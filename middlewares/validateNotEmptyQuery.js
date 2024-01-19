import { query, validationResult } from 'express-validator';
import { ErrorResponse } from "../utils/errorResponse.js";

export const validateNotEmptyFields = (field) => [
    query(field).notEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ErrorResponse(`${field} query cannot be empty`, 400));
        }
        next();
    }
];
