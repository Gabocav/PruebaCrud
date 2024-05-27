const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const { sequelize } = require('./config/db');
const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: './src/.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar Handlebars
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: 'src/views/layouts',
    partialsDir: 'src/views/partials'
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', 'src/views');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(cookieParser());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'code.jquery.com', 'cdn.jsdelivr.net'],
        },
    })    
);

// Rutas
app.use('/', homeRoutes);
app.use('/', authRoutes);

// Sincronizar base de datos y arrancar el servidor
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(error => console.error('No se puede conectar a la base de datos:', error));