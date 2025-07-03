import z from 'zod';

const registerUser = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required!' }),
    email: z
      .string({ required_error: 'Email is required!' })
      .email({ message: 'Invalid email format!' }),
    password: z.string({ required_error: 'Password is required!' }),
  }),
});

const updateProfile = z.object({
  body: z
    .object({
      name: z.string().min(1, 'Name cannot be empty').optional(),
    })
    .refine(data => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});

const updateProfilePicture = z.object({
  // No body validation needed as it's handled by multer
});

export const userValidation = {
  registerUser,
  updateProfile,
  updateProfilePicture,
};
