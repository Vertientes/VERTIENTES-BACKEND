import express from 'express'
import { verifyJwt } from '../../middlewares/verifyJwt.js'
import { validateNotEmptyFields } from '../../middlewares/validateNotEmptyFields.js'
import { createRequestRecharge, deleteRequest,  getRequests,  getRequestsForOrder, updateRequest } from './requestController.js'

const router = express.Router()

router.get('/all_requests', verifyJwt, getRequests)
router.post('/new_request_recharge', validateNotEmptyFields(['requested_recharges']), verifyJwt, createRequestRecharge)
router.get('/get_requests_for_order', verifyJwt, getRequestsForOrder)
router.put('/update_request/:id', validateNotEmptyFields(['requested_recharges']), verifyJwt, updateRequest)
router.delete('/delete_request/:id', verifyJwt, deleteRequest)

export default router

