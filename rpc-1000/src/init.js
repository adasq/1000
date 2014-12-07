
var express = require('express');
var RPC = require('./js/rpc.js');


	var app = express(); 
	app.configure(function() {
		app.set('port', 80);
	  	app.set('ipaddr', "127.0.0.1");
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use('/', express.static(__dirname));
	});
var server = require('http').createServer(app);

server.listen(app.get('port'), app.get('ipaddr'), function(){
	console.log('Express server listening on  IP: ' + app.get('ipaddr') 
		+ ' and port ' + app.get('port'));
});
 

var proxy = new RPC.ProxyManager(server);