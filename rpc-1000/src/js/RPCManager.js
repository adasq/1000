var _ = require('underscore');
var q = require('q');
var Clients = require('./endpoint/Clients.js');

function makeid(length){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < (length || 5); i++ ){
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
    return text;
}

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

  communicationManager.onMessage(function(msg){
    var messageTypeBehavior = {
      response: function(obj){
        that.onResponseMessage(obj);
      },
      clients: function(obj){
        that.onClientsMessage(obj);
      },
      message: function(obj){
        that.onMessageMessage(obj);
      }
    };
    messageTypeBehavior[msg.header.type](msg);
  });
};

RPCManager.prototype.onResponseMessage = function(obj) {
  var that= this;
  that.promiseStack[0].resolve(obj.data);
  that.promiseStack = [];  

};
RPCManager.prototype.onClientsMessage = function(obj) {
   this.userRPCInteface.clients.set(obj.data);
   console.table(obj.data);
};
RPCManager.prototype.onMessageMessage = function(obj) {
  console.log('message received:', obj);
  var that= this;
  var inputMethodDescription = that.getInputMethodByName(obj.data.handleMethod);
          var realArgs = _.map(inputMethodDescription.args, function(argName) {
            return obj.data.args[argName];
          });
          that.userRPCInteface.source = obj.header.source;
          var responseResult = inputMethodDescription.fn.apply(that.userRPCInteface, realArgs);       
          that.communicationManager.send({
            header: {
              mid: obj.header.mid,
              type: 'response',       
              target: null
            },
            data: responseResult
          });
};

RPCManager.prototype.getInputMethodByName = function(handleName){
  return _.find(this.inputTypeCallbacks, function(callback){
    return handleName === callback.normalizedName;  
  });
};

RPCManager.prototype.prepareOutputResponses = function(){
var that = this;

_.each(this.outputTypeCallbacks, function(callback){
  var outputMethodDescription = callback.fn();
  var targetType = outputMethodDescription.type;
  var isTargetUnique = outputMethodDescription.unique;
 
  that.userRPCInteface[callback.name] = function(){
    var target;

    if(isTargetUnique){
      target = that.userRPCInteface.clients.getClientByType(targetType);
      parsedArguments = _.toArray(arguments);
    }else{
       var targetName = arguments[0];
        target = that.userRPCInteface.clients.getClientByNameAndType(targetName, targetType);
       parsedArguments = _.toArray(arguments).slice(1); 
    }
   
    var deferred = q.defer();
    
    if(!target){
          deferred.reject({error: true, text: 'no target available!'});
    }else{
        that.promiseStack.push(deferred);
        var targetNodeData = {          
          args: _.object(callback.args, parsedArguments),
          handleMethod: 'on'+callback.normalizedName
        };
        that.communicationManager.send({
          data: targetNodeData,
          header: {
            mid: makeid(10),
            type: 'message',       
            target: target.aid
          }      
        });  
    }

   
    return deferred.promise;
  };

});

};

RPCManager.prototype.prepare = function(userRPCInteface){
var callbacksInfo = [];

_.each(userRPCInteface, function(fn, name){
  callbacksInfo.push({
    name: name,
    fn: fn,
    normalizedName: name.toLowerCase(),
    isOutputFn: !!(name.toLowerCase().substr(0,2) === "on"),
    args: getParamsByFn(fn.toString())
  });
});
this.userRPCInteface = userRPCInteface;
this.userRPCInteface.clients= new Clients();
this.inputTypeCallbacks = getInputTypeCallbacks(callbacksInfo);
this.outputTypeCallbacks = getOutputTypeCallbacks(callbacksInfo);
};

module.exports = RPCManager;
