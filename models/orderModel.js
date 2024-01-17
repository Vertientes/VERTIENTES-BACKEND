import mongoose from 'mongoose'
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product is required'],
        min: [1, 'Product must be at least 1']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
    },
    deliveryAddress: {
        neighborhood: {
            type: String,
            trim: true,
            maxlength: 50
        },
        street: {
            type: String,
            trim: true,
            maxlength: 50
        },
        houseNumber: {
            type: String,
            trim: true,
            maxlength: 10
        }
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'delivering'],
        default: 'pending'
    },
    recargas: {
        type: Number,
        trim: true,
        min: [0, 'Recargas must be at least 1']
    },
    promotion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promotion',
        required: false,
    },
    cant_a_entregar:{
        type: Number,
        trim: true,
        min: [1, 'Cant a entregar must be at least 1']
    },
    totalAmount: {
        type: Number,
        required: true
    }
}, { timestamps: true });


export default mongoose.model('Order', orderSchema)

