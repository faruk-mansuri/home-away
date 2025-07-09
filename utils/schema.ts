import * as z from 'zod';

export const profileSchema = z.object({
  // firstName: z.string().max(5, 'max length is 5 characters.'),
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters long',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters long',
  }),
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters long',
  }),
});

export const validateWithZodSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T => {
  const parsedData = schema.safeParse(data);
  if (!parsedData.success) {
    throw new Error(
      parsedData.error.errors.map((err) => err.message).join(', ')
    );
  }
  return parsedData.data;
};
export const validateProfile = async (data: unknown) => {
  return validateWithZodSchema(profileSchema, data);
};

export const ImageSchema = z.object({
  image: validateFile(),
});

function validateFile() {
  const maxUploadSize = 1024 * 1024;
  const acceptedFileTypes = ['image/'];
  return z
    .instanceof(File)
    .refine((file) => {
      return !file || file.size <= maxUploadSize;
    }, `File size must be less than 1 MB`)
    .refine((file) => {
      return (
        !file || acceptedFileTypes.some((type) => file.type.startsWith(type))
      );
    }, 'File must be an image');
}
