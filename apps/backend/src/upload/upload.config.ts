import { InvalidFileException } from '../exception/upload.exception';

export const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB

export const imageFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new InvalidFileException(), false);
  }
  callback(null, true);
};

export const uploadOptions = {
  fileFilter: imageFileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
};
