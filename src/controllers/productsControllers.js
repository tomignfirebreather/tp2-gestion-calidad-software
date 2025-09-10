const {
    buscarData,
    guardarData,
    actualizarData,
    eliminarData
} = require('../models/productsModels');
const { verificarSesion } = require('./clientsControllers');

const paginaProductos = async (req, res) => {
    const response = await buscarTotalProductos();
    if(response.message === 'Se han encontrado productos') {
        products = response.data;
        req.session.products = products;
        const activeSession = verificarSesion(req, res).status;
        const scriptPages = [
            {
                src: '/js/header.js',
                integrity: '',
                crossorigin: ''
            },
            {
                src: '/js/products.js',
                integrity: '',
                crossorigin: ''
            }
        ]
        const navbarItems = [
            {
                name: 'Inicio',
                id: 'init',
                class: '',
                span: false,
                itemActiveSession: true,
                itemInactiveSession: true,
            },
            {
                name: 'Creá tu cuenta',
                id: 'createProfile',
                class: '',
                span: false,
                itemActiveSession: false,
                itemInactiveSession: true
            },
            {
                name: 'Ingresá',
                id: 'login',
                class: '',
                span: false,
                itemActiveSession: false,
                itemInactiveSession: true
            },
            {
                name: 'Cerrar sesión',
                id: 'logout',
                class: '',
                span: false,
                itemActiveSession: true,
                itemInactiveSession: false
            },
            {
                name: 'shopping_cart',
                id: '',
                class: 'material-symbols-outlined',
                span: true,
                itemActiveSession: true,
                itemInactiveSession: true
            },
        ]
        res.render('products', {stylesPage: 'products', scriptPages, title: 'Barté - Productos', activeSession, navbarItems, products});
    } else {
        res.json({
            message: response.message
        });
    }
};

const paginaInfoProducto = async (req, res) => {
    const product = req.session.product;
    console.log(product);
    const activeSession = verificarSesion(req, res).status;
    const scriptPages = [
        {
            src: '/js/header.js',
            integrity: '',
            crossorigin: ''
        },
        {
            src: '/js/infoProduct.js',
            integrity: '',
            crossorigin: ''
        },
        {
            src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
            integrity: 'sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL',
            crossorigin: 'anonymous'
        }
    ]
    const navbarItems = [
        {
            name: 'Inicio',
            id: 'init',
            class: '',
            span: false,
            itemActiveSession: true,
            itemInactiveSession: true,
        },
        {
            name: 'Productos',
            id: 'products',
            class: '',
            span: false,
            itemActiveSession: true,
            itemInactiveSession: true,
        },
        {
            name: 'Creá tu cuenta',
            id: 'createProfile',
            class: '',
            span: false,
            itemActiveSession: false,
            itemInactiveSession: true
        },
        {
            name: 'Ingresá',
            id: 'login',
            class: '',
            span: false,
            itemActiveSession: false,
            itemInactiveSession: true
        },
        {
            name: 'Cerrar sesión',
            id: 'logout',
            class: '',
            span: false,
            itemActiveSession: true,
            itemInactiveSession: false
        },
        {
            name: 'shopping_cart',
            id: '',
            class: 'material-symbols-outlined',
            span: true,
            itemActiveSession: true,
            itemInactiveSession: true
        },
    ]
    res.render('infoProduct', {stylesPage: 'infoProduct', scriptPages, title: 'Barté - Info Producto', activeSession, navbarItems, product});
};

const infoProducto = async (req, res) => {
    const productId = req.headers.id;
    const product = req.session.products.find(product => product._id === productId);
    req.session.product = product;
    res.send();
};

const insertarProductos = async (req, res) => {
    var {
        productName,
        productDescription,
        productPrice,
        productStock,
        productImage
    } = req.body;
    var data = {
        productName
    };
    let resultado = await buscarData(data);
    if (resultado.success == 'nodata') {
        data = {
            productName,
            productDescription,
            productPrice,
            productStock,
            productImage
        };
        resultado = await guardarData(data);
        if(resultado.success) {
            res.status(300).json({
                message: 'Producto insertado correctamente en la base de datos'
            });
        } else {
            res.status(400).send({
                message: resultado.error_db
            });
        }
    } else if(resultado.error_db !== undefined) {
        res.status(400).send({
            message: resultado.error_db
        });
    } else {
        res.status(500).send({
            message: 'El producto ya existe en la base de datos'
        });
    }
};

const buscarProductos = async (req, res) => {
    if (req.query.buscarTodo) {
        const resultado = await buscarData('buscarTodo');
        if (resultado.success == 'sidata') {
            res.status(300).json({
                message: 'Se han encontrado productos',
                data: resultado.producto
            });
        } else if(resultado.error !== undefined) {
            res.status(400).send({
                message: resultado.error
            });
        } else if(resultado.error_db !== undefined) {
            res.status(400).send({
                message: resultado.error_db
            });
        } else {
            res.status(500).send({
                message: 'No se han encontrado coincidencias'
            });
        }
    } else {
        //Ver si los nombres de las var coinciden con el nombre de las query
        var {
            productID,
            productName
        } = req.query.productSearch;
        var data1 = { productName };
        var data2 = { productID };
        const resultado1 = await buscarData(data1);
        const resultado2 = await buscarData(data2);
        if(resultado1.success == 'sidata') {
            res.status(300).json({
                message: 'Se han encontrado productos',
                data: resultado1.producto
            });
        } else if(resultado2.success == 'sidata') {
            res.status(300).json({
                message: 'Se han encontrado productos',
                data: resultado2.producto
            });
        } else if(resultado1.error !== undefined) {
            res.status(400).send({
                message: resultado1.error
            });
        } else if(resultado2.error !== undefined) {
            res.status(400).send({
                message: resultado2.error
            });
        } else if(resultado1.error_db !== undefined) {
            res.status(400).send({
                message: resultado1.error_db
            });
        } else if(resultado2.error_db !== undefined) {
            res.status(400).send({
                message: resultado2.error_db
            });
        } else {
            res.status(500).send({
                message: 'No se han encontrado coincidencias'
            });
        }
    }
}

const buscarTotalProductos = async (req, res) => {
    const resultado = await buscarData('buscarTodo');
    if (resultado.success == 'sidata') {
        return({
            message: 'Se han encontrado productos',
            data: resultado.producto
        });
    } else if(resultado.error !== undefined) {
        return({
            message: resultado.error
        });
    } else if(resultado.error_db !== undefined) {
        return({
            message: resultado.error_db
        });
    } else {
        return({
            message: 'No se han encontrado coincidencias'
        });
    }
};

const actualizarProductos = async (req, res) => {
    var {
        productID,
        productName,
        productDescription,
        productPrice,
        productStock,
        productImage
    } = req.body;
    var data = {
        productID,
    };
    let resultado = await buscarData(data);
    if (resultado.success == 'sidata') {
        data = {
            productID,
            productName,
            productDescription,
            productPrice,
            productStock,
            productImage
        };
        resultado = await actualizarData(data);
        if(resultado.success) {
            res.status(300).json({
                message: 'Producto actualizado correctamente',
            });
        } else {
            res.status(400).send({
                message: resultado.error_db
            });
        }
    } else if(resultado.error_db !== undefined) {
        res.status(400).send({
            message: resultado.error_db
        });
    } else {
        res.status(500).send({
            message: 'No se encontró el producto que quiere actualizar'
        });
    }
};
const eliminarProductos = async (req, res) => {
    var productID = req.body.productID;
    var data = {
        productID,
    };
    let resultado = await buscarData(data);
    if (resultado.success == 'sidata') {
        resultado = await eliminarData(data);
        if(resultado.success) {
            res.status(300).send({
                message: 'Producto eliminado correctamente',
            });
        } else {
            res.status(400).send({
                message: resultado.error_db
            });
        }
    } else if(resultado.error_db !== undefined) {
        res.status(400).send({
            message: resultado.error_db
        });
    } else {
        res.status(500).send({
            message: 'No se encontró ningún producto con el _id proporcionado'
        });
    }
};

module.exports = {
    paginaProductos,
    paginaInfoProducto,
    infoProducto,
    insertarProductos,
    buscarProductos,
    buscarTotalProductos,
    actualizarProductos,
    eliminarProductos
};