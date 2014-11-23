
var express = require('express');
var RPC = require('./rpc.js');



	var app = express(); 
	app.configure(function() {
		app.set('port', 80);
	  	app.set('ipaddr', "127.0.0.1");
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		var path = 'C:\\GIT\\bootstrap-clear\\src\\';
		console.log(path);
		app.use('/', express.static(path));
	});
var server = require('http').createServer(app);

server.listen(app.get('port'), app.get('ipaddr'), function(){
	console.log('Express server listening on  IP: ' + app.get('ipaddr') 
		+ ' and port ' + app.get('port'));
});


	// var io = require("socket.io").listen(server);
	// io.sockets.on("connection", function (socket) {
	// 	console.log('socket connected');
	// 	socket.emit('event', {x: 3});
	// });

	

var proxy = new RPC.ProxyManager(server);