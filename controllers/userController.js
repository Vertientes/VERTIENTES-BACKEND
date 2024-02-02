import User from '../models/userModel.js'

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        return next(error)
    }
}

export const updateCompanyDrum = async (req, res, next) => {
    const {company_drum} = req.body
}