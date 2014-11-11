var
mega = require('mega'),
progress = require('request-progress'),
q = require('q');


var MegaDriver = function(){
};

MegaDriver.prototype.getFileByUrl = function(url, progressCallback){
var deferred = q.defer();







mega.file(url).loadAttributes(function(err, file) {

console.log(file);

//file.download().pipe(fs.createWriteStream(file.name))

var fileToReturn = {
  stream: file.download(),
  name: file.name
};


progress(fileToReturn.stream, {
    throttle: 5000,  // Throttle the progress event to 2000ms, defaults to 1000ms
    delay: 1000      // Only start to emit after 1000ms delay, defaults to 0ms
})
.on('progress', progressCallback);

deferred.resolve(fileToReturn);


});


return deferred.promise;
};


module.exports = MegaDriver;