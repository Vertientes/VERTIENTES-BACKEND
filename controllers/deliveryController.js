import { ErrorResponse } from "../utils/errorResponse.js"
import Order from '../models/orderModel.js'
import Delivery from '../models/deliveryModel.js'
import { getActualDate } from "../utils/dateUtils.js"
import User from '../models/userModel.js'

export const newDelivery = async (req, res, next) => {
    const { id } = req.params
    try {
        const order = await Order.findById(id)
        const delivery = await Delivery.findOne({ order: id })
        if (delivery) {
            throw new ErrorResponse('The order has already been added to delivery', 400)
        }
        if (!order) {
            throw new ErrorResponse('Order not found', 404)
        }

        const newDelivery = new Delivery({
            order: order.id,
            delivery_date: getActualDate()
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

export const updateDeliveryData = async (req, res, next) => {
    try {
        const { id } = req.params
        const { order_id, amount_paid, recharges_delivered, recharges_in_favor } = req.body
        const file = req.file
        const delivery = await Delivery.findById(id)
        const order = await Order.findById(order_id)
        const user = await User.findById(order.user)
        if (file) {
            user.house_img = file.path
            await user.save()
        }
        const updatedOrder = await Order.findByIdAndUpdate(order_id, { amount_paid, recharges_delivered, recharges_in_favor }, { new: true })
        if (amount_paid > order.total_amount) {
            order.extra_payment = order.total_amount - amount_paid

            await order.save()
            user.company_drum = recharges_delivered
            user.balance = order.extra_payment
            await user.save()
        }
        else {
            order.extra_payment = 0
            await order.save()
            user.company_drum = recharges_delivered
            user.balance = amount_paid - order.total_amount
            await user.save()
        }

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


