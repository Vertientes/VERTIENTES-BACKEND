import mongoose from 'mongoose'
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product is required'],
        min: [1, 'Product must be at least 1']
    }],
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
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
    order_date: {
        type: String,
        required: [true, 'order date is required']
    },
    order_due_date: {
        type: String,
        required: [true, 'order due date is required']
    },
    visits: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visit',
        deafult: []
    }],
    status: {
        type: String,
        enum: ['pendiente', 'completo'],
        default: 'pendiente'
    },
    refills_in_favor: {
        type: Number,
        required: [true, 'Recharges in favor is required'],
        default: 0
    },
    refills_delivered: {
        type: Number,
        required: [true, 'Recharges delivered is required'],
        default: 0
    },
    promotion: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'Promotion',
        required: false,
    },
    totalAmount: {
        type: Number,
        required: true
    }
}, { timestamps: true });


export default mongoose.model('Order', orderSchema)

