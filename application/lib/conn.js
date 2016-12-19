/**
 * Created by a_wav on 2016/12/19.
 */
'use strict';
let co = require('co');
let redisStore = require('koa-redis');
let _redis = require('redis');
let wrapper = require('co-redis');
let config = require('../../config/main');
var debug = require('debug')('app:conn');


//创建redis连接
let redisClient = _redis.createClient(config.redis.port, config.redis.host);
/*redisClient.auth(config.redis.pass, function () {
    debug('redis登录成功,host:%s'.green, config.redis.host);
});*/
redisClient.select(config.redis.db, function () {
    debug('redis数据库选择成功,db:%d'.green, config.redis.db);
});


//自动连接数据库和redis
co(function*() {
    global.redis = wrapper(redisClient);
}).catch(function (err) {
    debug('数据库连接失败 %s'.red, err);
})

//数据库连接
exports.start = function () {
    return function*(next) {
        debug('-------------------------------------------------------------------')
        yield next;
    }
}

//session连接句柄
exports.redisStore = function () {
    return redisStore({
        host: config.redis.host,
        port: config.redis.port,
        db: config.redis.db
    })
}