'use strict';
const router   = require('koa-router')();

const check  = require('../controller/check');
const login    = require('../controller/login');
const logout   = require('../controller/logout');
const register = require('../controller/register');
const pwd      = require('../controller/pwd');
const auth     = require('../controller/auth');
const captcha = require('../controller/captcha');

router.post('/check',check.check_account);
router.post('/login', login.handleLogin);
router.post('/logout', logout.handleLogout);
router.post('/register', register.handleRegister);
router.put('/pwd',pwd.handlePwd);
router.post('/auth',auth.handleAuth);
router.get('/code', captcha.get_PicCaptcha);
router.post('/token', captcha.genCaptcha);


module.exports = router;
