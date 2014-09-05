var express = require('express');
var router = express.Router();
var fs = require('fs');
var multiparty = require('multiparty');


/* GET home page. */
router.get('/cdn', function(req, res) {
  res.render('index', { title: 'RedRock CDN System' });
});

router.get('/cdn/js/:jsname', function(req, res) {
   var js = req.params.jsname.toString().split('@');
   var jsVersion = js[1] || '';
   jsname = js[0];
   console.log(js, jsVersion);
   fs.readFile('../js_components/' + jsname + '/' + jsname + '.min.js', function(err, file){
       if(err){
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
            querys.forEach(function(name){
                //TODO fs.read
                var result = '';
                result;

                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(result);
            });
        }
    }
});

router.get('/cdn/css/:cssname', function(req, res) {
    var css = req.params.cssname.toString();
    console.log(css);
    fs.readFile('../css_components/' + css, function(err, file){
        res.end(file);
    });

});

router.get('/cdn/css*', function(req, res){
    for(var key in req.query){
        if(key[0] == '?'){
            var q = key.slice(1);
            var querys = q.split(',');
            querys.forEach(function(name){
                //TODO fs.read
                var result = '';
                result;

                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(result);
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
        var ver = fields.ver[0];
        if (!ver) return res.end('//error no version');
        var oriName = files.files[0].originalFilename;
        var extName = oriName.split('.').reverse()[0];
        var tmpPath = fs.createReadStream(files.files[0].path);
        var hashName = new Date().getTime() + '_' + oriName;
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
            //TODO 给老董发
            res.end('ok');
        });
    });
});





module.exports = router;
