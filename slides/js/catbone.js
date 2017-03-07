// Helpers

var extend = function(target, origin) {
  for (property in origin) {
    target[property] = origin[property];
  }
  return target;
};

var addEventHandler = function(event, callback, context, once) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push({ callback: callback, context: context, once: once });
};

// Catbone

var Catbone = {};

Catbone.Events = {
  on: function(event, callback, context) {
    addEventHandler.call(this, event, callback, context, false);
  },
  once: function(event, callback, context) {
    addEventHandler.call(this, event, callback, context, true);
  },
  trigger: function(event) {
    if (this.events[event]) {
      this.events[event].forEach(function(object) {
        object.callback.call(object.context);
        if (object.once) {
          this.off(event, object.callback);
        }
      }, this);
    }
  },
  off: function(event, callback) {
    if (event) {
      if (callback) {
        this.events[event] = this.events[event].filter(function(object) { return object.callback !== callback; });
      } else {
        this.events[event] = [];
      }
    } else {
      this.events = {};
    }
  },
  listenTo: function(model, event, callback) {
    model.on(event, callback, this);
  },
  listenToOnce: function(model, event, callback) {
    model.once(event, callback, this);
  }
};

Catbone.Model = function(attributes) {
  this.attributes = extend({}, attributes);
  this.events = {};
  this.initialize();
};

Catbone.Model.extend = function(properties) {
  var constructor = function(attributes) {
    Catbone.Model.call(this, attributes);
  }
  constructor.prototype = extend(new Catbone.Model(), properties);

  return constructor;
};

Catbone.Model.prototype.initialize = function() {};

Catbone.Model.prototype.set = function() {
  if (arguments.length === 1) {
    var attributes = arguments[0];
    for (attribute in attributes) {
      this.set(attribute, attributes[attribute]);
    }
  } else {
    var attribute = arguments[0];
    var value = arguments[1];

    if (this.attributes[attribute] !== value) {
      this.attributes[attribute] = value;
      this.trigger('change');
      this.trigger('change:' + attribute);
    }
  }
};

Catbone.Model.prototype.get = function(attribute) {
  return this.attributes[attribute];
};

extend(Catbone.Model.prototype, Catbone.Events);

Catbone.View = function (options) {
  if (options) {
    this.model = options.model;
    this.el = options.el;
    this.$el = $(options.el);
  }
  for (event in this.events) {
    var eventName = event.split(' ')[0];
    var selector;
    if (event.indexOf(' ') === -1) {
      selector = null;
    } else {
      selector = event.substring(event.indexOf(' ') + 1);
    }

    var callback;
    if (typeof this.events[event] === 'string') {
      callback = this[this.events[event]];
    } else {
      callback = this.events[event];
    }

    if (selector) {
      this.$el.on(eventName, selector, callback.bind(this));
    } else {
      this.$el.on(eventName, callback.bind(this));
    }
  }
  this.initialize();
};

Catbone.View.prototype.initialize = function() {};

extend(Catbone.View.prototype, Catbone.Events);

Catbone.View.extend = function(properties) {
  var constructor = function(options) {
    Catbone.View.call(this, options);
  }
  constructor.prototype = extend(new Catbone.View(), properties);

  return constructor;
};

