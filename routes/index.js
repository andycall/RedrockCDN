var express = require('express');
var router = express.Router();
var fs = require('fs');
var multiparty = require('multiparty');
var save = require('../model/save');

/* GET home page. */
router.get('/cdn', function(req, res) {
  res.render('index', { title: 'RedRock CDN System' });
});

router.get('/cdn/js/:jsname', function(req, res) {
   var jsname = req.params.jsname.toString();
   fs.readFile('../js_components/' + jsname, function(err, file){
       if(err){
           res.setHeader(404);
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
                        console.log(name, err);
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
        }
    }
});

router.get('/cdn/css/:cssname', function(req, res) {
    var css = req.params.cssname.toString();
    fs.readFile('../css_components/' + css, function(err, file){
        if(err){
            res.setHeader(404);
            res.end('//error file not found');
        }
        res.setHeader(200, {'Content-Type': 'text/css'});
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
                        res.writeHead(200, {'Content-Type': 'text/css'});
                        res.end(data);
                    }
                });
            });
        }
    }
});


router.get('/cdn/admin', function(req, res){
   res.render('admin', {});
});

router.post('/cdn/upload', function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
//        var ver = fields.ver[0];
//        if (!ver) return res.end('//error no version');
        var oriName = files.files[0].originalFilename;
        var extName = oriName.split('.').reverse()[0];
        var hash = (new Date().getTime()).toString().slice(-6);
        var tmpPath = fs.createReadStream(files.files[0].path);
        var hashName = hash + '_' + oriName;
        if(extName === 'css'){
            var type = 'css';
            var fstream = fs.createWriteStream('css_components/'+ hashName);
        }else if (extName === 'js') {
            var type = 'js';
            var fstream = fs.createWriteStream('js_components/'+ hashName);
        }else{
            return res.end('//error file type');
        }
        console.log("Uploading: " + type + ' | ' + hashName);
        tmpPath.pipe(fstream);
        fstream.on('close', function () {
            save(hashName, hash, type, true, function(err){
                console.log(123123123123213);
//                if(err){
//                    return res.end(err);
//                }
                res.end('ok');
            });
        });
    });
});





module.exports = router;
