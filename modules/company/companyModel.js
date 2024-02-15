import mongoose from 'mongoose'

const companySchema = new mongoose.Schema({
    holder_cuil: {
        type: String,
        required: true
    },
    holder_name: {
        type: String,
        required: true
    },
    company_address: {
        neighborhood: {
            type: String,
            trim: true,
            required: [true, 'Neighborhood is required'],
            maxlength: 50
        },
        street: {
            type: String,
            trim: true,
            required: [true, 'Street is required'],
            maxlength: 50
        },
        house_number: {
            type: Number,
            trim: true,
            required: [true, 'House number is required'],
            maxlength: 10
        },
    },
    city:{
        type: String,
        required: true,
    },
    postal_code: {
        type: Number,
        required: true
    },
    business_name: {
        type: String,
        required: true
    },
    business_name_cuil: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    alias: {
        type: String,
        required: true
    }

}, { timestamps: true });

export default mongoose.model('Company', companySchema);