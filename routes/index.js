var express = require('express');
var router = express.Router();
var fs = require('fs');



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

router.get('/cdn/css/:cssname', function(req, res) {
    var css = req.params.cssname.toString();
    console.log(css);
    fs.readFile('../css_components/' + css, function(err, file){
        res.end(file);
    });

});












module.exports = router;
