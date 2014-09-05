/**
 * Created by andycall on 14-9-5.
 */

var Packages = require('./db').Packages;
var fs = require('fs');
var md5 = require('./encryption');
var compressor = require('node-minify');


function Save(name, version, filePath, type, isCompress, callback){
    var id = md5(name);

    var obj = {
        id : id,
        name : name,
        version : version,
        type : type,
        isCompress : isCompress,
        filePath :  filePath
    };

    var fileNameArr = filePath.split(".");
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

}




