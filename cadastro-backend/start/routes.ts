import router from '@adonisjs/core/services/router'

router.post('/users/registro', [() => import('#controllers/users_controller'), 'store'])
router.post('/users/confirmar_conta', [() => import('#controllers/users_controller'), 'account_confirmation'])
router.post('/users/novo_codigo', [() => import('#controllers/users_controller'), 'resendConfirmationCode'])
router.post('/users/login', [() => import('#controllers/users_controller'), 'login'])