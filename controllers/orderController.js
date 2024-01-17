import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import Promotion from '../models/promotionModel.js'

//65a8540c8e8b3338c8022ff8 id promocion
//65a58f6d5f751e3890950236 id producto

export const newOrder = async (req, res, next) => {
    try {
        const { quantity, productId, promotionId, cant_a_entregar } = req.body
        const { street, neighborhood, houseNumber } = req.body.deliveryAddress
        // Verifica si el usuario existe
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new ErrorResponse('User not found', 400));
        }
        if (!street || !neighborhood || !houseNumber) {
            return next(new ErrorResponse('Please add your address', 400))
        }
        if (!productId) {
            return next(new ErrorResponse('Product ID is required', 400));
        }
        // Busca el producto por su ID

        const product = await Product.findById(productId);
        if (!product) {
            return next(new ErrorResponse('Product not found', 400));
        }
        if (promotionId !== "") {
            const promotion = await Promotion.findById(promotionId)
            if (!promotion) {
                return next(new ErrorResponse('Promotion not found', 400));
            }

            if (promotion.requiredQuantity > quantity) {
                return next(new ErrorResponse('Promotion is not applicable', 400))
            }
            let totalWithoutDiscount = quantity * product.price;

            // Calculamos el descuento y actualizamos el totalAmount
            const discountAmount = (totalWithoutDiscount * promotion.discounted_percentage) / 100;
            const totalAmount = totalWithoutDiscount - discountAmount;

            if (cant_a_entregar !== quantity) {
                // Crea la nueva orden
                const newOrder = new Order({
                    user: user.id,
                    product: product.id,
                    quantity,
                    recargas: quantity - cant_a_entregar,
                    cant_a_entregar,
                    totalAmount,
                    promotion: promotionId,
                    deliveryAddress: req.body.deliveryAddress
                });
                const savedOrder = await newOrder.save();
                const populatedOrder = await Order.findById(savedOrder.id)
                    .populate('user', '-password')
                    .populate('product', '-_id')
                    .populate('promotion', '-_id -requiredQuantity')
                res.status(201).json({
                    success: true,
                    populatedOrder
                });
            }
        }
        else {
            const newOrder = new Order({
                user: user.id,
                product: product.id,
                quantity,
                recargas: quantity - cant_a_entregar,
                cant_a_entregar,
                totalAmount: product.price * quantity,
                deliveryAddress: req.body.deliveryAddress
            });

            const savedOrder = await newOrder.save();

            const populatedOrder = await Order.findById(savedOrder.id)
                .populate('user', '-password')
                .populate('product', '-_id')

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