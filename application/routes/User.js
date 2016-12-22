'use strict';
const router   = require('koa-router')();

const check  = require('../controller/check');
const login    = require('../controller/login');
const logout   = require('../controller/logout');
const register = require('../controller/register');
const captcha = require('../controller/captcha');

router.post('/check',check.check_account);
router.post('/login', login.handleLogin);
router.post('/logout', logout.handleLogout);
router.get('/register', register.handleRegister);
router.get('/code', captcha.get_PicCaptcha);
router.post('/token', captcha.genCaptcha);


module.exports = router;
