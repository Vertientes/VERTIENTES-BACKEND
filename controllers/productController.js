import Product from '../models/productModel.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export const newProduct = async (req, res, next) => {
    try {
        const { name, price } = req.body
        if (!name || !price) {
            return next(new ErrorResponse('Please add a name or price', 400))
        }
        const product = await Product.findOne({ name })
        if (product) {
            return next(new ErrorResponse('Product already exists', 400))
        }
        const newProduct = new Product({
            name,
            price
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({
            success: true,
            savedProduct
        })
    } catch (error) {
        next(error)
    }
}

export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
        res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, price } = req.body;
        if (!name || !price) {
            return next(new ErrorResponse('Please add a name or price', 400))
        }
        const product = await Product.findOne({name})
        if(product){
            return next(new ErrorResponse('Product already exists', 400))
        }
        const updateProduct = await Product.findByIdAndUpdate(id, { name, price }, { new: true })
        res.status(200).json({
            success: true,
            updateProduct
        })
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
    const { id } = req.params
    try {
        const deleteProduct = await Product.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            deleteProduct
        })
    } catch (error) {
        next(error)
    }
}
