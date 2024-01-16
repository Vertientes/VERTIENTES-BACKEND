import Product from '../models/productModel.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export const newProduct = async (req, res, next) => {
    try {
        const { name, price } = req.body
        if (!name || !price) {
            return next(new ErrorResponse('Please add a name or price', 400))
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
