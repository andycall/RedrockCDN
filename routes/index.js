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
   fs.readFile('../components/' + jsname + '/' + jsname + '.min.js', function(err, file){
       res.end(file);
   })

});












module.exports = router;
