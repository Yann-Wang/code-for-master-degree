/**
 * Created by gospray on 16-12-21.
 */
const Err = require('../../config/error');
const UserSchema = require('../models/UserSchema');

/**
 * 登录接口
 *
 * 1、验证请求参数是否合法： 不合法－return
 * 2、根据userName查询当前用户: 查不到-retrun
 * 3、对比查询出来的用户密码与请求参数中的密码是否相等
 * 4、完成
 */
exports.handleLogin = function *(next) {
    const userName = this.request.body.userName;
    const password = this.request.body.password;
    if (!userName) {
        this.body = {
            success: false,
            error: Err.E1001
        };
        return false;
    }
    if (!password) {
        this.body = {
            success: false,
            error: Err.E1002
        };
        return false;
    }

    // default have no use mongo, if you want find the user from db,
    // open line 34 and comment lines 35 to 41
    let user = yield UserSchema.findByAccount(userName);
    /*let user = [{
     account: 'admin',
     nickname: 'admin_system',
     password: 'D033E22AE348AEB5660FC2140AEC35850C4DA997',
     remark: '',
     email: ''
     }]*/
    if (user.length > 0) {
        user = user[0];
        if (user.password === password.toUpperCase()) {
            // create session
            this.session.user = user;
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