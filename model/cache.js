/**
 * Created by andycall on 14-9-5.
 */
var Packages = require('./db').Packages;

//
//Packages.find({
//
//});



var Cache = {};


/**
 * 获取数据
 * @param obj
 * @returns {*}
 */
Cache.get = function(obj){
    var self = this;

    if(!self.cache[obj.id]){

        self.cache[obj.id] = obj;

        var package = new Packages({
            package_id: obj.id,
            package_name : obj.name,
            package_version : obj.version,
            package_isCompress : obj.isCompress,
            package_type : obj.type,
            package_filePath : obj.filePath
        });

        package.save(obj, function(err){
            if(err) throw err;
        });
    }

    else{
        return self.cache[obj.id];
    }

};

/**
 * 将数据库中所有的数据缓存
 */
Cache.save = function(){
    var package = new Packages();


};


Cache.search = function(id){
    var self = this;

    if(!self.cache[id]){
       Packages.find({ package_id : id}, function(err, obj){
            if(err) throw err;
            return obj;
       });
    }
    else{
        return cache[id];
    }
};



module.exports = Cache;