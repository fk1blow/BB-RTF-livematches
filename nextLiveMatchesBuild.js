
  
// SKM Core Object definition

define('skm/k/Object',[], function()
{



// Shorthand method
var slice = Array.prototype.slice;


/**
 * Extends a given object with a given
 * array of extension objects
 * 
 * @param  {Object} target Destination object
 */
var extend = function(target) {
  var ext = [].slice.call(arguments, 1);
  var i, prop, extension, extLen = ext.length;
  for (i = 0; i < extLen; i++) {
    extension = ext[i];
    for (prop in extension) {
      if (extension.hasOwnProperty(prop))
        target[prop] = extension[prop];
    }
  }
}


/**
 * Safer test for an Object
 * though it excludes null and Array
 * 
 * @param  {Mixed}  obj The object to test
 * @return {Boolean}     
 */
var isObject = function(obj) {
  return Object.prototype.toString.apply(obj) === '[object Object]';
}


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * @description Taken from google's closure library
 * @link http://closure-library.googlecode.com/svn/docs/closure_goog_base.js.source.html
 */
var inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.__super__ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  /** @override */
  childCtor.prototype.constructor = childCtor;
};


var SKMObject = function() {};


/**
 * Creates a constructor function based its prototype
 * to an SKMObject definition
 * 
 * @param  {Object} mixins     A list of zero or more Objects
 * that represent the definition of this constructor
 * @return {Function}  function  constructor function used as a 
 * template for the new SKMObject
 */
SKMObject.extend = function(mixins) {
  var args = slice.call(arguments);
  var parent = this, child = null;
  var i, argsLen = args.length, mixin;
  // Use the initialize function as a function constructor
  /*if ( extension && ( 'initialize' in extension ) ) {
    child = extension.initialize;
  } else {
    child = function() {
      parent.apply(this, arguments);
    }
  }*/
  child = function() {
    parent.apply(this, arguments);
  }

  // Establish the base prototype chain
  inherits(child, parent);

  // Add static methods directly to child
  // function constructor
  extend(child, parent);

  // Inject every extension Object to [this.prototype]
  // and see if the mixin is an Object
  for (i = 0; i < argsLen; i++) {
    if ( isObject(mixin = args[i]) )
      extend(child.prototype, mixin);
  }

  return child;
}

/**
 * Creates (instantiates) and object
 * based on [this]
 *
 * @param {Object} options A single object to be 
 * injected to the newly created object
 * @return {Object}
 */
SKMObject.create = function(options) {
  // Create the instance object of 'this' constructor
  var instance = new this();

  // Takes the object passed at create
  // and adds it, directly to the instance
  if ( arguments.length ) {
    extend(instance, options);
  }

  // Try to call the initialize function
  if ( typeof instance.initialize === 'function' ) {
    instance.initialize.apply(instance, arguments);
  }

  return instance;
}

/**
 * Merges [this.prototype] with an Object
 * or a function constructor's prototype
 */
SKMObject.mixin = function() {
  var i, mixin, len = arguments.length;
  for (i = 0; i < len; i++) {
    if ( isObject(mixin = arguments[i]) )
      extend(this.prototype, mixin);
  }
}


return SKMObject;


});



define('skm/util/Logger',['skm/k/Object'], function(SKMObject) {


/**
 * Logger singleton object
 * 
 * @description  Adds a convenient and safe method to use the console 
 * even in browser that don't support it
 * @author Paul Irish, linked from http://www.jquery4u.com/snippets/lightweight-wrapper-firebug-console-log/#.T-2xA-HWRhE
 */
Logger = SKMObject.extend({
	TYPE: 'Logger',

	_instance: null,

	_console: null,

	_enabled: true,

	initialize: function(options) {
	  this._prepareConsole();
	},

	_prepareConsole: function() {
	  this._console = window.console;
	  // if the browser does not support console(IE, mobiles, etc)
	  if(this.consoleUnavailable())
	    this._clearUndefinedConsole();
	},

	_clearUndefinedConsole: function() {
	  var c = this._console || {};
	  for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)c[a]=c[a] || function() {};
	  // is it safe?!
	  this._console = c;
	},

	disablePrinter: function() {
	  window.console = window.console || {};
	  var c = function(){};
	  for(var d="info,debug,error,log".split(","), a; a=d.pop();)
	    window.console[a]=c;
	  return true;
	},

	consoleUnavailable: function() {
	  return typeof (window.console !== 'undefined');
	},

	/* Now, for every console method, check if it's a function(Because IE that's why) */

	debug: function() {
	  if(typeof this._console.debug === 'function')
	    this._console.debug.apply(console, [].slice.call(arguments));
	},

	info: function() {
	  if(typeof this._console.info === 'function')
	    this._console.info.apply(console, [].slice.call(arguments));
	},

	warn: function() {
	  if(typeof this._console.warn === 'function')
	    this._console.warn.apply(console, [].slice.call(arguments));
	},

	error: function() {
	  if(typeof this._console.error === 'function')
	    this._console.error.apply(console, [].slice.call(arguments));
	}
});


return Logger;


});
/**
 * Break apart the Publish-Subcribe part of the Observable
 * and build two distinct modules:
 * 	1 - subscribable
 * 	2 - observable
 *
 * #1 Subscribable
 * - basic pub/sub mechanism
 *
 * #2 Observable
 * - ability to observe object properties
 */

define('skm/util/Subscribable',[], function()
{



/**
 * Event/Subscribable Mixin
 * 
 * @author Jeremy Ashkenas, DocumentCloud Inc
 * @link http://documentcloud.github.com/backbone/
 */
 
 
var eventSplitter = /\s+/;


// Implement fancy features of the Events API such as multiple event
// names `"change blur"` and jQuery-style event maps `{change: action}`
// in terms of the existing API.
var eventsApi = function(obj, action, name, rest) {
  if (!name) return true;
  if (typeof name === 'object') {
    for (var key in name) {
      obj[action].apply(obj, [key, name[key]].concat(rest));
    }
  } else if (eventSplitter.test(name)) {
    var names = name.split(eventSplitter);
    for (var i = 0, l = names.length; i < l; i++) {
      obj[action].apply(obj, [names[i]].concat(rest));
    }
  } else {
    return true;
  }
};


// Optimized internal dispatch function for triggering events. Tries to
// keep the usual cases speedy (most Backbone events have 3 arguments).
var triggerEvents = function(events, args) {
  var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
  switch (args.length) {
  case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx);
  return;
  case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1);
  return;
  case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2);
  return;
  case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
  return;
  default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
  }
};


var Subscribable = {
	// Bind one or more space separated events, or an events map,
  // to a `callback` function. Passing `"all"` will bind the callback to
  // all events fired.
  on: function(name, callback, context) {
    if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
    this._events || (this._events = {});
    var events = this._events[name] || (this._events[name] = []);
    events.push({callback: callback, context: context, ctx: context || this});
    return this;
  },

  // Bind events to only be triggered a single time. After the first time
  // the callback is invoked, it will be removed.
  once: function(name, callback, context) {
    if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
    var self = this;
    var once = _.once(function() {
      self.off(name, once);
      callback.apply(this, arguments);
    });
    once._callback = callback;
    return this.on(name, once, context);
  },

  // Remove one or many callbacks. If `context` is null, removes all
  // callbacks with that function. If `callback` is null, removes all
  // callbacks for the event. If `name` is null, removes all bound
  // callbacks for all events.
  off: function(name, callback, context) {
    var retain, ev, events, names, i, l, j, k;
    if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
    if (!name && !callback && !context) {
      this._events = {};
      return this;
    }

    names = name ? [name] : _.keys(this._events);
    for (i = 0, l = names.length; i < l; i++) {
      name = names[i];
      if (events = this._events[name]) {
        this._events[name] = retain = [];
        if (callback || context) {
          for (j = 0, k = events.length; j < k; j++) {
            ev = events[j];
            if ((callback && callback !== ev.callback &&
                             callback !== ev.callback._callback) ||
                (context && context !== ev.context)) {
              retain.push(ev);
            }
          }
        }
        if (!retain.length) delete this._events[name];
      }
    }

    return this;
  },

  // Trigger one or many events, firing all bound callbacks. Callbacks are
  // passed the same arguments as `trigger` is, apart from the event name
  // (unless you're listening on `"all"`, which will cause your callback to
  // receive the true name of the event as the first argument).
  fire: function(name) {
    if (!this._events) return this;
    var args = [].slice.call(arguments, 1);
    if (!eventsApi(this, 'trigger', name, args)) return this;
    var events = this._events[name];
    var allEvents = this._events.all;
    if (events) triggerEvents(events, args);
    if (allEvents) triggerEvents(allEvents, arguments);
    return this;
  },

  // Tell this object to stop listening to either specific events ... or
  // to every object it's currently listening to.
  stopListening: function(obj, name, callback) {
    var listeners = this._listeners;
    if (!listeners) return this;
    if (obj) {
      obj.off(name, typeof name === 'object' ? this : callback, this);
      if (!name && !callback) delete listeners[obj._listenerId];
    } else {
      if (typeof name === 'object') callback = this;
      for (var id in listeners) {
        listeners[id].off(name, callback, this);
      }
      this._listeners = {};
    }
    return this;
  }
};


return Subscribable;


});


// Simple Timer object

define('skm/util/Timer',['skm/util/Logger',
  'skm/util/Subscribable',
  'skm/k/Object'], function(SKMLogger, Subscribable, SKMObject)
{


var Logger = SKMLogger.create();


/**
 * Timer object that provides an easy and a more manageable
 * way to use intervals/cycles
 * 
 * @description Because some critical modules will use Timers,
 * i had to borrow much of the logic from google closure's timer.
 * @link http://closure-library.googlecode.com/svn/docs/closure_goog_timer_timer.js.html
 */
Timer = SKMObject.extend(Subscribable, {
  // How many times the interval will
  // trigger a tick; (x < 1) == infinity
  ticks: 1,

  // The interval at which a tick is being triggered
  tickInterval: 1000,

  // If the timer is active or not
  enabled: false,

  _intervalScale: 0.8,

  // Timer object reference
  _timerObject: null,

  // How many time the timer has fired a "tick" event
  _tickCounter: 0,

  _lastTickTime: 0,

  initialize: function() {
    this._timerObject = null;
  },

  /**
   * Commands
   */

  start: function() {
    var that = this;
    this.enabled = true;
    // Start only if the timerObject is not assigned(or null)
    if ( !this._timerObject ) {
      this._tickCounter = 0;
      this._timerObject = setTimeout(function() {
        that._tickTack();
      }, this.tickInterval);
      this._lastTickTime = this.now();
    }
    return this;
  },

  stop: function() {
    this.enabled = false;
    var lastTickCounter = this.getTicksCounter();
    this._tickCounter = 0;
    if ( this._timerObject ) {
      clearTimeout(this._timerObject);
      this._timerObject = null;
    }
    return this;
  },

  /**
   * Handlers
   */

  handleTick: function(ticks) {
    this.fire('tick', ticks);
  },

  /**
   * Getters/Setters
   */

  getTicks: function() {
    if ( this.ticks < 0 ) {
      return 0;
    } else {
      return this.ticks;
    }
  },

  setTicks: function(val) {
    if ( typeof val !== 'number' ) {
      val = 1;
    }
    this.ticks = val;
  },

  getTicksCounter: function() {
    return this._tickCounter;
  },

  now: function() {
    return (new Date()).getTime();
  },

  /**
   * Private
   */

  _tickTack: function() {
    if ( this.enabled ) {
      var that = this, elapsed, notSynced;
      // Stop if reached maximum ticks set
      if ( this._maxTicksReached() ) {
        this.stop();
        return;
      }
      // Synchronize the interval with the elapsed time
      // @see closure-library.googlecode.com/svn/docs/closure_goog_timer_timer.js.html
      elapsed = this.now() - this._lastTickTime;
      notSynced = elapsed > 0 && elapsed < (this.tickInterval * this._intervalScale);
      if ( notSynced ) {
        this._timerObject = setTimeout(function() {
          that._tickTack();
        }, this.tickInterval - elapsed);
        return;
      }
      // Handle the ticks and increment internal counter
      this.handleTick.call(this, this.getTicksCounter());
      this._tickCounter++;
      // In goog.timer, this re-check is required becase a timer may be
      // stopped between a tick so that [this.enabled] could be reset
      if ( this.enabled ) {
        this._timerObject = setTimeout(function() {
          that._tickTack();
        }, this.tickInterval);
        this._lastTickTime = this.now();
      }
    }
  },

  _maxTicksReached: function() {
    if ( this.getTicks() === 0 ) {
      return false;
    } else {
      return this._tickCounter >= this.getTicks();
    }
  }
});


return Timer;


});
// SKM WebSocketWrapper implementation

define('skm/net/WSNativeWrapper',['skm/k/Object',
  'skm/util/Logger'], function(SKMObject, SKMLogger)
{


  
var Logger = SKMLogger.create();


var ErrorMessages = {
  UNAVAILABLE: 'WebSockets implementation is unavailable.',
  NATIVE_IMPLEMENTATION_MISSING: 'Native implementation not found.',
  MISSSING_URL: 'The url param of the WebSocket constructor is mandatory.',
  SOCKET_ALREADY_OPENED: 'Seems that another socket is already opened.'
};


var NoNativeImplementation = 'No native WebSocket implementation found;'
+ ' WebSocket not available!';


var WSNativeWrapper = SKMObject.extend({
  _socket: null,

  initialize: function() {
    Logger.debug('%cnew WSNativeWrapper', 'color:#A2A2A2');
    this._socket = null;
  },

  getProperConstructor: function() {
    var c = null;
    if ('WebSocket' in window)
      c = WebSocket;
    else if ('MozWebSocket' in window)
      c = MozWebSocket;
    return c;
  },

  getNativeConstructor: function() {
    var ctor = this.getProperConstructor();
    if ( ctor === null ) {
      Logger.debug('%cWSNativeWrapper.getNativeConstructor : '
        + NoNativeImplementation, 'red');
    }
    return ctor;
  },

  createSocket: function(url, protocols) {
    // Logger.info('WSNativeWrapper.createSocket');
    var c = this.getNativeConstructor();
    // If no native implementation found, return null
    if ( c == null )
      return c;
    if ( !arguments.length )
      throw new TypeError(ErrorMessages.MISSSING_URL);
    this._socket = (protocols) ? new c(url, protocols) : new c(url);
    return this._socket;
  },

  destroySocket: function() {
    // Logger.info('WSNativeWrapper.destroySocket');
    if ( !this._socket )
      return false;
    this._socket.close();
    this._socket = null;
    return true;
  },

  getConnectionState: function() {
    if ( this._socket )
      return this._socket.readyState;
    return null;
  },

  getSocketObject: function() {
    return this._socket;
  }
});


return WSNativeWrapper;


});


// SKM WebSocketHandler implementation

define('skm/net/WSHandler',['skm/k/Object',
  'skm/util/Logger',
  'skm/util/Subscribable',
  'skm/util/Timer'], function(SKMObject, SKMLogger, Subscribable, SKMTimer)
{


  
var Logger = SKMLogger.create();


/**
 * WebSocket Message Handler
 *
 * @description this object could be used as a Mixin
 * or as a Delegates object.
 * Or it could expose some methods that will be called
 * in the context of the WSDelegatesHandler or added
 * as a mixin Object.
 * @type {Object}
 */
var WrapperMessageDelegates = {
  handleOnClose: function(event) {
    Logger.info('WrapperMessageDelegates.handleOnClose');
    Logger.debug('wasClean, code, reason : ', event.wasClean, event.code, event.reason);

    // stop all timers
    this._stopTimers();
    // If  socket connection is closed by the server
    if ( event.wasClean ) {
      this._isReconnecting = false;
      this.fire('link:closed', event);
    } else {
      if ( this._closeExpected ) {
        Logger.info('Close expected/invoked. Nothing more to do');
        // should inform the DelegatesHandler about this state change
        this._isReconnecting = false;
      } else {
        this._makeReconnectAttempt();
      }
      this.fire('connecting:stopped');
    }
    this._closeExpected = false;
  },

  handleOnOpen: function() {
    Logger.info('WrapperMessageDelegates.handleOnOpen');
    this._stopTimers();
    this._reconnectionAttempt = 0;
    this.fire('link:opened');
  },

  handleOnError: function(event) {
    // Logger.info('WrapperMessageDelegates : Socket error');
    this.fire('error', event);
  },
 
  handleOnMessage: function(message) {
    var data = message.data;
    switch( data ) {
      case 'server:pong':
        this.fire('server:pong');
        break;
      // case 'server:close':
      //   this.fire('server:close');
      //   break;
      default:
        this.fire('message', data);
    }
  }
};


/**
 * Object that handle a WebSocket connection's events and state
 */
var WSHandler = SKMObject.extend(Subscribable, WrapperMessageDelegates, {
  connectionTimeout: 1500,

  reconnectDelay: 3000,

  maxReconnectAttempts: 5,

  _timerAutoDisconnect: null,

  _timerAutoReconnect: null,

  _reconnectionAttempt: 0,

  _closeExpected: false,

  _isReconnecting: false,

  initialize: function() {
    Logger.debug('%cnew WSHandler', 'color:#A2A2A2');
    // Creates auto-disconnect and reconnect, timers
    this._createTimers();
  },

  /**
   * Attaches the socket events to a handler
   * @param  {WebSoclet} connection WebSocket connection reference
   */
  attachListenersTo: function(connection) {
    var that = this;
    connection.onopen = function() {
      that.handleOnOpen.apply(that, arguments);
    }
    connection.onerror = function() {
      that.handleOnError.apply(that, arguments);
    }
    connection.onclose = function() {
      that.handleOnClose.apply(that, arguments);
    }
    connection.onmessage = function() {
      that.handleOnMessage.apply(that, arguments);
    }
    return this;
  },

  /**
   * Queries/Commands
   */
  
  isReconnecting: function() {
    return this._isReconnecting;
  },

  startConnectingAttempt: function() {
    Logger.info('WSHandler.startConnectingAttempt');
    this._timerAutoDisconnect.start();
    this._closeExpected = false;
    return this;
  },

  stopConnectingAttempt: function() {
    Logger.info('WSHandler.stopConnectingAttempt');
    this._stopTimers();
    this._closeExpected = true;
    return this;
  },

  holdConnectingAttempt: function() {
    Logger.info('WSHandler.holdConnectingAttempt');
    this._stopTimers();
    this._closeExpected = false;
    return this;
  },

  /**
   * Private
   */
  
  _stopTimers: function() {
    this._timerAutoDisconnect.stop();
    this._timerAutoReconnect.stop();
  },
  
  _handleAutoDisconnect: function() {
    Logger.debug('auto-disconnected after ' +
      this._timerAutoDisconnect.tickInterval + ' ms');
    this.fire('connecting:timeout');
  },
  
  _handleAutoReconnect: function() {
    Logger.debug('autoreconnect attempt #', this._reconnectionAttempt);
    this._stopTimers();
    this._closeExpected = false;
    this.fire('reconnecting:started');
  },
  
  _createTimers: function() {
    // Stops the connecting attempt after specified interval
    this._timerAutoDisconnect = SKMTimer.create({
      tickInterval: this.connectionTimeout
    }).on('tick', this._handleAutoDisconnect, this);

    // Tries to reconnect after a specified delay
    this._timerAutoReconnect = SKMTimer.create({
      tickInterval: this.reconnectDelay
    }).on('tick', this._handleAutoReconnect, this);
  },

  _makeReconnectAttempt: function() {
    if ( this._reconnectionAttempt > this.maxReconnectAttempts - 1 ) {
      Logger.info('WebSocketHandler Max reconnection attempts reached');
      this._reconnectionAttempt = 0;
      this._isReconnecting = false;
      this.fire('reconnecting:stopped');
    } else {
      Logger.info('WebSocketHandler will try to reconnect in ' + 
        this._timerAutoReconnect.tickInterval + ' ms');
      this._isReconnecting = true;
      this._reconnectionAttempt++;
      this._timerAutoReconnect.start();
    }
  }
});


return WSHandler;


});

// SKM WebSocket implementation

define('skm/net/WSWrapper',['skm/k/Object',
  'skm/util/Logger',
  'skm/util/Subscribable',
  'skm/util/Timer',
  'skm/net/WSNativeWrapper',
  'skm/net/WSHandler'],
  function(SKMObject, SKMLogger, Subscribable,
    SKMTimer, WSNativeWrapper, WSHandler)
{



var Logger = SKMLogger.create();


var WebsocketStates = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
};


var iDevice = function() {
  return typeof navigator !== 'undefined'
    && /iPad|iPhone|iPod/i.test(navigator.userAgent);
}


var HandlerEventDelegates = {
  _attachConnectionEvents: function() {
    var connection = this._connectionHandler;

    /**
     * Connecting handlers
     */
    
    // Connecting timeout triggered
    connection.on('connecting:timeout', function() {
      this._startReconnecting();
      this.fire('connecting:timeout');
    }, this);

    // A connecting attempt stopped
    connection.on('connecting:stopped', function() {
      this.fire('connecting:stopped');
    }, this);

    // One reconnecting cycle started
    connection.on('reconnecting:started', function() {
      this._startConnecting();
      this.fire('reconnecting:started');
    }, this);

    // When maximum reconnecting attempts reached
    connection.on('reconnecting:stopped', function() {
      this._stopConnecting();
      this.fire('reconnecting:stopped');
    }, this);

    /**
     * Link handlers
     */

    connection.on('link:opened', function() {
      this.fire('link:opened');
      this._initPingTimer();
    }, this)
    .on('link:closed', function(evt) {
      this._stopConnecting();
      this.fire('link:closed', evt);
    }, this);

    /**
     * Message and pong listeners
     */

    connection.on('message', function(message) {
      if ( message == 'pong' )
        Logger.debug('%cWSWrapper :: pong', 'color:blue');
      else
        this.fire('message', message);
    }, this)


    /**
     * Error handler
     */

    connection.on('error', function() {
      this.fire('error');
    }, this);
  }
}


var WSWrapper = SKMObject.extend(Subscribable, HandlerEventDelegates, {
  /**
   * URL of the WebSocket server
   * @type {String}
   */
  url: null,

  /**
   * TBD
   * @type {Array}
   */
  protocols: null,

  /**
   * How long before aborting the connection attempt
   */
  timeout: 1500,

  /**
   * Amount of time, before trying to reconnect
   */
  reconnectDelay: 3000,

  /**
   * The number of times will attempt to reconnect
   */
  reconnectAttempts: 1,

  /**
   * If will try to ping the server or not
   */
  pingServer: true,

  /**
   * The interval at which will send pings to the server
   */
  pingInterval: 10 * 1000, // 10 seconds

  /**
   * Similar to Socket.IO's "sync disconnect on unload"
   * @todo add actual implementation
   * @type {Boolean}
   */
  syncDisconnectOnUnload: true,

  /**
   * The native wrapper implementation object
   * @type {WSNativeWrapper}
   * @private
   */
  _nativeWrapper: null,

  /**
   * Event handler/delegate object
   * @type {WSHandler}
   * @private
   */
  _connectionHandler: null,

  _timerPing: null,

  initialize: function() {
    Logger.debug('%cnew WSWrapper', 'color:#A2A2A2');
    this._timerPing = Timer.create({ tickInterval: this.pingInterval, ticks: 0 });
    this._timerPing.on('tick', this.ping, this);
    this._initNativeWrapper();
    this._initConnectionHandler();
  },

  /**
   * Public
   */

  connect: function() {
    if ( this.isOpened() ) {
      Logger.error('WebSocket already open.');
      return false;
    }
    if ( this.isReconnecting() ) {
      Logger.error('WebSocket already trying to reconnect.');
      return false;
    }
    this._startConnecting();
    return this;
  },

  disconnect: function() {
    Logger.info('WebSocket disconnect.');
    this._stopConnecting();
  },

  send: function(message) {
    var socketObject = this._nativeWrapper.getSocketObject();
    // If the socket is not ready or not created yet
    if ( socketObject === null || !this.isOpened() ) {
      Logger.info('Unable to send message; invalid socket ' +
                  'wrapper state or connection not yet opened.');
      return;
    }
    // Wrap inside a timeout if iDevice browser detected
    if ( iDevice ) {
      setTimeout(function() {
        socketObject.send(message);
      }, 0);
    } else {
      socketObject.send(message);
    }
    return this;
  },

  /**
   * @todo Refactor conditions
   */
  ping: function() {
    if ( ! this.isOpened() ) {
      Logger.info('Cannot ping server. WebSocket connection is closed.');
      this._timerPing.stop();
      return false;
    }
    Logger.debug('%cWSWrapper :: ping', 'color:green');
    this.send('ping');
    return this;
  },

  /**
   * Queries
   */

  isConnecting: function() {
    return this._nativeWrapper.getConnectionState() === 0;
  },

  isOpened: function() {
    return this._nativeWrapper.getConnectionState() === 1;
  },

  isClosing: function() {
    return this._nativeWrapper.getConnectionState() === 2;
  },

  isClosed: function() {
    return this._nativeWrapper.getConnectionState() === 3;
  },

  isReconnecting: function() {
    return this._connectionHandler.isReconnecting();
  },

  /**
   * Private
   */
  
  _startConnecting: function() {
    var socket = this._nativeWrapper.createSocket(this.url, this.protocols);
    if ( socket == null )
      this.fire('implementation:missing')._stopConnecting();
    else {
      this._connectionHandler
        .attachListenersTo(socket)
        .startConnectingAttempt();
    }
  },

  _stopConnecting: function() {
    this._connectionHandler.stopConnectingAttempt();
    this._nativeWrapper.destroySocket();
  },

  _startReconnecting: function() {
    this._connectionHandler.holdConnectingAttempt();
    this._nativeWrapper.destroySocket();
  },

  _initPingTimer: function() {
    if ( !this.pingServer )
      return false;
    // if timer is not enabled, only then try to (re)start it
    if ( !this._timerPing.enabled ) {
      Logger.info('Ping started.');
      this._timerPing.start();
    }
  },

  _initNativeWrapper: function(url, protocols) {
    this._nativeWrapper = WSNativeWrapper.create();
  },

  _initConnectionHandler: function() {
    this._connectionHandler = WSHandler.create({
      connectionTimeout: this.timeout,
      reconnectDelay: this.reconnectDelay,
      maxReconnectAttempts: this.reconnectAttempts
    });
    // Disconnect and auto reconnect bindings
    this._attachConnectionEvents();
  }
});


return WSWrapper;


});


// XHR Wrapper implementation

define('skm/net/XHRWrapper',['skm/k/Object',
  'skm/util/Logger',
  'skm/util/Subscribable'],
  function(SKMObject, SKMLogger, Subscribable)
{



var Logger = SKMLogger.create();


var DefaultLibraryWrapper = window.jQuery || null;


// The XHR wrapper that will use
// Usually, this wrapper will be for jQuery's $.ajax method
// Direct reference to the Library that will provide the ajax api
var LibraryConfig = {
	wrapper: null,
	ajax: null,
	get: null,
	post: null
}


var XHRMessageDelegates = {
	handleOnComplete: function() {
		Logger.info('XHRWrapper.handleOnComplete');
		this._expectedClose = false;
		this.fire('complete');
	},

	handleOnSuccess: function(msg) {
		Logger.info('XHRWrapper.handleOnSuccess', msg);
		this._expectedClose = false;
		this.fire('success', msg);
	},

	handleOnError: function(err) {
		if ( ! this._expectedClose ) {
			Logger.info('XHRWrapper.handleOnError');
			this._expectedClose = false;
			this.fire('error', err);
		}
	}
}


var XHRWrapper = SKMObject.extend(Subscribable, XHRMessageDelegates, {
	/**
	 * Server url
	 * @type {String}
	 */
	url: null,

	httpMethod: 'POST',

	dataType: 'JSON',

	_wrapper: null,

	_request: null,

	_expectedClose: false,

	initialize: function() {
		Logger.debug('%cnew XHRWrapper', 'color:#A2A2A2');
		this._wrapper = LibraryConfig.wrapper || DefaultLibraryWrapper;
		this._request = null;
	},

	/**
	 * Sends a message through the AJAX connection
	 * using default method type - 'GET'
	 * @param  {Object} messageObj the message to be sened
	 */
	sendMessage: function(message) {
		Logger.info('XHRWrapper.send');
		this._doRequest(message);
		return this;
	},

	/**
	 * Send a message using a GET request
	 * @param  {Object} messageObj the message to be sened
	 */
	sendGetRequest: function(message) {
		Logger.info('XHRWrapper.sendGetRequest');
		this._doRequest(message, { httpMethod: 'GET' });
		return this;
	},

	/**
	 * Sends a message using a POST request
	 * @param  {Object} messageObj the message to be sened
	 */
	sendPostRequest: function(message) {
		Logger.info('XHRWrapper.sendPostRequest');
		this._doRequest(message, { httpMethod: 'POST' });
		return this;
	},

	/**
	 * Aborts a in-progress request
	 * @param  {Boolean} triggersError Should trigger error
	 * callback or not - [this._expectedClose]
	 */
	abortRequest: function(triggersError) {
		// if triggers error is true, it will trigger the error event
		if ( triggersError === true )
			this._expectedClose = false;
		// Set expected close, only it aborts the connection
		if ( this._request != null ) {
			this._expectedClose = true;
			this._request.abort();
		}
		// nullifies the request object
		this._resetRequestObject();
	},

	/**
	 * Sends an Ajax request, using the provided adapter
	 * @param  {Object} options an object used for
	 * AJAX setting(method, url, type, etc)
	 */
	_doRequest: function(messageData, options) {
		var opt = options || {};
		var methodType = opt.httpMethod || this.httpMethod;
		var dataType = this.dataType;

		// Abort the request if there is one in progress
		this.abortRequest();

		this._request = this._wrapper.ajax({
			url: this.url,

			context: this,

			type: methodType,

			// The type of data that you're expecting back from the server
			dataType: dataType,

			// Data to be sent to the server
			// data: JSON.stringify({ 'params': { a: 'a', b: 'b' } }),
			
			// data: { params: JSON.stringify(messageData) },

			data: messageData,

			// data: {
			// 	'subscribe':'{test,detail}',
			// 	'params':'{test:{eu:10}}' 
			// },

			error: function (err) {
				this.handleOnError(err);
			},

			complete: function(msg) {
				this._resetRequestObject();
				this.handleOnComplete(msg);
			},

			success: function(msg) {
				this.handleOnSuccess(msg);
			}
		});
	},

	_resetRequestObject: function() {
		if ( this._request !== null )
			this._request = null;
	}
});


// return {
// 	Config: LibraryConfig,
// 	Wrapper: XHRWrapper
// };


/**
 * Temporarely hardcoded
 */
return XHRWrapper;


});
// Connector Manager implementation

define('skm/rtf/ConnectorManager',['skm/k/Object',
  'skm/util/Logger',
  'skm/util/Subscribable'],
  function(SKMObject, SKMLogger, Subscribable)
{



var Logger = SKMLogger.create();


var ManagerDelegates = {
  handleConnectorDeactivated: function() {
    Logger.debug('%cManagerDelegates connector:deactivated!', 'color:red');
    this.fire('deactivated');
    this._stopCurrentSequence();
    this._startNextSequence();
  },

  handleConnectorError: function(error) {
    Logger.debug('%cManagerDelegates api:error', 'color:red', error);
    this.fire('stopped');
    this._stopCurrentSequence();
  },

  handleConnectorUpdate: function(message) {
    Logger.debug('%cManagerDelegates api:update', 'color:green', message);
    this.fire('update', message);
  }
}


var Manager = SKMObject.extend(Subscribable, ManagerDelegates, {
  /**
   * List of connector object instances
   * @type {Object Connector}
   */
  _connectors: null,

  /**
   * Reference to the currently/primary used
   * connector instance
   * 
   * @type {Object Connector}
   */
  _activeConnector: null,

  /**
   * Reference to active sequence index
   * @type {Array}
   */
  _activeSequenceIdx: 0,

  /**
   * State of the rtf
   * @type {Boolean}
   */
  started: false,

  /**
   * The default sequence of the connectors
   * @type {Array}
   */
  sequence: [
    'WebSocket', 'XHR'
  ],


  initialize: function() {
    this._connectors = null;
    this._activeConnector = null;
  },


  /**
   * Starts the connectors [beginUpdate]
   * and creates the transports available
   */
  startConnectors: function() {
    Logger.info('ConnectorManager.startConnectors');
    this._startInitialSequence();
    this.started = true;
  },

  /**
   * Stops all connectors
   * 
   * @todo stop all connectors and clear all transport
   * instances - destroy
   */
  stopConnectors: function() {
    Logger.info('ConnectorManager.stopConnectors');
    this._stopCurrentSequence();
    this._activeConnector = null;
    this.started = false;
  },

  /**
  * Pauses the sequence and doesn't
  * modify sequence index
  */
  pauseConnectors: function() {},

  /**
  * Resumes the sequence, not altered
  * since the pause
  */
  resumeConnectors: function() {},
  
  /**
   * Switches to the next connector in sequence
   * 
   * @description Currently, it doesn't go around the tail
   * of the list and stops at the last sequence
   */
  switchToNextConnector: function() {
    Logger.info('ConnectorManager.switchToNextConnector');
    this._stopCurrentSequence();
    this._startNextSequence();
  },

  /**
   * Returns the active connector
   * @return {Object} connector instance
   */
  getActiveConnector: function() {
    return this._activeConnector;
  },

  /**
   * Returns a connector from the connectors list
   * @param  {String} type name of the connector
   * @return {Object}      connector instance
   */
  getConnector: function(type) {
    return this._connectors[type];
  },

  /**
   * Registers a connector instance
   * @param  {String} name      connector's name
   * @param  {Object} connector an object representing the instance
   */
  registerConnector: function(type, connector) {
    this._connectors = this._connectors || {};
    if ( type in this._connectors ) {
      throw new Error('ConnectorManager.registerConnector :: '
        + ' connector already registered : ' + type);
    }
    return this._connectors[type] = connector;
  },

  /**
   * Connectors list iterator
   * 
   * @param  {Function} callback handler of iteration
   * @param  {Object}   context  context object in which
   * handler is being called
   */
  eachConnector: function(callback, context) {
    var connector, list = this._connectors;
    for ( connector in list ) {
      callback.call(context || this, list[connector]);
    }
  },

  /**
   * Sends a message through a connector
   * @param  {Mixed} message a string or plain json of
   * the message sent to the server
   * @param {JSON} optData an object containing additional
   * parameters sent to the connector - wrapper
   */
  sendMessage: function(message) {
    var connector;
    if ( connector = this.getActiveConnector() )
      connector.sendMessage(message);
    else {
      Logger.info('ConnectorManager.sendMessage : invalid connector type' + 
        ' or connector is null');
    }
    return this;
  },


/**
   * Private
   */
  

   /**
    * Starts the initial update sequence
    * when the connectors is at 0(zero) index
    */
  _startInitialSequence: function() {
    var list = this._connectors;
    this._activeSequenceIdx = 0;
    var nextConnector;
    
    if ( list === null || ( list && ! ( this.sequence[0] in list ) ) ) {
      Logger.info('%cConnectorManager : connector list is empty or null',
        'color:red');
      this.started = false;
      return;
    }

    this.fire('before:initialSequence');

    this._activeConnector = list[this.sequence[0]];
    this._startConnector(this._activeConnector);

    this.fire('after:initialSequence');
  },

  /**
   * Gets the next connector in sequence
   * and starts the update
   */
  _startNextSequence: function() {
    Logger.debug('%cConnectorManager : starting next sequence', 'color:green');

    // tell that a next sequence is about the be started
    this.fire('before:nextSequence');

    this._activeSequenceIdx = this._getNextSequence();
    this._activeConnector = this._connectors[this._activeSequenceIdx];

    if ( this._activeConnector != undefined ) {
      this._startConnector(this._activeConnector);
    } else {
      Logger.debug('%ccConnectorManager : sequence complete!', 'color:red');
      this._activeConnector = null;
      this.started = false;
    }

    this.fire('after:nextSequence');
  },

  /**
   * Stops the current sequence and end update
   */
  _stopCurrentSequence: function() {
    Logger.debug('%cConnectorManager : ' + 
      'stopping current sequence', 'color:green');
    // Remove events and end update
    if ( this._activeConnector ) {
      this._activeConnector.off().endUpdate();
      this._activeConnector = null;
    }
  },

  /**
   * Return the next sequence of connector to use
   */
  _getNextSequence: function() {
    return this.sequence[this._activeSequenceIdx + 1];
  },

  _startConnector: function(connector) {
    this.fire('before:startConnector');

    // Stop current connectors and start next one
    connector.on('connector:deactivated', this.handleConnectorDeactivated, this);

    // Stop and clean current connector
    connector.on('api:error', this.handleConnectorError, this);

    // notify of update...
    connector.on('api:update', this.handleConnectorUpdate, this);

    // Begin update connector
    connector.beginUpdate();

    this.fire('after:startConnector');
  }
});


return Manager;


});


// Base Connector implementation

define('skm/rtf/BaseConnector',['skm/k/Object',
  'skm/util/Logger',
  'skm/util/Subscribable'],
  function(SKMObject, SKMLogger, Subscribable)
{



var Logger = SKMLogger.create();


var ConnectorState = {
  ACTIVE: 1,
  INACTIVE: 0,
  STOPPED: -1
}


/**
 * Abstract connector
 */
var Connector = SKMObject.extend(Subscribable, {
  /**
   * Transport type object
   * @type {WSWrapper, XHRWrapper} an instance of a Transport type
   */
  transport: null,

  /**
   * Base url for the given transport
   * @type {String}
   */
  urlBase: null,

  /**
   * Object that models the url and 
   * its parameters
   * @type {Object}
   */
  urlParamModel: null,

  initialize: function() {
    console.log('%cnew Connector', 'color:#a2a2a2');
    this.urlParamModel.on('added altered removed', this.buildTransportUrl, this);
  },

  /**
   * @abstract
   * 
   * Begins update by opening the transport's connection
   */
  beginUpdate: function() {},

  /**
   * @abstract
   *
   * Stops updates for this transport by aborting connection
   */
  endUpdate: function() {},

  /**
   * @abstract
   * 
   * Sends a message to the RTF server
   */
  sendMessage: function(message) {},

  /**
   * @abstract
   * 
   * Listens to transport events
   */
  addTransportListeners: function() {},

  /**
   * @abstract
   *
   * Removes transport listeners
   */
  removeTransportListeners: function() {
    this.transport.off();
    return this;
  },

  /**
   * Adds a transport type object
   * instance of Transport type and listens
   * to various events
   */
  addTransport: function(transportObject) {
    if ( this.transport == null ) {
      this.transport = transportObject;
      this.addTransportListeners();
    } else {
      throw new Error('Connector.addTransport : ' + 
        'transport object already exists');
    }
    return this;
  },

  /**
   * Destroys the object
   * @description nullifies every field
   * and removes any events bound to that particular field
   */
  destroy: function() {
    this.removeTransportListeners();
    this.transport = null;
    this.urlParamModel = null;
  },

  /**
   * Builds the transport utl, based on
   * urlParams and urlBase fields
   */
  buildTransportUrl: function() {
    // console.log('%cConnector.buildTransportUrl : ', 'color:red', this._typeName);
    var qs = this.urlParamModel.toQueryString();
    this.transport.url = this.urlBase + qs;
  }
});


return Connector;


});

// RTF XHR Connector implementation

define('skm/rtf/XHRConnector',['skm/k/Object',
  'skm/util/Logger',
  'skm/rtf/BaseConnector'],
  function(SKMObject, SKMLogger, BaseConnector)
{



var Logger = SKMLogger.create();


var ConnectorErrors = {
  INACTIVE: 'Innactive connection',
  LIST_TO_BIG: 'Confirmation Message Sent list is too big',
  READY_LIST_TO_BIG: 'Ready To send Message list is too big'
}


var XHRConnector = BaseConnector.extend({
  _typeName: 'XHR',

  beginUpdate: function() {
    this.buildTransportUrl();
    Logger.debug('XHRConnector.beginUpdate\n', this.transport.url);
    // this.addTransportListeners();
    this.transport.sendMessage();
    return this;
  },

  endUpdate: function() {
    Logger.debug('XHRConnector.endUpdate');
    // disconnect and remove events
    this.transport.abortRequest();
    // this.removeTransportListeners();
    return this;
  },

  addTransportListeners: function() {
    this.transport
      .on('error', this.handleError, this)
      .on('success', this.handleReceivedMessage, this);
    return this;
  },


  /*
    Message senders
   */
  

  sendMessage: function(msg) {
    Logger.debug('%cXHRConnector.sendMessage : ', 'color:red', msg);
    this.buildTransportUrl();
    this.transport.sendMessage(msg);
  },

  
  /*
    Handlers
  */
  

  /**
   * Handles a message received from server api
   *
   * @description handles the server's update message
   * and passes it to the subscribers/clients of rtf api
   * 
   * @param  {Object} message JSON message send by rtf server api
   */
  handleReceivedMessage: function(message) {
    Logger.info('XHRConnector.handleReceivedMessage');
    this.fire('api:update', message);
  },

  /**
   * Handles xhr connection error
   *
   * @description triggered when the transport cannot
   * connect to the host url or when the server
   * closes a connection giving a reason as the "405" status code
   * 
   * @param  {[type]} err JSON message representing the reason
   */
  handleError: function(err) {
    Logger.info('XHRConnector.handleError');
    // If server triggers errors
    if ( err.status == 405 ) {
      this.fire('api:error', err.responseText);
    } else {
      this.fire('connector:deactivated');
    }
  }
});


return XHRConnector;


});

// RTF WebSocket Connector implementation

define('skm/rtf/WSConnector',['skm/k/Object',
  'skm/util/Logger',
  'skm/rtf/BaseConnector'],
  function(SKMObject, SKMLogger, BaseConnector)
{



var Logger = SKMLogger.create();


var ConnectorErrors = {
  INACTIVE: 'Innactive connection',
  LIST_TO_BIG: 'Confirmation Message Sent list is too big',
  READY_LIST_TO_BIG: 'Ready To send Message list is too big'
}



// should be implemented by every connector
var ConnectorDecisionDelegate = {}


var WebSocketConnector = BaseConnector.extend({
  _typeName: 'WS',

  beginUpdate: function() {
    this.buildTransportUrl();
    Logger.debug('WebSocketConnector.beginUpdate\n', this.transport.url);
    // this.addTransportListeners();
    this.transport.connect();
    return this;
  },

  endUpdate: function() {
    Logger.debug('WebSocketConnector.endUpdate');
    // disconnect and remove events
    this.transport.disconnect();
    // this.removeTransportListeners();
    return this;
  },

  addTransportListeners: function() {
    // connection dropped
    this.transport.on('link:closed', this.hanleLinkClosed, this);
    // handles connection message event - rtf server api update
    this.transport.on('message', this.handleReceivedMessage, this);
    this.transport.on('pong', this.handlePongReceived, this);
    // unable to connect through provided transport(various reasons)
    this.transport
      .on('reconnecting:stopped', this.handleReconnectingStopped, this)
      .on('implementation:missing', this.handleReconnectingStopped, this);
    return this;
  },


  /*
    Message senders
   */
  
  sendMessage: function(msg) {
    if ( msg && (typeof msg === 'object') )
      msg = JSON.stringify(msg);
    Logger.debug('%cWebSocketConnector.sendMessage : ', 'color:red', msg);
    this.transport.send(msg);
  },

  
  /*
    Handlers
  */
  

  /**
   * Handles a message received from server api
   *
   * @description handles the server's update message
   * and passes it to the subscribers/clients of rtf api
   * 
   * @param  {Object} message JSON message send by rtf server api
   */
  handleReceivedMessage: function(message) {
    Logger.info('WebSocketConnector.handleReceivedMessage');
    message = JSON.parse(message);
    this.fire('api:update', message);
  },
  
  /**
   * Handles ws re/connection attempt
   *
   * @description handles the event where a connection
   * is being closed after a reconnecting attempt or the
   * transport cannot be initialized.
   * After this, usually, the connector manager should 
   * swtich to the next available connector, if any.
   */
  handleReconnectingStopped: function() {
    Logger.info('WebSocketConnector.handleReconnectingStopped');
    this.fire('connector:deactivated');
  },
  
  /**
   * Handles ws link:closed
   *
   * @description if server api closes the link, it sends a message
   * describing the reason for the close.
   * Usually, the server api will close the link because of a problem
   * involving protocols or for network issues.
   * Anything else is not interpreted!
   * 
   * @param  {Object} message JSON message sent by rtf server api
   */
  hanleLinkClosed: function(message) {
    var reason;
    Logger.info('WebSocketConnector.hanleLinkClosed');
    if ( message ) {
      reason = jQuery.parseJSON(message.reason);
      if ( reason.error )
        this.fire('api:error', reason.error);
    }
  }
});


return WebSocketConnector;


});

// RTF Api Manager implementation

define('skm/rtf/RTFApi',['skm/k/Object',
  'skm/util/Logger',
  'skm/util/Subscribable',
  'skm/net/WSWrapper',
  'skm/net/XHRWrapper',
  'skm/rtf/ConnectorManager',
  'skm/rtf/XHRConnector',
  'skm/rtf/WSConnector'],
  function(SKMObject, SKMLogger, Subscribable, WSWrapper, XHRWrapper,
           ConnectorManager, XHRConnector, WSConnector)
{



var Logger = SKMLogger.create();


/*
  Config - urls, connector sequence, etc
 */


var Config = (function(){
  var transportsURLs = {
    ws: 'ws://localhost:8080/testws',
    xhr: 'http://localhost:8080/testajax'
  };

  var defaultURLs = {
    ws: 'ws://localhost:8080/testws',
    xhr: 'http://localhost:8080/testajax'
  };

  var connectorSequence = ['WebSocket', 'XHR'];

  var wsReconnectAttempts = 1;

  return {
    getSequence: function() {
      return connectorSequence;
    },

    setSequence: function(sequence) {
      connectorSequence = sequence;
    },

    getWSReconnectAttempts: function() {
      return wsReconnectAttempts;
    },

    setWSReconnectAttempts: function(attempts) {
      wsReconnectAttempts = attempts;
    },

    getWSUrl: function() {
      var url = null;
      if ( ! (url = transportsURLs.ws) ) {
        url = defaultURLs.ws;
        Logger.info('%cConfig.getWSUrl : ws url is null - '
          + ' returning default url', 'color:red');
      }
      return transportsURLs.ws;
    },

    setWSUrl: function(url) {
      transportsURLs.ws = url;
    },

    getXHRUrl: function() {
      var url = null;
      if ( ! (url = transportsURLs.xhr) ) {
        url = defaultURLs.xhr;
        Logger.info('%cConfig.getXHRUrl : xhr url is null - '
          + ' returning default url', 'color:red');
      }
      return transportsURLs.xhr;
    },

    setXHRUrl: function(url) {
      transportsURLs.xhr = url;
    }
  }
}());


/*
  Subscriptions and Param lists
 */


var Subscription = SKMObject.extend(Subscribable, {
  name: undefined,

  initialize: function() {
    Logger.debug('%cnew Subscription', 'color:#A2A2A2', this.name);
  },

  handleUpdate: function(message) {
    this.fire('update', message);
  },

  destroy: function() {
    this.fire('destroy');
  }
});


var rtfSubscriptionList = {
  _subscriptions: null,

  add: function(name, subscription) {
    if ( ! this._subscriptions )
      this._subscriptions = {};
    return this._subscriptions[name] = subscription;
  },

  remove: function(name) {
    if ( name in this._subscriptions )
      delete this._subscriptions[name];
    return true;
  },

  get: function(name) {
    this._subscriptions = this._subscriptions || {};
    return this._subscriptions[name];
  },

  eachSubscription: function(callback, context) {
    var subscription, list = this._subscriptions;
    for ( subscription in list ) {
      callback.call(context || this, list[subscription]);
    }
  },

  getList: function() {
    return this._subscriptions;
  },

  has: function(subscription) {
    return this._subscriptions && (subscription in this._subscriptions);
  },

  isNullOrEmpty: function() {
    var counter = 0, sub;
    if ( this._subscriptions !== null ) {
      for (sub in this._subscriptions) {
        counter++;
      }
      if (counter > 0)
        return false;
    }
    return true;
  }
};


var ParamsModel = SKMObject.extend(Subscribable, {
  _parameterizerList: null,

  getList: function() {
    this._parameterizerList = this._parameterizerList || {};
    return this._parameterizerList;
  },

  getByName: function(name) {
    return this._parameterizerList[name];
  },

  toUrl: function() {
    var list = this._parameterizerList;
    return encodeURIComponent(JSON.stringify(list).toString());
  },

  toQueryString: function(concatStr) {
    var i = 0, qs = '', part, segment, params = this.getList();
    var concatWith = concatStr || '&';
    for ( part in params ) {
      i = 0, segment = params[part];
      // If at first part
      if ( qs.length < 1 ) {
        qs += '?';
      } else {
        qs += concatWith;
      }
      // for each part, there will be a segment array
      for ( ; i < segment.length; i++ ) {
        if ( i > 0 )
          qs += concatWith;
        qs += (part + '=' + segment[i]);
      }
    }
    return qs;
  },

  reset: function(name, value) {
    if ( name in this.getList() )
      delete this._parameterizerList[name];
    return this;
  },

  add: function(name, value) {
    var list = this.getList();
    if ( list[name] ) {
      list[name].push(value);
    } else {
      list[name] = [value];
    }
    this.fire('added');
    return this;
  },

  addByKeyAndValue: function(paramObject) {
    //
  },

  remove: function(name) {
    var list = this.getList();
    if ( name in list )
      delete list[name];
    this.fire('removed');
    return this;
  },

  alter: function(name, newValue) {
    var param, list = this.getList();
    if ( param = list[name] ) {
      list[name] = [newValue];
    }
    this.fire('altered');
    return this;
  }
});


var rtfParamList = ParamsModel.create();


/**
 * RTFApi handlers delegate
 */
var ApiDelegates = {
  handleMessage: function(data) {
    var batchId = this._batchId;
    if ( 'message' in data ) {
      Logger.debug('ApiDelegates.handleMessage :: message', data);
    } else if ( 'reconfirmation' in data ) {
      Logger.debug('ApiDelegates.handleMessage :: reconfirmation', data);
    } else if ( 'noupdates' in data ) {
      return this.handleNoUpdates(data);
    } else {
      return this.handleInvalidData(data);
    }
    // get batchId sent by server
    batchId = data['batchId'];
    // update it in params list
    rtfParamList.alter('batchId', batchId);
    // send message
    this.sendMessage('batchId{' + batchId + '}');
  },

  handleNoUpdates: function() {
    Logger.debug('ApiDelegates.handleNoUpdates :: batchId ', this._batchId);
    this.sendMessage('batchId{' + this._batchId + '}');
  },

  handleInvalidData: function(data) {
    Logger.error('ApiDelegates.handleInvalidData :: invalid data', data);
  },

  // notify all subscriptions that an error has occured
  handleManagerSequenceStopped: function() {
    Logger.debug('ApiDelegates.handleManagerSequenceStopped');
  },

  // notify all subscriptions that sequence has been deactivated
  handleManagerSequenceDeactivated: function() {
    Logger.warn('ApiDelegates.handleManagerSequenceDeactivated');
  },

  handleResetThenAddSubscribes: function() {
    rtfParamList.reset('subscribe');
    // Re-add the subscriptions to the params list
    rtfSubscriptionList.eachSubscription(function(subscription) {
      rtfParamList.add('subscribe', subscription.name);
    });
  },

  handleRemoveSubscribes: function() {
    rtfParamList.remove('subscribe');
  },

  handleBrowserUnload: function() {
    this.sendMessage('closeConnection');
  }
}


/**
 * API constructor
 */
var RTFApi = SKMObject.extend(ApiDelegates, {
  _clientId:  null,
  
  _sessionId:  null,

  _batchId: 0,

  _connectorManager: null,

  initialize: function() {
    Logger.debug('%cnew RTFApi', 'color:#A2A2A2');

    var that = this;

    // handle browser/tab unload/close
    $(window).bind("beforeunload", function() {
      that.handleBrowserUnload();
    });
    
    // Prepare batchId and add it to the parameterizer
    rtfParamList.add('batchId', this._batchId);
    
    // creates the connector manager
    this._createConnectorManager();

    // Resends a confirmation back to server api
    this._connectorManager.on('update',
      this.handleMessage, this);

    // Handle when manager has stopped - something wrong happened
    this._connectorManager.on('stopped',
      this.handleManagerSequenceStopped, this);

    // Handle when manager has been deactivated - next/sequence switch
    this._connectorManager.on('deactivated',
      this.handleManagerSequenceDeactivated, this);

    // re-add subscriptions to the param list before connector began update
    this._connectorManager.on('before:nextSequence',
      this.handleResetThenAddSubscribes, this);

    // remove subscribe after every connector has began update
    this._connectorManager.on('after:startConnector',
      this.handleRemoveSubscribes, this);
  },

  startUpdates: function() {
    Logger.debug('%cRTFApi.startUpdates', 'color:green');
    // check clientId, subscription list
    this._checkEssentialFields();
    // Start the connectors, if any available.
    this._connectorManager.startConnectors();
  },

  stopUpdates: function() {
    Logger.debug('%cRTFApi.stopUpdates', 'color:green');
    this._connectorManager.stopConnectors();
  },

  switchToNextConnector: function() {
    Logger.debug('%cRTFApi.switchToNextConnector', 'color:green');
    this._connectorManager.switchToNextConnector();
  },

  sendMessage: function(message) {
    if ( ! message )
      Logger.warn('RTFApi.sendMessage : unable to send an empty message');
    this._connectorManager.sendMessage(message);
  },

  
  /**
   * @todo
   * Refactor params list create/update
   */


  /**
   * Sets the clientId of the rtf client
   *
   * @description same as session id though can be left out
   * and the value implicitly retrieved/set by server api
   * @param {String} id cliend/sessions id string
   */
  setClientId: function(id) {
    var cid = this._clientId;
    if ( cid !== null ) {
      throw new Error('RTFApi.setClientId : clientId already set!');
    }
    rtfParamList.add('clientId', this._clientId = id);
  },
  
  /**
   * @todo create a [addParam] method that takes an object as argument
   * { paramKey: value } and sends it to the [rtfParamList]
   */
  setSessionId: function(key,value) {
    var cid = this._sessionId;
    if ( cid !== null ) {
      throw new Error('RTFApi.setSessionId : ' + key + ' already set!');
    }
    rtfParamList.add(key, value);
  },

  /**
   * Returns a subscription
   * 
   * @param  {String} name the name identifier of the subscription
   */
  getSubscription: function(name) {
    return rtfSubscriptionList.get(name);
  },

  /**
   * Adds a new subscription
   *
   * @description creates a new Subscription object
   * and ties it to the connector's "api:update" event
   * @param {String} name subscription name
   * @param {Object} optParams the optional parameters object to be
   * sendt alongside subscription name
   */
  addSubscription: function(name, optParams) {
    var subscription, message;
    if ( rtfSubscriptionList.has(name) ) {
      Logger.info('RTFApi.addSubscription :: ' + name +
        ' subscription already registered!'); 
    }
    message = 'subscribe{' + name + '}';

    // Create the new subscription and add it to the list
    subscription = rtfSubscriptionList.add( name,
      Subscription.create({ name: name }) );
    
    // Tie the subscription to the manager's updates
    this._connectorManager.on('update', subscription.handleUpdate, subscription);

    // Add it to the rtfParamList
    rtfParamList.add('subscribe', name);

    // if params are sent, concatenate to message string
    if ( optParams ) {
      var  newParams = {};
      newParams[name]=optParams;

      var strParams = JSON.stringify(newParams).replace(/\"|\'/g, '');
      // this._connectorManager += ('params{' + name + ':{' + strParams + '}');
      this.sendMessage({ params: strParams });
    } else {
      this.sendMessage({ message: message });
    }

    // message = optParams;

    // Tell the connector to notify server api
    // this.sendMessage(message, { params: optParams });

    

    return subscription;
  },

  /**
   * Removes a subscription
   *
   * @description destroys the instance and
   * removes the callbacks on connector "api:update" event
   * @param  {String} name subscription name
   */
  removeSubscription: function(name) {
    var subscription = rtfSubscriptionList.get(name);

    // Dettach update event
    this._connectorManager.off('update', subscription.handleUpdate, subscription);
    
    // Remove from subscription list
    rtfSubscriptionList.remove(name);

    // Destroy subscription
    subscription.destroy();
    
    // rtfParamList.remove('subscribe');
    rtfParamList.remove('subscribe');
  },


  /*
    Privates
   */
  

  _createConnectorManager: function() {
    var manager = this._connectorManager = ConnectorManager.create({
      sequence: Config.getSequence()
    });

    manager.registerConnector('WebSocket', WSConnector.create({
      urlBase: Config.getWSUrl(),
      urlParamModel: rtfParamList
    })).addTransport(WSWrapper.create({
      reconnectAttempts: Config.getWSReconnectAttempts(),
      pingServer: true
    }));

    manager.registerConnector('XHR', XHRConnector.create({
      urlBase: Config.getXHRUrl(),
      urlParamModel: rtfParamList
    })).addTransport(XHRWrapper.create());
  },

  _getIncrementedBatchId: function() {
    var bid = this._batchId++
    return bid;
  },

  _checkEssentialFields: function() {
    // Checks clientId presence
    if ( !this._clientId )
      Logger.warn('RTFApi.startUpdates :: no clientId set!');
    // Checks the presence of subscriptions
    if ( rtfSubscriptionList.isNullOrEmpty() )
      Logger.warn('RTFApi.startUpdates :: subscription list is empty!');
  }
});


return {
  Config: Config,

  Api: (function() {
    var instance = null;

    return {
      get: function() {
        if ( instance == null ) {
          instance = RTFApi.create();
        }
        return instance;
      }
    }
  }())
};


// end module
});
define('models/OutcomeCellModel',[], function(){
	

	var OutcomeCellModel = Backbone.Model.extend();

	return OutcomeCellModel; 
});
  
// Event Details model

define('models/EventItemModel',['models/OutcomeCellModel'], function(OutcomeModel) {



var EventItemModel = Backbone.Model.extend({
  defaults: {
    groupParam: null,
    isLive: false,

    brEvent: false,
    epEvent: false,

    link: "",
    score: "",
    seeAllMatches: "",
    showingBetType: "",
    from: "",
    locationName: "",
    scopeLink: "",
    payout: 0,
    scopeName: "",
    startTime: "",
    seeEventIds: false,
    eventId: 0,
    providers: 0,
    disciplineName: "",
    name: "",
    tournamentName: "",
    tc_live: "",
    betTypeName: "",
    disciplineId: 0,
    scopeId: 0,
    tournamentId: 0,
    index: 0,
    seeMatchNow: "",
    betTypeLink: "",
    disciplineNameLink: "",
    betTypePayout: false,
    tournamentNameLink: "",
    hasGroup: false,
    seeSportCompetitionTitle: "",
    passedTime: 0,
    defaultScope: true,
  },

  idAttribute: 'eventId',

  outcomesModels: null,

  initialize: function() {
    this.on('change:outcomes', this._updateOutcomesModels, this);
    this._buildOutcomeCellModel();
  },

  getOutcomeModelByIndex: function(index) {
    return this.outcomesModels[index];
  },

  destroy: function() {
    this.outcomesModels.splice(0);
    this.outcomesModels = null;
  },

  getTimeAttributes: function() {
    var attrs = this.attributes;
    return {
        match: {
            passedTime: attrs.passedTime,
            startTime: attrs.startTime
        }
    }
  },

  getScoreAttributes: function() {
    var attrs = this.attributes;
    return {
        match: {
          score: attrs.score,
          isLive: attrs.isLive,
          tc_live: attrs.tc_live
        }
    }
  },

  getLinkAttributes: function() {
    var attrs = this.attributes;
    return {
      match: {
        link: attrs.link,
        betTypeLink: attrs.betTypeLink,
        scopeLink: attrs.scopeLink,
        seeMatchNow: attrs.seeMatchNow,
        name: attrs.name
      }
    }
  },

  hasScore: function() {
    var score = this.get('score');
    if ( score && score.length ) {
        return true;
    }
    return false
  },


  /*
    Private
   */
  

  _updateOutcomesModels: function() {
    var outcomesModelsArr = this.outcomesModels;
    var outcomesUpdatesList = this.get('outcomes');
    
    if ( outcomesModelsArr.length ) {
      _.each(outcomesUpdatesList, function(outcome, idx) {
        if ( outcomesModelsArr[outcome.index] )
          outcomesModelsArr[outcome.index].set(outcome);
      });
    }
  },

  _buildOutcomeCellModel: function() {
    var outcomes = this.attributes.outcomes;
    var i = 0, item, model, len = outcomes.length;
    this.outcomesModels = [];
    for (; i < len; i++ ) {
      item = outcomes[i];
      model = new OutcomeModel(item);
      this.outcomesModels.push(model);
    }
  }
});


return EventItemModel;


});

// Matches Table model - main module model :D

define('models/MatchesTableModel',['models/EventItemModel'],
  function(EventModel)
{



var eventsCollection = new Backbone.Collection();


var MatchesTableModel = Backbone.Model.extend({
  /**
   * Adds a new event and creates its model
   * 
   * @param {JSON} jsonMatchAttributes The object representing the new
   * match/event to be added
   */
  addMatch: function(jsonMatchAttributes, triggersEvent) {
    var eventItem = new EventModel(jsonMatchAttributes);
    eventsCollection.add(eventItem);
    if ( triggersEvent != false )
      this.trigger('created:match', eventItem);
    return eventItem;
  },

  /**
   * Removes a match and destroys it
   * 
   * @param  {String} id event item/match id
   */
  removeMatch: function(id) {
    var eventItemModel = eventsCollection.get(id);
    if ( eventItemModel ) {
      eventItemModel.destroy();
      eventsCollection.remove(id);
      this.trigger('removed:match', id);
    }
  },

  /**
   * Updates the matches and their attributes
   *
   * @description If collection doesn't contain the model
   * with this eventId, create it and add it to the collection
   * 
   * @param  {Array} matchesArr list of matches to be updated
   */
  updateMatchesList: function(matchesArr) {
    var eventItem = null;
    _.each(matchesArr, function(matchAttributes) {
      if ( eventItem = eventsCollection.get(matchAttributes.eventId) )
        eventItem.set(matchAttributes);
    }, this);
  },
  
  /**
   * For a list (JSON) of matches, create a new EventModel instance
   *
   * @description it iteratest over the list,
   * creating a new instance of [EventModel]
   * and adds it to the eventsCollection
   * 
   * @param  {JSON} matchesArr json list of matches to be created
   */
  createMatchesList: function(matchesArr) {
    _.each(matchesArr, function(matchAttributes) {
      if ( eventsCollection.get(matchAttributes.eventId) )
        console.log('%cMatchesTableModel.createMatchesList : event with id '
          + matchAttributes.eventId + ' already created', 'color:green');
      else
          this.addMatch(matchAttributes);
    }, this);
  },

  /**
   * Removes a list of matches - EventModel instances
   *
   * @description based on a JSON of events - event id's - iterate
   * over each item and call [removeMatch]
   * @param  {JSON} matchesArr the list of matches to be destroyed
   */
  removeMatchesList: function(matchesArr) {
    _.each(matchesArr, function(matchAttribute) {
      this.removeMatch(matchAttribute.eventId);
    }, this);
  }
});


return MatchesTableModel;


});
  
// Components

define('app/components',['skm/k/Object'],
  function(SKMObject)
{



var Component = {};


/*
  UI Components
  -------------
 */


Component.ui = {};


Component.ui.TableView = Backbone.View.extend({
  /**
   * Collection of row item view instances
   * @type {Object}
   */
  _rowViews: null,

  /**
   * Selector used to query dom, for each row of the table view
   * @type {String}
   */
  rowSelector: '>li',

  getRowById: function(id) {
    return this._rowViews[id];
  },

  addRow: function(id, view) {
    var list = this._rowViews;
    if ( id in list ) {
      console.log('%TableView.addRow :: view with id '
        + id + ' already added', 'color:red');
    }
    list[id] = view;
    return this;
  },

  removeRow: function(rowView) {
    //
  },

  removeRowById: function(id) {
    var row = null;
    if ( row = this._rowViews[id] ) {
      delete this._rowViews[id];
      row.off().remove();
      row = null;
    }
  },

  eachRow: function(cb, ctx) {
    var $rows = this.$el.find(this.rowSelector);
    var that = this, elem = null;
    $rows.each(function() {
      elem = $(this);
      cb.call(ctx || that, elem);
    });
  }
});


Component.ui.AdapterView = Backbone.View.extend({
  _adapter: null,

  getAdapter: function() {
    return this._adapter;
  },

  setAdapter: function(adapterInstance) {
    this._adapter = adapterInstance;
  }
});


/*
  Data Components
  ---------------
 */


Component.data = {};


Component.data.Adapter = SKMObject.extend({
  _dataSource: null,

  _viewItems: null,

  setDataSource: function(data) {},

  getDataSource: function() {},

  getCount: function() {},

  getItem: function(position) {},

  getView: function() {},

  eachItem: function(cb, ctx) {},

  addViewItem: function(id, view) {},

  removeViewItem: function(id) {}
});


Component.data.ArrayAdapter = Component.data.Adapter.extend({
  initialize: function() {
    this._dataSource = null;
    this._viewItems = {};
  },

  getDataSource: function() {
    return this._dataSource;
  },

  setDataSource: function(data) {
    this._dataSource = data;
  },

  getItem: function(position) {
    var dataItem = null, list = this._dataSource;
    if ( list.length && position < list.length ) {
      dataItem = list[position];
    }
    return dataItem;
  },
  
  getCount: function() {
    return this._dataSource.length;
  },

  eachItem: function(cb, ctx) {
    var data = this.getDataSource();
    var len = this.getCount();
    for ( var i = 0; i < len; i++ ) {
      cb.call(ctx || this, data[i]);
    }
  },

  removeItemAt: function(position) {
    var list = this.getDataSource();
    var item = list.splice(position, 1);
    this.removeView(this.getViewAtIndex(position));
  },

  getViewById: function(id) {
    return this._viewItems[id];
  },

  getViewAtIndex: function(index) {
    var list = this._viewItems;
    var item, view = null, counter = 0;
    for ( item in list ) {
      if ( index === counter ) {
        view = list[item];
        break;
      }
      counter++;
    }
    return view;
  },

  addViewItem: function(id, view) {
    this._viewItems[id] = view;
  }
});


return Component;


});
  
// Matches Cell

define('views/MatchesTable/EventDetailsView',[], function() {



var EventDetails = Backbone.View.extend({
  initialize: function() {
    // console.log('%cnew EventDetails', 'color:#A2A2A2');

    this.model.on('change:tournamentName',
      this.handleChangedTournamentName, this);

    this.model.on('change:tournamentNameLink change:seeAllMatches',
      this.handleChangeTournamentnameLink, this);

    this.model.on('change:locationName', this.handleChangedLocationName, this);

    this.model.on('change:betTypeName', this.handleChangedBettypeName, this);

    this.model.on('change:scopeName', this.handleChangedScopeName, this);
    
    this.model.on('change:groupParam', this.handleChangedGroupParam, this);

    this.model.on('change:disciplineNameLink change:locationNameLink'
      + ' change:seeSportCompetitionTitle',
      this.handleChangedDisciplinenameLink, this);

    this.model.on('change:disciplineName',
      this.handleChangeDisciplineName, this);
    
    this.model.on('change:link change:scopeLink change:betTypeLink'
      + ' change:seeMatchNow change:name', this.handleChangedLink, this);

    this.model.on('change:providers', this.handleChangedProviders, this);
    
    this.model.on('change:payout', this.handleChangedPayout, this);

    this.model.on('change:brEvent change:epEvent',
      this.handleChangedCoverage, this);

    this.model.on('change:startTime change:passedTime',
      this.handleChangedMatchTime, this);

    this.model.on('change:isLive', this.handleChangedIsLive, this);

    this.model.on('change:score', this.handleChangedScore, this);
  },

  handleChangedTournamentName: function() {
    var tournamentName = this.model.get('tournamentName');
    this.$el.find('span.Tour').html(tournamentName);
  },

  handleChangeTournamentnameLink: function() {
    var link = this.model.get('tournamentNameLink');
    var title = this.model.get('seeAllMatches');
    var el = this.$el.find('.MDLink.TourLink');
    el.attr('href', link).attr('title', title);
  },

  handleChangedLocationName: function() {
    this.$el.find('.Flag').html(this.model.get('locationName'));
  },

  handleChangedBettypeName: function() {
    this.$el.find('span.ShowingBetType')
      .html(this.model.get('betTypeName'));
  },

  handleChangedScopeName: function() {
    var el = this.$el.find('span.ShowingBetType').find('.scopeName');
    var text = '', prev = el.html();

    if ( this.model.get('defaultScope') ) {
      text = ', ' + this.model.get('scopeName');
    }
    el.html(text);
  },

  handleChangedGroupParam: function() {
    var el = this.$el.find('span.ShowingBetType').find('.groupParam');
    var groupParam = '', text = '', prev = el.html();

    if ( this.model.get('hasGroup')
         && (groupParam = this.model.get('groupParam')) )
    {
      text = ', ' + groupParam;
    }
    el.html(text);
  },

  handleChangedDisciplinenameLink: function() {
    var sportLink = '/' + this.model.get('disciplineNameLink') + '/';
    var regionLink = sportLink + this.model.get('locationNameLink') + '/';
    this.$el.find('.MDLink.SportLink').attr('href', sportLink);
    this.$el.find('.MDLink.RegionLink')
      .attr('href', regionLink)
      .attr('title', this.model.get('seeSportCompetitionTitle'));
  },

  handleChangeDisciplineName: function() {
    var icon = this.model.get('SportIcon');
    this.$el.find('.SportIcon').html(icon);   
  },

  handleChangedLink: function() {
    var timeAttrs = this.model.getTimeAttributes();
    var scoreAttrs = this.model.getScoreAttributes();
    var linkAttrs = this.model.getLinkAttributes();
    var attrs = _.extend({}, linkAttrs.match, timeAttrs.match, scoreAttrs.match);
    var tpl = com.betbrain.nextLiveMatches.matchLink({ match: attrs });
    this.$el.find('a.MatchLink').replaceWith(tpl);
  },

  handleChangedProviders: function() {
    var tpl = com.betbrain.nextLiveMatches.matchBookies({
      match: { providers: this.model.get('providers') }
    });
    this.$el.find('.BookieNo').replaceWith(tpl);
  },

  handleChangedPayout: function() {
    var $container = null;

    if ( this.model.get('betTypePayout') === true ) {
      $container = this.$el.find('div.MDxInfo');
      $container.find('.ShowingPayout').remove();

      var tpl = com.betbrain.nextLiveMatches.matchPayout({
        match: { payout: this.model.get('payout') }
      });
      $container.prepend(tpl);
    }
  },

  handleChangedCoverage: function() {
    var attrs = this.model.attributes;
    var tpl = com.betbrain.nextLiveMatches.matchCoverage({
      match: { epEvent: attrs.epEvent, brEvent: attrs.brEvent }
    });
    this.$el.find('div.coverage').html(tpl);
  },

  handleChangedMatchTime: function(model) {
    var attrs = this.model.getTimeAttributes();
    this._renderTime(attrs);
  },

  handleChangedIsLive: function() {
    var attrs = this.model.getTimeAttributes();
    this.trigger('isLive', true);
    this._renderTime(attrs);
    this._renderScore();
  },

  handleChangedScore: function() {
    this._renderScore();
  },

  /*
    Renderers
   */
  
  _renderScore: function() {
    var attrs = this.model.getScoreAttributes();
    var tpl = com.betbrain.nextLiveMatches.matchScore(attrs);
    this.$el.find('span.Score').replaceWith(tpl);
  },
  
  _renderTime: function(attributes) {
    var tpl = com.betbrain.nextLiveMatches.matchTime(attributes);
    this.$el.find('.Timing').replaceWith(tpl);
  } 
});


return EventDetails;


});


// Outcome Cell view

define('views/MatchesTable/OutcomeCellView',[], function(){
	

	var OutcomeCellView = Backbone.View.extend({
		events: {
			'click a.Bet': 'handleBetClick'
		},

		/**
		 * Google Closure Template Object
		 * Use the predefined methods to render the template
		 * @type {[Object]}
		 */
		_templateMethod:  window.com.betbrain.nextLiveMatches.outcome,

		initialize: function(){
			// console.log('%cnew OutcomeCellView', 'color:#A2A2A2');
			this.model.on('change', function(){
				this.render();
			}, this)
		},

		/**
		 * Returns the compiled template with data from the model
		 * @return {String} 
		 */
		createTemplate: function(){
			if(this.model) {
				return this._templateMethod({ outcome: this.model.attributes });
			} else {
				console.log('Instantiation ERROR! The view has been initialized without a MODEL !!', this);
				return false;
			}
		},

		/**
		 * Appends the template to the container $el property of the view
		 * @return {void} 
		 */
		render: function(){
			console.log('%cOutcomeCellView.rerender', 'color:green');
			var content = this._templateMethod({ 'outcome': this.model.attributes });
			var el = $(content);
			this.$el.replaceWith(el);
			this.setElement(el);
		},

		handleBetClick: function(evt) {
			evt.preventDefault();
			console.log('handleBetClick')
		}
	});

	return OutcomeCellView;


});
  
// RowItemView

define('views/MatchesTable/EventItemView',['app/components',
  'views/MatchesTable/EventDetailsView',
  'views/MatchesTable/OutcomeCellView'],
  function(component, EventDetailsView, OutcomeCell)
{



var EventItem = Backbone.View.extend({
  tagName: 'li',

  className: 'TheMatch',

  events: {
    'click .MDContainer.MDxContainer': function(evt) {
      evt.preventDefault();
      console.log('test clicks on new rows')
    }
  },

  _eventDetailsView: null,

  _betCellViews: null,

  _templateSuffix: 'match',

  initialize: function() {
    // console.log('%cnew EventItemView', 'color:#A2A2A2');
    this._eventDetailsView = null;
    this._betCellViews = [];
  },

  /*
    Commands
   */

  render: function(data) {
    console.log('%cEventItemView.render', 'color:green', data);
    var tplRender = com.betbrain.nextLiveMatches[this._templateSuffix];
    var content = tplRender({ match: data });
    this.setElement(content);
  },

  renderChildren: function() {
    console.log('%cEventItemView.renderChildren', 'color:green');
    if ( ! this.model ) {
      console.log('%cEventItemView.renderChildren : no model provided'
        + ' for this event item!');
    }
    this._buildMatchesDetailsView();
    this._buildOutcomeCellsViews();
    return this;
  },

  removeOutcomeCell: function(cellIndex) {
    var cellView = this._betCellViews[cellIndex];
    this._betCellViews.splice(cellIndex, 1);
    cellView.remove();
    cellView = null;
  },

  setModel: function(model) {
    this.model = model;
    return this;
  },


  /*
    Private
   */

  
  _buildMatchesDetailsView: function() {
    var view = new EventDetailsView({
      el: this.$el.find('div.MatchDetails'),
      model: this.model
    });
    this._eventDetailsView = view;
  },

  _buildOutcomeCellsViews: function() {
    var $cells = this.$el.find('.OddsList li.Outcome');
    var that = this, cellView = null, item;

    $cells.each(function(idx) {
      item = $(this);
      cellView = new OutcomeCell({
        el: item,
        model: that.model.getOutcomeModelByIndex(idx)
      });
      that._betCellViews.push(cellView);
    });
  }
});


return EventItem;


});

  
// RowItemView

define('views/MatchesTable/WrapperView',['app/components',
  'views/MatchesTable/EventItemView',
  /*'views/MatchesTable/MatchesCell',
  'views/MatchesTable/BetCell'*/],
  function(component, EventItemView)
{



var Wrapper = component.ui.TableView.extend({
  el: $('#NextLiveMatchesRTF'),

  rowSelector: 'li.TheMatch',

  initialize: function() {
    console.log('%cnew Wrapper', 'color:#A2A2A2');
    this._rowViews = {};
  },

  /**
   * Inserts a new row view
   *
   * @description Inserts a new element to the table view,
   * at the tail or at a specified index. If the index is not found or not
   * speficied, it will be appended at the end of the table view.
   * @param  {Object} view  a reference to an instance of EventItemView
   * @param  {Number} index the index at which the view's el should pe placed
   */
  renderRow: function(view, index) {
    console.log('%cWrapper.renderRow', 'color:green', view.$el);
    var $elAtIndex = null, $view = view.$el;
    if ( index ) {
      $elAtIndex = this.el.find('li.TheMatch').eq(index);
      if ( $elAtIndex.length )
        $view.insertBefore($elAtIndex);
      else
        this.$el.append($view);
    } else {
      this.$el.append($view);
    }
  },

  getNewRow: function(options) {
    return new EventItemView(options || {});
  },

  getNewRowByMatchId: function(id) {
    var element = this.$el.find('li[data-matchid="' + id + '"]');
    return this.getNewRow({ el: element });
  }
});


return Wrapper;


});

 
// Match Table ViewController implementation

define('controllers/MatchesTableViewController',['skm/k/Object',
  'skm/util/Subscribable',
  'models/MatchesTableModel',
  'views/MatchesTable/WrapperView'],
  function(SKMObject, Subscribable, MatchesTableModel, Wrapper)
{



var MatchTableController = SKMObject.extend({
  _wrapperView: null,

  _matchesTableModel: null,

  initialize: function() {
    this._wrapperView = new Wrapper();
    
    // Create the Event Details model collection
    this._matchesTableModel = new MatchesTableModel();

    // Move this event, directly on [_wrapperView]
    // Create the view for each new created match
    this._matchesTableModel.on('created:match',
      this._handleCreatedMatch, this);

    // Move this event, directly on [_wrapperView]
    // Handles a match, removed from matches talbe's event list
    this._matchesTableModel.on('removed:match',
      this._handleRemovedMatch, this);
  },

  processMatchesListUpdates: function(updatesJson) {
    var updateArr = updatesJson['nextLiveMatches'];
    var createItems, updateItems, deleteItems;
    
    if ( createItems = updateArr['create'] )
      this._matchesTableModel.createMatchesList(createItems);
    if ( updateItems = updateArr['update'] )
      this._matchesTableModel.updateMatchesList(updateItems);
    if ( deleteItems = updateArr['delete'] )
      this._matchesTableModel.removeMatchesList(deleteItems);
  },

  processMatchesInitialDump: function(initialJson) {
    this._handleInitialMatchesDump(initialJson);
  },


  /*
    Private
   */


  _handleInitialMatchesDump: function(matchesDumpJson) {
    var view, model, matchesArr = matchesDumpJson.matches;
    
    _.each(matchesArr, function(matchAttrs) {
      model = this._matchesTableModel.addMatch(matchAttrs, false);
      
      view = this._wrapperView.getNewRowByMatchId(model.id);
      view.setModel(model);
      view.renderChildren();

      this._wrapperView.addRow(model.id, view);
      this._wrapperView.renderRow(view);
    }, this);
  },

  _handleRemovedMatch: function(matchId) {
    this._wrapperView.removeRowById(matchId);
  },

  _handleCreatedMatch: function(matchModel) {

    var view = this._wrapperView.getNewRow();
    view.setModel(matchModel);
    view.render(matchModel.attributes);
    view.renderChildren();
    
    this._wrapperView.addRow(matchModel.id, view);
    this._wrapperView.renderRow(view, matchModel.index);
  }
});


return MatchTableController;


});

  
// Application

define('app/application',['skm/rtf/RTFApi',
  'controllers/MatchesTableViewController'],
  function(RTF, MatchesTableViewController)
{





var tplhtml = com.betbrain.nextLiveMatches.matchesList(jsonMatches);
$('#NextLiveMatchesRTF').html(tplhtml);




var matchesTableController = MatchesTableViewController.create();
matchesTableController.processMatchesInitialDump(jsonMatches);
window.mtc = matchesTableController;



// return;



RTF.Config.setWSUrl('ws://radu.betonvalue.com:8080/rtfws');
RTF.Config.setXHRUrl('http://radu.betonvalue.com/rtfajax');

RTF.Config.setSequence(['WebSocket', 'XHR']);

var rtf;
window.RTFApi = rtf = RTF.Api.get();

rtf.setClientId((new Date).getTime());
var sessionId = window.location.hash.replace(/.*=/g, '');
cl(sessionId)
rtf.setSessionId('jSessionId', sessionId);

// rtf.addSubscription('anotherSub');

rtf.addSubscription('nextLiveMatches').on('update', function(update) {
  var updatesArray = update['message'];
  _.each(updatesArray, function(matchesUpdatesItem) {
    matchesTableController.processMatchesListUpdates(matchesUpdatesItem);
  });
});


rtf.startUpdates();



});
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
// better vertsion => console.log.apply. If not, the method will log everything and insert that result inside an array. eg: log("ceva") //!# ["ceva"]
/* window.log = function() {
  if(this.console) return console.log.apply(console, Array.prototype.slice.call(arguments) );
};  */

// make it safe to use console.log always
(function(b){
	if(window.console) {
		return;
	}
	for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a] || function() {};
})(window.console = window.console || {});

window.log = (function() {
	return {
		info: function() {
			if(typeof console.info === 'function')
				return console.info.apply(console, Array.prototype.slice.call(arguments));
		},
		
		debug: function() {
			if(typeof console.info === 'function')
				return console.log.apply(console, Array.prototype.slice.call(arguments));
		},
		
		error: function() {
			if(typeof console.info === 'function')
				return console.error.apply(console, Array.prototype.slice.call(arguments));
		}
	}
})();


// a small shortcut but performance unsafe
// only for development debugging!!!
window.cl = window.log.debug;
define("console", function(){});

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
define("main", function(){});
