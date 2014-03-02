var i;
setInterval(function () {
	//console.log(new Date());
	chrome.browserAction.setIcon({
		path : 'active.png'
	});
}, 10000);

var contentType = [];
chrome.webRequest.onHeadersReceived.addListener(function (details) {

	for (i = 0; i < details.responseHeaders.length; ++i) {
		if ("content-type" == details.responseHeaders[i].name.toLowerCase()) {
			console.log(details.responseHeaders[i].value);
			contentType[details.tabId] = details.responseHeaders[i].value;
		}
		//console.log(details.responseHeaders[i].name+": "+details.responseHeaders[i].value);
	}

}, {
	urls : ['*://*/*'],
	types : ['main_frame']
}, ['responseHeaders']);

function getNewId() {
	var newId = 0;
	if (!localStorage["nazas"]) {
		localStorage["nazas"] = 0;
	} else {
		var array = localStorage["nazas"].split(",");
		newId = (array.length == 0) ? 0 : array[array.length - 1];
		++newId;
		localStorage["nazas"] += "," + newId;
	}
	return newId;
}

function getTpeByContentType(ct) {

	var type = -1;
	switch (ct) {
	case "image/gif":
		type = ContentType.GIF;
		break;
	case "image/png":
	case "image/jpg":
	case "image/jpeg":
		type = ContentType.IMAGE;
		break;
	case "application/pdf":
		type = ContentType.PDF;
		break;
	case "video/mp4":
		type = ContentType.VIDEO;
		break;
	default:
		if (ct.indexOf("text/html") > -1) {
			type = ContentType.WEBPAGE;
		}

	};
	return type;
}

var YoutubeManager = function(url){
	var videoId  = url.substr(url.indexOf("?v=")+3);
	
	this.getCategory = function(){
		return Category.VIDEO;
	};
	
	this.getPayload = function(){
		var payloads = [];
		
		payloads.push(videoId);
		
		return payloads;
	};
};

var Item = function () {
	var domainRegexp = new RegExp(/\/\/[www\.]*(.[^/?]+)/) ;
	
	var getDomainByUrl = function (url) {
		return url.match(domainRegexp)[1];
	};

	this.computePayloadType = function(){
		var payloadType;	
		
		if( this.contentType == ContentType.GIF ){
			payloadType = PayloadType.GIF;
		}else if( this.contentType == ContentType.PDF ){
			payloadType = PayloadType.PDF;
		}else if( this.contentType == ContentType.IMAGE ){
			payloadType = PayloadType.IMAGE;
		}else{
			switch (this.domain) {
				case "youtube.com":
					payloadType = PayloadType.YOUTUBE;
					break;
				default:
					payloadType = PayloadType.WEBPAGE;
					break;
			};
			
		}
		this.payloadType =  payloadType;
		
	};

	this.computePayloads = function (func) {
		var that= this;
		if (this.payloadType == PayloadType.YOUTUBE) {
			var manager = new YoutubeManager(this.url);
			this.category = manager.getCategory();
			this.payload = manager.getPayload();
			var videoId = this.payload[0];
			this.payload.push("http://img.youtube.com/vi/"+videoId+"/0.jpg");
			func(this.toObject());
			/*
			$.get("http://img.youtube.com/vi/"+videoId+"/0.jpg", function (response) {
				if(!response.error){					
						that.payload = [response.content];
				}else{
						that.payload = ["~~ERROR"];
						console.log("ERROR");
				}	
				func(that.toObject());		
			}).fail(function () {
				that.payload = ["~~fail"];
				console.log("fail");
				func(that.toObject());
			});
			*/
			
		}else if(this.payloadType == PayloadType.GIF){
			this.category = Category.GIF;	
			$.get("http://www.tm.ubuntu-pomoc.org/thumbs/generate.php?url=" + this.url, function (response) {
				if(!response.error){					
						that.payload = [response.content];
				}else{
						that.payload = ["~~ERROR"];
						console.log("ERROR");
				}	
				func(that.toObject());		
			}).fail(function () {
				that.payload = ["~~fail"];
				console.log("fail");
				func(that.toObject());
			});
		}else if(this.payloadType == PayloadType.PDF){
			this.category = Category.PDF;	
			var title = this.url.substr(this.url.lastIndexOf("/") + 1);
			$.get("http://www.tm.ubuntu-pomoc.org/thumbs/pdf.php?url=" + this.url, function (response) {
				if (!response.error) {			
					that.payload = [response.content, title];
				}else{
					that.payload = ["~~ERROR", title];
				}
				func(that.toObject());
			});			
		}else if(this.payloadType == PayloadType.IMAGE){
			this.category = Category.IMAGE;
				console.log("Category.IMAGE");
			func(that.toObject());		
		}else if(this.payloadType == PayloadType.WEBPAGE){		
			this.category = Category.WEBPAGE;	
					console.log(that.toObject());
			func(that.toObject());	
			console.log("Category.WEBSITE");
		}else{
				console.log("Category.else");
		}		 
	};
	this.toObject = function(){
		var obj = {};
		for (var property in this) {
			if (this.hasOwnProperty(property) && typeof(this[property]) !== "function") {
			   obj[property]=this[property];
			}
		}
		return obj;
	};
	this.generateObject = function(func){
	
		this.domain = getDomainByUrl(this.url);
		this.computePayloadType(); 
		this.computePayloads(func);
		
		
	};

};

chrome.browserAction.onClicked.addListener(function (tab) {
	/*
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	chrome.tabs.sendMessage(tab.id, {request: "title"}, function(response) {
	console.log(response.title);	});	});
	 */
	alert(getTpeByContentType(contentType[tab.id]));
	var newId = getNewId();
	
	var item = new Item();
	item.title = tab.title;
	item.url = tab.url;
	item.payload = tab.url;
	item.date = (+new Date());
	item.contentType = getTpeByContentType(contentType[tab.id]);
	item.payloadType = -1;
	item.id = newId;
	item.generateObject(function(object){

		var json = JSON.stringify(object);
		console.log( json );		
		localStorage["nazas-" + object.id] = json;
		
	});
	
	return;
	
	/*
	for (var property in item) {
    if (item.hasOwnProperty(property) && typeof(item[property]) !== "function") {
       console.log(item[property]);
    }}*/
	

	
	 

	if (getTpeByContentType(contentType[tab.id]) == ContentType.GIF) {

		$.get("http://www.tm.ubuntu-pomoc.org/thumbs/generate.php?url=" + tab.url, function (z) {
			var demo = z.content;
			var title = tab.url.substr(tab.url.lastIndexOf("/") + 1);
			localStorage["nazas-" + newId] = '{"contype":' + ContentType.GIF + ', "title":"' + title + '","url":"' + tab.url + '","fav":"' + demo + '","order":4,"date":' + (+new Date()) + ',"id":' + newId + '}';

		}).fail(function () {
			localStorage["nazas-" + newId] = '{"contype":' + ContentType.GIF + ', "title":"' + title + '","url":"' + tab.url + '","fav":"","order":4,"date":' + (+new Date()) + ',"id":' + newId + '}';
			console.log("error");
		});

	} else if (getTpeByContentType(contentType[tab.id]) == ContentType.IMAGE) {
		localStorage["nazas-" + newId] = '{"contype":' + ContentType.IMAGE + ', "title":"' + tab.title + '","url":"' + tab.url + '","fav":"' + tab.favIconUrl + '","order":4,"date":' + (+new Date()) + ',"id":' + newId + '}';

	} else if (getTpeByContentType(contentType[tab.id]) == ContentType.PDF) {

		$.get("http://www.tm.ubuntu-pomoc.org/thumbs/pdf.php?url=" + tab.url, function (response) {
			if (response.error) {}
			var title = tab.url.substr(tab.url.lastIndexOf("/") + 1);
			localStorage["nazas-" + newId] = '{"contype":' + ContentType.PDF + ', "title":"' + title + '","url":"' + tab.url + '","fav":"' + response.content + '","order":4,"date":' + (+new Date()) + ',"id":' + newId + '}';
		});

	} else {

		localStorage["nazas-" + newId] = '{"contype":' + ContentType.WEBPAGE + ', "title":"' + tab.title + '","url":"' + tab.url + '","fav":"' + tab.favIconUrl + '","order":4,"date":' + (+new Date()) + ',"id":' + newId + '}';

	}

	//alert(tab.url);

	/*
	chrome.tabs.executeScript({
	code: 'alert(CIPA);'
	});
	 */

});
