import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import UsersController from '#controllers/users_controller'

router.post('/users/registro', [() => import('#controllers/users_controller'), 'store'])
router.post('/users/confirmar_conta', [() => import('#controllers/users_controller'), 'account_confirmation'])
router.post('/users/novo_codigo', [() => import('#controllers/users_controller'), 'resendConfirmationCode'])
router.post('/users/login', [() => import('#controllers/users_controller'), 'login'])

router.group(() => {
    router.get('/users/info', [() => import('#controllers/users_controller'), 'getUserInfo']),
    router.put('/users/update', [UsersController, 'update'])
}).use(middleware.auth())