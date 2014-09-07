/**
 * Created by andycall on 14-9-5.
 */


var crypto = require('crypto');



var md5 = (function(){
    var cache = {};

    function merge(){
        var result = [];
        for(var i = 0,len = arguments.length; i < len;  i ++){
            if(typeof arguments[i] != 'string') continue;
            result.push(arguments[i]);
        }
        return result.join("");
    }

    return function(){
        var original = merge.apply(this, arguments);

        if(!cache[original]){
            cache[original] = md5.update(original).digest('hex');
        }
        else{
            return cache[original];
        }
    }
}());


module.exports = md5;
