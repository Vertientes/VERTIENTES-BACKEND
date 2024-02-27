import express from 'express'
import { verifyJwt } from '../../middlewares/verifyJwt.js'
import { getAllOrdersCompleted, getAllOrdersInProcess, getAllOrdersPending, getUserOrdersCompleted, getUserOrdersInProcess, getUserOrdersPending, newOrder, renewOrder, updateOrderData } from './orderController.js'
import { validateNotEmptyFields } from '../../middlewares/validateNotEmptyFields.js'
import multer from 'multer'
import { storage } from '../../utils/multerStorage.js'
import { isAdminOrSuperAdmin } from '../../middlewares/isAdminOrSuperAdmin.js'
const upload = multer({ storage: storage })


const router = express.Router()

router.post('/new_order', upload.single('proof_of_payment_image'), validateNotEmptyFields(['quantity', 'payment_method', 'product_id']), verifyJwt, newOrder)

router.get('/all_pending_user_orders', verifyJwt, getUserOrdersPending)

router.get('/all_in_process_user_orders', verifyJwt, getUserOrdersInProcess)

router.get('/all_completed_user_orders', verifyJwt, getUserOrdersCompleted)

router.get('/all_pending_orders', verifyJwt, isAdminOrSuperAdmin, getAllOrdersPending)

router.get('/all_in_process_orders', verifyJwt, isAdminOrSuperAdmin, getAllOrdersInProcess)

router.get('/all_completed_orders', verifyJwt, isAdminOrSuperAdmin, getAllOrdersCompleted)

router.put('/update_order_data_for_admin/:id', validateNotEmptyFields(['amount_paid', 'recharges_in_favor', 'recharges_delivered',]), verifyJwt, isAdminOrSuperAdmin, updateOrderData)

router.put('/renew_order/:id', upload.single('proof_of_payment_image'), validateNotEmptyFields(['quantity', 'product_id', 'payment_method', 'product_id']), verifyJwt, renewOrder)

export default router

