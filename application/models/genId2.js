/**
 * Created by gospray on 16-12-21.
 */
const mongoose = require('mongoose')
    ,Schema = mongoose.Schema;

// 自增ID生成器
let IdGenerator = new Schema({
    modelname  : { type: String },
    currentid  : { type: Number, default: 0 }
});

let idg = mongoose.model('IdGenerator', IdGenerator);

// 获得一个自增ID的方法
idg.getNewID = function(modelName, callback){
    this.findOne({modelname : modelName},function(err,doc){
        if(doc){
            doc.currentid += 1;
        }else{
            doc = new idg({modelname : modelName});
            //doc.modelname = modelName;
        }

        doc.save(function(err){
            if(err)
                throw err('IdGenerator.getNewID.save() error');
            else
                callback(parseInt(doc.currentid.toString()));
        });
    });
};

module.exports = idg;