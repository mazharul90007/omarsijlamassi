import express from 'express';
import { uploadAudio } from '../../utils/uploadConfig';
import validateRequest from '../../middlewares/validateRequest';
import { journalValidation } from './journal.validation';
import { JournalController } from './journal.controller';

const router = express.Router();

router.post(
  '/',
  uploadAudio.single('audio'),
  validateRequest(journalValidation.createJournal),
  JournalController.createJournal,
);

export default router;
