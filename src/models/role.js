const { sequelize, DataTypes } = require('../config/db');

const Role = sequelize.define('roles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Descripcion: {
        type: DataTypes.STRING
    }
});

// Crear un rol por defecto
Role.findOrCreate({
    where: { Descripcion: 'RolPorDefecto' },
}).then(([role, created]) => {
    console.log(created ? 'Rol por defecto creado' : 'Rol por defecto ya existía');
}).catch(err => {
    console.error('Error al crear el rol por defecto:', err);
});


module.exports = Role;
