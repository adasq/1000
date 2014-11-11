var 
express = require('express'),
getRoutes = require('./routes/get'),
postRoutes = require('./routes/post'),
SocketManager = require('./socketManager'),
config = require('../config'),
_ = require('underscore');

 

var Server = function(){
	this.socketManager = null;
};

Server.prototype.init= function(callback){
	var that = this;
var app = express(); 
	app.configure(function() {
	app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 80);
  	app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use('/',express.static(__dirname + '/ui/'+config.ui.dir));
});
var server = require('http').createServer(app);

_.each(postRoutes, function(route){
		app.post(route.url, route.callback);
});
_.each(getRoutes, function(route){
		app.get(route.url, route.callback);
});
server.listen(app.get('port'), app.get('ipaddr'), function(){
	console.log('Express server listening on  IP: ' + app.get('ipaddr') + ' and port ' + app.get('port'));
	that.socketManager = new SocketManager(server);
	callback();
});
};

module.exports = Server;