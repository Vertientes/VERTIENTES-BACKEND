import { ErrorResponse } from "../../utils/errorResponse.js"
import Order from '../orders/orderModel.js'
import Delivery from './deliveryModel.js'
import User from '../user/userModel.js'

export const newDelivery = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { delivery_date } = req.body;
        const order = await Order.findById(id);

        if (!order) {
            throw new ErrorResponse('Order not found', 404);
        }
        const user = await User.findById(order.user);

        // Si la orden esta completa o ya fue entregada no se puede aniadir a delivery
        if (order.status === 'completo' || (order.recharges_in_favor <= 0 && order.recharges_delivered > 0)) {
            throw new ErrorResponse('The order cant add to delivery', 400);
        }


        // Obtener las coordenadas del usuario
        const location = user.address.location;

        const newDelivery = new Delivery({
            order: order.id,
            delivery_date,
            delivery_zone: user.address.zone,
            delivery_location: location
        });

        const savedDelivery = await newDelivery.save();

        // Guardar el delivery en la orden
        order.deliveries.push(savedDelivery.id);
        await order.save();

        // Cambiar el estado de la orden
        order.status = 'en proceso';
        await order.save();


        res.status(201).json({
            success: true,
            savedDelivery
        });
    } catch (error) {
        next(error);
    }
};


export const getDeliveries = async (req, res, next) => {
    try {
        const deliveries = await Delivery.find().populate({
            path: 'order',
            populate: [
                { path: 'user' },
                { path: 'product' },
                { path: 'promotion' },
                { path: 'deliveries' },
                { path: 'request_recharges' }
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

export const getDeliveriesForC5 = async (req, res, next) => {
    try {
        const deliveries = await Delivery.find({ delivery_zone: 'c5' }).populate({
            path: 'order',
            populate: [
                { path: 'user' },
                { path: 'product' },
                { path: 'promotion' },
                { path: 'deliveries' },
                { path: 'request_recharges' }
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

export const getDeliveriesByLocation = async (req, res, next) => {
    try {
        // Convertir las coordenadas a números flotantes
        const initialLocation = {
            type: "Point",
            coordinates: [parseFloat(-26.140053102542083), parseFloat(-58.1586185445208)]
        };

        // Buscar los deliveries ordenados por ubicación más cercana
        const deliveries = await Delivery.aggregate([
            {
                $geoNear: {
                    near: initialLocation,
                    distanceField: "distance",
                    spherical: true,
                    query: { status: 'pendiente' }, // Puedes agregar condiciones adicionales aquí si es necesario
                    includeLocs: "delivery_location",
                    maxDistance: 500000, // Especifica la distancia máxima en metros
                    distanceMultiplier: 0.001 // Convertir la distancia a kilómetros
                }
            },
            { $sort: { distance: 1 } } // Ordenar por distancia ascendente
        ]);

        res.status(200).json({
            success: true,
            deliveries
        });
    } catch (error) {
        next(error);
    }
};

export const getDeliveriesForGeneral = async (req, res, next) => {
    try {
        const deliveries = await Delivery.find({ delivery_zone: 'general' }).populate({
            path: 'order',
            populate: [
                { path: 'user' },
                { path: 'product' },
                { path: 'promotion' },
                { path: 'deliveries' },
                { path: 'request_recharges' }
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
        const { id } = req.params;
        let { order_id, amount_paid, recharges_delivered, returned_drums } = req.body;
        const delivery = await Delivery.findById(id);
        const order = await Order.findById(order_id);
        const user = await User.findById(order.user);

        if (delivery.status === 'entregado') {
            throw new ErrorResponse('No se puede actualizar una entrega ya realizada', 400);
        }

        if (order.deliveries.length > 1 && recharges_delivered > 0) {
            // Manejar pago superior al monto total
            const extraPayment = amount_paid - order.total_amount;
            if (extraPayment > 0) {
                user.balance += extraPayment;
            }

            // Actualizar datos del delivery
            delivery.amount_paid = amount_paid;
            delivery.recharges_delivered = recharges_delivered;
            delivery.returned_drums = returned_drums;

            // Actualizar datos de la orden
            order.amount_paid += amount_paid;
            order.recharges_delivered += recharges_delivered;
            order.recharges_in_favor -= recharges_delivered;
            await order.save();

            // Actualizar datos del usuario
            user.company_drum += (recharges_delivered - returned_drums);
            await user.save();

            // Completar la orden si es necesario
            if (order.recharges_in_favor === 0 && order.amount_paid >= order.total_amount) {
                order.status = 'completo';
                await order.save();
            }
        } else if (recharges_delivered > 0) {
            // Actualizar datos del delivery
            delivery.amount_paid = amount_paid;
            delivery.recharges_delivered = recharges_delivered;
            delivery.returned_drums = returned_drums;

            // Actualizar datos de la orden
            order.amount_paid = amount_paid;
            order.recharges_delivered = recharges_delivered;
            order.recharges_in_favor -= recharges_delivered; // Asegurar que no sea nulo
            await order.save();

            // Actualizar datos del usuario
            user.company_drum = recharges_delivered;
            await user.save();

            // Completar la orden si es necesario
            if (order.recharges_in_favor === 0 && order.amount_paid >= order.total_amount) {
                order.status = 'completo';
                await order.save();
            }
        } else {
            throw new ErrorResponse('No se puede realizar una entrega sin recargas entregadas', 400);
        }

        // Marcar la entrega como completada
        delivery.status = 'entregado';
        await delivery.save();

        res.status(200).json({
            success: true,
            order,
            delivery
        });
    } catch (error) {
        next(error);
    }
};



//Controlador para el repartidor, por si necesita editar datos del cliente
export const updateAddressUserData = async (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
}
