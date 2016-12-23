/**
 * Created by gospray on 16-12-23.
 */
const md5Hex = require('md5-hex');
const Err = require('../../config/error');
const userSchema = require('../models/userSchema');
const tokenSchema = require('../models/tokenSchema');
let debug = require('debug')('app:pwd');


/**
 * 修改密码
 */
exports.handlePwd = function *(next) {
    let pwd     = this.request.body.pwd;
    let new_pwd = this.request.body.new_pwd;
    let uid     = this.session.uid;

    //既然能到这里，说明 用户处于登录状态，所以不需要token验证
    try{
        let user = yield userSchema.find({uid: uid});
        debug(user[0].hashed_password);

        if (user.length > 0) {
            user = user[0];

            let hashed_password = md5Hex([pwd,user.salt]);

            if (hashed_password === user.hashed_password) {
                let hashed_new_pwd = md5Hex([new_pwd,user.salt]);

                user = yield userSchema.findOneAndUpdate({uid: uid},{hashed_password:hashed_new_pwd},{new: true});
                debug(user.hashed_password);

                this.body = {
                    success: true
                };
                return false;
            }
        }

        this.body = {
            success: false,
            error: Err.E1005
        }

    }catch(e){
        this.body = {
            success: false,
            error: Err.E3005
        }
    }

};

/**
 * 忘记密码
 */
exports.handleForget = function *(next) {
    let account = this.request.body.account;
    let new_pwd = this.request.body.new_pwd;
    let token   = this.request.body.token;

    try{
        let result = yield tokenSchema.findOne({account:account});

        if(result.token === token){
            let user = yield userSchema.findOne({phone: account});
            let hashed_new_pwd = md5Hex([new_pwd,user.salt]);

            yield userSchema.update({uid: user.uid},{hashed_password:hashed_new_pwd});

            this.session.uid = user.uid;
            this.session.roles = user.roles;

            this.body = {
                success: true
            };
            return false;
        }else{
            this.body = {
                success: false,
                error: Err.E1006
            };
        }

    }catch(e){
        this.body = {
            success: false,
            error: Err.E1006
        };
    }

};