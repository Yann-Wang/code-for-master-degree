'use strict';

module.exports = {
    E9999: {
        code: 9999,
        text: '未知异常'
    },

    // 1* 为用户报错信息
    E1001: {
        code: 1001,
        text: '用户名不能为空'
    },
    E1002: {
        code: 1002,
        text: '密码不能为空'
    },
    E1003: {
        code: 1003,
        text: '请先登录'
    },
    E1004: {
        code: 1004,
        text: '用户名已存在'
    },
    E1005: {
        code: 1005,
        text: '用户名／密码错误'
    },
    E1006: {
        code: 1006,
        text: '验证码输入错误'
    },

    // 2* 为权限报错信息
    E2001: {
        code: 2001,
        text: '权限不足'
    },

    // 数据库写入错误
    E3001:{
        code:3001,
        text:'验证码写入失败'
    },
    E3002:{
        code:3002,
        text:'账户信息写入失败'
    },
    E3003: {
        code:3003,
        text:'账户密码写入失败'
    },
    E3004: {
        code:3004,
        text:'账户授权写入失败'
    }

};
