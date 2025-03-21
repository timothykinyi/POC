const express = require('express');
const { registerUser, login, verifyUser, updateEmail, resendVerificationCode, newrecoverPassword, resetPassword, changepassword, logout} = require('../controllers/authController');
const router = express.Router();


router.post('/register', registerUser);
router.post('/login', login);
router.post('/verify', verifyUser)
router.post('/update-email', updateEmail);
router.post('/resendemail', resendVerificationCode);
router.post('/recoverpassword', newrecoverPassword);
router.post('/reset-password', resetPassword);
router.post('/changepassword', changepassword);
router.post('/logout', logout);

module.exports = router;
