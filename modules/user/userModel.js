import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        trim: true,
        required: [true, 'First name is required'],
        maxlength: 32
    },
    last_name: {
        type: String,
        trim: true,
        required: [true, 'Last name is required'],
        maxlength: 32
    },
    dni: {
        type: Number,
        trim: true,
        required: [true, 'Dni is required'],
        maxlength: 8
    },
    mobile_phone: {
        type: String,
        trim: true,
        required: [true, 'Mobile phone is required'],
    },
    balance: {
        type: Number,
        required: [true, 'Balance is required'],
        default: 0
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must have at least (6) caracters'],
    },
    address: {
        neighborhood: {
            type: String,
            trim: true,
            required: [true, 'Neighborhood is required'],
            maxlength: 50
        },
        street: {
            type: String,
            trim: true,
            required: [true, 'Street is required'],
            maxlength: 50
        },
        house_number: {
            type: Number,
            trim: true,
            required: [true, 'House number is required'],
            maxlength: 10
        },
        zone: {
            type: String,
            trim: true,
            enum: ['general', 'c5'],
            required: [true, 'Zone is required']
        },
        location: {
            type: String,
            required: [true, 'Location is required']
        }
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    },
    company_drum:{
        type: Number,
        required: true,
        default: 0
    },
    house_img: {
        type: String,
        required: false,
        default: 'No disponible'
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'delivery', 'super_admin', 'user_with_plan'],
        required:[true, 'Role is required'],
        default: 'user'
    }
}, { timestamps: true })


//funcion para comparar el password con el hasheado

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//funcion del usuario para obtener un token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: 3600
    });
}


export default mongoose.model('User', userSchema)

