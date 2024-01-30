import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import Promotion from '../models/promotionModel.js'
import { getActualDate } from '../utils/getActualDate.js';
import { getDateAfterOneMonth } from '../utils/getDateAfterOneMonth.js';

export const newOrder = async (req, res, next) => {
    try {
        const { quantity, promotion_id, payment_method } = req.body
        const products_ids = req.body.product_id

        // Verifica si el usuario existe
        const user = await User.findById(req.user.id);
        if (!user) {
            throw new ErrorResponse('User not found', 404)
        }

        const products = await Product.find({ id: products_ids });
        if (!products) {
            throw new ErrorResponse('any Product not found', 404)
        }
        if (promotion_id !== "") {
            const promotion = await Promotion.findById(promotion_id)
            if (!promotion) {
                throw new ErrorResponse('Promotion not found', 404)
            }

            if (promotion.required_quantity > quantity) {
                throw new ErrorResponse('Promotion is not applicable', 400)
            }


            //Se calcula el total sin ninguna promocion aplicada
            let totalWithoutDiscount = quantity * product.price;

            //Se calcula el descuento en base al total sin descuento
            const discountAmount = (totalWithoutDiscount * promotion.discounted_percentage) / 100;
            const totalAmount = totalWithoutDiscount - discountAmount;


            const newOrder = new Order({
                user: user.id,
                product: product.id,
                quantity,
                payment_method,
                payment_date: getActualDate(),
                payment_due_date: getDateAfterOneMonth(),
                totalAmount,
                deliveryAddress: req.body.deliveryAddress
            });

            const savedOrder = await newOrder.save();

            const populatedOrder = await Order.findById(savedOrder.id)
                .populate('user', '-password')
                .populate('product')

            res.status(201).json({
                success: true,
                populatedOrder
            });
        }


    } catch (error) {
        next(error);
    }
};




export const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('user', '-password').populate('product').populate('promotion')
        res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        next(error)
    }
}

export const changeOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return next(new ErrorResponse('Please add a status', 400))
        }

        const updateOrder = await Order.findByIdAndUpdate(id, { status }, { new: true })
        res.status(200).json({
            success: true,
            updateOrder
        })
    } catch (error) {
        next(error)
    }
}