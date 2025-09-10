const express = require('express');
const router = express.Router();
const {
    paginaProductos,
    paginaInfoProducto,
    infoProducto,
    insertarProductos,
    buscarProductos,
    buscarTotalProductos,
    actualizarProductos,
    eliminarProductos
} = require('../controllers/productsControllers');

const { roleAuthenticator } = require('../middlewares/roleAuthenticator');
const { jwtAuthenticator } = require('../middlewares/jwtAuthenticator');

router.get('/', jwtAuthenticator(false), paginaProductos);
router.get('/infoProduct', jwtAuthenticator(false), paginaInfoProducto);
router.post('/infoProduct', jwtAuthenticator(false), infoProducto);
router.post('/insert', jwtAuthenticator(true), roleAuthenticator('admin'), insertarProductos);
router.get('/get', jwtAuthenticator(false), buscarProductos);
router.get('/getAll', jwtAuthenticator(false), buscarTotalProductos);
router.put('/update', jwtAuthenticator(true), roleAuthenticator('admin'), actualizarProductos);
router.delete('/delete', jwtAuthenticator(true), roleAuthenticator('admin'), eliminarProductos);

module.exports = router;