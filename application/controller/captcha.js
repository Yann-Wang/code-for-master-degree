/**
 * Created by gospray on 16-12-21.
 */
const ccap = require('ccap');
const Err = require('../../config/error');
const tokenSchema = require('../models/tokenSchema');

/**
 * 获取图片验证码
 */
exports.get_PicCaptcha = function *(next) {
    let captcha = ccap();
    let ary = captcha.get();//ary[0] is captcha's text,ary[1] is captcha picture buffer.
    let text = ary[0];
    let buffer = ary[1];


};

exports.genCaptcha = function *() {
    let account = this.request.body.account;
    let token = "123456";

    try{
        let query = {account: account };
        //账户如果存在，就修改token；
        // 如果不存在，就插入account，并设置token
        yield tokenSchema.findOneAndUpdate(query, { token: token }, {upsert:true});

        this.body={
            success: true
        };

    }catch(e){
        this.body={
            success:false,
            error: Err.E3001
        };
    }
};