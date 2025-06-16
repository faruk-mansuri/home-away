import * as z from 'zod';

export const profileSchema = z.object({
  // firstName: z.string().max(5, 'max length is 5 characters.'),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  userName: z.string().min(3),
});
