module.exports = function ( grunt ) {

  

  var taskConfig = {
	 watch: {
	 	i: {
	    files: ['src/js/*.js'],
	    tasks: ['browserify:dist'],
	    options: {
	    	livereload: true,
	      	spawn: false
	    },
	  },	  
	 },



browserify: {
  dist: {
    files: {
      'src/rpc-bundle.js': ['src/js/rpc.js'],
    },
    options: {      
    }
  }
}


  };




  grunt.initConfig(taskConfig);
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
