import express from 'express'
import { verifyJwt } from '../../middlewares/verifyJwt.js'
import { validateNotEmptyFields } from '../../middlewares/validateNotEmptyFields.js'
import { getDeliveries, getDeliveriesByLocation, getDeliveriesForC5, getDeliveriesForGeneral, newDelivery, updateDeliveryData } from './deliveryController.js'

const router = express.Router()

router.post('/new_delivery/:id', /* verifyJwt, */ newDelivery)
router.get('/all_deliveries', /* verifyJwt, */ getDeliveries)
router.get('/all_deliveries_location', getDeliveriesByLocation)
router.get('/all_deliveries_c5', getDeliveriesForC5)
router.get('/all_deliveries_general', getDeliveriesForGeneral)
router.put('/update_delivery_data/:id', validateNotEmptyFields(['order_id', 'recharges_delivered', 'returned_drums']), verifyJwt, updateDeliveryData)

export default router

