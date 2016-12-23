/**
 * Created by gospray on 16-12-22.
 */
'use strict';
const router   = require('koa-router')();
const accountInfo  = require('../controller/accountInfo');

router.post('/info',accountInfo.handleAccountInfo);


module.exports = router;