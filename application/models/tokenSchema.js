/**
 * Created by gospray on 16-12-21.
 */
"use strict";
const mongoose = require('mongoose');
const idg      = require('./genId2');
let Schema = mongoose.Schema;

// userSchema
const tokenSchema = new Schema({
    type:{ // phone : 1
        type: Number,
        default: 1
    },
    account:{ // account: phone number
        type: String,
        required: true,
        unique: true
    },
    token:{ // message captcha
        type: String,
        required: true
    },
    code:{ // picture captcha
        type: String,
        default: ""
    },
    create_time:{
        type: Date,
        default: Date.now
    }
});

// 定义Model 的类方法
tokenSchema.statics = {
    findByAccount: function *(account) {
        try {
            return yield this.find({account: account});
        } catch (e) {
            console.error('根据账号查询用户失败：', e);
            return {
                type: 'error',
                err: e
            };
        }
    },
    addAccount: function *(account) {
        try {
            return yield this.create(account);
        } catch (e) {
            console.error('新增用户失败：', e);
            return {
                type: 'error',
                err: e
            }
        }
    }
};

let Token = mongoose.model('token', tokenSchema);


module.exports = Token;
