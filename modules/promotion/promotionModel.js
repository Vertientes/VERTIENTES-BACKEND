import mongoose from 'mongoose'

const promotionSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Please add a name'],
        min: [1, 'Recargas must be at least 1']
    },
    required_quantity: {
        type: Number,
        required: [true, 'Please add required quantity'],
        min: [1, 'Recargas must be at least 1']
    },
    discounted_percentage: {
        type: Number,
        required: [true, 'Please add discounted percentage'],
        min: [1, 'Recargas must be at least 1']
    },
    img: {
        type: String,
        required: [true, 'Url img is required'],
    }
}, { timestamps: true });

export default mongoose.model('Promotion', promotionSchema);