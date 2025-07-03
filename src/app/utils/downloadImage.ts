import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const downloadImage = async (
  imageUrl: string,
  folder = 'public/uploads/journal-images',
) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  const extMatch = imageUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const ext = extMatch ? extMatch[1] : 'jpg';
  const filename = `${uuidv4()}.${ext}`;
  const filePath = path.join(folder, filename);

  const response = await axios.get(imageUrl, { responseType: 'stream' });
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  await new Promise<void>((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });

  return filename;
};
