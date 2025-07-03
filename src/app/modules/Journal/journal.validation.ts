import z from 'zod';

const createJournal = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
  }),
});

export const journalValidation = { createJournal };
