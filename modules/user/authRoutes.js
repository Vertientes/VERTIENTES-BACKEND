import express from 'express'
import { logOut, signIn, signUp, userProfile } from './authController.js'
import { verifyJwt } from '../../middlewares/verifyJwt.js'
import { validateNotEmptyFields } from '../../middlewares/validateNotEmptyFields.js'
import { validateUserExists } from '../../middlewares/validateUserExists.js'

const router = express.Router()

//api/signup
router.post('/signup', validateNotEmptyFields(['firstName', 'lastName', 'dni', 'mobile_phone', 'password', 'address.*']), validateUserExists, signUp)
//api/signin
router.post('/signin', validateNotEmptyFields(['dni', 'password']), signIn)
//api/logout
router.post('/logout', logOut)

router.get('/profile', verifyJwt, userProfile)

export default router

