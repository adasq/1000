module.exports = function ( grunt ) {

  

  var taskConfig = {
  	 traceur: {
    options: {
      // traceur options here
    },
    custom: {
      files: [{
        expand: true,
        cwd: 'src/js/es6',
        src: ['*.js'],
        dest: 'src/js/es5'
      }]
    },
  },
	 watch: {
	 	i: {
	    files: ['src/js/es6/init.js','src/index.html', 'src/css/style.less'],
	    tasks: ['less:development', 'traceur:custom'],
	    options: {
	    	livereload: true,
	      	spawn: false
	    },
	  }
	 },
	 less: {
	 	  development: {
		    options: {
		      paths: [""]
		    },
		    files: {
		      "src/css/style.css": "src/css/style.less"
		    }
		  }


	 }

  };

  grunt.initConfig(taskConfig);

  grunt.loadNpmTasks('grunt-traceur');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
