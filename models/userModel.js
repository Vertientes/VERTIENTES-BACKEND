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
    email: {
        type: String,
        trim: true,
        required: [true, 'E-mail is required'],
        maxlength: 32,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
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
        }
    },
    role: {
        type: Number,
        default: 0
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

