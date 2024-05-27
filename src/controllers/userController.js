const user = require('../models/user');
const axios = require('axios');

exports.protectedPage = async (req, res) => {
    try {
        const response = await axios.get('https://randomuser.me/api/?results=10&nat=ES');
        const usuarios = response.data.results.map(usuario => ({
            nombre: usuario.name.first + ' ' + usuario.name.last,
            genero: usuario.gender,
            telefono: usuario.phone,
            foto: usuario.picture.large,
            email: usuario.email,
            direccion: usuario.location.street.name + ', ' + usuario.location.street.number,
            pais: usuario.location.country,
            estado: usuario.location.state,
            ciudad: usuario.location.city
        }));
        res.render('protected', { 
            title: 'Home Page',
            usuarios
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
};

exports.createUser = async (req, res) => {
    const { usuario, clave, Nombre, roleId } = req.body;
    try {
        const existingUser = await User.findOne({ where: { usuario } });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(clave, 10);
        await User.create({ usuario, clave: hashedPassword, Nombre, roleId });
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { usuario, clave, Nombre, roleId } = req.body;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.update({ usuario, clave, Nombre, roleId });
        res.status(200).json({ message: 'User updated successfully' });
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error updating user' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.destroy();
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
};