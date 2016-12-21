/**
 * Created by gospray on 16-12-20.
 */
'use strict';
let co = require('co');
const router = require('koa-router')();
const Err = require('../config/error');


/**
 * test redis
 * access: /app/user/test_redis
 */
router.get('/test_redis', function *(next) {
    /*co(function* () {
        let data;
        yield redis.set('test', 33);
        //console.log(); // logs 33
        data = yield redis.get('test');

        return data;
    });*/
    //don't need co, because middleware is just executed in co

    let data;
    yield redis.set('test', 33);
    data = yield redis.get('test');

    this.body = {data: data};

});

module.exports = router;