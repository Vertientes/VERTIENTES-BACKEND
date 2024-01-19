import { body, validationResult } from 'express-validator';
import { ErrorResponse } from "../utils/errorResponse.js";
import User from '../models/userModel.js';

export const validateEmail = () => [
    body('email')
        .isEmail().withMessage(`email must be a valid email`),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ErrorResponse(errors.array()[0].msg, 400));
            }
            next()
        }
    ]
