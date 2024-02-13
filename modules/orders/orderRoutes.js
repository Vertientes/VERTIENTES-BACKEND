import express from 'express'
import { verifyJwt } from '../../middlewares/verifyJwt.js'
import { getMyOrders, getOrders, newOrder, renewOrder, updateOrderData } from './orderController.js'
import { isAdmin } from '../../middlewares/isAdmin.js'
import { validateNotEmptyFields } from '../../middlewares/validateNotEmptyFields.js'
import multer from 'multer'
import { storage } from '../../utils/multerStorage.js'
import { orderLimiter } from '../../middlewares/orderLimiter.js'
const upload = multer({ storage: storage })


const router = express.Router()

router.post('/new_order', upload.single('proof_of_payment_image'), validateNotEmptyFields(['product_id', 'payment_method', 'quantity']), verifyJwt,orderLimiter, newOrder)
router.put('/update_order_data/:id', validateNotEmptyFields(['amount_paid', 'recharges_in_favor', 'recharges_delivered',]),  /* verifyJwt, isAdmin, */ updateOrderData)
router.get('/all_orders', /* verifyJwt, */ /* isAdmin, */ getOrders)
router.get('/my_orders', verifyJwt, getMyOrders)
router.put('/renew_order/:id',upload.single('proof_of_payment_image'), validateNotEmptyFields(['product_id', 'payment_method', 'quantity']), verifyJwt, renewOrder )
export default router

