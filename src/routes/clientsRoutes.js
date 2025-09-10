const express = require('express');
const router = express.Router();
const {
    paginaCrearPerfil,
    paginaIniciarSesion,
    crearPerfil,
    buscarPerfil,
    editarPerfil,
    eliminarPerfil,
    iniciarSesion,
    cerrarSesion,
    enviarSesion,
} = require('../controllers/clientsControllers');

const { roleAuthenticator } = require('../middlewares/roleAuthenticator');
const { jwtAuthenticator } = require('../middlewares/jwtAuthenticator');

router.get('/profile/register', jwtAuthenticator(false), paginaCrearPerfil);
router.post('/profile/register', jwtAuthenticator(false), crearPerfil);
router.get('/profile/get', jwtAuthenticator(true), buscarPerfil);
router.put('/profile/edit', jwtAuthenticator(true), roleAuthenticator('client'), editarPerfil);
router.delete('/profile/delete', jwtAuthenticator(true), roleAuthenticator('client'), eliminarPerfil);

router.get('/session/login', jwtAuthenticator(false), paginaIniciarSesion); /* programar: paginaIniciarSesion */
router.post('/session/login', jwtAuthenticator(false), iniciarSesion, enviarSesion);
router.get('/session/logout', jwtAuthenticator(true), cerrarSesion);

module.exports = router;