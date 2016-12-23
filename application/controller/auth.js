/**
 * Created by gospray on 16-12-22.
 */

const Err = require('../../config/error');
const userSchema = require('../models/userSchema');
let debug = require('debug')('app:auth');

/**
 * 授权必须在登录的状态下才可进行
 *
 * @param next
 */
exports.handleAuth = function *(next) {
    //如果账户没有登录，那么对app/user/auth的访问，将不能通过session_filter中间件
    let phone = this.request.body.phone;

    try{
        let result = yield userSchema.findOne({phone:phone});
        let roles = result.roles;

        roles.push('auth');
        yield userSchema.update({phone:phone},{roles:roles});

        this.body = {
            success: true
        };
    }catch(e){
        debug("账户授权写入数据库失败！");
        this.body = {
            success: false,
            error: Err.E3004
        };
    }

};
