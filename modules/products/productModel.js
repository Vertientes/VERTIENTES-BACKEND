import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [1, 'Price must be at least 1']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        min: [1, 'Name must be at least 1']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        min: [1, 'Description must be at least 1']
    },
    type: {
        type: String,
        required: [true, 'Type is required'],
        enum: ['dispenser', 'bidon'],
    },
    img: {
        type: String,
        required: [true, 'Url img is required'],
    }
}, { timestamps: true });


export default mongoose.model('Product', productSchema)

