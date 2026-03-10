import z from 'zod';

export const loginSchema = z.object({
  nameOrEmail: z.string().refine((val) => {
    const isEmail = val.includes('@');
    if (isEmail) {
      return z.email().safeParse(val.trim()).success;
    }

    return val.length >= 3;
  }, {
    error: "Invalid email or Username (3+ characters)"
  }),
  password: z.string().min(8, "Must be 8 or more characters"),
});

export const signupSchema = loginSchema.pick({
  password: true
}).extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().trim().pipe(z.email("Invalid Email")),
});