'use server';
import db from './db';
import {
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

const renderError = (error: unknown): { message: string } => {
  console.log(error);
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
    console.log('Error updating profile image:', error);
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
    },
  });
};
