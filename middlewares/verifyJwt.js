import { ErrorResponse } from "../utils/errorResponse.js";
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'

//funcion para autenticar usuario
export const verifyJwt = async (req, res, next) => {
    const token = req.header('Authorization')
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id)
        next()
    } catch (error) {
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }
}