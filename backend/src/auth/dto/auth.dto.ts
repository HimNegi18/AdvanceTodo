import { z } from 'zod';

export const RegisterUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export type RegisterUserDto = z.infer<typeof RegisterUserDto>;

export const LoginUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginUserDto = z.infer<typeof LoginUserDto>;
