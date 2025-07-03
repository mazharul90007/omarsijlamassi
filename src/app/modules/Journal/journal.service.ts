import prisma from '../../utils/prisma';
import axios from 'axios';
import { CreateJournalInput } from '../../interface/journal';
import { downloadImage } from '../../utils/downloadImage'; // Make sure this utility exists

const createJournalService = async ({
  userId,
  content,
  audio,
}: CreateJournalInput) => {
  const aiPayload: any = {};
  if (content) aiPayload.text = content;
  if (audio) aiPayload.audio = audio.buffer.toString('base64');

  const aiResponse = await axios.post(
    'http://172.252.13.71:8111/api/reflect',
    aiPayload,
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );

  const { journalTitle, journalContent, dreamPatterns, image } =
    aiResponse.data;

  let imageFilename: string | undefined = undefined;
  if (image && typeof image === 'string' && image.startsWith('http')) {
    imageFilename = await downloadImage(image);
  }

  const journal = await prisma.journal.create({
    data: {
      userId,
      title: journalTitle,
      content: journalContent,
      dreamPatterns,
      image: imageFilename,
    },
  });
  return journal;
};

export const JournalService = {
  createJournalService,
};
