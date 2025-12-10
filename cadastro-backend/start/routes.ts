import router from '@adonisjs/core/services/router'

router.post('/users/registro', [() => import('#controllers/users_controller'), 'store'])
router.post('/users/confirmar_conta', [() => import('#controllers/users_controller'), 'account_confirmation'])