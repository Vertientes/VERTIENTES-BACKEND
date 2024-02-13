import Promotion from './promotionModel.js'
import { ErrorResponse } from '../../utils/errorResponse.js'

export const createPromotion = async (req, res, next) => {
    try {
        const { description, required_quantity, discounted_percentage } = req.body;
        const file = req.file
        if (!file) {
            throw new ErrorResponse('promotion-image cannot be empty', 400)
        }
        const newPromotion = new Promotion({
            description,
            required_quantity,
            discounted_percentage,
            img: file.path
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

export const updatePromotion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { description, required_quantity, discounted_percentage } = req.body;
        const file = req.file
        if (file) {
            const updatedPromotion = await Promotion.findByIdAndUpdate(id, { description, required_quantity, discounted_percentage, img: file.path }, { new: true })
            res.status(200).json({
                success: true,
                updatedPromotion
            })
        }
        else {
            const promotion = await Promotion.findById(id)
            const updatedPromotion = await Promotion.findByIdAndUpdate(id, { description, required_quantity, discounted_percentage, img: promotion.img }, { new: true })
            res.status(200).json({
                success: true,
                updatedPromotion
            })
        }

    } catch (error) {
        next(error)
    }
}

export const deletePromotion = async (req, res, next) => {
    const { id } = req.params
    try {
        const deletedPromotion = await Promotion.findByIdAndDelete(id)
        if(!deletedPromotion){
            throw new ErrorResponse('Promotion not found', 404)
        }
        res.status(200).json({
            success: true,
            deletedPromotion
        })
    } catch (error) {
        next(error)
    }
}

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