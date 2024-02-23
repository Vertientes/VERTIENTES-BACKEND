import { ErrorResponse } from '../../utils/errorResponse.js'
import User from './userModel.js'
import bcrypt from 'bcryptjs'

// Obtener todos los usuarios activos actualmente
export const getUsersActive = async (res, next) => {
    try {
        const users = await User.find({ role: 'user', is_active: true })
        if (users.length < 0) {
            return next(new ErrorResponse('There are no users in actives in database', 404))
        }
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        next(error)
    }
}

// Obtener todos los usuarios
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        if (users.length < 0) {
            return next(new ErrorResponse('There are no users in database', 404))
        }
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        next(error)
    }
}

// Profile del usuario logeado.
export const userProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        next(error)
    }

}

// Actualizar TODOS los datos del usuario sin afectar a las relaciones, solo el superadmin ejecuta esto
export const updateUserDataForSuperAdmin = async (req, res, next) => {
    try {
        const { id } = req.params
        const { first_name, last_name, dni, mobile_phone, neighborhood, street, house_number, zone, location, company_drum, balance } = req.body
        const user = await User.findById(id)
        if (!user) {
            return next(new ErrorResponse('User not found', 404))
        }
        const updatedUser = await User.findByIdAndUpdate(id, { first_name, last_name, dni, mobile_phone, address: { neighborhood, street, house_number, zone, location }, company_drum, balance }, { new: true })

        res.status(200).json({
            success: true,
            updatedUser
        })
    } catch (error) {
        next(error)
    }
}

// Actualizar el rol de un usuario a un usuario con abono, el super admin ejecuta esto
export const changeUserRoleWithPlan = async (req, res, next) => {
    try {
        const { id } = req.params
        const role = 'user_with_plan'
        const user = await User.findById(id)
        if (!user) {
            return next(new ErrorResponse('user not found', 404))
        }
        const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true })
        res.status(200).json({
            success: true,
            updatedUser
        })
    } catch (error) {
        next(error)
    }
}

// Actualizar la propiedad is_active del usuario a false
export const deactivateUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const is_active = false
        const user = await User.findById(id)
        if (!user) {
            return next(new ErrorResponse('User not found', 404))
        }
        const updatedUser = await User.findByIdAndUpdate(id, { is_active }, { new: true })
        res.status(200).json({
            success: true,
            updatedUser
        })
    } catch (error) {
        next(error)
    }

}

// Actualizar la propiedad is_active del usuario a true
export const activateUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const is_active = true
        const user = await User.findById(id)
        if (!user) {
            return next(new ErrorResponse('User not found', 404))
        }
        const updatedUser = await User.findByIdAndUpdate(id, { is_active }, { new: true })
        res.status(200).json({
            success: true,
            updatedUser
        })
    } catch (error) {
        next(error)
    }
}

// Actualizar password de cualquier tipo de usuario
export const changePassword = async (req, res, next) => {
    try {
        const { id } = req.params
        const { old_password, new_password } = req.body
        const dni = req.user.dni
        const user = await User.findOne({ dni })
        if (!user) {
            return next(new ErrorResponse('User not found', 404))
        }
        if (user.is_active === false) {
            return next(new ErrorResponse('Cannot change password for a disabled user', 400))
        }
        const isMatched = await user.comparePassword(old_password)
        if (!isMatched) {
            return next(new ErrorResponse('Incorrect old password', 400))
        }

        const passwordCrypt = await bcrypt.hash(new_password, 10)

        const updatedUser = await User.findByIdAndUpdate(id, { password: passwordCrypt }, { new: true })

        res.status(200).json({
            success: true,
            updatedUser
        })
    } catch (error) {
        next(error)
    }
}

// Obtener un usuario a traves del id
export const getOneUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        if (!user) {
            return next(new ErrorResponse('User not found', 404))
        }

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        next(error)
    }
}

// Actualizar los datos de direccion del usuario
export const updateAddressUserData = async (req, res, next) => {
    try {
        const { id } = req.params
        const file = req.file
        const { neighborhood, street, house_number, zone, location } = req.body

        const user = await User.findById(id)

        if (!user) {
            return next(new ErrorResponse('User not found', 404))
        }

        let house_img = file ? file.path : user.house_img

        const updatedUser = await User.findByIdAndUpdate(id, { address: { neighborhood, street, house_number, zone, location }, house_img }, { new: true })

        res.status(200).json({
            success: true,
            updatedUser
        })
    } catch (error) {
        next(error)
    }
}

