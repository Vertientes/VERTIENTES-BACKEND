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
        required: [true, 'Please add a delivery location'],
    }

}, { timestamps: true });
deliverySchema.index({ delivery_location: '2dsphere' });
export default mongoose.model('Delivery', deliverySchema);