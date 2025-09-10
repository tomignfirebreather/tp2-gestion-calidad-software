const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const { engine } = require('express-handlebars');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const clientsRoutes = require('./routes/clientsRoutes');
const productsRoutes = require('./routes/productsRoutes');
const { verificarSesion } = require('./controllers/clientsControllers');

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use('/clients', clientsRoutes);
app.use('/products', productsRoutes);

app.engine('hbs', engine({
    defaultLayout: 'main',
    extname: 'hbs',
    layoutsDir: path.join(__dirname, '../views/layouts'),
    partialsDir: path.join(__dirname, '../views/partials'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));

app.get('/', (req, res) => {
    const { status: activeSession, message } = verificarSesion(req, res);
    console.log("Estado de sesión:", message);
    const scriptPages = [
        {
            src: '/js/header.js',
            integrity: '',
            crossorigin: ''
        },
        {
            src: '/js/home.js',
            integrity: '',
            crossorigin: ''
        }
    ]
    const navbarItems = [
        {
            name: 'Productos',
            id: 'products',
            class: '',
            span: false,
            itemActiveSession: true,
            itemInactiveSession: true
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
    res.render('home', {stylesPage: 'home', scriptPages, title: 'Barté', activeSession, navbarItems});
});

module.exports = app;