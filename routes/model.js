var express = require('express');
var router = express.Router();
var fs = require('fs');
var Twitter = require('twitter');
var util = require("util");

var client = new Twitter({
  consumer_key: 'BwjInHVoadpiaU6JHfVH64T96',
  consumer_secret: 'qLUnXeVbooXnlFB0DMzjsEF4FNUrZm0k0aMOO2XjRu4NTom4N9',
  access_token_key: '901077254100398080-4S2qXo0gvcjg4JdL5tEobndyKH6Mpzt',
  access_token_secret: 'Rwzt3ekqVhmuUDtjBjXR7YfYqE0HuAVvgEu6GlQBKQoBf'
});

var params = {screen_name: 'nodejs'};

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('check the console to see some tweets');
  if (req.query.task == "download") {
    //call python child process
    util.log('readingin');

    var spawn = require("child_process").spawn;
    var process = spawn('python',["routes/makeTargetLists.py","routes/output.csv"]);
    
    var positiveFile = '/home/gab/Bureau/hackathonia/routes/positiveOutput.csv';
    var negativeFile = '/home/gab/Bureau/hackathonia/routes/negativeOutput.csv';
    if (req.query.status == 'negative') {
        res.download(negativeFile); // Set disposition and send it.
    }
    else if (req.query.status == 'positive') {
        res.download(positiveFile);
    }
  }
  else {
    client.get('search/tweets', {q: req.query.data, count: 300, lang: 'en', exclude: 'retweets'}, function(error, tweets, response) {
      var json = JSON.stringify(tweets,null,4);
      fs.writeFile("routes/input.json",json);
  
      var options = {
        args : "input.json"
      }
  
      //call python child process
      util.log('readingin');
  
      var spawn = require("child_process").spawn;
      var process = spawn('python',["routes/read_predict.py","routes/input.json"]);
      
      //after that, output.csv is generated by the python sub-routine in routes/output.csv
      //process the output.csv
      res.render('model', {titre : req.query.data});
  
   });
  }
  
});



module.exports = router;