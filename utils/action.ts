'use server';

import { profileSchema } from './schema';

export const createProfileAction = async (
  prevSate: any,
  formData: FormData
) => {
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = profileSchema.safeParse(rawData);
    if (!validatedFields.data) {
      return { message: 'Profile Created.', inputs: rawData };
    }
    return { message: 'Profile Created.' };
  } catch (error) {
    console.log('error', error);
    return { message: 'there was an error.' };
  }
};
