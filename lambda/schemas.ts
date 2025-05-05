import { z } from 'zod';

export const queryHandlerSchema = z.object({
  question: z.string().min(3, { message: 'Query must be at least 3 characters long' })
});
