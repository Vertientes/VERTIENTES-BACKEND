import { body, validationResult } from 'express-validator';
import { ErrorResponse } from "../utils/errorResponse.js";

export const validateArrayNotEmpty = (field) => [
    body(field)
        .notEmpty()
        .isArray({ min: 1 })
        .withMessage(`${field} must be a non-empty array`),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ErrorResponse(errors.array()[0].msg, 400);
            }
            next();
        } catch (error) {
            next(error);
        }
    }
];
