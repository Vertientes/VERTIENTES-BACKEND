import Order from '../models/orderModel.js'
import { getDateTomorrowISO, getCurrentISODate } from '../utils/dateUtils.js';


async function countOrdersForDay(date) {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    console.log(startOfDay, endOfDay, 'aqui')
    const count = await Order.countDocuments({ order_date: { $gte: startOfDay, $lte: endOfDay } });
    return count;
}
export const orderLimiter = async (req, res, next) => {
    try {
        let currentDateISO = getCurrentISODate();
        let numberOfOrders = await countOrdersForDay(currentDateISO);

        while (numberOfOrders >= 2) {
            currentDateISO = getDateTomorrowISO(1);
            numberOfOrders = await countOrdersForDay(currentDateISO);
            if(numberOfOrders > 2) {
                currentDateISO = getDateTomorrowISO(2)
                numberOfOrders = await countOrdersForDay(currentDateISO)
            }
        }

        req.body.order_date = new Date(currentDateISO);
        next();
    } catch (error) {
        next(error);
    }
}