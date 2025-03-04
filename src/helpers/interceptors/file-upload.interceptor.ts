// file-upload.interceptor.ts
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';

export const fileUploadInterceptor = (
  fieldName: string,
  destinationPath: string,
) => {
  return FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: destinationPath,
      filename: (req, file, callback) => {
        const uniqueFilename = `${
          randomUUID() + '-' + file.originalname.replace(' ', '')
        }`;
        callback(null, uniqueFilename);
      },
    }),
    limits: {
      fileSize: 1024 * 1024 * 4, // 4 MB limit
    },
    fileFilter: (req, file, callback) => {
      if (!file) {
        callback(null, false);
      } else {
        callback(null, true);
      }
    },
  });
};
