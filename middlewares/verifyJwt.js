import { ErrorResponse } from "../utils/errorResponse.js";
import User from '../modules/user/userModel.js'
import jwt from 'jsonwebtoken'

// Middleware para verificar si el token proporcionado es valido
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
        return next(new ErrorResponse('Server error in verify jsonwebtoken', 500))
    }
}