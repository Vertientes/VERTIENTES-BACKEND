import Order from './orderModel.js';
import User from '../user/userModel.js';
import Product from '../products/productModel.js';
import { ErrorResponse } from '../../utils/errorResponse.js';
import Promotion from '../promotion/promotionModel.js'
import { v2 as cloudinary } from 'cloudinary'

export const newOrder = async (req, res, next) => {
    try {
        const { quantity, promotion_id, payment_method, product_id, observation, order_date, order_due_date } = req.body
        const file = req.file
        let monto_descontado = 0
        let total_bidones_descontado = 0
        let total_bidones_sin_descuento = 0
        let comprobante = ""
        let user_balance = 0


        // Verifica si el usuario existe
        const user = await User.findById(req.user.id);
        if (!user) {
            throw new ErrorResponse('User not found', 404)
        }
        const product = await Product.findById(product_id);

        if (!product) {
            throw new ErrorResponse('No product found', 404);
        }
        const user_orders = await Order.find({ user: req.user.id })
        // Contadores para tipos de pedidos pendientes
        let pendingBidonOrderCount = 0;
        let pendingDispenserOrderCount = 0;

        // Verificar los tipos de pedidos pendientes del usuario
        for (const userOrder of user_orders) {
            const product = await Product.findById(userOrder.product);
            if (product.type === 'bidon' && userOrder.status === 'pendiente') {
                pendingBidonOrderCount++;
            } else if (product.type === 'dispenser' && userOrder.status === 'pendiente') {
                pendingDispenserOrderCount++;
            }
        }
        if (product.type === 'bidon') {
            if (pendingBidonOrderCount >= 1) {
                throw new ErrorResponse('You already have a pending bidon order.', 400);
            }
        } else if (product.type === 'dispenser') {
            if (pendingDispenserOrderCount >= 1) {
                throw new ErrorResponse('You already have a pending dispenser order.', 400);
            }
        }

        if (!req.file) {
            comprobante = 'No disponible'
        }
        if (req.file && payment_method === "Transferencia") {
            comprobante = file.path
        }

        if (req.file && payment_method === "Efectivo") {
            await cloudinary.uploader.destroy(req.file.filename);
            comprobante = "No disponible"
        }
        if (user.balance > 0) {
            user_balance = user.balance
        }

        if (promotion_id !== "") {


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
                order_date,
                order_due_date,
                observation,
                total_amount: total_bidones_descontado - user_balance,
            });

            const savedOrder = await newOrder.save();

            const populatedOrder = await Order.findById(savedOrder.id)
                .populate('user', '-password')
                .populate('product', '-img')
                .populate('promotion', '-img')

            res.status(201).json({
                success: true,
                populatedOrder,
                discounted_quantity: user_balance
            });


        }
        else {
            total_bidones_sin_descuento = product.price * quantity
            const newOrder = new Order({
                user: user.id,
                product: product_id,
                promotion: null,
                quantity,
                payment_method,
                proof_of_payment_image: comprobante,
                order_date,
                order_due_date,
                observation,
                total_amount: total_bidones_sin_descuento - user_balance
            });

            const savedOrder = await newOrder.save();

            const populatedOrder = await Order.findById(savedOrder.id)
                .populate('user', '-password')
                .populate('product')

            res.status(201).json({
                success: true,
                populatedOrder,
                discounted_quantity: user_balance
            });
        }
    }

    catch (error) {
        next(error);
    }
}




export const getMyOrders = async (req, res, next) => {
    try {
        const user_orders = await Order.find({ user: req.user.id })

        // Filtrar las órdenes sin promoción
        const orders_sin_promocion = user_orders.filter(user_order => user_order.promotion === 'No disponible');

        // Filtrar las órdenes con promoción (ObjectID)
        const orders_con_promocion = user_orders.filter(user_order => user_order.promotion !== 'No disponible');

        // Hacer el populate solo para las órdenes con promoción
        const orders_con_promocion_populated = await Order.populate(orders_con_promocion, { path: 'promotion user product request_recharge' });

        // Hacer el populate para las órdenes sin promoción
        const orders_sin_promocion_populated = await Order.populate(orders_sin_promocion, { path: 'user product request_recharge' });

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

export const renewOrder = async (req, res, next) => {
    try {
        const { id } = req.params
        const { quantity, promotion_id, payment_method, product_id } = req.body
        const file = req.file
        let monto_descontado = 0
        let total_bidones_descontado = 0
        let total_bidones_sin_descuento = 0
        let user_balance = 0
        let proof_of_payment_image_array = []
        //buscar la order la cual se va renovar
        const order = await Order.findById(id)

        proof_of_payment_image_array.push(...order.proof_of_payment_image)
        //buscar el usuario al que le pertenece la order
        const user = await User.findById(order.user);

        const product = await Product.findById(product_id);


        if (!product) {
            throw new ErrorResponse('No product found', 404);
        }
        if (!req.file) {
            proof_of_payment_image_array.push('No disponible')
        }
        if (req.file && payment_method === "Transferencia") {
            proof_of_payment_image_array.push(file.path)
        }

        if (req.file && payment_method === "Efectivo") {
            await cloudinary.uploader.destroy(req.file.filename);
            proof_of_payment_image_array.push('No disponible')
        }
        if (user.balance > 0) {
            user_balance = user.balance
        }

        if (promotion_id !== "") {


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
                quantity: order.quantity + quantity,
                payment_method,
                proof_of_payment_image: proof_of_payment_image_array,
                order_date: getActualDate(),
                order_due_date: getDateAfterOneMonth(),
                total_amount: total_bidones_descontado - user_balance,
            });

            const savedOrder = await newOrder.save();

            const populatedOrder = await Order.findById(savedOrder.id)
                .populate('user', '-password')
                .populate('product', '-img')
                .populate('promotion', '-img')

            res.status(201).json({
                success: true,
                populatedOrder,
                discounted_quantity: user_balance
            });


        }
        else {
            total_bidones_sin_descuento = product.price * quantity
            const newOrder = new Order({
                user: user.id,
                product: product_id,
                promotion: null,
                quantity,
                payment_method,
                proof_of_payment_image: proof_of_payment_image_array,
                order_date: getActualDate(),
                order_due_date: getDateAfterOneMonth(),
                total_amount: total_bidones_sin_descuento - user_balance
            });

            const savedOrder = await newOrder.save();

            const populatedOrder = await Order.findById(savedOrder.id)
                .populate('user', '-password')
                .populate('product')

            res.status(201).json({
                success: true,
                populatedOrder,
                discounted_quantity: user_balance
            });
        }


    } catch (error) {
        next(error);
    }
}


//funcion para que el delivery modifique la order
export const updateOrderData = async (req, res, next) => {
    try {
        const { order_date, order_due_date, amount_paid, recharges_delivered, recharges_in_favor, observation } = req.body
        const { id } = req.params
        const order = await Order.findById(id)
        if (!order) {
            throw new ErrorResponse('Order not found', 404)
        }
        const updatedOrder = await Order.findByIdAndUpdate(id, { amount_paid, recharges_delivered, recharges_in_favor, order_date, order_due_date, observation }, { new: true })

        res.status(200).json({
            success: true,
            updatedOrder
        })
    } catch (error) {
        next(error)
    }
}


export const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('user', '-password').populate('product').populate('promotion').populate('deliveries').populate('request_recharges')
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