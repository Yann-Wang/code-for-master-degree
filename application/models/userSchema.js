"use strict";
const mongoose = require('mongoose');
const idg      = require('./genId2');
let Schema = mongoose.Schema;

// userSchema
const userSchema = new Schema({
    uid:{
        type: Number,
        unique: true
    },
    phone:{
        type: String,
        required: true,
        unique:true
    },
    hashed_password:{
        type: String,
        required: true
    },
    salt:{
        type:String,
        default:"secret"
    },
    roles:{
        type: Array,
        default:['user']
    },
    login_time:{
        type:Date,
        default: Date.now
    },
    heartbeat_time:{
        type:Date,
        default:Date.now
    },
    create_time:{
        type:Date,
        default:Date.now
    },

    nickname:{ //昵称可以重复，不作为主键
        type: String,
        default: ""
    },
    sex:{
        type: Number,
        default: 0
    },
    birthday:{
        type: Number,
        default: function () {
            //设置默认值为1990-01-01
            return (new Date(1990,0,1)).getTime();
        }
    },
    height:{
        type: String,
        default:""
    },
    signature:{
        type: String,
        default: "此处为填写的个性宣言"
    },
    complete_total_days:{
        type: Number,
        default: 0
    }
});

/**
 * 实现uid自增
 */
userSchema.pre('save', function(next){
    let UserSchema = this;
    //获得一个新ID
    idg.getNewID('userSchema',function(newid){
        if(newid){
            UserSchema.uid = newid;
            next(); //必须的，否则不会保存到mongo哦！
        }
    });
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
            return yield this.find({account: account});
        } catch (e) {
            console.error('根据账号查询用户失败：', e);
            return {
                type: 'error',
                err: e
            }
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

let User = mongoose.model('user', userSchema);


module.exports = User;
