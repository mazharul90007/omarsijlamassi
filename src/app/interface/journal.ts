import { Express } from 'express';

export interface CreateJournalInput {
  userId: string;
  title?: string;
  content?: string;
  audio?: Express.Multer.File;
}
