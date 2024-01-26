import User from '../models/userModel.js'
import { ErrorResponse } from '../utils/errorResponse.js'

//registrar usuario
export const signUp = async (req, res, next) => {
    try {
        const user = await User.create(req.body)
        res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        next(error)
    }
}

//ingresar usuario
export const signIn = async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 400))
    }
    const isMatched = await user.comparePassword(password)
    if (!isMatched) {
        return next(new ErrorResponse('Invalid credentials', 400))
    }

    sendTokenResponse(user, 200, res)
}

const sendTokenResponse = async (user, codeStatus, res) => {
    const token = user.getJwtToken()
    res.status(codeStatus).cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true }).json({
        success: true,
        token,
        user
    })
}

//log out

export const logOut = async (req, res, next) => {
    res.clearCookie('token')
    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
}

//user profile, o get user by id

export const userProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        next(error)
    }

}