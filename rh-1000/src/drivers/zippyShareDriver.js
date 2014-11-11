var
q = require('q'),
util = require('util'),
vm = require('vm'),
progress = require('request-progress'),
cheerio = require('cheerio'),
request = require('request');

var ZippyShareDriver = function(){
};

ZippyShareDriver.prototype.getFileByUrl = function(url, progressCallback){
var deferred = q.defer();
console.log(url)
var server = url.match(/www[0-9]+\.zippy/g)[0];
server= server.substr(3, server.length-9);
var j= request.jar();
request({uri: url, jar: j, followRedirect: true}, function(e,r,b){
var $ = cheerio.load(b, {normalizeWhitespace: true});
var title = $('title');
var fileName = title[0].children[0].data.substr(17);
var scripts = $('script'); 
var script= scripts[16];
var line = script.children[0].data.split(';')[2];
 
 console.log(script.children[0].data)
var x = {};
var initSandbox = {      'document': {getElementById: function(z){
	if(z == "downloadB"){
		return x;
	}else{
		return {};
	}
	
}}    },
context = vm.createContext(initSandbox);
vm.runInContext(script.children[0].data, context, 'myfile.vm');
var str = util.inspect(context);
var link = x.href;
link = link.substr(1);
// var initSandbox = {      fl1x: 'cat'    },
// context = vm.createContext(initSandbox);
// vm.runInContext(line, context, 'myfile.vm');
// var str = util.inspect(context);
//var link = str.match(/\'(.)+\'/g)[0];
//link = link.substr(1, link.length-2)
link="http://www"+server+".zippyshare.com/"+link;
console.log(link)
var file = {
  stream: request({uri: link, jar: j, followRedirect: false}),
  name: fileName
};
progress(file.stream, {
    throttle: 2000,  // Throttle the progress event to 2000ms, defaults to 1000ms
    delay: 1000      // Only start to emit after 1000ms delay, defaults to 0ms
})
.on('progress', progressCallback);
deferred.resolve(file)
});
return deferred.promise;
};


module.exports = ZippyShareDriver;