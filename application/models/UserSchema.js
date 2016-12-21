"use strict";
const mongoose = require('mongoose');
let Schema = mongoose.Schema;

// userSchema
const userSchema = new Schema({
    // _id: {
    //     type: mongoose.Schema.Types.ObjectId
    // },
    account: {
        type: String,
        unique: true,
        required: true
    },
    nickname: {
        type: String,
        default: '匿名用户'
    },
    password: {
        type: String,
        required: true
    },
    last_login_time: {
        type: Date,
        default: new Date()
    },
    remark: {
        type: String
    },
    email: {
        type: String
    }
});

// Model的实例方法
/*userSchema.methods = {
    speak: function () {
        console.log(this.account);
    },
    findOtherByNickname: function () {
        return this.model(collection).find({nickname: this.nickname});
    }
};*/

// 定义Model 的类方法
userSchema.statics = {
    findByAccount: function *(account) {
        try {
            const result = yield this.find({account: account})
            return result
        } catch (e) {
            console.error('根据账号查询用户失败：', e)
            return {
                type: 'error',
                err: e
            }
        }
    },
    addAccount: function *(account) {
        try {
            const result = yield this.create(account)
            return result
        } catch (e) {
            console.error('新增用户失败：', e)
            return {
                type: 'error',
                err: e
            }
        }
    }
};

let User = mongoose.model('user', userSchema);


module.exports = User;
