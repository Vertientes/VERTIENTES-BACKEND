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
    payment_method: {
        type: String,
        enum: ['Transferencia', 'Efectivo'],
        required: [true, 'Payment method is required']
    },
    amount_paid: {
        type: Number,
        required: true,
        default: 0
    },
    order_date: {
        type: Date,
        required: [true, 'Order date is required']
    },
    order_due_date: {
        type: Date,
        required: [true, 'Order due date is required']
    },
    deliveries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Delivery',
        deafult: []
    }],
    request_recharges: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        deafult: []
    }],
    status: {
        type: String,
        enum: ['pendiente','en proceso','completo'],
        default: 'pendiente'
    },
    recharges_in_favor: {
        type: Number,
        required: [true, 'Recharges in favor is required'],
        default: 0
    },
    recharges_delivered: {
        type: Number,
        required: [true, 'Recharges delivered is required'],
        default: 0
    },
    proof_of_payment_image: [{
        type: String,
        required: false
    }],
    promotion: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'Promotion',
        required: false,
    },
    observation: {
        type: String,
        required: [true, 'Observation is required'],
    },
    total_amount: {
        type: Number,
        required: true
    }
}, { timestamps: true });


export default mongoose.model('Order', orderSchema)

