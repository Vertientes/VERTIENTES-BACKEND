import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET
});

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'vertientes-uploads',
        format: async (req, file) => {
            return file.originalname.split('.').pop()
        },
        public_id: (req, file) => {
            return file.fieldname + '-' + Date.now()
        }
    }
});
