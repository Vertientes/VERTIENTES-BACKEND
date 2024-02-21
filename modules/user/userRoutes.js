import express from 'express'
import { verifyJwt } from '../../middlewares/verifyJwt.js'
import { isAdmin } from '../../middlewares/isAdmin.js'
import { activateUser, changePassword, changeUserRoleWithPlan, deactivateUser, getAllUsers, getUsersActive, updateUserDataForSecretary, updateUserDataForSuperAdmin, userProfile } from './userController.js'
import { validateNotEmptyFields } from '../../middlewares/validateNotEmptyFields.js'
import { isSuperAdmin } from '../../middlewares/isSuperAdmin.js'

const router = express.Router()

router.get('/all_users', verifyJwt, isSuperAdmin, getAllUsers)

router.get('/all_users_active', verifyJwt, isSuperAdmin, getUsersActive)

router.get('/user_profile', verifyJwt, userProfile)

router.put('/change_user_with_plan/:id', verifyJwt, isSuperAdmin, changeUserRoleWithPlan)

router.put('/deactivate_user/:id', verifyJwt, isSuperAdmin, deactivateUser)

router.put('/activate_user/:id', verifyJwt, isSuperAdmin, activateUser)

router.put('/change_password/:id', verifyJwt, changePassword)

router.put('/update_user_data_for_secretary/:id', validateNotEmptyFields(['first_name', 'last_name', 'dni', 'mobile_phone', 'neighborhood', 'street', 'house_number', 'zone', 'location']), verifyJwt, isAdmin, updateUserDataForSecretary)

router.put('/update_user_data_for_super_admin/:id', validateNotEmptyFields(['first_name', 'last_name', 'dni', 'mobile_phone', 'neighborhood', 'street', 'house_number', 'zone', 'location', 'balance', 'company_drum']), verifyJwt, isSuperAdmin, updateUserDataForSuperAdmin)

export default router

