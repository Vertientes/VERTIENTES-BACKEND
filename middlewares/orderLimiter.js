import Order from '../models/orderModel.js'
import { getNextBusinessDayISO, getCurrentISODate } from '../utils/dateUtils.js';


async function countOrdersForDay(date) {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999); // Ajuste en el límite superior del día
    console.log(startOfDay, endOfDay, 'aqui');
    const count = await Order.countDocuments({ order_date: { $gte: startOfDay, $lte: endOfDay } });
    return count;
}

export const orderLimiter = async (req, res, next) => {
    try {
        let currentDateISO = getCurrentISODate();
        let numberOfOrders = await countOrdersForDay(currentDateISO);
        let currentDate = new Date(currentDateISO)
        const dayOfWeek = currentDate.getDay()

        if(dayOfWeek === 6) {
            currentDateISO = currentDate.setDate(currentDate.getDate() + 2)
        }

        while (numberOfOrders >= 59) {
            currentDateISO = getNextBusinessDayISO(currentDateISO);
            numberOfOrders = await countOrdersForDay(currentDateISO);
            console.log(currentDateISO)
            console.log(numberOfOrders)
        }


        const orderDate = new Date(currentDateISO);
        const orderDueDate = new Date(orderDate.getFullYear(), orderDate.getMonth() + 1, orderDate.getDate(), orderDate.getHours(), orderDate.getMinutes());
        req.body.order_date = orderDate;
        req.body.order_due_date = orderDueDate;


        next();
    } catch (error) {
        next(error);
    }
}