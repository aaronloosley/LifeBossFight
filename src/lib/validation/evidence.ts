import { z } from 'zod';

export const evidenceSchema = z.object({
  type: z.enum(['photo', 'note', 'receipt', 'contact', 'fact']),
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  linkedStepId: z.string().optional()
});

export type EvidenceInput = z.infer<typeof evidenceSchema>;
