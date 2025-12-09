import router from '@adonisjs/core/services/router'

router.post('/users/registro', [() => import('#controllers/users_controller'), 'store'])