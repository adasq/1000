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
var RPCManager = function(){
  
};



RPCManager.prototype.prepare = function(callbacks){
var callbacksInfo = [];

_.each(callbacks, function(fn, name){
  callbacksInfo.push({
    name: name,
    normalizedName: name.toLowerCase(),
    isOutputFn: !!(name.toLowerCase().substr(0,2) === "on"),
    args: getParamsByFn(fn.toString())
  });
});


this.inputTypeCallbacks = getInputTypeCallbacks(callbacksInfo);
this.outputTypeCallbacks = getOutputTypeCallbacks(callbacksInfo);

};

RPCManager.prototype.prepareOutputResponses = function(){
var thisX = {
  id: 1
};
_.each(this.outputTypeCallbacks, function(callback){
  thisX[callback.name]= function(){
    var deferred = q.defer();
    console.log(callback.name+' called');
    setTimeout(function(){
      deferred.resolve({ans:'wer'});
    }, 200);
    return deferred.promise;
  };
});

};


module.exports = RPCManager;










//u usera:
// var thisX = {
//   id: 1
// };
// _.each(outputTypeCallbacks, function(callback){  
//   thisX[callback.name]= function(){
//     var deferred = Q.defer();
//     console.log(callback.name+' called');
//     setTimeout(function(){
//       deferred.resolve({ans:'wer'});
//     }, 200);
//     return deferred.promise;
//   };
// });

// server.onThrowCard.call(thisX, 'aaa');