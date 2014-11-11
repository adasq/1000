var
q = require('q'),
util = require('util'),
  vm = require('vm'),
  _ = require('underscore'),
cheerio = require('cheerio'),
request = require('request');

var ZippyShareDriver = function(){
};

ZippyShareDriver.prototype.getFileByUrl = function(url){
var deferred = q.defer();

var j= request.jar();
request({uri: url, jar: j, followRedirect: true}, function(e,r,b){


 var $ = cheerio.load(b, {normalizeWhitespace: true});
 var title = $('.song');
 var fileName = title[0].children[0].data+".mp3";

var scripts = $('script'); 
var script = scripts[20].children[0].data;
script = script.match(/document\.location\.href =\'(.)+\';/g)[0];
targetUrl= script.substr(25, script.length-25-2)
console.log(targetUrl);
 
// var fileName = title[0].children[0].data.substr(17);
// var scripts = $('script'); 
// var script= scripts[16];
// var line = script.children[0].data.split(';')[2];
// var initSandbox = {      fl1x: 'cat'    },
// context = vm.createContext(initSandbox);
// vm.runInContext(line, context, 'myfile.vm');
// var str = util.inspect(context);
// var link = str.match(/\'(.)+\'/g)[0];
// link = link.substr(1, link.length-2)
// link="http://www"+server+".zippyshare.com/d/"+link;

var file = {
  stream: request({uri: targetUrl, jar: j, followRedirect: false}),
  name: fileName
};
deferred.resolve(file)
});
return deferred.promise;
};


module.exports = ZippyShareDriver;