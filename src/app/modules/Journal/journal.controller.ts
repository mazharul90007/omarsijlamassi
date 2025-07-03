import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { JournalService } from './journal.service';
import sendResponse from '../../utils/sendResponse';

const createJournal = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { content } = req.body;
  const audio = req.file;

  if (!content && !audio) {
    throw new Error('Either text or audio is required.');
  }

  const journal = await JournalService.createJournalService({
    userId,
    content,
    audio,
  });

  const baseUrl = process.env.BASE_URL_SERVER || 'http://localhost:5000';
  const imageUrl = journal.image
    ? `${baseUrl}/uploads/journal-images/${journal.image}`
    : null;

  sendResponse(res, {
    statusCode: 201,
    message: 'Journal created successfully',
    data: {
      ...journal,
      image: imageUrl,
    },
  });
});

export const JournalController = {
  createJournal,
};
