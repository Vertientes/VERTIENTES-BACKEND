import express from 'express'
import { verifyJwt } from '../middlewares/verifyJwt.js'
import { getOrders, newOrder } from '../controllers/orderController.js'
import { isAdmin } from '../middlewares/isAdmin.js'

const router = express.Router()

router.post('/new_order', verifyJwt, newOrder)
router.post('/all_orders', verifyJwt, isAdmin, getOrders)

export default router

