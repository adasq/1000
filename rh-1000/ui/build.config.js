
module.exports = {


  build_dir: '../src/ui/build',
  compile_dir: '../src/ui/bin',

  app_files: {
    js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
    jsunit: [ 'src/**/*.spec.js' ],
    
    coffee: [ 'src/**/*.coffee', '!src/**/*.spec.coffee' ],
    coffeeunit: [ 'src/**/*.spec.coffee' ],

    atpl: [ 'src/app/**/*.tpl.html' ],
    ctpl: [ 'src/common/**/*.tpl.html' ],

    html: [ 'src/index.html' ],
    less: 'src/less/main.less'
  },

  test_files: {
    js: [
      'vendor/angular-mocks/angular-mocks.js'
    ]
  },

  vendor_files: {
    js: [
      'vendor/jquery/dist/jquery.min.js',
      'vendor/bootstrap/dist/js/bootstrap.min.js',
      'vendor/angular/angular.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/underscore/underscore-min.js',
      'vendor/ngprogress/build/ngProgress.min.js',
      'vendor/d3/d3.js',
       'vendor/socket.io-client/socket.io.js',
      'vendor/angular-socket-io/socket.min.js',
      'vendor/moment/min/moment-with-locales.min.js'
    ],
    css: [
      
    ],
    assets: [
      'vendor/ngprogress/ngProgress.css'
    ]
  },
};
