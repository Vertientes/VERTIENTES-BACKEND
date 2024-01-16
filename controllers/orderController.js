import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export const newOrder = async (req, res, next) => {
    try {
        const { quantity, productId } = req.body
        const { street, neighborhood, houseNumber } = req.body.deliveryAddress
        // Verifica si el usuario existe
        const user = await User.findById(req.user._id);
        if (!user) {
            return next(new ErrorResponse('User not found', 400));
        }
        if(!street || !neighborhood || houseNumber) {
            return next(new ErrorResponse('Please add your address', 400))
        }
        if (!productId) {
            return next(new ErrorResponse('Product ID is required', 400));
        }

        // Busca el producto por su ID
        const product = await Product.findById(productId);
        if (!product) {
            return next(new ErrorResponse('Product not found', 400));
        }

        const totalAmount = quantity * product.price;

        // Crea la nueva orden
        const newOrder = new Order({
            user: user.id,
            quantity: req.body.quantity,
            totalAmount: totalAmount,
            deliveryAddress: req.body.deliveryAddress
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            success: true,
            savedOrder
        });
    } catch (error) {
        next(error);
    }
};
