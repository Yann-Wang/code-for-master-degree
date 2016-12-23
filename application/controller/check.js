/**
 * Created by gospray on 16-12-21.
 */
const Err = require('../../config/error');
const tokenSchema = require('../models/tokenSchema');
/**
 * 检查帐号是否存在
 */
exports.check_account = function *(){
    const account = this.request.body.account;
    if (!account) {
        this.body = {
            success: false,
            error: Err.E1001
        };
        return false;
    }

    let user = yield tokenSchema.find({account: account});
    //console.log(user);
    //console.log(user[0].account);
    if (user.length > 0) {

        this.body={
            success: true,
            data: 0
        };

        return false;


    }

    this.body = {
        success: false,
        error: Err.E1005
    }

};