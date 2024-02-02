import Order from '../models/orderModel.js'
import { ErrorResponse } from '../utils/errorResponse.js';
import Visit from '../models/visitModel.js'
import { getActualDate } from '../utils/getActualDate.js';
import User from '../models/userModel.js'

export const createVisit = async (req, res, next) => {
    try {
        const { quantity_delivered, number_of_visit, observation, returned_drums } = req.body;
        const { id } = req.params
        const order = await Order.findById(id)
        const user = await User.findById(order.user)
        if (!order) {
            throw new ErrorResponse('Order not found', 404)
        }
        if (order.recharges_in_favor === 0 || quantity_delivered > order.recharges_in_favor) {
            throw new ErrorResponse('This order dont have recharges in favor or quantity delivered is major')
        }
        if (order.recharges_delivered >= order.quantity) {
            throw new ErrorResponse('This order dont have quantity for a visit')
        }
        const newVisit = new Visit({
            order: order.id,
            number_of_visit,
            visit_date: getActualDate(),
            quantity_delivered,
            returned_drums,
            observation
        });
        const savedVisit = await newVisit.save();

        order.visits.push(savedVisit.id)

        order.recharges_delivered = order.recharges_delivered + quantity_delivered

        await order.save();
        user.company_drum = (user.company_drum + quantity_delivered) - returned_drums
        await user.save()

        res.status(201).json({
            success: true,
            savedVisit
        });
    } catch (error) {
        next(error);
    }
};

export const getVisitsForOrder = async (req, res, next) => {
    try {
        const { id } = req.params.id
        const order = await Order.findById(id)
        const visits = await Visit.find({ order: order.id })
        res.status(200).json({
            success: true,
            visits
        });
    } catch (error) {
        next(error);
    }
};