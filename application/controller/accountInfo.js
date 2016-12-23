/**
 * Created by gospray on 16-12-22.
 */
const Err = require('../../config/error');
const userSchema = require('../models/userSchema');
let debug = require('debug')('app:accountInfo');


exports.handleAccountInfo = function *(next) {

    let body = this.request.body;

    let uid = this.session.uid;
    let accountInfo = {
        nickname: body.nickname,
        sex: body.sex,
        birthday: body.birthday,
        height: body.height,
        signature: body.signature
    };

    try{
        yield userSchema.update({uid:uid},accountInfo);
        this.body = {
            success: true
        };
    }catch(e){
        debug("账户信息写入数据库失败！");
        this.body = {
            success: false,
            error: Err.E3002
        };
    }
};

