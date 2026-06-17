import multer, { StorageEngine } from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import { BadRequestError } from '../utils/errors';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const ALLOWED = /jpeg|jpg|png|gif|webp|pdf/;

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const extOk = ALLOWED.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = ALLOWED.test(file.mimetype);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only image and PDF files are allowed'));
  }
};

class CloudinaryStorage implements StorageEngine {
  _handleFile(
    _req: Express.Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: Partial<Express.Multer.File>) => void
  ) {
    const stream = cloudinary.uploader.upload_stream(
      { folder: config.cloudinary.folder, resource_type: 'auto' },
      (error, result) => {
        if (error) return callback(error);
        if (!result) return callback(new Error('Cloudinary upload failed'));
        callback(null, {
          filename: result.public_id,
          path: result.secure_url,
          size: result.bytes,
        });
      }
    );
    (file as any).stream.pipe(stream);
  }

  _removeFile(
    _req: Express.Request,
    _file: Express.Multer.File,
    callback: (error: Error | null) => void
  ) {
    callback(null);
  }
}

export const upload = multer({
  storage: new CloudinaryStorage(),
  limits: { fileSize: config.upload.maxFileSize },
  fileFilter,
});
