import Order from './orderModel.js';
import User from '../user/userModel.js';
import Product from '../products/productModel.js';
import { ErrorResponse } from '../../utils/errorResponse.js';
import Promotion from '../promotion/promotionModel.js'
import { v2 as cloudinary } from 'cloudinary'
import { getCurrentISODate, getDateNextMonthISO } from '../../utils/dateUtils.js';

// Solicitar un nuevo pedido a la empresa
export const newOrder = async (req, res, next) => {
    try {
        const { quantity, promotion_id, payment_method, product_id, observation, } = req.body
        let quantity_number = parseInt(quantity)
        const file = req.file

        // Variables auxiliares para realizar calculos automaticos
        let discounted_amount = 0;
        let total_discounted_amount = 0;
        let total_without_discount = 0;
        let discounted_quantity = 0
        let proof_of_payment_image = ''

        // Verificar si observation es vacia para asignar un valor por default
        if (observation === "") {
            observation = 'No hay observaciones proporcionadas'
        }
        // Buscar al usuario que realizo el pedido de la orden
        const user = await User.findById(req.user.id);
        // Verificar que el que crea la orden sea un usuario y no un repartidor u otro role
        if (user.role !== 'user') {
            return next(new ErrorResponse('Only customers can request orders', 400))
        }
        if (!user) {
            return next(new ErrorResponse('User not found', 404))
        }

        // Buscar el producto que pidio el usuario en la orden
        const product = await Product.findById(product_id);
        if (!product) {
            return next(new ErrorResponse('Product not found', 404))
        }

        // Comprobar que el usuario tenga solo una orden pendiente, puede tener 2, pero no del mismo tipo

        // Obtener todas las ordenes creadas por ese usuario
        const user_orders = await Order.find({ user: req.user.id })

        // Contar los tipos de ordenes que tiene (Solo puede tener una de bidon, y otra de dispenser)
        let order_drum_pending = 0;
        let order_dispenser_pending = 0;

        // Recorrer todas las ordenes del usuario, incrementar si ya posee una orden pendiente.
        // Esto valida que el cliente solo pueda tener una orden en proceso, de lo contrario no podra crear otras
        for (const user_order of user_orders) {
            const product_order = await Product.findById(user_order.product);
            // Buscamos el producto de la orden, si coincide con bidon y la orden esta pendiente incrementamos
            if ((product_order.type === 'bidon' && user_order.status === 'pendiente') || (product_order.type === 'bidon' && user_order.status === 'en proceso')) {
                order_drum_pending++

                // Buscamos el producto de la orden, si coincide con dispenser y la orden esta pendiente incrementamos
            } else if ((product_order.type === 'dispenser' && user_order.status === 'pendiente') || (product_order.type === 'dispenser' && user_order.status === 'en proceso')) {
                order_dispenser_pending++
            }
        }
        if (product.type === 'bidon') {
            // Comprobar si tiene una orden en proceso con el producto bidon
            if (order_drum_pending >= 1) {
                return next(new ErrorResponse('You already have a pending or in process drum order', 400))
            }
        } else if (product.type === 'dispenser') {
            // Comprobar si tiene una orden en proceso con el producto dispenser
            if (order_dispenser_pending >= 1) {
                return next(new ErrorResponse('You already have a pending or in process dispenser order', 400))
            }
        }
        if (payment_method === 'Efectivo' && file) {
            await cloudinary.uploader.destroy(req.file.filename);
            return next(new ErrorResponse('You cannot send a receipt when the payment method is cash', 400))
        }
        else if (payment_method === 'Transferencia' && !file) {
            return next(new ErrorResponse('Comprobant is required', 400))
        }
        // Comprobamos si no se mando la imagen de comprobante de pago
        if (!file) {
            proof_of_payment_image = 'No disponible'
        }
        // Si se mando imagen se guarda en el array de comprobantes de pago el link a cloudinary
        else if (file) {
            proof_of_payment_image = file.path
        }

        // Logica para agregar la orden a la base de datos en caso de que el producto sea bidon, y haya una promocion
        // Comprobamos si el usuario aplico a una promocion

        if (promotion_id !== "" && product.type === 'bidon') {
            const promotion = await Promotion.findById(promotion_id)
            if (!promotion) {
                return next(new ErrorResponse('Promotion not found', 404))
            }
            if (promotion.required_quantity > quantity_number) {
                throw new ErrorResponse('Promotion is not applicable', 400)
            }

            // Calculamos el monto sin la promocion
            total_without_discount = product.price * quantity_number
            // Calculamos el descuento de ese monto
            discounted_amount = (total_without_discount * promotion.discounted_percentage) / 100;
            // Calculamos el monto con el descuento aplicado
            total_discounted_amount = total_without_discount - discounted_amount

            // Descontar el balance del usuario en caso de que se pueda
            if (user.balance > total_discounted_amount) {
                total_discounted_amount = 0
                discounted_quantity = user.balance + discounted_amount
                user.balance = user.balance - total_discounted_amount
                await user.save()
            }
            else if (user.balance > 0 && user.balance < total_without_discount) {
                total_discounted_amount = total_discounted_amount - user.balance
                discounted_quantity = user.balance + discounted_amount
                user.balance = 0
                await user.save()
            }


            // Agregamos la orden a la base de datos con el descuento aplicado
            const newOrder = new Order({
                user: user.id,
                product: product_id,
                promotion: promotion_id,
                quantity: quantity_number,
                payment_method,
                proof_of_payment_image,
                order_date: getCurrentISODate(),
                order_due_date: getDateNextMonthISO(),
                observation,
                discounted_quantity,
                total_amount: total_discounted_amount
            });

            // Guardamos la orden en la base de datos
            const savedOrder = await newOrder.save();

            // Respondemos con la orden ya creada, con su promocion aplicada
            res.status(201).json({
                success: true,
                savedOrder,
            });
        }

        // Agregar la orden a la base de datos, en caso de que no aplique a ninguna promocion y el producto sea bidon
        else if (promotion_id == "" && product.type === 'bidon') {

            total_without_discount = product.price * quantity_number

            // Descontar balance del usuario
            if (user.balance > total_without_discount) {
                total_without_discount = 0
                discounted_quantity = user.balance
                user.balance = user.balance - total_without_discount
                await user.save()
            }
            else if (user.balance > 0 && user.balance < total_without_discount) {
                total_without_discount = total_without_discount - user.balance
                discounted_quantity = user.balance
                user.balance = 0
                await user.save()
            }
            const newOrder = new Order({
                user: user.id,
                product: product_id,
                promotion: null,
                quantity,
                payment_method,
                proof_of_payment_image,
                order_date: getCurrentISODate(),
                order_due_date: getDateNextMonthISO(),
                observation,
                discounted_quantity,
                total_amount: total_without_discount
            });

            // Guardamos la orden en la base de datos
            const savedOrder = await newOrder.save();


            res.status(201).json({
                success: true,
                savedOrder,
                discounted_quantity
            });
        }

        // Agregar una nueva orden a la base de datos en caso del que producto sea dispenser
        else if (product.type === 'dispenser') {

            total_without_discount = product.price * quantity_number
            if (user.balance > total_without_discount) {
                total_without_discount = 0
                discounted_quantity = user.balance
                user.balance = user.balance - total_without_discount
                await user.save()
            }
            else if (user.balance > 0 && user.balance < total_without_discount) {
                total_without_discount = total_without_discount - user.balance
                discounted_quantity = user.balance
                user.balance = 0
                await user.save()
            }
            const newOrder = new Order({
                user: user.id,
                product: product_id,
                promotion: null,
                quantity,
                payment_method,
                proof_of_payment_image,
                order_date: getCurrentISODate(),
                order_due_date: getDateNextMonthISO(),
                observation,
                discounted_quantity,
                total_amount: total_without_discount
            });

            // Guardamos la orden en la base de datos
            const savedOrder = await newOrder.save();


            res.status(201).json({
                success: true,
                savedOrder
            });
        }
    }
    catch (error) {
        next(error);
    }
}

// Obtener las ordenes pendientes del usuario logueado
export const getUserOrdersPending = async (req, res, next) => {
    try {
        const pending_user_orders = await Order.find({
            user: req.user.id,
            status: 'pendiente'
        })
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'product'
            })
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'deliveries'
            })
            .populate({
                path: 'promotion'
            })
            .populate({
                path: 'request_recharges'
            })


        res.status(200).json({
            success: true,
            pending_user_orders
        });
    } catch (error) {
        console.error(error)
        next(error);
    }
}

// Obtener las ordenes en proceso del usuario logueado
export const getUserOrdersInProcess = async (req, res, next) => {
    try {
        const process_user_orders = await Order.find({
            user: req.user.id,
            status: 'en proceso'
        })
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'product'
            })
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'deliveries'
            })
            .populate({
                path: 'promotion'
            })
            .populate({
                path: 'request_recharges'
            })


        res.status(200).json({
            success: true,
            process_user_orders
        });
    } catch (error) {
        console.error(error)
        next(error);
    }
}

// Obtener las ordenes completadas del usuario logueado
export const getUserOrdersCompleted = async (req, res, next) => {
    try {
        const completed_user_orders = await Order.find({
            user: req.user.id,
            status: 'completo'
        })
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'product'
            })
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'deliveries'
            })
            .populate({
                path: 'promotion'
            })
            .populate({
                path: 'request_recharges'
            })


        res.status(200).json({
            success: true,
            completed_user_orders
        });
    } catch (error) {
        console.error(error)
        next(error);
    }
}

// Obtener todas las ordenes pendientes (Admin y Super Admin)
export const getAllOrdersPending = async (req, res, next) => {
    try {
        const pending_all_orders = await Order.find({ status: 'pendiente' })
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'product'
            })
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'deliveries'
            })
            .populate({
                path: 'promotion'
            })
            .populate({
                path: 'request_recharges'
            })


        res.status(200).json({
            success: true,
            pending_all_orders
        });

    } catch (error) {
        next(error)
    }
}

// Obtener todas las ordenes en proceso (Admin y Super Admin)
export const getAllOrdersInProcess = async (req, res, next) => {
    try {
        const process_all_orders = await Order.find({ status: 'en proceso' })
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'product'
            })
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'deliveries'
            })
            .populate({
                path: 'promotion'
            })
            .populate({
                path: 'request_recharges'
            })


        res.status(200).json({
            success: true,
            process_all_orders
        });

    } catch (error) {
        next(error)
    }
}

// Obtener todas las ordenes completadas (Admin y Super Admin)
export const getAllOrdersCompleted = async (req, res, next) => {
    try {
        const completed_all_orders = await Order.find({ status: 'completo' })
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'product'
            })
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'deliveries'
            })
            .populate({
                path: 'promotion'
            })
            .populate({
                path: 'request_recharges'
            })


        res.status(200).json({
            success: true,
            completed_all_orders
        });

    } catch (error) {
        next(error)
    }
}

// Actualizar datos de la orden (Admin y Super Admin)
export const updateOrderData = async (req, res, next) => {
    try {
        let { order_date, order_due_date, amount_paid, recharges_delivered, recharges_in_favor, observation } = req.body
        const { id } = req.params
        const order = await Order.findById(id)
        if (!order) {
            throw new ErrorResponse('Order not found', 404)
        }
        if (observation === '') {
            observation = order.observation
        }
        if (observation !== '') {
            observation = observation
        }
        if (order_date === '') {
            order_date = order.order_date
        }
        if (order_due_date === '') {
            order_due_date = order.order_due_date
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

// Solicitar renovar la orden del usuario
export const renewOrder = async (req, res, next) => {
    try {
        const { id } = req.params
        let { quantity, promotion_id, payment_method, product_id, observation } = req.body
        const file = req.file
        let quantity_number = parseInt(quantity)
        // Variables auxiliares para realizar calculos automaticos
        let discounted_amount = 0
        let total_discounted_amount = 0;
        let total_without_discount = 0;
        let discounted_quantity = 0;
        let proof_of_payment_image = ''

        // Buscar al usuario que realizo el pedido de la orden
        const user = await User.findById(req.user.id);
        // Verificar que el que crea la orden sea un usuario y no un repartidor u otro role
        if (user.role !== 'user') {
            return next(new ErrorResponse('Only customers can request orders', 400))
        }
        if (!user) {
            return next(new ErrorResponse('User not found', 404))
        }
        // Buscar la orden que desea renovar el usuario
        const order = await Order.findById(id)
        if (!order) {
            return next(new ErrorResponse('Order not found', 404))
        }
        // Buscar el producto que pidio el usuario en la orden
        const product = await Product.findById(product_id);
        if (!product) {
            return next(new ErrorResponse('Product not found', 404))
        }

        if (payment_method === 'Efectivo' && file) {
            await cloudinary.uploader.destroy(req.file.filename);
            return next(new ErrorResponse('You cannot send a receipt when the payment method is cash', 400))
        }
        else if (payment_method === 'Transferencia' && !file) {
            return next(new ErrorResponse('Comprobant is required', 400))
        }
        // Comprobamos si no se mando la imagen de comprobante de pago
        if (!file) {
            proof_of_payment_image = 'No disponible'
        }
        // Si se mando imagen se guarda en el array de comprobantes de pago el link a cloudinary
        else if (file) {
            proof_of_payment_image = file.path
        }

        // Verificar si observation es vacia para asignar un valor por default
        if (observation === "") {
            observation = 'No hay observaciones proporcionadas'
        }

        // Comprobamos si el usuario aplico a una promocion
        if (promotion_id !== "" && product.type === 'bidon') {
            const promotion = await Promotion.findById(promotion_id)
            if (!promotion) {
                return next(new ErrorResponse('Promotion not found', 404))
            }
            if (promotion.required_quantity > quantity_number) {
                throw new ErrorResponse('Promotion is not applicable', 400)
            }
            // Calculamos el monto sin la promocion
            total_without_discount = product.price * quantity_number
            // Calculamos el descuento
            discounted_amount = (total_without_discount * promotion.discounted_percentage) / 100;
            // Calculamos el monto con el descuento aplicado
            total_discounted_amount = total_without_discount - discounted_amount;

            // Descontar el balance del usuario
            if (user.balance > total_discounted_amount) {
                total_discounted_amount = 0
                discounted_quantity = user.balance + discounted_amount
                user.balance = user.balance - total_discounted_amount
                await user.save()
            }
            else if (user.balance > 0 && user.balance < total_without_discount) {
                total_discounted_amount = total_discounted_amount - user.balance
                discounted_quantity = user.balance + discounted_amount
                user.balance = 0
                await user.save()
            }

            // Validacion para saber si puede renovar la orden
            if (order.amount_paid >= order.total_amount && order.recharges_in_favor > 1) {
                const updatedOrder = await Order.findByIdAndUpdate(id, { user: user.id, product: product_id, quantity: parseInt(quantity), promotion: promotion_id, payment_method, proof_of_payment_image, amount_paid: 0, order_date: getCurrentISODate(), order_due_date: getDateNextMonthISO(), observation, status: 'pendiente', recharges_delivered: order.recharges_delivered, discounted_quantity, is_renewed: true, total_amount: total_discounted_amount }, { new: true })
                // Respondemos con la orden ya creada, con su promocion aplicada
                res.status(201).json({
                    success: true,
                    updatedOrder,
                });
            }
            else {
                return next(new ErrorResponse('You cannot request to renew the order.', 400))
            }


        }

        // Actualizar la orden a la base de datos, en caso de que no aplique a ninguna promocion y el producto sea bidon
        else if (promotion_id == "" && product.type === 'bidon') {
            // Calculamos el monto sin la promocion
            total_without_discount = (product.price * quantity_number)

            // Descontar el balance del usuario
            if (user.balance > total_without_discount) {
                total_without_discount = 0
                discounted_quantity = user.balance
                user.balance = user.balance - total_without_discount
                await user.save()
            }
            else if (user.balance > 0 && user.balance < total_without_discount) {
                total_without_discount = total_without_discount - user.balance
                discounted_quantity = user.balance
                user.balance = 0
                await user.save()
            }
            // Validacion para saber si puede renovar la orden
            if (order.amount_paid >= order.total_amount && order.recharges_in_favor > 0) {
                const updatedOrder = await Order.findByIdAndUpdate(id, { user: user.id, product: product_id, quantity: parseInt(quantity), promotion: promotion_id, payment_method, proof_of_payment_image, amount_paid: 0, order_date: getCurrentISODate(), order_due_date: getDateNextMonthISO(), observation, status: 'pendiente', recharges_delivered: order.recharges_delivered, discounted_quantity, is_renewed: true, total_amount: total_without_discount }, { new: true })
                // Respondemos con la orden ya creada, con su promocion aplicada
                res.status(201).json({
                    success: true,
                    updatedOrder,
                });
            }
            else {
                return next(new ErrorResponse('You cannot request to renew the order.', 400))
            }
        }
    }
    catch (error) {
        next(error);
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