const {
    validarData,
    guardarPerfil,
    validarPerfil,
    generarJWT
} = require('../models/clientsModels');

const paginaCrearPerfil = (req, res) => {
    const activeSession = verificarSesion(req, res).status;
    const scriptPages = [
        {
            src: '/js/header.js',
            integrity: '',
            crossorigin: ''
        },
        {
            src: '/js/form.js',
            integrity: '',
            crossorigin: ''
        }
    ]
        const navbarItems = [
            {
                name: 'Ya tengo una cuenta',
                id: 'login',
                class: '',
                span: false,
                itemActiveSession: true,
                itemInactiveSession: true,
            }
        ]
    res.render('createProfile', {stylesPage: 'createProfile', scriptPages, title: 'Barté - Crear Cuenta', activeSession, navbarItems});
}
const paginaIniciarSesion = (req, res) => {
    const activeSession = verificarSesion(req, res).status;
    const scriptPages = [
        {
            src: '/js/header.js',
            integrity: '',
            crossorigin: ''
        },
        {
            src: '/js/form.js',
            integrity: '',
            crossorigin: ''
        }
    ]
        const navbarItems = [
            {
                name: 'Creá tu cuenta',
                id: 'createProfile',
                class: '',
                span: false,
                itemActiveSession: true,
                itemInactiveSession: true,
            }
        ]
    res.render('initSession', {stylesPage: 'initSession', scriptPages, title: 'Barté - Iniciar Sesión', activeSession, navbarItems});
}
const crearPerfil = async (req, res) => {
    var {
        userName,
        userEmail,
        userPass,
        userPassConfirm
    } = req.body;
    var userRolType = 'client';
    let resultado = await validarData(userName, userEmail, userPass, userPassConfirm);

    if (resultado.success) {
        resultado = await guardarPerfil(userName, userEmail, userPass, userRolType);
        if(resultado.success) {
            const token = await generarJWT(userEmail);
            req.session.user = {
                userName,
                userEmail,
                userRolType,
                token
            };
            res.set({ 'token': token });
            enviarSesion();
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
            message: resultado.error
        });
    }
};
const iniciarSesion = async (req, res, next) => {
    var {
        userEmail,
        userPass
    } = req.body;
    const resultado = await validarPerfil(userEmail, userPass);

    if (resultado.success){
        const token = await generarJWT(userEmail);
        req.session.user = {
            userName: resultado.userName,
            userEmail: resultado.userEmail,
            userRolType: resultado.userRolType,
            token: token
        }
        res.set({ 'token': token });
        next();
    } else if(resultado.error_db !== undefined) {
        res.status(400).send({
            message: resultado.error_db
        });
    } else {
        res.status(500).send({
            message: resultado.error
        });
    }
};
const enviarSesion = async (req, res) => {
    if(req.session.user) {
        if (req.session.user.userRolType == 'admin') {
            /* enviar pagina admin */
        } else if (req.session.user.userRolType == 'client'){
            res.redirect('/');
        } else {
            res.status(400).send({
                message: 'Error al iniciar sesión'
            });
        }
    } else {
        res.redirect('/session/login');
    }
};
const verificarSesion = (req, res) => {
    if (req.session.user) {
        const token = req.session.user.token;
        if (token === undefined || token === null) {
            return { message: 'Sesión inactiva', status: false };
        } else {
            return{ message: 'Sesión activa', status: true };
        }
    } else {
        return{ message: 'Sesión no iniciada', status: false };
    }
}
const cerrarSesion = async (req, res) => {
    req.session.destroy();
    res.removeHeader('token');
    res.redirect('/');
};
const editarPerfil = async (req, res) => {
};
const eliminarPerfil = async (req, res) => {
};
const buscarPerfil = async (req, res) => {
};
const buscarCarrito = async (req, res) => {
};
const buscarFavoritos = async (req, res) => {
};

module.exports = {
    paginaCrearPerfil,
    paginaIniciarSesion,
    crearPerfil,
    verificarSesion,
    iniciarSesion,
    enviarSesion,
    cerrarSesion,
    editarPerfil,
    eliminarPerfil,
    buscarPerfil,
    buscarCarrito,
    buscarFavoritos
};