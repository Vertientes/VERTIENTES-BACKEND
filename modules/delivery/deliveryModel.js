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
        type: {
            type: String,
            enum: ['Point'], // Solo permitir el tipo 'Point'
            required: true
        },
        coordinates: {
            type: [Number], // Array de números para latitud y longitud
            required: true
        }
    }

}, { timestamps: true });
deliverySchema.index({ delivery_location: '2d' });
export default mongoose.model('Delivery', deliverySchema);