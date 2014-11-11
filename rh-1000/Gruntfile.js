module.exports = function ( grunt ) {
  


  var taskConfig = {
  //  pkg: grunt.file.readJSON("package.json"), 
  };//taskConfig



    var prepareConfig= function(dest){
        var destConfig = {        
          build: {
              'db_connectionURI': 'mongodb://localhost/file',
              'ui_dir': 'build',
          },

          bin: {                   
                    'db_connectionURI': '',
                    'ui_dir': 'bin',
          }
        };  
      return function(){
              grunt.file.copy('.config',  'config.js', {
                process: function ( contents, path ) {
                  return grunt.template.process( contents, {
                    data: destConfig[dest]
                  });
                }
              });
      }
    };


  grunt.registerTask('build', prepareConfig('build'));
  grunt.registerTask('bin', prepareConfig('bin'));


};
