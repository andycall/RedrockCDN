/**
 * Created by andycall on 14-9-5.
 */

var cache = require('./save');
var fs = require('fs');
var md5 = require('./encryption');
var compressor = require('node-minify');


function save(name, hash, type, isCompress, callback){
    var id = hash;

    var obj = {
        id : id,
        name : name,
        type : type,
        isCompress : isCompress
    };

    var fileNameArr = name.split(".");
    fileNameArr.pop();
    var fileName = fileNameArr.join(".");


    if(isCompress){
        if(type == 'css'){
            new compressor.minify({
                type: 'yui-css',
                fileIn: 'css_components/' + fileName + ".css",
                fileOut: 'css_components/' + fileName + '.min.css',
                callback: function(err, min){
                    console.log(err);
                }
            });
        }
        else if(type == 'js'){
            new compressor.minify({
                type: 'yui-js',
                fileIn: 'js_components/' + fileName + ".js",
                fileOut: 'js_components/' + fileName + '.min.js',
                callback: function(err, min){
                    console.log(err);
                }
            });
        }
    }

    cache.save(obj, function(err){
        callback(err);
    });
}


module.exports = save;




