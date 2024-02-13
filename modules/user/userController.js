import User from './userModel.js'

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({rolq:'user'})
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        return next(error)
    }
}

/* export const updateUserData = async (req, res, next) => {
    try {
        const id = req.params
        const {firstName, lastName}
    } catch (error) {
        next(error)
    }
} */