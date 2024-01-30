import User from '../models/userModel.js'
import { ErrorResponse } from '../utils/errorResponse.js'

//registrar usuario
export const signUp = async (req, res, next) => {
    try {
        const { firstName, lastName, dni, mobile_phone, password } = req.body
        const newUser = new User({
            firstName,
            lastName,
            dni,
            mobile_phone,
            password,
            address: req.body.address
        })
        const user = await newUser.save()
        res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        next(error)
        console.error(error)
    }
}
const sendTokenResponse = async (user, codeStatus, res) => {
    const token = user.getJwtToken()
    res.status(codeStatus).json({
        success: true,
        token,
        user
    })
}
//ingresar usuario
export const signIn = async (req, res, next) => {
    const { dni, password } = req.body    
    const user = await User.findOne({dni})
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 400))
    }
    const isMatched = await user.comparePassword(password)
    if (!isMatched) {
        return next(new ErrorResponse('Invalid credentials', 400))
    }

    sendTokenResponse(user, 200, res)
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