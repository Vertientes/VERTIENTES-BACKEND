import mongoose from 'mongoose'

const requestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    request_date: {
        type: String,
        required: [true, 'Please add a date'],
    },
    requested_recharges: {
        type: Number,
        required: [true, 'Please add a refills'],
    }
}, { timestamps: true });

export default mongoose.model('Request', requestSchema);