'use server';
import db from './db';
import {
  createReviewSchema,
  ImageSchema,
  profileSchema,
  propertySchema,
  validateProfile,
  validateWithZodSchema,
} from './schema';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { uploadImage } from './supabase';
import { calculateTotals } from './calculateTotals';
import { formatDate } from './format';

const renderError = (error: unknown): { message: string } => {
  console.log('Error in action:', error);
  return {
    message: error instanceof Error ? error.message : 'An error occurred',
  };
};

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to access this route');
  }
  if (!user.privateMetadata.hasProfile) redirect('/profile/create');
  return user;
};

const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect('/');
  return user;
};

export const createProfileAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error('Please login to create a profile');

    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? '',
        ...validatedFields,
      },
    });
    const client = await clerkClient();
    await client.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect('/');
};

export const fetchProfileImage = async () => {
  const user = await currentUser();
  if (!user) return null;

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      profileImage: true,
    },
  });
  return profile?.profileImage;
};

export const fetchProfile = async () => {
  const user = await getAuthUser();
  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (!profile) return redirect('/profile/create');

  return profile;
};

export const updateProfileAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const user = await getAuthUser();
    const rawData = Object.fromEntries(formData);
    const validatedData = validateWithZodSchema(profileSchema, rawData);

    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: validatedData,
    });
    revalidatePath('/profile');

    return {
      message: 'Profile updated successfully',
    };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProfileImageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  try {
    const user = await getAuthUser();
    const image = formData.get('image') as File;
    const validatedFields = validateWithZodSchema(ImageSchema, { image });

    const fullPath = await uploadImage(validatedFields.image);
    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: {
        profileImage: fullPath,
      },
    });

    revalidatePath('/profile');
    return { message: 'Profile image updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};

export const createPropertyAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const file = formData.get('image') as File;
    const validatedFields = validateWithZodSchema(propertySchema, rawData);
    const validateFile = validateWithZodSchema(ImageSchema, { image: file });
    const fullPath = await uploadImage(validateFile.image);
    await db.property.create({
      data: {
        ...validatedFields,
        image: fullPath,
        profileId: user.id,
      },
    });
    // revalidatePath('/properties');
    // return { message: 'Property created successfully' };
  } catch (error) {
    return renderError(error);
  }
  redirect('/');
};

export const fetchProperties = async ({
  search = '',
  category,
  cursorId,
  limit = 8,
}: {
  search?: string;
  category?: string;
  cursorId?: string;
  limit?: number;
}) => {
  const { userId } = await auth();

  const properties = await db.property.findMany({
    where: {
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            tagline: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }),
      ...(category && { category }),
    },

    select: {
      id: true,
      name: true,
      tagline: true,
      image: true,
      country: true,
      price: true,

      // Include rating data
      reviews: {
        select: {
          rating: true,
        },
      },

      // Include favorite status if user is logged in
      ...(userId && {
        favorites: {
          where: {
            profileId: userId,
          },
          select: {
            id: true,
          },
        },
      }),
    },

    take: limit + 1,
    ...(cursorId && {
      skip: 1,
      cursor: {
        id: cursorId,
      },
    }),

    orderBy: {
      createdAt: 'desc',
    },
  });

  const hasMore = properties.length > limit;
  const data = hasMore ? properties.slice(0, limit) : properties;

  // Transform data to include favoriteId
  const transformedData = data.map((property) => {
    const reviews = property.reviews || [];
    const rating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          ).toFixed(1)
        : '0';
    const count = reviews.length;

    return {
      ...property,
      rating: parseFloat(rating) ?? 0,
      reviewCount: count ?? 0,
      favoriteId: property.favorites?.[0]?.id || null,
      reviews: undefined, // Remove reviews array
      favorites: undefined, // Remove favorites array
    };
  });

  return {
    properties: transformedData,
    hasMore,
    nextCursor: hasMore ? data[data.length - 1].id : null,
  };
};

export async function loadMorePropertiesAction(
  search: string = '',
  category: string = '',
  cursorId: string = '',
  action: any
) {
  try {
    const result = await action({
      search: search || undefined,
      category: category || undefined,
      cursorId: cursorId || undefined,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return { success: false, error: 'Failed to fetch properties' };
  }
}

export const fetchFavoriteId = async ({
  propertyId,
}: {
  propertyId: string;
}) => {
  const user = await getAuthUser();
  const favorite = await db.favorite.findFirst({
    where: {
      propertyId,
      profileId: user.id,
    },
    select: {
      id: true,
    },
  });

  return favorite?.id || null;
};

export const toggleFavoriteAction = async (prevState: {
  propertyId: string;
  favoriteId: string | null;
  pathname: string;
}) => {
  const user = await getAuthUser();
  const { propertyId, favoriteId, pathname } = prevState;

  try {
    if (favoriteId) {
      // If favoriteId exists, delete the favorite
      await db.favorite.delete({
        where: {
          id: favoriteId,
        },
      });
    } else {
      // If favoriteId does not exist, create a new favorite
      await db.favorite.create({
        data: {
          propertyId,
          profileId: user.id,
        },
      });
    }
    revalidatePath(pathname);
    return {
      message: favoriteId
        ? 'Property removed from favorites'
        : 'Property added to favorites',
    };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchFavorites = async ({
  cursorId,
  limit = 8,
}: {
  cursorId?: string;
  limit?: number;
}) => {
  const { id: userId } = await getAuthUser();
  const favorites = await db.favorite.findMany({
    where: { profileId: userId },
    select: {
      id: true,
      property: {
        select: {
          id: true,
          name: true,
          tagline: true,
          image: true,
          country: true,
          price: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      },
    },
    take: limit + 1,
    ...(cursorId && {
      skip: 1,
      cursor: {
        id: cursorId,
      },
    }),
  });

  const hasMore = favorites.length > limit;
  const data = hasMore ? favorites.slice(0, limit) : favorites;

  const formattedData = data.map((fav) => {
    const reviewCount = fav.property.reviews.length;
    const rating =
      fav.property.reviews.reduce((acc, cur) => {
        return acc + cur.rating;
      }, 0) ?? 0;
    return { ...fav.property, favoriteId: fav.id, reviewCount, rating };
  });

  return {
    properties: formattedData,
    hasMore,
    nextCursor: hasMore ? data[data.length - 1].id : null,
  };
};

export const fetchPropertyDetailsById = async (id: string) => {
  const { userId } = await auth();
  const property = await db.property.findUnique({
    where: {
      id,
    },

    include: {
      profile: true,
      bookings: {
        select: {
          checkIn: true,
          checkOut: true,
        },
      },

      // Include rating data
      reviews: {
        select: {
          rating: true,
        },
      },

      // Include favorite status if user is logged in
      ...(userId && {
        favorites: {
          where: {
            profileId: userId,
          },
          select: {
            id: true,
          },
        },
      }),
    },
  });

  if (!property) return redirect('/');

  return {
    ...property,
    favorites: undefined,
    reviews: undefined,
    favoriteId: property.favorites?.[0]?.id || null,
    reviewCount: property.reviews.length ?? 0,
    rating:
      property.reviews.reduce((acc, cur) => {
        return acc + cur.rating;
      }, 0) ?? 0,
  };
};

export const createReviewAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(createReviewSchema, rawData);

    await db.review.create({
      data: {
        ...validatedFields,
        profileId: user.id,
      },
    });
    revalidatePath(`/properties/${validatedFields.propertyId}`);
    return { message: 'Review submitted successfully.' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchPropertyReviews = async (propertyId: string) => {
  return db.review.findMany({
    where: {
      propertyId,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      profile: {
        select: {
          firstName: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const fetchPropertyReviewsByUser = async () => {
  const user = await getAuthUser();
  return db.review.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      property: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const deleteReviewAction = async ({
  reviewId,
}: {
  reviewId: string;
}) => {
  const user = await getAuthUser();
  try {
    const reviewToDelete = await db.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!reviewToDelete || reviewToDelete.profileId !== user.id) {
      throw new Error(
        'Review not found or you do not have permission to delete it'
      );
    }

    await db.review.delete({
      where: {
        id: reviewId,
        profileId: user.id,
      },
    });

    revalidatePath('/reviews');
    return { message: 'Review deleted successfully.' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchPropertyRating = async (propertyId: string) => {
  const reviews = await db.review.aggregate({
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
    where: {
      propertyId,
    },
  });

  return {
    rating: Number(reviews._avg.rating?.toFixed()) ?? 0,
    count: Number(reviews._count.rating.toFixed()) ?? 0,
  };

  // return await db.review.groupBy({
  //   by: ['propertyId'],
  //   _avg: {
  //     rating: true,
  //   },
  //   _count: {
  //     rating: true,
  //   },
  //   where: {
  //     propertyId,
  //   },
  // });
};

export const findExistingReview = async (
  propertyId: string,
  userId: string
) => {
  return await db.review.findFirst({
    where: {
      propertyId,
      profileId: userId,
    },
  });
};

export const createBookingAction = async (
  prevState: { propertyId: string; checkIn: Date; checkOut: Date },
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  let bookingId: null | string = null;

  await db.booking.deleteMany({
    where: {
      profileId: user.id,
      paymentStatus: false,
    },
  });

  const { propertyId, checkIn, checkOut } = prevState;
  const property = await db.property.findUnique({
    where: { id: propertyId },
    select: {
      price: true,
    },
  });
  if (!property) {
    return { message: 'Property not found.' };
  }
  const { orderTotal, totalNights } = calculateTotals({
    checkIn,
    checkOut,
    price: property.price,
  });

  try {
    const booking = await db.booking.create({
      data: {
        checkIn,
        checkOut,
        totalNights,
        orderTotal,
        propertyId,
        profileId: user.id,
      },
    });
    bookingId = booking.id;
  } catch (error) {
    return renderError(error);
  }
  redirect(`/checkout?bookingId=${bookingId}`);
};

export const fetchBookings = async () => {
  const user = await getAuthUser();
  return await db.booking.findMany({
    where: {
      profileId: user.id,
      paymentStatus: true,
    },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          country: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const deleteBookingAction = async ({
  bookingId,
}: {
  bookingId: string;
}) => {
  const user = await getAuthUser();
  try {
    const bookingToDelete = await db.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!bookingToDelete || bookingToDelete.profileId !== user.id) {
      throw new Error(
        'Booking not found or you do not have permission to delete it'
      );
    }

    await db.booking.delete({
      where: {
        id: bookingId,
        profileId: user.id,
      },
    });

    revalidatePath('/bookings');
    return { message: 'Booking deleted successfully.' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchRentals = async () => {
  const user = await getAuthUser();
  const rentals = await db.property.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      id: true,
      name: true,
      price: true,
    },
  });

  const rentalWithBookingsSums = await Promise.all(
    rentals.map(async (rental) => {
      const totalNightSum = await db.booking.aggregate({
        where: {
          propertyId: rental.id,
          paymentStatus: true,
        },
        _sum: {
          totalNights: true,
        },
      });
      const orderTotalSum = await db.booking.aggregate({
        where: {
          propertyId: rental.id,
          paymentStatus: true,
        },
        _sum: {
          orderTotal: true,
        },
      });
      return {
        ...rental,
        totalNightsSum: totalNightSum._sum.totalNights || 0,
        orderTotalSum: orderTotalSum._sum.orderTotal || 0,
      };
    })
  );
  return rentalWithBookingsSums;
};

export const deleteRentalAction = async ({
  propertyId,
}: {
  propertyId: string;
}) => {
  const user = await getAuthUser();
  try {
    const propertyToDelete = await db.property.findUnique({
      where: {
        id: propertyId,
      },
    });

    if (!propertyToDelete || propertyToDelete.profileId !== user.id) {
      throw new Error(
        'Property not found or you do not have permission to delete it'
      );
    }

    await db.property.delete({
      where: {
        id: propertyId,
        profileId: user.id,
      },
    });

    revalidatePath('/rentals');
    return { message: 'Property deleted successfully.' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchRentalDetails = async (propertyId: string) => {
  const user = await getAuthUser();
  return db.property.findUnique({
    where: {
      id: propertyId,
      profileId: user.id,
    },
    include: {
      bookings: true,
      profile: true,
    },
  });
};

export const updateRentalAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  const propertyId = formData.get('id') as string;

  try {
    const rawData = Object.fromEntries(formData);
    const validatedData = validateWithZodSchema(propertySchema, rawData);
    await db.property.update({
      where: {
        id: propertyId,
        profileId: user.id,
      },
      data: {
        ...validatedData,
      },
    });
    revalidatePath(`/rentals/${propertyId}/edit`);
    return { message: 'Rental updated successfully.' };
  } catch (error) {
    return renderError(error);
  }
};

export const updateRentalImageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  const propertyId = formData.get('id') as string;
  try {
    const image = formData.get('image') as File;
    const validatedFields = validateWithZodSchema(ImageSchema, { image });
    const fullPath = await uploadImage(validatedFields.image);
    await db.property.update({
      where: {
        id: propertyId,
        profileId: user.id,
      },
      data: {
        image: fullPath,
      },
    });
    revalidatePath(`/rentals/${propertyId}/edit`);
    return { message: 'Property image updated successfully.' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchReservations = async () => {
  const user = await getAuthUser();
  const reservations = await db.booking.findMany({
    where: {
      paymentStatus: true,
      property: {
        profileId: user.id,
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          price: true,
          country: true,
        },
      },
    },
  });

  return reservations;
};

export const fetchStats = async () => {
  await getAdminUser();

  const userCount = await db.profile.count();
  const propertyCount = await db.property.count();
  const bookingCount = await db.booking.count({
    where: { paymentStatus: true },
  });

  return {
    userCount,
    propertyCount,
    bookingCount,
  };
};

export const fetchChartsData = async () => {
  await getAdminUser();
  const date = new Date();
  date.setMonth(date.getMonth() - 6); // 6 months ago
  const sixMonthsAgo = date;

  const bookings = await db.booking.findMany({
    where: {
      paymentStatus: true,
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  let bookingPerMonth = bookings.reduce((total, current) => {
    const date = formatDate(current.createdAt, true);
    const existingEntry = total.find((entry) => entry.date === date);
    if (existingEntry) {
      existingEntry.count += 1;
    } else {
      total.push({ date, count: 1 });
    }
    return total;
  }, [] as Array<{ date: string; count: number }>);

  return bookingPerMonth;
};

export const fetchReservationStats = async () => {
  const user = await getAuthUser();
  const properties = await db.property.count({
    where: {
      profileId: user.id,
    },
  });
  const totals = await db.booking.aggregate({
    _sum: {
      totalNights: true,
      orderTotal: true,
    },
    where: {
      property: {
        profileId: user.id,
      },
      paymentStatus: true,
    },
  });

  return {
    properties,
    nights: totals._sum.totalNights || 0,
    amount: totals._sum.orderTotal || 0,
  };
};
