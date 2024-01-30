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
        let monto_dispenser = 0
        let monto_descontado = 0
        let total_bidones_descontado = 0
        let total_bidones_sin_descuento = 0
        
        // Verifica si el usuario existe
        const user = await User.findById(req.user.id);
        if (!user) {
            throw new ErrorResponse('User not found', 404)
        }
        const products = await Product.find({ _id: { $in: products_ids } });

        if (!products || products.length === 0) {
            throw new ErrorResponse('No product found or field is empty', 404);
        }
        if (promotion_id !== "") {
            const promotion = await Promotion.findById(promotion_id)
            if (!promotion) {
                throw new ErrorResponse('Promotion not found', 404)
            }

            if (promotion.required_quantity > quantity) {
                throw new ErrorResponse('Promotion is not applicable', 400)
            }


            //Se calcula el total de los bidones nada mas, ya que el dispenser no aplica ninguna promocion


            products.forEach((product) => {
                if (product.type === 'bidon') {
                    total_bidones_sin_descuento += product.price * quantity
                    console.log(total_bidones_sin_descuento)
                }
                if (product.type === 'dispenser') {
                    monto_dispenser = product.price
                    console.log(monto_dispenser)
                }
            })


            //calculo del descuento aplicado a los bidones
            monto_descontado = (total_bidones_sin_descuento * promotion.discounted_percentage) / 100;
            total_bidones_descontado = total_bidones_sin_descuento - monto_descontado


            const newOrder = new Order({
                user: user.id,
                product: products,
                promotion: promotion_id,
                quantity,
                payment_method,
                order_date: getActualDate(),
                order_due_date: getDateAfterOneMonth(),
                deliveryAddress: req.body.deliveryAddress,
                totalAmount: total_bidones_descontado + monto_dispenser,
            });

            const savedOrder = await newOrder.save();

            const populatedOrder = await Order.findById(savedOrder.id)
                .populate('user', '-password')
                .populate('product', '-img')
                .populate('promotion', '-img')

            res.status(201).json({
                success: true,
                populatedOrder
            });


        }
        else {
            
            
            products.forEach((product) => {
                if (product.type === 'bidon') {
                    total_bidones_sin_descuento += product.price * quantity
                    console.log(total_bidones_sin_descuento)
                }
                if (product.type === 'dispenser') {
                    monto_dispenser = product.price
                    console.log(monto_dispenser)
                }
            })

            const newOrder = new Order({
                user: user.id,
                product: products,
                promotion: "No seleccionada",
                quantity,
                payment_method,
                order_date:getActualDate(),
                order_due_date:getDateAfterOneMonth(),
                deliveryAddress: req.body.deliveryAddress,
                totalAmount: total_bidones_sin_descuento + monto_dispenser,
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