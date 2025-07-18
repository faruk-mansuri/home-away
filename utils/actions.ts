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
}: {
  search?: string;
  category?: string;
}) => {
  // if search in undefined then e will not get any property
  return await db.property.findMany({
    where: {
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
      category,
    },

    select: {
      id: true,
      name: true,
      tagline: true,
      image: true,
      country: true,
      price: true,
    },

    orderBy: {
      createdAt: 'desc',
    },
  });
};

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

export const fetchFavorites = async () => {
  const user = await getAuthUser();
  const favorites = await db.favorite.findMany({
    where: { profileId: user.id },
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
        },
      },
    },
  });

  return favorites.map((fav) => fav.property);
};

export const fetchPropertyDetailsById = async (id: string) => {
  return db.property.findUnique({
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
    },
  });
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
    await db.booking.create({
      data: {
        checkIn,
        checkOut,
        totalNights,
        orderTotal,
        propertyId,
        profileId: user.id,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect(`/bookings`);
};

export const fetchBookings = async () => {
  const user = await getAuthUser();
  return await db.booking.findMany({
    where: {
      profileId: user.id,
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
        },
        _sum: {
          totalNights: true,
        },
      });
      const orderTotalSum = await db.booking.aggregate({
        where: {
          propertyId: rental.id,
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
