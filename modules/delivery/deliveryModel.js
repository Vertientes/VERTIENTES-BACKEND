import mongoose from 'mongoose'

const deliverySchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    status: {
        type: String,
        required: [true, 'Please add a status'],
        enum: ['pendiente', 'entregado'],
        default: 'pendiente'
    },
    delivery_zone: {
        type: String,
        required: true,
        enum: ['c5', 'general']
    },
    delivery_date: {
        type: String,
        required: [true, 'Please add a delivery date'],
    },
    delivery_location: {
        type: String,
        required: true
    },
    amount_paid: {
        type: Number,
        required: true,
        default: 0,
    },
    recharges_delivered: {
        type: Number,
        required: true,
        default: 0
    },
    returned_drums: {
        type: Number,
        required: true,
        default: 0
    }

}, { timestamps: true });

export default mongoose.model('Delivery', deliverySchema);