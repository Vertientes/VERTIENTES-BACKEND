import User from './userModel.js'

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'user', is_active: true })
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        return next(error)
    }
}

export const updateUserData = async (req, res, next) => {
    try {
        const { id } = req.params
        console.log(id)
        const { firstName, lastName, dni, mobile_phone, balance, neighborhood, street, houseNumber, zone, location, company_drum } = req.body
        const file = req.file
        const user = await User.findById(id)
        if (!user) {
            throw new ErrorResponse('User not found', 404)
        }
        let house_img
        if (file) {
            house_img = file.path
        }
        else {
            house_img = user.house_img
        }
        const updatedUser = await User.findByIdAndUpdate(id, { firstName, lastName, dni, mobile_phone, balance, address: { neighborhood, street, houseNumber, zone, location, }, company_drum, house_img }, { new: true })

        res.status(200).json({
            success: true,
            updatedUser
        })
    } catch (error) {
        next(error)
    }
}
export const updateAddressUserData = async (req, res, next) => {

}

export const changeUserActive = async (req,res,next)=>{

}