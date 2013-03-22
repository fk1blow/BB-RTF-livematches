requirejs.config({
  baseUrl: 'js',
  paths: {
    "lib": "lib",
    "app": "app",
    "views": "app/views",
    "controllers": "app/controllers",
    "templates": "app/templates",
    "models": "app/models",

    "console": "http://10.0.3.98:82/SKeeM/js/lib/console-wrapper",
    "skm": "http://10.0.3.98:82/SKeeM/js/lib/skm"
  }
});


// could transform to
// require(['app/application'])
// require(['console'], function() {
require(['console'], function() {
  var application = require(['app/application']);
  console.log('Required :: main.js');
});
