import User from './userModel.js'
import { ErrorResponse } from '../../utils/errorResponse.js'
import bcrypt from 'bcryptjs'
import { sendTokenResponse } from '../../utils/sendTokenResponse.js'

//Registro de usuario
export const signUp = async (req, res, next) => {
    try {
        const { first_name, last_name, dni, mobile_phone, password } = req.body
        const passwordCrypt = await bcrypt.hash(password, 10)
        const newUser = new User({
            first_name,
            last_name,
            dni,
            mobile_phone,
            password: passwordCrypt,
            address: req.body.address,
            role: 'user'
        })
        const user = await newUser.save()

        res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        next(error)
    }
}



//Loguear al usuario en la aplicaicon
export const signIn = async (req, res, next) => {
    const { dni, password } = req.body
    const user = await User.findOne({ dni })
    if (!user) {
        return next(new ErrorResponse('User not found', 404))
    }
    if (user.is_active === false) {
        return next(new ErrorResponse('User is not active', 400))
    }
    const isMatched = await user.comparePassword(password)
    if (!isMatched) {
        return next(new ErrorResponse('Incorrect password', 400))
    }
    sendTokenResponse(user, 200, res)
}

export const signUpDelivery = async (req, res, next) => {
    try {
        const { firstName, lastName, dni, mobile_phone, password } = req.body
        const role = 'delivery'
        const newUser = new User({
            firstName,
            lastName,
            dni,
            mobile_phone,
            password,
            address: req.body.address,
            role
        })
        const user = await newUser.save()
        res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        next(error)
    }
}