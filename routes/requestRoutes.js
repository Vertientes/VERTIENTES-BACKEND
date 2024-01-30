import express from 'express'
import { verifyJwt } from '../middlewares/verifyJwt.js'
import { validateNotEmptyFields } from '../middlewares/validateNotEmptyFields.js'
import { createRequest, deleteRequest, getRequests, updateRequest } from '../controllers/requestController.js'

const router = express.Router()

router.post('/new_request', validateNotEmptyFields(['requested_recharges']), verifyJwt, createRequest)
router.get('/all_requests', verifyJwt, getRequests)
router.put('/update_request/:id', validateNotEmptyFields(['requested_recharges']), verifyJwt, updateRequest)
router.delete('/delete_request/:id', verifyJwt, deleteRequest)

export default router

