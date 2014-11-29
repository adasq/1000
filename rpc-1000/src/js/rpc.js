var ProxyManager = require('./proxy/ProxyManager.js');
var EndpointManager = require('./endpoint/EndpointManager.js');


console.log('RPC loaded');

var publicAPI = {
	ProxyManager: ProxyManager,  
	EndpointManager: EndpointManager
};

if(typeof window !== 'undefined'){
window.RPC = publicAPI;
}
module.exports = publicAPI;




