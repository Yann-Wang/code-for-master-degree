/**
 * Created by gospray on 16-12-19.
 */

'use strict';
let co = require('co');
let _redis = require('redis');
let wrapper = require('co-redis');
let config = require('../config/main');
var debug = require('debug')('app:conn');
require('colors');

//创建redis连接
let redisClient = _redis.createClient(config.redis.port, config.redis.host);



//自动连接数据库和redis
co(function*() {
    global.redis = wrapper(redisClient);
}).catch(function (err) {
    debug('数据库连接失败 %s'.red, err);
})


co(function* () {
    yield redis.set('test', 33);
    console.log(yield redis.get('test')); // logs 33
});
