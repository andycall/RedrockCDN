/**
 * Created by andycall on 14-9-5.
 */

var cache = require('./cache');
var fs = require('fs');
var md5 = require('./encryption');
var compressor = require('node-minify');
var uglify = require('uglify-js');


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
            var result = uglify.minify("js_components/" + fileName + '.js', {mangle: true});

            fs.writeFile("js_components/" + fileName + '.min.js', result.code, function(err){
                if(err){
                    callback(err);
                }
            })
        }
    }


    cache.save(obj, function(err){
        callback(err);
    });
}


module.exports = save;




