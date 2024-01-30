import Order from '../models/orderModel.js'
import { ErrorResponse } from '../utils/errorResponse.js';
import Visit from '../models/visitModel.js'

export const newVisit = async (req, res, next) => {
    try {
        const { order_id, visit_date, quantity_delivered, observation, number_of_visit } = req.body
        const order = await Order.findById(order_id);
        if (!order) {
            throw new ErrorResponse('Order not found', 404)
        }

        const newVisit = new Visit({
            order: order.id,
            number_of_visit,
            visit_date,
            quantity_delivered,
            observation
        })

        const visit = await newVisit.save()

        res.status(201).json({
            success: true,
            visit
        })
    } catch (error) {
        next(error)
    }
}

export const getVisitsForOrder = async (req, res, next) => {
    try {
        const {id} = req.params

        const visits = await Visit.find( {order: id} ).populate('order')


        res.status(200).json({
            success: true,
            visits
        })
    } catch (error) {
        next(error)
    }
}