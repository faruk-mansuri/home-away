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
  const maxUploadSize = 5 * 1024 * 1024; // 5 mb;
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

export const propertySchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'name must be at least 2 characters.',
    })
    .max(100, {
      message: 'name must be less than 100 characters.',
    }),
  tagline: z
    .string()
    .min(2, {
      message: 'tagline must be at least 2 characters.',
    })
    .max(100, {
      message: 'tagline must be less than 100 characters.',
    }),
  price: z.coerce.number().int().min(0, {
    message: 'price must be a positive number.',
  }),
  category: z.string(),
  description: z.string().refine(
    (description) => {
      const wordCount = description.split(' ').length;
      return wordCount >= 10 && wordCount <= 1000;
    },
    {
      message: 'description must be between 10 and 1000 words.',
    }
  ),
  country: z.string(),
  guests: z.coerce.number().int().min(0, {
    message: 'guest amount must be a positive number.',
  }),
  bedrooms: z.coerce.number().int().min(0, {
    message: 'bedrooms amount must be a positive number.',
  }),
  beds: z.coerce.number().int().min(0, {
    message: 'beds amount must be a positive number.',
  }),
  baths: z.coerce.number().int().min(0, {
    message: 'bahts amount must be a positive number.',
  }),
  amenities: z.string(),
});

export const createReviewSchema = z.object({
  propertyId: z.string(),
  rating: z.coerce.number().int().min(1).max(5, {
    message: 'Rating must be between 1 and 5.',
  }),
  comment: z
    .string()
    .min(10, {
      message: 'Comment must be at least 10 characters long.',
    })
    .max(1000, {
      message: 'Comment must be less than 1000 characters.',
    }),
});
