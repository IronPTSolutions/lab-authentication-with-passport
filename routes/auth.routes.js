const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const secure = require('../middlewares/secure.mid');

router.get('/login', secure.isLoged, authController.login);
router.post('/login', secure.isLoged, authController.doLogin);

router.get('/register', secure.isLoged, authController.register);
router.post('/register', secure.isLoged, authController.doRegister);

router.get('/logout', authController.logout);


module.exports = router;
