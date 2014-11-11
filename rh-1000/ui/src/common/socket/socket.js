angular
.module('socket', [
 'btford.socket-io'
])
.factory('socket', function (socketFactory) {
  var url = "";
  if(location.origin.indexOf('file-botters') > -1){
    url = 'ws://file-botters.rhcloud.com:8000';
  }else{
    url = location.origin;
  }

  return socketFactory({
  //  prefix: 'foo~',
    ioSocket: io.connect(url)
  });
});


