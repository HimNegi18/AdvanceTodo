import { z } from 'zod';
import { Priority } from '../../generated/prisma';

export const CreateTodoDto = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(), // ISO 8601 string
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM).optional(),
  tags: z.string().optional(), // Stored as a comma-separated string for SQLite compatibility
});

export type CreateTodoDto = z.infer<typeof CreateTodoDto>;

export const CreateNaturalLanguageTodoDto = z.object({
  text: z.string().min(1),
});

export type CreateNaturalLanguageTodoDto = z.infer<typeof CreateNaturalLanguageTodoDto>;

export const UpdateTodoDto = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.nativeEnum(Priority).optional(),
  tags: z.string().optional(),
});

export type UpdateTodoDto = z.infer<typeof UpdateTodoDto>;
