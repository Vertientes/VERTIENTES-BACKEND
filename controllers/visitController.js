import Order from '../models/orderModel.js'
import { ErrorResponse } from '../utils/errorResponse.js';
import Visit from '../models/visitModel.js'
import { getActualDate } from '../utils/getActualDate.js';

export const createVisit = async (req, res, next) => {
    try {
        const { quantity_delivered, number_of_visit, observation } = req.body;
        const { id } = req.params
        const order = await Order.findById(id)
        if(!order){
            throw new ErrorResponse('Order not found', 404)
        }
        if(order.recharges_in_favor < 0 ){
            throw new ErrorResponse('This order dont have recharges in favor')
        }
        if (order.recharges_delivered >= order.quantity) {
            throw new ErrorResponse('This order dont have quantity for a visit')
        }
        const newVisit = new Visit({
            order: order.id,
            number_of_visit,
            visit_date: getActualDate(),
            quantity_delivered,
            observation
        });
        const savedVisit = await newVisit.save();

        order.visits.push(savedVisit.id)

        order.recharges_delivered = order.recharges_delivered + quantity_delivered

        await order.save();

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