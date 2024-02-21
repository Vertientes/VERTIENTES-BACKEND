import { body, validationResult } from 'express-validator';
import { ErrorResponse } from "../utils/errorResponse.js";
import { v2 as cloudinary } from 'cloudinary'

// Middleware para validar que ningun campo este vacio, si no hay error de campos vacio, Si ocurre un error en los campos vacio y hay req.file, lo borrara, ya que no es necesario subir si la peticion dio error
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
                return next(new ErrorResponse(`${errors.array()[0].path} cannot be empty`, 400))
            }
            next();
        } catch (error) {
            next(error);
        }
    }
];