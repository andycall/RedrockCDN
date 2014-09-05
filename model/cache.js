/**
 * Created by andycall on 14-9-5.
 */
var Packages = require('./db').Packages;

var Cache = {};

/**
 * 保存数据
 * @param obj
 * @returns {*}
 */
Cache.save = function(obj, callback){
    var self = this;

    if(!self.cache[obj.id]){

        self.cache[obj.id] = obj;

        // 保存数据库
        var package = new Packages({
            package_id: obj.id,
            package_name : obj.name,
            package_version : obj.version,
            package_isCompress : obj.isCompress,
            package_type : obj.type,
            package_filePath : obj.filePath
        });

        package.save(obj, function(err){
            callback.call(this, err);
        });
    }
    else{
        // 从缓存中取
        return callback.call(this);
    }

};

//Cache.search = function(id, callback){
//    var self = this;
//
//    if(!self.cache[id]){
//       Packages.find({ package_id : id}, function(err, obj){
//            if(err) throw err;
//            return callback.call(this, obj);
//       });
//    }
//    else{
//        return callback.call(this, self.cache[id]);
//    }
//};



module.exports = Cache;