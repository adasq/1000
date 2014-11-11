var 
_ = require('underscore'),
CloudService = require('./cloudService');

var URLManager = {};

var csMap = {
	'zippyshare.com': CloudService.ZIPPYSHARE,
	'mega.co.nz': CloudService.MEGA,
	'mediafire.com': CloudService.MEDIAFIRE,
	'hulkshare.com': CloudService.HULKSHARE
};

URLManager.getCloudServiceByURL = function(url) {
	if(!url){
		return null;
	}else{
		var service= _.find(csMap, function(service, urlPartial){
			if(url.indexOf(urlPartial) > -1){
				return true;
			}else{
				return false;
			}
		});
		return service || null;
	}
};

module.exports = URLManager;