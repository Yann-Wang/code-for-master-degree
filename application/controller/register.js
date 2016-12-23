/**
 * Created by gospray on 16-12-21.
 */
const md5Hex = require('md5-hex');
const Err = require('../../config/error');
const tokenSchema = require('../models/tokenSchema');
const userSchema = require('../models/userSchema');
let debug = require('debug')('app:register');

/**
 * 注册用户
 */
exports.handleRegister = function *(next) {
    let account = this.request.body.account;
    let pwd = this.request.body.pwd;
    let token = this.request.body.token;

    // 如果token验证码与数据库中存储的token相匹配，那么将pwd存储到user数据库表中

    try{
        let result = yield tokenSchema.findOne({account:account});
        debug(result);
        debug(result.token);
        if(result.token === token){
            let user = {
                phone: account
            };

            user.salt = new Date() + user.phone;
            //md5加盐加密, 输出16进制表示形式
            user.hashed_password = md5Hex([pwd, user.salt]);

            //可能会因为手机号不唯一而导致插入错误，因为 数据库表中有unique索引
            user = yield userSchema.create(user);
            debug(user);

            this.session.uid = user.uid;

            this.body = {
                success: true
            };
            //页面跳转交给前端， 服务端只负责提供接口服务
            //this.redirect("/app/account/info");
        }else{
            this.body = {
                success: false,
                error: Err.E1006
            };
        }
    }catch(e){
        this.body = {
            success: false,
            error: Err.E3003
        };
    }

};