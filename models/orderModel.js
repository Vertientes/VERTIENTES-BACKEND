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
    payment_method: {
        type: String,
        enum: ['Transferencia', 'Efectivo'],
        required: [true, 'Payment method is required']
    },
    extra_payment: {
        type: Number,
        required: [true, 'Extra payment is required'],
        default: 0 
    },
    payment_date: {
        type: String,
        required: [true, 'Payment date is required']
    },
    payment_due_date: {
        type: String,
        required: [true, 'Payment due date is required']
    },
    vitits:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visit'
    }],
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'delivering'],
        default: 'pending'
    },
    refills_in_favor: {
        type: Number,
        required: [true, 'Recharges in favor is required'],
        default: 0
    },
    refills_delivered: {
        type: Number,
        required:[true, 'Recharges delivered is required'],
        default: 0
    },
    promotion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promotion',
        required: false,
    },
    totalAmount: {
        type: Number,
        required: true
    }
}, { timestamps: true });


export default mongoose.model('Order', orderSchema)

