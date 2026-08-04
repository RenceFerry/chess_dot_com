import z from 'zod';

export const loginSchema = z.object({
  nameOrEmail: z.string().refine((val) => {
    const isEmail = val.includes('@');
    if (isEmail) {
      return z.email().safeParse(val.trim()).success;
    }

    return val.length >= 3 && val.length <= 30;
  }, {
    error: "Invalid email or Username (3+ characters)"
  }),
  password: z.string().min(8, "Must be 8 or more characters"),
});

export const signupSchema = loginSchema.pick({
  password: true
}).extend({
  username: z.string().min(3, "Username must be at least 3 characters").max(30, 'Username must be at most 30 characters'),
  email: z.string().trim().pipe(z.email("Invalid Email")),
});

export const userUpdateSchema = z.object({
  email: z.email('Invalid Email'),
  name: z.string().min(3, "Username must be at least 3 characters").max(30, 'Username must be at most 30 characters'),
  file: z.union([z.file(), z.string()]),
})

export const changePasswordSchema = z.object({
  currentPass: z.string().min(8, "Must be 8 or more characters").optional(),
  newPass: z.string().min(8, "Must be 8 or more characters"),
  confirmPass: z.string().min(8, "Must be 8 or more characters"),
})