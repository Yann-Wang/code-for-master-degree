/**
 * Created by gospray on 16-12-21.
 */
const Err = require('../../config/error');
const userSchema = require('../models/userSchema');
const md5Hex = require('md5-hex');
let debug = require('debug')('app:login');

/**
 * 登录接口
 * 在通过用户名和密码验证之后，将uid加入session中
 */
exports.handleLogin = function *(next) {
    const account = this.request.body.account;
    const pwd = this.request.body.pwd;
    if (!account) {
        this.body = {
            success: false,
            error: Err.E1001
        };
        return false;
    }
    if (!pwd) {
        this.body = {
            success: false,
            error: Err.E1002
        };
        return false;
    }


    let user = yield userSchema.find({phone: account});
    debug(user);

    if (user.length > 0) {
        user = user[0];

        let hashed_password = md5Hex([pwd,user.salt]);

        if (hashed_password === user.hashed_password) {
            // create session
            this.session.uid = user.uid;

            this.body = {
                success: true,
                data: user
            };
            return false;
        }
    }

    this.body = {
        success: false,
        error: Err.E1005
    }
};