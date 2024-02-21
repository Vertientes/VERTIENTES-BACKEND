import express from 'express'
import { signIn, signUp, signUpDelivery } from './authController.js'
import { verifyJwt } from '../../middlewares/verifyJwt.js'
import { validateNotEmptyFields } from '../../middlewares/validateNotEmptyFields.js'
import { validateUserExists } from '../../middlewares/validateUserExists.js'
import { isSuperAdmin } from '../../middlewares/isSuperAdmin.js'

const router = express.Router()

router.post('/sign_up', validateNotEmptyFields(['first_name', 'last_name', 'dni', 'mobile_phone', 'password', 'address.*']), validateUserExists, signUp)

router.post('/sign_up_delivery', validateNotEmptyFields(['first_name', 'last_name', 'dni', 'mobile_phone', 'password', 'address.*']), validateUserExists, verifyJwt, isSuperAdmin, signUpDelivery)

router.post('/sign_in', validateNotEmptyFields(['dni', 'password']), signIn)


export default router

