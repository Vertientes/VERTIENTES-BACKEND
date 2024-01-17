import Promotion from '../models/promotionModel.js'
import { ErrorResponse } from '../utils/errorResponse.js'

export const createPromotion = async (req, res, next) => {
    try {
        const { description, requiredQuantity, discounted_percentage } = req.body;

        if (!description || !requiredQuantity || !discounted_percentage) {
            return next(new ErrorResponse('Please complete the fields', 400))
        }

        const newPromotion = await new Promotion({
            description,
            requiredQuantity,
            discounted_percentage
        });

        const savedPromotion = await newPromotion.save();

        res.status(201).json({
            success: true,
            savedPromotion
        });
    } catch (error) {
        next(error);
    }
};

export const getPromotions = async (req, res, next) => {
    try {
        const promotions = await Promotion.find();
        res.status(200).json({
            success: true,
            promotions: promotions
        });
    } catch (error) {
        next(error);
    }
};