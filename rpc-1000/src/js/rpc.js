var ProxyManager = require('./ProxyManager.js');
var EndpointManager = require('./EndpointManager.js');


console.log('RPC loaded');

var publicAPI = {
	ProxyManager: ProxyManager,  
	EndpointManager: EndpointManager
};

if(typeof window !== 'undefined'){
window.RPC = publicAPI;
}
module.exports = publicAPI;




