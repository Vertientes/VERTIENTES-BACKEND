import { ErrorResponse } from "../../utils/errorResponse.js"
import Order from '../orders/orderModel.js'
import Delivery from './deliveryModel.js'
import User from '../user/userModel.js'

export const newDelivery = async (req, res, next) => {

    try {
        const { id } = req.params
        const { delivery_date } = req.body
        const order = await Order.findById(id)
        const delivery = await Delivery.findOne({ order: id })
        const user = await User.findById(order.user)
        console.log(req.body)
        if (delivery) {
            throw new ErrorResponse('The order has already been added to delivery', 400)
        }
        if (!order) {
            throw new ErrorResponse('Order not found', 404)
        }

        const newDelivery = new Delivery({
            order: order.id,
            delivery_date,
            delivery_zone: user.address.zone
        })

        const savedDelivery = await newDelivery.save()

        res.status(201).json({
            success: true,
            savedDelivery
        });

    } catch (error) {
        next(error)
    }
}

export const getDeliveries = async (req, res, next) => {
    try {
        const deliveries = await Delivery.find().populate({
            path: 'order',
            populate: [
                { path: 'user' },
                { path: 'product' },
                { path: 'promotion' },
                { path: 'visits' },
                { path: 'request_recharge' }
            ]
        }).sort({ "delivery_date": 1 });
        res.status(200).json({
            success: true,
            deliveries
        });
    } catch (error) {
        next(error);
    }
};

export const getDeliveriesForC5 = async (req, res, next) => {
    try {
        const deliveries = await Delivery.find({delivery_zone: 'c5'}).populate({
            path: 'order',
            populate: [
                { path: 'user' },
                { path: 'product' },
                { path: 'promotion' },
                { path: 'visits' },
                { path: 'request_recharge' }
            ]
        }).sort({ "delivery_date": 1 });
        res.status(200).json({
            success: true,
            deliveries
        });
    } catch (error) {
        next(error);
    }
};

export const getDeliveriesForGeneral = async (req, res, next) => {
    try {
        const deliveries = await Delivery.find({delivery_zone: 'general'}).populate({
            path: 'order',
            populate: [
                { path: 'user' },
                { path: 'product' },
                { path: 'promotion' },
                { path: 'visits' },
                { path: 'request_recharge' }
            ]
        }).sort({ "delivery_date": 1 });
        res.status(200).json({
            success: true,
            deliveries
        });
    } catch (error) {
        next(error);
    }
};


export const updateDeliveryData = async (req, res, next) => {
    try {
        const { id } = req.params
        const { order_id, amount_paid, recharges_delivered, recharges_in_favor } = req.body
        const delivery = await Delivery.findById(id)
        const order = await Order.findById(order_id)
        const user = await User.findById(order.user)
        const updatedOrder = await Order.findByIdAndUpdate(order_id, { amount_paid, recharges_delivered, recharges_in_favor }, { new: true })
        if (amount_paid > order.total_amount) {
            order.extra_payment =  amount_paid - order.total_amount 
            order.recharges_in_favor = order.quantity - recharges_delivered
            await order.save()
            user.company_drum = recharges_delivered
            user.balance = user.balance + order.extra_payment
            await user.save()
        }
        else {
            order.extra_payment = 0
            order.recharges_in_favor = order.quantity - recharges_delivered
            await order.save()
            user.company_drum = recharges_delivered
            user.balance = user.balance + amount_paid - order.total_amount
            await user.save()
        }
        order.status = 'en proceso',
            await order.save()
        delivery.status = 'entregado'
        await delivery.save()

        res.status(200).json({
            success: true,
            updatedOrder,
            delivery
        })
    } catch (error) {
        next(error)
    }
}


