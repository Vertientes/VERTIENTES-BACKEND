import express from 'express'
import { verifyJwt } from '../../middlewares/verifyJwt.js'
import multer from 'multer'
import { storage } from '../../utils/multerStorage.js'
import { validateNotEmptyFields } from '../../middlewares/validateNotEmptyFields.js'
import { getDeliveries, getDeliveriesForC5, getDeliveriesForGeneral, newDelivery, updateDeliveryData } from './deliveryController.js'

const upload = multer({ storage: storage })
const router = express.Router()

router.post('/new_delivery/:id', /* verifyJwt, */ newDelivery)
router.get('/all_deliveries', /* verifyJwt, */ getDeliveries)
router.get('/all_deliveries_c5', getDeliveriesForC5)
router.get('/all_deliveries_general', getDeliveriesForGeneral)
router.put('/update_delivery_data/:id',  upload.single('house-image'), validateNotEmptyFields(['order_id', 'amount_paid', 'recharges_delivered', 'recharges_in_favor']), verifyJwt, updateDeliveryData)

export default router

