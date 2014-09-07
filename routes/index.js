var express = require('express');
var router = express.Router();
var fs = require('fs');
var multiparty = require('multiparty');
var save = require('../model/save');
var EventProxy = require("eventproxy");
var AppConfig = require('../config');


/* GET home page. */
router.get('/cdn', function(req, res) {
  res.render('index', { title: 'RedRock CDN System' });
});

router.get('/cdn/js/:jsname', function(req, res) {
   var jsname = req.params.jsname.toString();
   fs.readFile('js_components/' + jsname, function(err, file){
       if(err){
           console.log('css readfile error', err);
           res.writeHead(404);
           res.end('//no this file');
       }
       res.end(file);
   });
});

router.get('/cdn/js*', function(req, res){
    for(var key in req.query){
        if(key[0] == '?'){
            var q = key.slice(1);
            var querys = q.split(',');
            var result = {};
            var flag = 0;
            querys.forEach(function(name){
                fs.readFile('js_components/' + name, function (err, content){
                    if(err){
                        res.writeHead(404);
                        return res.end('//can not find file: ' + name);
                    }
                    result[name] = content;
                    flag++;
                    if(flag === querys.length){  //all read
                        console.log();
                        var data = '';
                        for(var i = 0, len = flag; i < flag; i++){
                            data += result[querys[i]];
                        }
                        res.writeHead(200, {'Content-Type': 'application/javascript'});
                        res.end(data);
                    }
                });
            });
        }else{
            return res.redirect('/cdn');
        }
    }
});

router.get('/cdn/css/:cssname', function(req, res) {
    var css = req.params.cssname.toString();
    fs.readFile('css_components/' + css, function(err, file){
        if(err){
            console.log('css readfile error', err);
            res.writeHead(404);
            res.end('/* error: file not found */');
        }
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.end(file);
    });
});

router.get('/cdn/css*', function(req, res){
    for(var key in req.query){
        if(key[0] == '?'){
            var q = key.slice(1);
            var querys = q.split(',');
            var result = {};
            var flag = 0;
            querys.forEach(function(name){
                fs.readFile('css_components/' + name, function (err, content){
                    if(err){
                        res.writeHead(404);
                        return res.end('/*can not find file: ' + name + '*/');
                    }
                    result[name] = content;
                    flag++;
                    if(flag === querys.length){  //all read
                        console.log();
                        var data = '';
                        for(var i = 0, len = flag; i < flag; i++){
                            data += result[querys[i]];
                        }
                        res.writeHead(200, {'Content-Type': 'text/css'});
                        res.end(data);
                    }
                });
            });
        }else{
            return res.redirect('/cdn');
        }
    }
});


router.get('/cdn/admin', function(req, res){
    res.redirect('/cdn/upload')

});


router.get('/cdn/upload', function(req, res){
    return res.render('upload');
});



router.post('/cdn/upload', function (req, res) {
    var form = new multiparty.Form();
    var filetype = "",
        urlString = [AppConfig.website],
        data = [],
        type;


    function FileCallback(){
        var fileStr = [];

        type = data[0].type;

        urlString.push(type + "??");

        console.log(data);

        data.forEach(function(value, index){
            (function(){
                var hashName = value.hashName,
                    hash = value.hash;

                type = value.type;
                save(hashName, hash, type, true, function(err){
                    if(err){
                        return res.end(err);
                    }
                    var minName = hashName.slice(0, -type.length) + 'min.' + type;

                    fileStr.push(minName);

                    if(data.length == fileStr.length){
                        urlString = urlString.join("") + fileStr.join(",");

                        res.render('success', {type: type, minName: urlString});
                    }
                });
            }());
        });

    }


    form.parse(req, function(err, fields, files) {

        for(var file in files){
            if(files.hasOwnProperty(file)){
                (function(){
                    var oriName = files[file][0].originalFilename;
                    var extName = oriName.split('.').reverse()[0];
                    var hash = (new Date().getTime()).toString().slice(-6);
                    var tmpPath = fs.createReadStream(files[file][0].path);
                    var hashName = hash + '_' + oriName;
                    filetype = filetype || extName;
                    if(extName === 'css' && filetype == extName){
                        var type = 'css';
                        var fstream = fs.createWriteStream('css_components/'+ hashName);
                    }else if (extName === 'js' && filetype == extName) {
                        var type = 'js';
                        var fstream = fs.createWriteStream('js_components/'+ hashName);
                    }else{
                        return res.end('//error file type');
                    }
                    console.log("Uploading: " + type + ' | ' + hashName);
                    tmpPath.pipe(fstream);
                    fstream.on('close', function () {
                        var obj = {
                            hashName : hashName,
                            hash : hash,
                            type : type,
                            isCompress : true
                        };
                        data.push(obj);

                        if(data.length == Object.keys(files).length){
                            FileCallback()
                        }
                    });
                }());
            }
        }
    });
});





module.exports = router;
