const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
require('dotenv').config({ path: './src/.env' });

exports.showRegister = (req, res) => {
    res.render('register', { title: 'Register' });
};

exports.registerUser = async (req, res) => {
    const { usuario, clave, Nombre, roleId } = req.body;
    try {
        const existingUser = await User.findOne({ where: { usuario } });
        if (existingUser) {
            return res.status(400).render('register', { title: 'Register', error: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(clave, 10);
        await User.create({ usuario, clave: hashedPassword, Nombre, roleId });
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error); 
        res.status(400).render('register', { title: 'Register', error: 'Something went wrong. Please try again later.' });
    }
};

exports.showLogin = (req, res) => {
    res.render('login', { title: 'Login' });
};

exports.loginUser = async (req, res) => {
    const { usuario, clave } = req.body;
    try {
        const user = await User.findOne({ where: { usuario } });
        if (!user) {
            return res.status(400).render('login', { title: 'Login', error: 'Invalid credentials' });
        }
        const validPassword = await bcrypt.compare(clave, user.clave);
        if (!validPassword) {
            return res.status(400).render('login', { title: 'Login', error: 'Invalid credentials' });
        }
        const userRole = await Role.findByPk(user.roleId);
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true }); // Almacenar el token en una cookie
        res.status(200).redirect('/protected');
    }
    catch (error) {
        console.error('Error logging in user:', error);
        res.status(400).render('login', { title: 'Login', error: 'Something went wrong. Please try again later.' });
    }
};

exports.authenticate = (req, res, next) => {
    const token = req.cookies.token; // Obtener el token de las cookies
    if (!token) {
        return res.status(401).redirect('/login');
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).redirect('/login');
        }
        req.userId = decoded.userId;
        next();
    });
};

exports.protectedPage = (req, res) => {
    res.render('protected', { title: 'Protected Page', message: 'This is a protected route' });
};
