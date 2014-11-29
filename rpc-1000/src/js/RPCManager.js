var _ = require('underscore');
var q = require('q');

var getParamsByFn = function(target){
    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    var text = target.toString();
    var args = text.match(FN_ARGS)[1].split(',');
    return args;
};

var getOutputTypeCallbacks= function(callbacks){
  return _.filter(callbacks, function(cb){
    return !cb.isOutputFn;
  });  
};
var getInputTypeCallbacks= function(callbacks){
  return _.filter(callbacks, function(cb){
    return cb.isOutputFn;
  });    
};

//============================================
var RPCManager = function(communicationManager){
  this.communicationManager= communicationManager;
  var that = this;
  this.promiseStack = [];

  if(!communicationManager)return;
  communicationManager.onMessage(function(msg){

    var msgType = msg.type;
    var msgObj = msg.data;
    var messageTypeBehavior = {
      response: function(obj){
        that.promiseStack[0].resolve(obj);
        that.promiseStack= [];
      },
      clients: function(obj){
          that.rpcThis.clients= obj;
          console.log('CLIENTS: ',obj);
      },
      message: function(obj){
          var callback = that.getInputMethodByName(obj.handleMethod);
          console.log('callback:',callback);
          console.log('resposne:',obj);
          var realArgs = _.map(callback.args, function(argName) {
            return obj.args[argName];
          });
          // callback.fn
          console.log('realArgs:',realArgs);
          that.rpcThis.custom = obj;
          var responseResult = callback.fn.apply(that.rpcThis, realArgs);       
          communicationManager.send({
            type: 'response',
            data: responseResult
          });
      }
    };

    messageTypeBehavior[msgType](msgObj);
  });


};

RPCManager.prototype.getInputMethodByName = function(handleName){
  return _.find(this.inputTypeCallbacks, function(callback){
    return handleName === callback.normalizedName;  
  });
};


RPCManager.prototype.prepareOutputResponses = function(){

var that = this;

var findTargetByType = function(type){
  return _.find(that.rpcThis.clients, function(client){
    return client.type === type;
  });
};

_.each(this.outputTypeCallbacks, function(callback){
  var targetType = callback.fn();
  that.rpcThis[callback.name] = function(){
    var deferred = q.defer();
    var target = findTargetByType(targetType);

    var targetNodeData = {
      args: _.object(callback.args, arguments),
      handleMethod: 'on'+callback.normalizedName
    }

    that.communicationManager.send({
      data: targetNodeData,
      type: 'message',       
      target: target.aid}); 
    that.promiseStack.push(deferred);
    return deferred.promise;
  };
});

};

RPCManager.prototype.prepare = function(callbacks){
var callbacksInfo = [];

_.each(callbacks, function(fn, name){
  callbacksInfo.push({
    name: name,
    fn: fn,
    normalizedName: name.toLowerCase(),
    isOutputFn: !!(name.toLowerCase().substr(0,2) === "on"),
    args: getParamsByFn(fn.toString())
  });
});

this.rpcThis = callbacks;

this.inputTypeCallbacks = getInputTypeCallbacks(callbacksInfo);
this.outputTypeCallbacks = getOutputTypeCallbacks(callbacksInfo);

};

module.exports = RPCManager;
