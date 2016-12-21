'use strict';

const app = require('koa')();
const router = require('koa-router')();
const logger = require('koa-logger');
const json = require('koa-json');
const session = require('koa-session');
const mongoose=require('mongoose');
let debug = require('debug')('app:request');

const User = require('./application/routes/User');
const Config = require('./application/routes/Config');
const session_filter = require('./application/middleware/session_filter');
const authorization = require('./application/middleware/authorization');
const testCase = require('./test');

//连接redis数据库
require('./application/lib/conn');

//mongooose初始化配置
require('./application/lib/conn2')(mongoose);

// 请求分割线
app.use(function*(next) {
    debug('---------split line-------------->');
    yield next;
});

app.keys = ['some secret hurr'];
app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());
app.use(session(app));

// session filter
app.use(session_filter());

// authorization
app.use(authorization());

app.use(require('koa-static')(__dirname + '/static'));

// routes definition
router.prefix('/app');
router.use('/user', User.routes(), User.allowedMethods());
router.use('/config', Config.routes(), Config.allowedMethods());
router.use('/test', testCase.routes(), testCase.allowedMethods());

// mount root routes
app.use(router.routes());

app.on('error', (err, ctx) => {
    logger.error('server error', err, ctx);
});

module.exports = app;
