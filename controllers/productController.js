import Product from '../models/productModel.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export const newProduct = async (req, res, next) => {
    try {
        const { name, price, type, description } = req.body
        const file = req.file
        const product = await Product.findOne({ name })

        if (product) {
            return next(new ErrorResponse('Product already exists', 400))
        }
        if (!file) {
            return next(new ErrorResponse('Product-image cannot be empty', 400))
        }
        const newProduct = new Product({
            name,
            price,
            type,
            description,
            img: file.path

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
        const { name, price, type, description } = req.body;
        const file = req.file
        if (file) {
            const updateProduct = await Product.findByIdAndUpdate(id, { name, price, type, description, img: file.path }, { new: true })
            res.status(200).json({
                success: true,
                updateProduct
            })
        }
        else {
            const product = await Product.findById(id)
            console.log(product)
            const updateProduct = await Product.findByIdAndUpdate(id, { name, price, type, description, img: product.img }, { new: true })
            res.status(200).json({
                success: true,
                updateProduct
            })
        }

    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
    const { id } = req.params
    try {
        const deleteProduct = await Product.findByIdAndDelete(id)
        if(!deleteProduct){
            throw new ErrorResponse('Product not found', 404)
        }
        res.status(200).json({
            success: true,
            deleteProduct
        })
    } catch (error) {
        next(error)
    }
}
