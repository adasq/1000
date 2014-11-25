var ProxyManager = require('./ProxyManager.js');
var EndpointManager = require('./EndpointManager.js');




var publicAPI = {
	ProxyManager: ProxyManager,  
	EndpointManager: EndpointManager
};

if(typeof window !== 'undefined'){
window.RPC = publicAPI;
}
module.exports = publicAPI;




