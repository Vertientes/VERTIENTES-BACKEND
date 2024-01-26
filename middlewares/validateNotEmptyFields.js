import { body, validationResult } from 'express-validator';
import { ErrorResponse } from "../utils/errorResponse.js";
import { v2 as cloudinary } from 'cloudinary'

export const validateNotEmptyFields = (fields) => [
    ...fields.map(field =>
        body(field)
            .notEmpty()
    ),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                if (req.file) {
                    await cloudinary.uploader.destroy(req.file.filename);
                }
                throw new ErrorResponse(`${errors.array()[0].path} cannot be empty`, 400);
            }
            next();
        } catch (error) {
            next(error);
        }
    }
];