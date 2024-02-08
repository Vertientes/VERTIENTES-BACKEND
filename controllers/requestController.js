import Request from '../models/requestModel.js'
import { ErrorResponse } from '../utils/errorResponse.js'
import { getCurrentISODate } from '../utils/dateUtils.js';
import Order from '../models/orderModel.js'

export const createRequestRecharge = async (req, res, next) => {
    try {
        const { requested_recharges } = req.body;
        const order = await Order.findOne({ user: req.user.id, status: 'pendiente' })
        if (order.recharges_in_favor < requested_recharges) {
            throw new ErrorResponse('Recharges in favor is minor')
        }
        const newRequest = new Request({
            order: order.id,
            request_date: getCurrentISODate(),
            requested_recharges
        });
        const savedRequest = await newRequest.save();


        order.request_recharge.push(savedRequest.id);

        order.recharges_in_favor = order.recharges_in_favor - requested_recharges

        await order.save();

        res.status(201).json({
            success: true,
            savedRequest
        });
    } catch (error) {
        next(error);
    }
};

export const updateRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { requested_recharges } = req.body;
        const request = await Request.findById(id)
        if (!request) {
            throw new ErrorResponse('Request not found', 404)
        }

        const updatedRequest = await Request.findByIdAndUpdate(id, { requested_recharges }, { new: true })
        res.status(200).json({
            success: true,
            updatedRequest
        })
    } catch (error) {
        next(error)
    }
}

export const getRequestsForOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({ user: req.user.id, status: 'pendiente' })
        const requests = await Request.find({ order: order.id })
        res.status(200).json({
            success: true,
            requests
        });
    } catch (error) {
        next(error);
    }
};

export const deleteRequest = async (req, res, next) => {
    const { id } = req.params
    try {
        const deleteRequest = await Request.findByIdAndDelete(id)
        if (!deleteRequest) {
            throw new ErrorResponse('Request not found', 404)
        }
        res.status(200).json({
            success: true,
            deleteRequest
        })
    } catch (error) {
        next(error)
    }
}
