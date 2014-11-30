var _ = require('underscore');

var MessagesBuffer = function(){

	var buffer = [];

	this.insert= function(source, target, mid){
		buffer.push({
			source: source,
			mid: mid,
			target: target,
			time: +new Date()
		});
	};

	this.getByMid = function(mid){
		var messageBufferItem = _.find(buffer, function(bufferItem){
			return bufferItem.mid === mid;
		});
		return messageBufferItem;
	};
};

module.exports = MessagesBuffer;