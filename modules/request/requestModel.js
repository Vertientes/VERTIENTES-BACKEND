import mongoose from 'mongoose'

const requestSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    request_date: {
        type: String,
        required: [true, 'Please add a date'],
    },
    requested_recharges: {
        type: Number,
        required: [true, 'Please add a refills'],
    },
    status:{
        type: String,
        required: true,
        default: 'pendiente'
    }
}, { timestamps: true });

export default mongoose.model('Request', requestSchema);