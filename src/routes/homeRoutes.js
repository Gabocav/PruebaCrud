const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');

router.get('/', homeController.homePage);

router.get('/protected', userController.protectedPage);

router.post('/create-user', userController.createUser);

router.put('/update-user/:id', userController.updateUser);

router.delete('/delete-user/:id', userController.deleteUser);


module.exports = router;