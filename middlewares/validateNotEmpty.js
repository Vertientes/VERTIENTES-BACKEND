import { body, validationResult } from 'express-validator';
import { ErrorResponse } from "../utils/errorResponse.js";

export const validateNotEmptyFields = (fields) => [
    ...fields.map(field => body(field)
        .notEmpty()
    ),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ErrorResponse(`${errors.array()[0].path} cannot be empty`, 400));
        }
        next();
    }
];
