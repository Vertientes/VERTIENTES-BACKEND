import mongoose from 'mongoose'

const visitSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    number_of_visit:{
        type: Number,
        required: [true, 'Number visit is required']  
    },
    visit_date: {
        type: String,
        required: [true, 'Visit date is required'],
        min: [1, 'Visit must be at least 1']
    },
    quantity_delivered: {
        type: Number,
        required: [true, 'Quantity delivered is required'],
        min: [1, 'Quantity delivered must be at least 1']
    },
    observation: {
        type: String,
        required: false
    },
}, { timestamps: true });


export default mongoose.model('Visit', visitSchema)

