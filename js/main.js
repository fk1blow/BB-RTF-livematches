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


require(['app/application', 'console']);