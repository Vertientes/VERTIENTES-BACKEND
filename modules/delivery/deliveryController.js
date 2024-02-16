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
        if (order.status === 'completo' || (order.recharges_in_favor <= 0 && order.recharges_delivered > 0)) {
            throw new ErrorResponse('The order cant add to delivery', 400);
        }


        // Obtener las coordenadas del usuario y convertirlas a un array de números
        const locationString = user.address.location;
        const coordinates = locationString.split(',').map(coord => parseFloat(coord.trim()));
        console.log(coordinates)

        const newDelivery = new Delivery({
            order: order.id,
            delivery_date,
            delivery_zone: user.address.zone,
            delivery_location: {
                type: 'Point',
                coordinates: coordinates // Utiliza las coordenadas convertidas en un array de números
            }
        });

        const savedDelivery = await newDelivery.save();
        order.deliveries.push(savedDelivery.id);
        await order.save();
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
        const { id } = req.params
        const { order_id, amount_paid, recharges_delivered, returned_drums, debt } = req.body
        const delivery = await Delivery.findById(id)
        const order = await Order.findById(order_id)
        const user = await User.findById(order.user)
        if (order.amount_paid > 0) {
            if (user.balance < 0) {
                order.amount_paid = order.amount_paid + debt
                user.balance = user.balance + debt
                await order.save()
                await user.save()
            }
            order.amount_paid = order.amount_paid,
            order.recharges_delivered = order.recharges_delivered + recharges_delivered
            order.recharges_in_favor = order.recharges_in_favor - recharges_delivered
            await order.save()
            user.company_drum = user.company_drum + (recharges_delivered - returned_drums)
            delivery.status = 'entregado'
            await delivery.save()

            res.status(200).json({
                success: true,
                order,
                delivery
            })
        }
        if (amount_paid > order.total_amount) {
            order.amount_paid = amount_paid
            order.recharges_delivered = recharges_delivered
            order.extra_payment = amount_paid - order.total_amount
            order.recharges_in_favor = order.quantity - recharges_delivered
            await order.save()
            user.company_drum = recharges_delivered
            user.balance = user.balance + order.extra_payment
            await user.save()
        }
        else {
            order.amount_paid = amount_paid
            order.recharges_delivered = recharges_delivered
            order.extra_payment = 0
            order.recharges_in_favor = order.quantity - recharges_delivered
            await order.save()
            user.company_drum = recharges_delivered
            user.balance = user.balance + amount_paid - order.total_amount
            await user.save()
        }




        delivery.status = 'entregado'
        await delivery.save()

        res.status(200).json({
            success: true,
            order,
            delivery
        })
    } catch (error) {
        next(error)
    }
}


