import express from 'express'
import { verifyJwt } from '../middlewares/verifyJwt.js'
import { getOrders, newOrder } from '../controllers/orderController.js'
import { isAdmin } from '../middlewares/isAdmin.js'
import { validateNotEmptyFields } from '../middlewares/validateNotEmptyFields.js'
import { validateArrayNotEmpty } from '../middlewares/validateArrayNotEmpty.js'


const router = express.Router()

router.post('/new_order', validateArrayNotEmpty('product_id'), validateNotEmptyFields(['product_id', 'payment_method', 'quantity']), verifyJwt, newOrder)
router.get('/all_orders', verifyJwt, isAdmin, getOrders)

export default router

