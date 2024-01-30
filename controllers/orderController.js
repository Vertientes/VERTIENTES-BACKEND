import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import Promotion from '../models/promotionModel.js'
import { getActualDate } from '../utils/getActualDate.js';
import { getDateAfterOneMonth } from '../utils/getDateAfterOneMonth.js';
import { v2 as cloudinary } from 'cloudinary'

export const newOrder = async (req, res, next) => {
    try {
        const user_orders = await Order.find({ user: req.user.id })
        user_orders.forEach((user_order) => {
            if (user_order.status === 'pendiente') {
                throw new ErrorResponse('You already have an outstanding order.', 400)
            }
        })

        const { quantity, promotion_id, payment_method, product_id } = req.body
        const file = req.file
        let monto_descontado = 0
        let total_bidones_descontado = 0
        let total_bidones_sin_descuento = 0
        let comprobante = ""


        // Verifica si el usuario existe
        const user = await User.findById(req.user.id);
        if (!user) {
            throw new ErrorResponse('User not found', 404)
        }
        const product = await Product.findById(product_id);

        if (!product) {
            throw new ErrorResponse('No product found', 404);
        }
        if (promotion_id !== "") {
            if (req.file && payment_method === "Transferencia") {
                comprobante = file.path
            }
            else {
                await cloudinary.uploader.destroy(req.file.filename);
                comprobante = "No disponible"
            }

            const promotion = await Promotion.findById(promotion_id)
            if (!promotion) {
                throw new ErrorResponse('Promotion not found', 404)
            }

            if (promotion.required_quantity > quantity) {
                throw new ErrorResponse('Promotion is not applicable', 400)
            }

            //calculo del descuento aplicado a los bidones
            const total_bidones_sin_descuento = product.price * quantity
            monto_descontado = (total_bidones_sin_descuento * promotion.discounted_percentage) / 100;
            total_bidones_descontado = total_bidones_sin_descuento - monto_descontado


            const newOrder = new Order({
                user: user.id,
                product: product_id,
                promotion: promotion_id,
                quantity,
                payment_method,
                proof_of_payment_image: comprobante,
                order_date: getActualDate(),
                order_due_date: getDateAfterOneMonth(),
                total_amount: total_bidones_descontado,
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
            if (req.file && payment_method === "Transferencia") {
                comprobante = file.path
            }
            else {
                await cloudinary.uploader.destroy(req.file.filename);
                comprobante = "No disponible"
            }

            total_bidones_sin_descuento = product.price * quantity
            const newOrder = new Order({
                user: user.id,
                product: product_id,
                promotion: null,
                quantity,
                payment_method,
                proof_of_payment_image: comprobante,
                order_date: getActualDate(),
                order_due_date: getDateAfterOneMonth(),
                total_amount: total_bidones_sin_descuento
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


export const getMyOrders = async (req, res, next) => {
    try {
        const user_orders = await Order.find({ user: req.user.id });

        // Filtrar las órdenes sin promoción
        const orders_sin_promocion = user_orders.filter(user_order => user_order.promotion === 'No disponible');

        // Filtrar las órdenes con promoción (ObjectID)
        const orders_con_promocion = user_orders.filter(user_order => user_order.promotion !== 'No disponible');

        // Hacer el populate solo para las órdenes con promoción
        const orders_con_promocion_populated = await Order.populate(orders_con_promocion, { path: 'promotion user product' });

        // Hacer el populate para las órdenes sin promoción
        const orders_sin_promocion_populated = await Order.populate(orders_sin_promocion, { path: 'user product' });

        // Unir las órdenes con promoción poblada y las órdenes sin promoción poblada
        const all_orders = [...orders_sin_promocion_populated, ...orders_con_promocion_populated];

        res.status(200).json({
            success: true,
            orders: all_orders
        });
    } catch (error) {
        console.error(error)
        next(error);
    }
}


export const updateOrderData = async (req, res, next) => {
    const { amount_paid, recharges_delivered, recharges_in_favor } = req.body
    const { id } = req.params
    const order = await Order.findById(id)
    if (!order) {
        throw new ErrorResponse('Order not found', 404)
    }
}

//funcion para que el usuario pida un nuevo servicio
export const updateOrderForUser = async (req, res, next) => {

}

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

export const requestRecharge = async (req, res, next) => {

}