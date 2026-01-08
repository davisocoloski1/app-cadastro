import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import UsersController from '#controllers/users_controller'
// import ClientesController from '#controllers/clientes_controller'
// import ValidationsController from '#controllers/validations_controller'
import ClientesController from '#controllers/clientes_controller'
import EmailsController from '#controllers/emails_controller'
import TelefonesController from '#controllers/telefones_controller'
import EnderecosController from '#controllers/enderecos_controller'
import ValidationsController from '#controllers/validations_controller'

router.post('/users/registro', [() => import('#controllers/users_controller'), 'store'])
router.post('/users/confirmar_conta', [() => import('#controllers/users_controller'), 'account_confirmation'])
router.post('/users/novo_codigo', [() => import('#controllers/users_controller'), 'resendConfirmationCode'])
router.post('/users/login', [() => import('#controllers/users_controller'), 'login'])
router.delete('/users/logout', [UsersController, 'logout'])

router.group(() => {
    router.get('/users/info', [() => import('#controllers/users_controller'), 'getUserInfo']),
    router.put('/users/update', [UsersController, 'update']),
    router.put('/users/updatePassword', [UsersController, 'updatePassword'])
    router.put('/users/deleteUser', [UsersController, 'destroy'])
    router.get('/users/getUsers', [UsersController, 'index'])
    router.get('users/getUserById', [UsersController, 'getUserById'])
    router.post('/users/confirm-email-update', [UsersController, 'confirmEmailUpdate'])
    router.post('/users/searchUser', [UsersController, 'searchUser'])
}).use(middleware.auth())

router.group(() => {
    router.post('/enviarEmailRecuperacao', [UsersController, 'enviarRecuperacao'])
    router.post('/validarToken', [UsersController, 'validarToken'])
    router.post('/recuperar-senha', [UsersController, 'recuperarSenha'])
}).prefix('/recuperar-senha')

router.post('/admin/registrarUsuario', [UsersController, 'adminStore']).use(middleware.auth())

// Controle e rotas de clientes (email, telefone e endereço incluídos)

router.group(() => {
    router.post('/registrarCliente', [ClientesController, 'store'])
    router.post('/registrarEmail/:id', [EmailsController, 'store'])
    router.post('/registrarTelefone/:id', [TelefonesController, 'store'])
    router.post('/registrarEndereco/:id', [EnderecosController, 'store'])
}).prefix('/clientes/registro').use(middleware.auth())

router.group(() => {
    router.get('/listagemClientes', [ClientesController, 'index'])
    router.get('/pesquisarClientes', [ClientesController, 'searchCliente'])
    router.get('/listarInfoCliente/:id', [ClientesController, 'getById'])
}).prefix('/clientes/listagem').use(middleware.auth())

// Rotas de validação 
router.group(() => {
    router.post('/validarCpf', [ValidationsController, 'validarCpf'])
    router.post('/validarCnpj', [ValidationsController, 'validarCpnj'])
}).prefix('/validations')