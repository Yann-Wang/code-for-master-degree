/**
 * Created by gospray on 16-12-20.
 */
'use strict';
let config = require('../../config/main');
let debug = require('debug')('app:conn');
require('colors');

module.exports = function (mongoose) {
    // mongoose初始化配置
    let db = mongoose.connection;

// 根据环境连接不同数据库
    switch(config.site.type){
        case 'development':
            mongoose.Promise = global.Promise;
            mongoose.connect(config.mongo.development.url, config.mongo.opts);
            db.on('error', console.error.bind(console, '数据库连接错误:'));
            db.once('open', function() {
                // we're connected!
                //console.log("mongodb connected!");
                debug('mongo数据库连接成功'.green);
            });

            break;
        case 'production':
            mongoose.Promise = global.Promise;
            mongoose.connect(config.mongo.production.url, config.mongo.opts);
            break;
        default:
            throw new Error(config.site.type + '是不被连接数据库的执行环境');
    }
};
