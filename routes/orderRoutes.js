import express from 'express'
import { verifyJwt } from '../middlewares/verifyJwt.js'
import { getMyOrders, getOrders, newOrder } from '../controllers/orderController.js'
import { isAdmin } from '../middlewares/isAdmin.js'
import { validateNotEmptyFields } from '../middlewares/validateNotEmptyFields.js'
import multer from 'multer'
import { storage } from '../utils/multerStorage.js'
const upload = multer({ storage: storage })


const router = express.Router()

router.post('/new_order', upload.single('proof_of_payment_image'), validateNotEmptyFields(['product_id', 'payment_method', 'quantity']), verifyJwt, newOrder)
router.put('/update_order_data/:id', validateNotEmptyFields(['amount_paid', 'recharges_in_favor', 'recharges_delivered',]), isAdmin, verifyJwt, newOrder)
router.get('/all_orders', verifyJwt, isAdmin, getOrders)
router.get('/my_orders', verifyJwt, getMyOrders)

export default router

