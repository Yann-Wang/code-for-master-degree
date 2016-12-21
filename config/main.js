'use strict';
module.exports = {
    // 站点设置
    site: {
        type: process.env.EVN_TYPE || 'development',
        port: process.env.PORT || 8000
    },
    // 数据库设置
    mongo: {
        development:{
            url: 'mongodb://192.168.68.130:27017/activity'
        },
        production:{
            url: 'mongodb://192.168.68.130:27017/activity'
        },
        opts: {
            server: {
                socketOptions: {
                    keepAlive: 1
                }
            }
        }
    },
    redis:{
        host:'127.0.0.1',
        port: 6379,
        db: 0
    }
};
