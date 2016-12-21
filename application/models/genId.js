/**
 * Created by gospray on 16-12-21.
 */
let mongoose = require('mongoose')
,Schema = mongoose.Schema;

let KeysSchema = new Schema({
    _id: {type: String ,index: true},
//实例应该是你的其它model的名字
    key: {type: Number,default: 0}
//每次使用时的自增长ID
});

let Keys = mongoose.model('Keys',KeysSchema);

exports.addAndUpdateKeys = function(keyId,callback){
    Keys.findById(keyId,function(err,doc){
        if(!err && !doc){
            let obj = {};
            obj._id = keyId;
            let keys = new Keys(obj);
            keys.save(function(err,doc){
                if(err){
                    callback(null);
                    return;
                }
                callback(doc);
            })
        }else{
            Keys.findByIdAndUpdate(keyId,{$inc:{key: 1}},
                function(err,doc){
                    if(err){
                        callback(null);
                        return;
                    }
                    callback(doc);
                })
        }
    });
};