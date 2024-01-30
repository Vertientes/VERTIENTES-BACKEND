import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'First name is required'],
        maxlength: 32
    },
    lastName: {
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
        houseNumber: {
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
    //bidones que no se devolvieron
    company_drum:{
        type: Number,
        required: true,
        default: 0
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'delivery'],
        required:[true, 'Role is required'],
        default: 'user'
    }
}, { timestamps: true })

//encriptar el password
userSchema.pre('save', async function (next) {
    //si el pw no fue modificado continuar
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

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

