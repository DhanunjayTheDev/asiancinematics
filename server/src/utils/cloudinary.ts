import { v2 as cloudinary } from 'cloudinary';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export interface UploadOptions {
  folder?: string;
  public_id?: string;
  resource_type?: 'auto' | 'image' | 'video' | 'raw';
}

/**
 * Upload a file to Cloudinary
 * @param file - Buffer or string (file path)
 * @param options - Upload options
 * @returns Cloudinary upload result
 */
export const uploadToCloudinary = async (
  file: string | Buffer,
  options: UploadOptions = {}
): Promise<any> => {
  try {
    const defaultOptions = {
      folder: 'asiancinematics',
      resource_type: 'auto',
      ...options,
    };

    if (typeof file === 'string' && file.startsWith('data:')) {
      // Base64 encoded image
      const result = await cloudinary.uploader.upload(file, defaultOptions);
      return result;
    } else if (typeof file === 'string') {
      // File path
      const result = await cloudinary.uploader.upload(file, defaultOptions);
      return result;
    } else {
      // Buffer - convert to data URL
      const base64 = file.toString('base64');
      const dataUrl = `data:application/octet-stream;base64,${base64}`;
      const result = await cloudinary.uploader.upload(dataUrl, defaultOptions);
      return result;
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Delete a file from Cloudinary
 * @param publicId - The public ID of the file
 */
export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

/**
 * Generate a secure URL for a Cloudinary file
 * @param publicId - The public ID
 * @param options - Transformation options
 */
export const generateCloudinaryUrl = (publicId: string, options: Record<string, any> = {}): string => {
  try {
    const url = cloudinary.url(publicId, {
      secure: true,
      ...options,
    });
    return url;
  } catch (error) {
    console.error('Cloudinary URL generation error:', error);
    throw error;
  }
};

export default {
  uploadToCloudinary,
  deleteFromCloudinary,
  generateCloudinaryUrl,
};
