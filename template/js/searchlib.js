// search library code
// $Id$

/**
 * @namespace A unique namespace for the AJAX Solr library.
 */
AjaxSolr = function () {};

/**
 * @namespace Baseclass for all classes
 */
AjaxSolr.Class = function () {};

/**
 * A class 'extends' itself into a subclass.
 *
 * @static
 * @param properties The properties of the subclass.
 * @returns A function that represents the subclass.
 */
AjaxSolr.Class.extend = function (properties) {
  var klass = this; // Safari dislikes 'class'
  // The subclass is just a function that when called, instantiates itself.
  // Nothing is _actually_ shared between _instances_ of the same class.
  var subClass = function (options) {
    // 'this' refers to the subclass, which starts life as an empty object.
    // Add its parent's properties, its own properties, and any passed options.
    AjaxSolr.extend(this, new klass(options), properties, options);
  }
  // Allow the subclass to extend itself into further subclasses.
  subClass.extend = this.extend;
  return subClass;
};

/**
 * @static
 * @param {Object} obj Any object.
 * @returns {Number} the number of properties on an object.
 * @see http://stackoverflow.com/questions/5223/length-of-javascript-associative-array
 */
AjaxSolr.size = function (obj) {
  var size = 0;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      size++;
    }
  }
  return size;
};

/**
 * @static
 * @param foo A value.
 * @param bar A value.
 * @returns {Boolean} Whether the two given values are equal.
 */
AjaxSolr.equals = function (foo, bar) {
  if (AjaxSolr.isArray(foo) && AjaxSolr.isArray(bar)) {
    if (foo.length !== bar.length) {
      return false;
    }
    for (var i = 0, l = foo.length; i < l; i++) {
      if (foo[i] !== bar[i]) {
        return false;
      }
    }
    return true;
  }
  else if (AjaxSolr.isRegExp(foo) && AjaxSolr.isString(bar)) {
    return bar.match(foo);
  }
  else if (AjaxSolr.isRegExp(bar) && AjaxSolr.isString(foo)) {
    return foo.match(bar);
  }
  else {
    return foo === bar;
  }
};

/**
 * @static
 * @param value A value.
 * @param array An array.
 * @returns {Boolean} Whether value exists in the array.
 */
AjaxSolr.inArray = function (value, array) {
  if (array) {
    for (var i = 0, l = array.length; i < l; i++) {
      if (AjaxSolr.equals(array[i], value)) {
        return i;
      }
    }
  }
  return -1;
};

/**
 * A copy of MooTools' Array.flatten function.
 *
 * @static
 * @see http://ajax.googleapis.com/ajax/libs/mootools/1.2.4/mootools.js
 */
AjaxSolr.flatten = function(array) {
  var ret = [];
  for (var i = 0, l = array.length; i < l; i++) {
    ret = ret.concat(AjaxSolr.isArray(array[i]) ? AjaxSolr.flatten(array[i]) : array[i]);
  }
  return ret;
};

/**
 * A copy of jQuery's jQuery.grep function.
 *
 * @static
 * @see http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.js
 */
AjaxSolr.grep = function(array, callback) {
  var ret = [];
  for (var i = 0, l = array.length; i < l; i++) {
    if (!callback(array[i], i) === false) {
      ret.push(array[i]);
    }
  }
  return ret;
}

/**
 * Equivalent to Ruby's Array#compact.
 */
AjaxSolr.compact = function(array) {
  return AjaxSolr.grep(array, function (item) {
    return item.toString();
  });
}

/**
 * Can't use toString.call(obj) === "[object Array]", as it may return
 * "[xpconnect wrapped native prototype]", which is undesirable.
 *
 * @static
 * @see http://thinkweb2.com/projects/prototype/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
 * @see http://ajax.googleapis.com/ajax/libs/prototype/1.6.0.3/prototype.js
 */
AjaxSolr.isArray = function (obj) {
  return obj != null && typeof obj == 'object' && 'splice' in obj && 'join' in obj;
};

/**
 * @param obj Any object.
 * @returns {Boolean} Whether the object is a RegExp object.
 */
AjaxSolr.isRegExp = function (obj) {
  return obj != null && (typeof obj == 'object' || typeof obj == 'function') && 'ignoreCase' in obj;
};

/**
 * @param obj Any object.
 * @returns {Boolean} Whether the object is a String object.
 */
AjaxSolr.isString = function (obj) {
  return obj != null && typeof obj == 'string';
};

/**
 * Define theme functions to separate, as much as possible, your HTML from your
 * JavaScript. Theme functions provided by AJAX Solr are defined in the
 * AjaxSolr.theme.prototype namespace, e.g. AjaxSolr.theme.prototype.select_tag.
 *
 * To override a theme function provided by AJAX Solr, define a function of the
 * same name in the AjaxSolr.theme namespace, e.g. AjaxSolr.theme.select_tag.
 *
 * To retrieve the HTML output by AjaxSolr.theme.prototype.select_tag(...), call
 * AjaxSolr.theme('select_tag', ...).
 *
 * @param {String} func
 *   The name of the theme function to call.
 * @param ...
 *   Additional arguments to pass along to the theme function.
 * @returns
 *   Any data the theme function returns. This could be a plain HTML string,
 *   but also a complex object.
 *
 * @static
 * @throws Exception if the theme function is not defined.
 * @see http://cvs.drupal.org/viewvc.py/drupal/drupal/misc/drupal.js?revision=1.58
 */
AjaxSolr.theme = function (func) {
  if (AjaxSolr.theme[func] || AjaxSolr.theme.prototype[func] == undefined) {
    console.log('Theme function "' + func + '" is not defined.');
  }
  else {
    for (var i = 1, args = []; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    return (AjaxSolr.theme[func] || AjaxSolr.theme.prototype[func]).apply(this, args);
  }
};

/**
 * A simplified version of jQuery's extend function.
 *
 * @static
 * @see http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
 */
AjaxSolr.extend = function () {
  var target = arguments[0] || {}, i = 1, length = arguments.length, options;
  for (; i < length; i++) {
    if ((options = arguments[i]) != null) {
      for (var name in options) {
        var src = target[name], copy = options[name];
        if (target === copy) {
          continue;
        }
        if (copy && typeof copy == 'object' && !copy.nodeType) {
          target[name] = AjaxSolr.extend(src || (copy.length != null ? [] : {}), copy);
        }
        else if (copy && src && typeof copy == 'function' && typeof src == 'function') {
          target[name] = (function(superfn, fn) {
            return function () {
              var tmp = this._super, ret;
              this._super = superfn;
              ret = fn.apply(this, arguments);
              this._super = tmp;
              return ret;
            };
          })(src, copy);
        }
        else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }
  return target;
};

// $Id$

/**
 * The Manager acts as the controller in a Model-View-Controller framework. All
 * public calls should be performed on the manager object.
 *
 * @param properties A map of fields to set. Refer to the list of public fields.
 * @class AbstractManager
 */
AjaxSolr.AbstractManager = AjaxSolr.Class.extend(
  /** @lends AjaxSolr.AbstractManager.prototype */
  {
  /**
   * The fully-qualified URL of the Solr application. You must include the
   * trailing slash. Do not include the path to any Solr servlet.
   *
   * @field
   * @public
   * @type String
   * @default "http://localhost:8983/solr/"
   */
  solrUrl: 'http://localhost:8983/solr/',

  /**
   * If we want to proxy queries through a script, rather than send queries
   * to Solr directly, set this field to the fully-qualified URL of the script.
   *
   * @field
   * @public
   * @type String
   */
  proxyUrl: null,

  /**
   * The default Solr servlet. You may prepend the servlet with a core if using
   * multiple cores.
   *
   * @field
   * @public
   * @type String
   * @default "select"
   */
  servlet: 'select',

  /**
   * The most recent response from Solr.
   *
   * @field
   * @private
   * @type Object
   * @default {}
   */
  response: {},

  /** 
   * A collection of all registered widgets. For internal use only.
   *
   * @field
   * @private
   * @type Object
   * @default {}
   */
  widgets: {},

  /**
   * The parameter store for the manager and its widgets. For internal use only.
   *
   * @field
   * @private
   * @type Object
   */
  store: null,

  /**
   * Whether <tt>init()</tt> has been called yet. For internal use only.
   *
   * @field
   * @private
   * @type Boolean
   * @default false
   */
  initialized: false,

  /**
   * An abstract hook for child implementations.
   *
   * <p>This method should be called after the store and the widgets have been
   * added. It should initialize the widgets and the store, and do any other
   * one-time initializations, e.g., perform the first request to Solr.</p>
   *
   * <p>If no store has been set, it sets the store to the basic <tt>
   * AjaxSolr.ParameterStore</tt>.</p>
   */
  init: function () {
    this.initialized = true;
    if (this.store === null) {
      this.setStore(new AjaxSolr.ParameterStore());
    }
    this.store.load(false);
    for (var widgetId in this.widgets) {
      this.widgets[widgetId].init();
    }
    this.store.init();
  },

  /**
   * Set the manager's parameter store.
   *
   * @param {AjaxSolr.ParameterStore} store
   */
  setStore: function (store) { 
    store.manager = this;
    this.store = store;
  },

  /** 
   * Adds a widget to the manager.
   *
   * @param {AjaxSolr.AbstractWidget} widget
   */
  addWidget: function (widget) { 
    widget.manager = this;
    this.widgets[widget.id] = widget;
  },

  /** 
   * Stores the Solr parameters to be sent to Solr and sends a request to Solr.
   *
   * @param {Boolean} [start] The Solr start offset parameter.
   * @param {String} [servlet] The Solr servlet to send the request to.
   */
  doRequest: function (start, servlet) {
    if (this.initialized === false) {
      this.init();
    }
    // Allow non-pagination widgets to reset the offset parameter.
    if (start !== undefined) {
      this.store.get('start').val(start);
    }
    if (servlet === undefined) {
      servlet = this.servlet;
    }

    this.store.save();

    for (var widgetId in this.widgets) {
      this.widgets[widgetId].beforeRequest();
    }

    this.executeRequest(servlet);
  },

  /**
   * An abstract hook for child implementations.
   *
   * <p>Sends the request to Solr, i.e. to <code>this.solrUrl</code> or <code>
   * this.proxyUrl</code>, and receives Solr's response. It should send <code>
   * this.store.string()</code> as the Solr query, and it should pass Solr's
   * response to <code>handleResponse()</code> for handling.</p>
   *
   * <p>See <tt>managers/Manager.jquery.js</tt> for a jQuery implementation.</p>
   *
   * @param {String} servlet The Solr servlet to send the request to.
   * @throws If not defined in child implementation.
   */
  executeRequest: function (servlet) {
    throw 'Abstract method executeRequest must be overridden in a subclass.';
  },

  /**
   * This method is executed after the Solr response data arrives. Allows each
   * widget to handle Solr's response separately.
   *
   * @param {Object} data The Solr response.
   */
  handleResponse: function (data) {
    this.response = data;

    for (var widgetId in this.widgets) {
      this.widgets[widgetId].afterRequest();
    }
  }
});

                           // $Id$

/**
 * Represents a Solr parameter.
 *
 * @param properties A map of fields to set. Refer to the list of public fields.
 * @class Parameter
 */
AjaxSolr.Parameter = AjaxSolr.Class.extend(
  /** @lends AjaxSolr.Parameter.prototype */
  {
  /**
   * The parameter's name.
   *
   * @field
   * @private
   * @type String
   */
  name: null,

  /**
   * The parameter's value.
   *
   * @field
   * @private
   * @type String
   */
  value: null,

  /**
   * The parameter's local parameters.
   *
   * @field
   * @private
   * @type Object
   * @default {}
   */
  locals: {},

  /**
   * Returns the value. If called with an argument, sets the value.
   *
   * @param {String|Number|String[]|Number[]} [value] The value to set.
   * @returns The value.
   */
  val: function (value) {
    if (value === undefined) {
      return this.value;
    }
    else {
      this.value = value;
    }
  },

  /**
   * Returns the value of a local parameter. If called with a second argument,
   * sets the value of a local parameter.
   *
   * @param {String} name The name of the local parameter.
   * @param {String|Number|String[]|Number[]} [value] The value to set.
   * @returns The value.
   */
  local: function (name, value) {
    if (value === undefined) {
      return this.locals[name];
    }
    else {
      this.locals[name] = value;
    }
  },

  /**
   * Deletes a local parameter.
   *
   * @param {String} name The name of the local parameter.
   */
  remove: function (name) {
    delete this.locals[name];
  },

  /**
   * Returns the Solr parameter as a query string key-value pair.
   *
   * <p>IE6 calls the default toString() if you write <tt>store.toString()
   * </tt>. So, we need to choose another name for toString().</p>
   */
  string: function () {
    var pairs = [];

    for (var name in this.locals) {
      if (this.locals[name]) {
        pairs.push(name + '=' + encodeURIComponent(this.locals[name]));
      }
    }

    var prefix = pairs.length ? '{!' + pairs.join('%20') + '}' : '';

    if (this.value) {
      return this.name + '=' + prefix + this.valueString(this.value);
    }
    // For dismax request handlers, if the q parameter has local params, the
    // q parameter must be set to a non-empty value. In case the q parameter
    // has local params but is empty, use the q.alt parameter, which accepts
    // wildcards.
    else if (this.name == 'q' && prefix) {
      return 'q.alt=' + prefix + encodeURIComponent('*:*');
    }
    else {
      return '';
    }
  },

  /**
   * Parses a string formed by calling string().
   *
   * @param {String} str The string to parse.
   */
  parseString: function (str) {
    var param = str.match(/^([^=]+)=(?:\{!([^\}]*)\})?(.*)$/);
    if (param) {
      var matches;

      while (matches = /([^\s=]+)=(\S*)/g.exec(decodeURIComponent(param[2]))) {
        this.locals[matches[1]] = decodeURIComponent(matches[2]);
        param[2] = param[2].replace(matches[0], ''); // Safari's exec seems not to do this on its own
      }

      if (param[1] == 'q.alt') {
        this.name = 'q';
        // if q.alt is present, assume it is because q was empty, as above
      }
      else {
        this.name = param[1];
        this.value = this.parseValueString(param[3]);
      }
    }
  },

  /**
   * Returns the value as a URL-encoded string.
   *
   * @private
   * @param {String|Number|String[]|Number[]} value The value.
   * @returns {String} The URL-encoded string.
   */
  valueString: function (value) {
    value = AjaxSolr.isArray(value) ? value.join(',') : value;
    return encodeURIComponent(value);
  },

  /**
   * Parses a URL-encoded string to return the value.
   *
   * @private
   * @param {String} str The URL-encoded string.
   * @returns {Array} The value.
   */
  parseValueString: function (str) {
    str = decodeURIComponent(str);
    return str.indexOf(',') == -1 ? str : str.split(',');
  }
});

/**
 * Escapes a value, to be used in, for example, an fq parameter. Surrounds
 * strings containing spaces or colons in double quotes.
 *
 * @public
 * @param {String|Number} value The value.
 * @returns {String} The escaped value.
 */
AjaxSolr.Parameter.escapeValue = function (value) {
  // If the field value has a space or a colon in it, wrap it in quotes,
  // unless it is a range query or it is already wrapped in quotes.
  if (value.match(/[ :]/) && !value.match(/[\[\{]\S+ TO \S+[\]\}]/) && !value.match(/^["\(].*["\)]$/)) {
    return '"' + value + '"';
  }
  return value;
}

// $Id$

/**
 * The ParameterStore, as its name suggests, stores Solr parameters. Widgets
 * expose some of these parameters to the user. Whenever the user changes the
 * values of these parameters, the state of the application changes. In order to
 * allow the user to move back and forth between these states with the browser's
 * Back and Forward buttons, and to bookmark these states, each state needs to
 * be stored. The easiest method is to store the exposed parameters in the URL
 * hash (see the <tt>ParameterHashStore</tt> class). However, you may implement
 * your own storage method by extending this class.
 *
 * <p>For a list of possible parameters, please consult the links below.</p>
 *
 * @see http://wiki.apache.org/solr/CoreQueryParameters
 * @see http://wiki.apache.org/solr/CommonQueryParameters
 * @see http://wiki.apache.org/solr/SimpleFacetParameters
 * @see http://wiki.apache.org/solr/HighlightingParameters
 * @see http://wiki.apache.org/solr/MoreLikeThis
 * @see http://wiki.apache.org/solr/SpellCheckComponent
 * @see http://wiki.apache.org/solr/StatsComponent
 * @see http://wiki.apache.org/solr/TermsComponent
 * @see http://wiki.apache.org/solr/TermVectorComponent
 * @see http://wiki.apache.org/solr/LocalParams
 *
 * @param properties A map of fields to set. Refer to the list of public fields.
 * @class ParameterStore
 */
AjaxSolr.ParameterStore = AjaxSolr.Class.extend(
  /** @lends AjaxSolr.ParameterStore.prototype */
  {
  /**
   * The names of the exposed parameters. Any parameters that your widgets
   * expose to the user, directly or indirectly, should be listed here.
   *
   * @field
   * @public
   * @type String[]
   * @default []
   */
  exposed: [],

  /**
   * The Solr parameters.
   *
   * @field
   * @private
   * @type Object
   * @default {}
   */
  params: {},

  /**
   * A reference to the parameter store's manager. For internal use only.
   *
   * @field
   * @private
   * @type AjaxSolr.AbstractManager
   */
  manager: null,

  /**
   * An abstract hook for child implementations.
   *
   * <p>This method should do any necessary one-time initializations.</p>
   */
  init: function () {},

  /**
   * Some Solr parameters may be specified multiple times. It is easiest to
   * hard-code a list of such parameters. You may change the list by passing
   * <code>{ multiple: /pattern/ }</code> as an argument to the constructor of
   * this class or one of its children, e.g.:
   *
   * <p><code>new ParameterStore({ multiple: /pattern/ })</code>
   *
   * @param {String} name The name of the parameter.
   * @returns {Boolean} Whether the parameter may be specified multiple times.
   * @see http://lucene.apache.org/solr/api/org/apache/solr/handler/DisMaxRequestHandler.html
   */
  isMultiple: function (name) {
    return name.match(/^(?:bf|bq|facet\.date|facet\.date\.other|facet\.date\.include|facet\.field|facet\.pivot|facet\.range|facet\.range\.other|facet\.range\.include|facet\.query|fq|group\.field|group\.func|group\.query|pf|qf)$/);
  },

  /**
   * Returns a parameter. If the parameter doesn't exist, creates it.
   *
   * @param {String} name The name of the parameter.
   * @returns {AjaxSolr.Parameter|AjaxSolr.Parameter[]} The parameter.
   */
  get: function (name) {
    if (this.params[name] === undefined) {
      var param = new AjaxSolr.Parameter({ name: name });
      if (this.isMultiple(name)) {
        this.params[name] = [ param ];
      }
      else {
        this.params[name] = param;
      }
    }
    return this.params[name];
  },

  /**
   * If the parameter may be specified multiple times, returns the values of
   * all identically-named parameters. If the parameter may be specified only
   * once, returns the value of that parameter.
   *
   * @param {String} name The name of the parameter.
   * @returns {String[]|Number[]} The value(s) of the parameter.
   */
  values: function (name) {
    if (this.params[name] !== undefined) {
      if (this.isMultiple(name)) {
        var values = [];
        for (var i = 0, l = this.params[name].length; i < l; i++) {
          values.push(this.params[name][i].val());
        }
        return values;
      }
      else {
        return [ this.params[name].val() ];
      }
    }
    return [];
  },

  /**
   * If the parameter may be specified multiple times, adds the given parameter
   * to the list of identically-named parameters, unless one already exists with
   * the same value. If it may be specified only once, replaces the parameter.
   *
   * @param {String} name The name of the parameter.
   * @param {AjaxSolr.Parameter} [param] The parameter.
   * @returns {AjaxSolr.Parameter|Boolean} The parameter, or false.
   */
  add: function (name, param) {
    if (param === undefined) {
      param = new AjaxSolr.Parameter({ name: name });
    }
    if (this.isMultiple(name)) {
      if (this.params[name] === undefined) {
        this.params[name] = [ param ];
      }
      else {
        if (AjaxSolr.inArray(param.val(), this.values(name)) == -1) {
          this.params[name].push(param);
        }
        else {
          return false;
        }
      }
    }
    else {
      this.params[name] = param;
    }
    return param;
  },

  /**
   * Deletes a parameter.
   *
   * @param {String} name The name of the parameter.
   * @param {Number} [index] The index of the parameter.
   */
  remove: function (name, index) {
    if (index === undefined) {
      delete this.params[name];
    }
    else {
      this.params[name].splice(index, 1);
      if (this.params[name].length == 0) {
        delete this.params[name];
      }
    }
  },

  /**
   * Finds all parameters with matching values.
   *
   * @param {String} name The name of the parameter.
   * @param {String|Number|String[]|Number[]|RegExp} value The value.
   * @returns {String|Number[]} The indices of the parameters found.
   */
  find: function (name, value) {
    if (this.params[name] !== undefined) {
      if (this.isMultiple(name)) {
        var indices = [];
        for (var i = 0, l = this.params[name].length; i < l; i++) {
          if (AjaxSolr.equals(this.params[name][i].val(), value)) {
            indices.push(i);
          }
        }
        return indices.length ? indices : false;
      }
      else {
        if (AjaxSolr.equals(this.params[name].val(), value)) {
          return name;
        }
      }
    }
    return false;
  },

  /**
   * If the parameter may be specified multiple times, creates a parameter using
   * the given name and value, and adds it to the list of identically-named
   * parameters, unless one already exists with the same value. If it may be
   * specified only once, replaces the parameter.
   *
   * @param {String} name The name of the parameter.
   * @param {String|Number|String[]|Number[]} value The value.
   * @param {Object} [locals] The parameter's local parameters.
   * @returns {AjaxSolr.Parameter|Boolean} The parameter, or false.
   */
  addByValue: function (name, value, locals) {
    if (locals === undefined) {
      locals = {};
    }
    if (this.isMultiple(name) && AjaxSolr.isArray(value)) {
      var ret = [];
      for (var i = 0, l = value.length; i < l; i++) {
        ret.push(this.add(name, new AjaxSolr.Parameter({ name: name, value: value[i], locals: locals })));
      }
      return ret;
    }
    else {
      return this.add(name, new AjaxSolr.Parameter({ name: name, value: value, locals: locals }));
    }
  },

  /**
   * Deletes any parameter with a matching value.
   *
   * @param {String} name The name of the parameter.
   * @param {String|Number|String[]|Number[]|RegExp} value The value.
   * @returns {String|Number[]} The indices deleted.
   */
  removeByValue: function (name, value) {
    var indices = this.find(name, value);
    if (indices) {
      if (AjaxSolr.isArray(indices)) {
        for (var i = indices.length - 1; i >= 0; i--) {
          this.remove(name, indices[i]);
        }
      }
      else {
        this.remove(indices);
      }
    }
    return indices;
  },

  /**
   * Returns the Solr parameters as a query string.
   *
   * <p>IE6 calls the default toString() if you write <tt>store.toString()
   * </tt>. So, we need to choose another name for toString().</p>
   */
  string: function () {
    var params = [];
    for (var name in this.params) {
      if (this.isMultiple(name)) {
        for (var i = 0, l = this.params[name].length; i < l; i++) {
          params.push(this.params[name][i].string());
        }
      }
      else {
        params.push(this.params[name].string());
      }
    }
    return AjaxSolr.compact(params).join('&');
  },

  /**
   * Parses a query string into Solr parameters.
   *
   * @param {String} str The string to parse.
   */
  parseString: function (str) {
    var pairs = str.split('&');
    for (var i = 0, l = pairs.length; i < l; i++) {
      if (pairs[i]) { // ignore leading, trailing, and consecutive &'s
        var param = new AjaxSolr.Parameter();
        param.parseString(pairs[i]);
        this.add(param.name, param);
      }
    }
  },

  /**
   * Returns the exposed parameters as a query string.
   *
   * @returns {String} A string representation of the exposed parameters.
   */
  exposedString: function () {
    var params = [];
    for (var i = 0, l = this.exposed.length; i < l; i++) {
      if (this.params[this.exposed[i]] !== undefined) {
        if (this.isMultiple(this.exposed[i])) {
          for (var j = 0, m = this.params[this.exposed[i]].length; j < m; j++) {
            params.push(this.params[this.exposed[i]][j].string());
          }
        }
        else {
          params.push(this.params[this.exposed[i]].string());
        }
      }
    }
    return AjaxSolr.compact(params).join('&');
  },

  /**
   * Resets the values of the exposed parameters.
   */
  exposedReset: function () {
    for (var i = 0, l = this.exposed.length; i < l; i++) {
      this.remove(this.exposed[i]);
    }
  },

  /**
   * Loads the values of exposed parameters from persistent storage. It is
   * necessary, in most cases, to reset the values of exposed parameters before
   * setting the parameters to the values in storage. This is to ensure that a
   * parameter whose name is not present in storage is properly reset.
   *
   * @param {Boolean} [reset=true] Whether to reset the exposed parameters.
   *   before loading new values from persistent storage. Default: true.
   */
  load: function (reset) {
    if (reset === undefined) {
      reset = true;
    }
    if (reset) {
      this.exposedReset();
    }
    this.parseString(this.storedString());
  },
  
  /**
   * An abstract hook for child implementations.
   *
   * <p>Stores the values of the exposed parameters in persistent storage. This
   * method should usually be called before each Solr request.</p>
   */
  save: function () {},

  /**
   * An abstract hook for child implementations.
   *
   * <p>Returns the string to parse from persistent storage.</p>
   *
   * @returns {String} The string from persistent storage.
   */
  storedString: function () {
    return '';
  }
});

// $Id$

/**
 * Baseclass for all widgets. 
 * 
 * Provides abstract hooks for child classes.
 *
 * @param properties A map of fields to set. May be new or public fields.
 * @class AbstractWidget
 */
AjaxSolr.AbstractWidget = AjaxSolr.Class.extend(
  /** @lends AjaxSolr.AbstractWidget.prototype */
  {
  /** 
   * A unique identifier of this widget.
   *
   * @field 
   * @public
   * @type String
   */
  id: null,

  /** 
   * The CSS selector for this widget's target HTML element, e.g. a specific
   * <tt>div</tt> or <tt>ul</tt>. A Widget is usually implemented to perform
   * all its UI changes relative to its target HTML element.
   * 
   * @field 
   * @public
   * @type String
   */
  target: null,

  /**
   * A reference to the widget's manager. For internal use only.
   *
   * @field
   * @private
   * @type AjaxSolr.AbstractManager
   */
  manager: null,

  /**
   * The offset parameter. Set this field to make the widget reset the offset
   * parameter to the given value on each request.
   *
   * @field
   * @public
   * @type Number
   */
  start: undefined,

  /**
   * The Solr servlet for this widget. You may prepend the servlet with a core
   * if using multiple cores. If none is set, it will default to the manager's
   * servlet.
   *
   * @field
   * @public
   * @type String
   */
  servlet: undefined,

  /**
   * An abstract hook for child implementations.
   *
   * <p>This method should do any necessary one-time initializations.</p>
   */
  init: function () {},

  /** 
   * An abstract hook for child implementations.
   *
   * <p>This method is executed before the Solr request is sent.</p>
   */
  beforeRequest: function () {},

  /**
   * An abstract hook for child implementations.
   *
   * <p>This method is executed after the Solr response is received.</p>
   */
  afterRequest: function () {},

  /**
   * A proxy to the manager's doRequest method.
   *
   * @param {Boolean} [start] The Solr start offset parameter.
   * @param {String} [servlet] The Solr servlet to send the request to.
   */
  doRequest: function (start, servlet) {
    this.manager.doRequest(start || this.start, servlet || this.servlet);
  }
});
         // $Id$

/**
 * The Manager acts as the controller in a Model-View-Controller framework. All
 * public calls should be performed on the manager object.
 *
 * @param properties A map of fields to set. Refer to the list of public fields.
 * @class AbstractManager
 */
AjaxSolr.AbstractManager = AjaxSolr.Class.extend(
  /** @lends AjaxSolr.AbstractManager.prototype */
  {
  /**
   * The fully-qualified URL of the Solr application. You must include the
   * trailing slash. Do not include the path to any Solr servlet.
   *
   * @field
   * @public
   * @type String
   * @default "http://localhost:8983/solr/"
   */
  solrUrl: 'http://localhost:8983/solr/',

  /**
   * If we want to proxy queries through a script, rather than send queries
   * to Solr directly, set this field to the fully-qualified URL of the script.
   *
   * @field
   * @public
   * @type String
   */
  proxyUrl: null,

  /**
   * The default Solr servlet. You may prepend the servlet with a core if using
   * multiple cores.
   *
   * @field
   * @public
   * @type String
   * @default "select"
   */
  servlet: 'select',

  /**
   * The most recent response from Solr.
   *
   * @field
   * @private
   * @type Object
   * @default {}
   */
  response: {},

  /** 
   * A collection of all registered widgets. For internal use only.
   *
   * @field
   * @private
   * @type Object
   * @default {}
   */
  widgets: {},

  /**
   * The parameter store for the manager and its widgets. For internal use only.
   *
   * @field
   * @private
   * @type Object
   */
  store: null,

  /**
   * Whether <tt>init()</tt> has been called yet. For internal use only.
   *
   * @field
   * @private
   * @type Boolean
   * @default false
   */
  initialized: false,

  /**
   * An abstract hook for child implementations.
   *
   * <p>This method should be called after the store and the widgets have been
   * added. It should initialize the widgets and the store, and do any other
   * one-time initializations, e.g., perform the first request to Solr.</p>
   *
   * <p>If no store has been set, it sets the store to the basic <tt>
   * AjaxSolr.ParameterStore</tt>.</p>
   */
  init: function () {
    this.initialized = true;
    if (this.store === null) {
      this.setStore(new AjaxSolr.ParameterStore());
    }
    this.store.load(false);
    for (var widgetId in this.widgets) {
      this.widgets[widgetId].init();
    }
    this.store.init();
  },

  /**
   * Set the manager's parameter store.
   *
   * @param {AjaxSolr.ParameterStore} store
   */
  setStore: function (store) { 
    store.manager = this;
    this.store = store;
  },

  /** 
   * Adds a widget to the manager.
   *
   * @param {AjaxSolr.AbstractWidget} widget
   */
  addWidget: function (widget) { 
    widget.manager = this;
    this.widgets[widget.id] = widget;
  },

  /** 
   * Stores the Solr parameters to be sent to Solr and sends a request to Solr.
   *
   * @param {Boolean} [start] The Solr start offset parameter.
   * @param {String} [servlet] The Solr servlet to send the request to.
   */
  doRequest: function (start, servlet) {
    if (this.initialized === false) {
      this.init();
    }
    // Allow non-pagination widgets to reset the offset parameter.
    if (start !== undefined) {
      this.store.get('start').val(start);
    }
    if (servlet === undefined) {
      servlet = this.servlet;
    }

    this.store.save();

    for (var widgetId in this.widgets) {
      this.widgets[widgetId].beforeRequest();
    }

    this.executeRequest(servlet);
  },

  /**
   * An abstract hook for child implementations.
   *
   * <p>Sends the request to Solr, i.e. to <code>this.solrUrl</code> or <code>
   * this.proxyUrl</code>, and receives Solr's response. It should send <code>
   * this.store.string()</code> as the Solr query, and it should pass Solr's
   * response to <code>handleResponse()</code> for handling.</p>
   *
   * <p>See <tt>managers/Manager.jquery.js</tt> for a jQuery implementation.</p>
   *
   * @param {String} servlet The Solr servlet to send the request to.
   * @throws If not defined in child implementation.
   */
  executeRequest: function (servlet) {
    throw 'Abstract method executeRequest must be overridden in a subclass.';
  },

  /**
   * This method is executed after the Solr response data arrives. Allows each
   * widget to handle Solr's response separately.
   *
   * @param {Object} data The Solr response.
   */
  handleResponse: function (data) {
    this.response = data;

    for (var widgetId in this.widgets) {
      this.widgets[widgetId].afterRequest();
    }
  }
});
// $Id$

/**
 * Baseclass for all facet widgets.
 *
 * @class AbstractFacetWidget
 * @augments AjaxSolr.AbstractWidget
 */
AjaxSolr.AbstractFacetWidget = AjaxSolr.AbstractWidget.extend(
  /** @lends AjaxSolr.AbstractFacetWidget.prototype */
  {
  /**
   * This widget will by default set the offset parameter to 0 on each request.
   */
  start: 0,

  /**
   * The field to facet on.
   *
   * @field
   * @public
   * @type String
   */
  field: null,

  /**
   * Set to <tt>false</tt> to force a single "fq" parameter for this widget.
   *
   * @field
   * @public
   * @type Boolean
   * @default true
   */
  multivalue: true,

  init: function () {
    this.initStore();
  },

  /**
   * Add facet parameters to the parameter store.
   */
  initStore: function () {
    /* http://wiki.apache.org/solr/SimpleFacetParameters */
    var parameters = [
      'facet.prefix',
      'facet.sort',
      'facet.limit',
      'facet.offset',
      'facet.mincount',
      'facet.missing',
      'facet.method',
      'facet.enum.cache.minDf'
    ];

    this.manager.store.addByValue('facet', true);

    // Set facet.field, facet.date or facet.range to truthy values to add
    // related per-field parameters to the parameter store.
    if (this['facet.field'] !== undefined) {
      this.manager.store.addByValue('facet.field', this.field);
    }
    else if (this['facet.date'] !== undefined) {
      this.manager.store.addByValue('facet.date', this.field);
      parameters = parameters.concat([
        'facet.date.start',
        'facet.date.end',
        'facet.date.gap',
        'facet.date.hardend',
        'facet.date.other',
        'facet.date.include'
      ]);
    }
    else if (this['facet.range'] !== undefined) {
      this.manager.store.addByValue('facet.range', this.field);
      parameters = parameters.concat([
        'facet.range.start',
        'facet.range.end',
        'facet.range.gap',
        'facet.range.hardend',
        'facet.range.other',
        'facet.range.include'
      ]);
    }

    for (var i = 0, l = parameters.length; i < l; i++) {
      if (this[parameters[i]] !== undefined) {
        this.manager.store.addByValue('f.' + this.field + '.' + parameters[i], this[parameters[i]]);
      }
    }
  },

  /**
   * @returns {Boolean} Whether any filter queries have been set using this
   *   widget's facet field.
   */
  isEmpty: function () {
    return !this.manager.store.find('fq', new RegExp('^-?' + this.field + ':'));
  },

  /**
   * Sets the filter query.
   *
   * @returns {Boolean} Whether the selection changed.
   */
  set: function (value) {
    return this.changeSelection(function () {
     // var a = this.manager.store.removeByValue('fq', new RegExp('^-?' + 'searchcat' + ':')),
       var a = this.manager.store.removeByValue('fq', new RegExp('^-?' + this.field + ':')),
          b = this.manager.store.addByValue('fq', this.fq(value));
      return a || b;
    });
  },

  /**
   * Adds a filter query.
   *
   * @returns {Boolean} Whether a filter query was added.
   */
  add: function (value) {
    return this.changeSelection(function () {
      return this.manager.store.addByValue('fq', this.fq(value));
    });
  },

  /**
   * Removes a filter query.
   *
   * @returns {Boolean} Whether a filter query was removed.
   */
  remove: function (value) {
    return this.changeSelection(function () {
      return this.manager.store.removeByValue('fq', this.fq(value));
    });
  },

  /**
   * Removes all filter queries using the widget's facet field.
   *
   * @returns {Boolean} Whether a filter query was removed.
   */
  clear: function () {
    return this.changeSelection(function () {
      return this.manager.store.removeByValue('fq', new RegExp('^-?' + this.field + ':'));
    });
  },

  /**
   * Helper for selection functions.
   *
   * @param {Function} Selection function to call.
   * @returns {Boolean} Whether the selection changed.
   */
  changeSelection: function (func) {
    changed = func.apply(this);
    if (changed) {
      this.afterChangeSelection();
    }
    return changed;
  },

  /**
   * An abstract hook for child implementations.
   *
   * <p>This method is executed after the filter queries change.</p>
   */
  afterChangeSelection: function () {},

  /**
   * One of "facet.field", "facet.date" or "facet.range" must be set on the
   * widget in order to determine where the facet counts are stored.
   *
   * @returns {Array} An array of objects with the properties <tt>facet</tt> and
   * <tt>count</tt>, e.g <tt>{ facet: 'facet', count: 1 }</tt>.
   */
  getFacetCounts: function () {
    var property;
    if (this['facet.field'] !== undefined) {
      property = 'facet_fields';
    }
    else if (this['facet.date'] !== undefined) {
      property = 'facet_dates';
    }
    else if (this['facet.range'] !== undefined) {
      property = 'facet_ranges';
    }
    if (property !== undefined) {
      switch (this.manager.store.get('json.nl').val()) {
        case 'map':
          return this.getFacetCountsMap(property);
        case 'arrarr':
          return this.getFacetCountsArrarr(property);
        default:
          return this.getFacetCountsFlat(property);
      }
    }
    throw 'Cannot get facet counts unless one of the following properties is set to "true" on widget "' + this.id + '": "facet.field", "facet.date", or "facet.range".';
  },

  /**
   * Used if the facet counts are represented as a JSON object.
   *
   * @param {String} property "facet_fields", "facet_dates", or "facet_ranges".
   * @returns {Array} An array of objects with the properties <tt>facet</tt> and
   * <tt>count</tt>, e.g <tt>{ facet: 'facet', count: 1 }</tt>.
   */
  getFacetCountsMap: function (property) {
    var counts = [];
    for (var facet in this.manager.response.facet_counts[property][this.field]) {
      counts.push({
        facet: facet,
        count: parseInt(this.manager.response.facet_counts[property][this.field][facet])
      });
    }
    return counts;
  },

  /**
   * Used if the facet counts are represented as an array of two-element arrays.
   *
   * @param {String} property "facet_fields", "facet_dates", or "facet_ranges".
   * @returns {Array} An array of objects with the properties <tt>facet</tt> and
   * <tt>count</tt>, e.g <tt>{ facet: 'facet', count: 1 }</tt>.
   */
  getFacetCountsArrarr: function (property) {
    var counts = [];
    for (var i = 0, l = this.manager.response.facet_counts[property][this.field].length; i < l; i++) {
      counts.push({
        facet: this.manager.response.facet_counts[property][this.field][i][0],
        count: parseInt(this.manager.response.facet_counts[property][this.field][i][1])
      });
    }
    return counts;
  },

  /**
   * Used if the facet counts are represented as a flat array.
   *
   * @param {String} property "facet_fields", "facet_dates", or "facet_ranges".
   * @returns {Array} An array of objects with the properties <tt>facet</tt> and
   * <tt>count</tt>, e.g <tt>{ facet: 'facet', count: 1 }</tt>.
   */
  getFacetCountsFlat: function (property) {
    var counts = [];
    for (var i = 0, l = this.manager.response.facet_counts[property][this.field].length; i < l; i += 2) {
      counts.push({
        facet: this.manager.response.facet_counts[property][this.field][i],
        count: parseInt(this.manager.response.facet_counts[property][this.field][i+1])
      });
    }
    return counts;
  },

  /**
   * @param {String} value The value.
   * @returns {Function} Sends a request to Solr if it successfully adds a
   *   filter query with the given value.
   */
  clickHandler: function (value) {
    var self = this, meth = this.multivalue ? 'add' : 'set';
    return function () {
// USED BY PRODUCT SEARCH BOX AND AUTO COMPLETE
      if (self[meth].call(self, value)) {
      // ADDED CUSTOM RN FUNCTIONS 
    var fq = self.manager.store.values('fq');
    //   console.log('fq=' + fq); 
     $.cookie('SearchFilter',fq);
    //   console.log('fq=' + fq); 
    //   console.log('value=' + value); 
    //   var fq = encodeURIComponent(fq)  ;
    //    console.log('fq=' + fq); 
    // addfield(fq,"submitvar", document.forms[0].submitvar) ;
// IF WE have results just do a request not a full submit
    if($('#docs').length){
        self.doRequest();
     } else {
     addfield("N","searchflag", document.forms[0].searchflag) ;
     addfield("1","searchptr", document.forms[0].searchptr) ;
     addfield("1","startptr", document.forms[0].startptr) ;
     addfield("SR","loginpath", document.forms[0].loginpath) ;
     showmodalsearch() ;
      // AddGoogleSearch() ;
    document.forms[0].submit(); 
   }
  //  changepath("PS") ;
//        self.doRequest();
      }
      return false;
    }
  },

  /**
   * @param {String} value The value.
   * @returns {Function} Sends a request to Solr if it successfully removes a
   *   filter query with the given value.
   */
  unclickHandler: function (value) {
    var self = this;
    return function () {
      if (self.remove(value)) {
        self.doRequest();
      }
      return false;
    }
  },

  /**
   * @param {String} value The facet value.
   * @param {Boolean} exclude Whether to exclude this fq parameter value.
   * @returns {String} An fq parameter value.
   */
  fq: function (value, exclude) {
    return (exclude ? '-' : '') + this.field + ':' + AjaxSolr.Parameter.escapeValue(value);
  }
});
// $Id$

/**
 * Baseclass for all free-text widgets.
 *
 * @class AbstractTextWidget
 * @augments AjaxSolr.AbstractWidget
 */
AjaxSolr.AbstractTextWidget = AjaxSolr.AbstractWidget.extend(
  /** @lends AjaxSolr.AbstractTextWidget.prototype */
  {
  /**
   * This widget will by default set the offset parameter to 0 on each request.
   */
  start: 0,

  /**
   * Sets the main Solr query to the given string.
   *
   * @param {String} q The new Solr query.
   * @returns {Boolean} Whether the selection changed.
   */
  set: function (q) {
    return this.changeSelection(function () {
      this.manager.store.get('q').val(q);
    });
  },

  /**
   * Sets the main Solr query to the empty string.
   *
   * @returns {Boolean} Whether the selection changed.
   */
  clear: function () {
    return this.changeSelection(function () {
      this.manager.store.remove('q');
    });
  },

  /**
   * Helper for selection functions.
   *
   * @param {Function} Selection function to call.
   * @returns {Boolean} Whether the selection changed.
   */
  changeSelection: function (func) {
    var before = this.manager.store.get('q').val();
    func.apply(this);
    var after = this.manager.store.get('q').val();
    if (after !== before) {
      this.afterChangeSelection(after);
    }
    return after !== before;
  },

  /**
   * An abstract hook for child implementations.
   *
   * <p>This method is executed after the main Solr query changes.</p>
   *
   * @param {String} value The current main Solr query.
   */
  afterChangeSelection: function (value) {},

  /**
   * Returns a function to unset the main Solr query.
   *
   * @returns {Function}
   */
  unclickHandler: function () {
    var self = this;
    return function () {
      if (self.clear()) {
        self.doRequest();
      }
      return false;
    }
  },

  /**
   * Returns a function to set the main Solr query.
   *
   * @param {String} value The new Solr query.
   * @returns {Function}
   */
  clickHandler: function (q) {
    var self = this;
    return function () {
      if (self.set(q)) {
        self.doRequest();
      }
      return false;
    }
  }
});
// $Id$

/**
 * @see http://wiki.apache.org/solr/SolJSON#JSON_specific_parameters
 * @class Manager
 * @augments AjaxSolr.AbstractManager
 */
AjaxSolr.Manager = AjaxSolr.AbstractManager.extend(
  /** @lends AjaxSolr.Manager.prototype */
  {
  executeRequest: function (servlet, string, handler) {
    var self = this;
    string = string || this.store.string();
    handler = handler || function (data) {
      self.handleResponse(data);
    };
    if (this.proxyUrl) {
      jQuery.post(this.proxyUrl, { query: string }, handler, 'json');
    }
    else {
      jQuery.getJSON(this.solrUrl + servlet + '?' + string + '&wt=json&json.wrf=?', {}, handler);
    }
  }
});

var Manager;
var viewtype ;
var l = window.location;
var base_url = l.protocol + "//" + l.host + "/" 
function changeview(xval) {
       //$('viewtype').val(xval) ;
       viewtype = xval ;
      // changed to set viewtype as cookie as well 
      $.cookie('viewtype',xval)  ; 
       if (process_order(0)) {  Manager.doRequest();  }  ;
}
(function ($) {

  $(function () {
    var gridhtml = " "  ;
    gridhtml += "<div class=viewer style='float:right;'>" ; 
    gridhtml += "<a href=\"javascript:changeview('grid')\" title=\"View items in a Grid\"> <img border=0 src='https://iws.helby.com/webimages/grid.jpg' alt='View items in a Grid'> </a>" ; 
    gridhtml += "<a href=\"javascript:changeview('list')\" title=\"View items in a List\"> <img border=0 src='https://iws.helby.com/webimages/list.jpg'> </a>" ; 
    gridhtml += "</div> " ;
   //  gridhtml += "<input type=hidden value='list' id='viewtype' name='viewtype' > " ;

    Manager = new AjaxSolr.Manager({
      
      solrUrl: base_url + '/solr/products/'
    });
    if($('#docs').length){
    Manager.addWidget(new AjaxSolr.ResultWidget({
      id: 'result',
      target: '#docs'
    }));
    }
    if($('#pager').length){
    Manager.addWidget(new AjaxSolr.PagerWidget({
      id: 'pager',
      target: '#pager',
      prevLabel: 'Previous',
      nextLabel: 'Next',
      innerWindow: 4,
      renderHeader: function (perPage, offset, total) {
       if (total > 0) {
        $('#pager-footer').html($('<span/>').text('Displaying ' + Math.min(total, offset + 1) + ' to ' + Math.min(total, offset + perPage) + ' of ' + total));
        $('#pager-footer').append(gridhtml) ;
       }
      }
    }));
    }
    if($('#toppager').length){
     Manager.addWidget(new AjaxSolr.PagerWidget({
      id: 'toppager',
      target: '#toppager',
      prevLabel: 'Previous',
      nextLabel: 'Next',
      innerWindow: 4,
      renderHeader: function (perPage, offset, total) {
        if (total > 0) {
        $('#pager-header').html($('<span/>').text('Displaying ' + Math.min(total, offset + 1) + ' to ' + Math.min(total, offset + perPage) + ' of ' + total));
        $('#pager-header').append(gridhtml) ;
        }
      }
    }));
    }
//    var fields = [ 'webtypes', 'webclasses', 'webcatgs' , 'websubcatgs', 'searchcat' ];
//    for (var i = 0, l = fields.length; i < l; i++) {
//      Manager.addWidget(new AjaxSolr.TagcloudWidget({
//        id: fields[i],
//        target: '#' + fields[i],
//        field: fields[i]
//      }));
//    }
 if($('#selection').length){
    Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
      id: 'currentsearch',
      target: '#selection'
    }));
  }
 //   Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
 //     id: 'currentsearchside',
 //     target: '#sidebarselection'
 //   }));
 if($('#search').length){
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'text',
      target: '#search',
      fields: [ 'allText' ]
      // fields: [ 'webtypes', 'webclasses', 'webcatgs', 'text', 'aprodno' ]
    }));
    }
    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
   //   'facet.field': [ 'webtypes' ],
      'facet.limit': 50,
      'facet.mincount': 1,
      'rows': 0 ,
      'json.nl': 'map'
    };
    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }
    Manager.doRequest();
  });

  $.fn.showIf = function (condition) {
    if (condition) {
      return this.show();
    }
    else {
      return this.hide();
    }
  }

})(jQuery);

//loaded code from test account 12-19-13
(function ($) {
// grid option 
AjaxSolr.theme.prototype.resultgrid = function (doc, snippet) {   
 var strVar="";
 var CID = document.forms[0].CustomerId.value ;
 var OID = document.forms[0].orderno.value  ;
var url = document.location.href;
url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
url = url.substring(url.lastIndexOf("/") + 1, url.length);
if (doc.image == 'undefined' || doc.image == '') { doc.image = 'noprod.gif'} ;
strVar += "<div id=\"SRBodyLine" + doc.id + "\" class=\"shadow SRGridLine\" + \">";
strVar += "<div id=\"SRBodypicturewrap\" style=\"width: auto ; float: left; \" >" 
// strVar += "\<a href='javascript:browsedetail("+ OID +",\""+ doc.aprodno +"\")'" ;
strVar += "<a href=\"javascript:prod_inquiry('PI','N','"+ doc.aprodno +"')\" " ;
strVar += " class=\"hintanchor\" onmouseover=\"showhintajax('" + url +"?&aprodno="+ doc.aprodno +"&orderno="+ OID +"&LOGINPATH=PIF&PAGEID=31&CUSTOMERID="+ CID +"', this, event, '150px')\">";
strVar += "<img id=\"SRBodyLineImage\" class=\"lazy\" ";
strVar += "src=\"https:\/\/iws.helby.com\/webimages\/"+ "spacer.gif" + "\" "  ;
strVar += " data-original=\"https:\/\/iws.helby.com\/webimages\/" + doc.image + "\" "  ;
strVar += " rel=\"SRLineLoad('" + doc.id + "','" + doc.aprodno + "')\" " ;
strVar += " style='border-style: none; display: inline-block;' width=\"100\" height=\"100\"><\/a><\/div>";
// moved up smaller elements  show on right 

strVar += "<div id=\"SRbodyqtybox\" style=\"width: auto ; float: right; height: auto; padding-top: 5px; \" ><input tabindex=\"1\" type=\"text\" size=\"2\" maxlength=\"6\" name=\"" + doc.aprodno +"||EA|0||\" onchange=\"qtychk2(value,name)\"><\/div> ";
strVar += "<div class=SRBodyiconwrap id=\"SRBodyiconwrap" + doc.id + "\" style=\"width: 70px ; float: left; height: auto \">";
// strVar += "<div id=\"SRbodyinstock" + doc.id + "\"><\/div> ";
if (doc.stock) {
strVar += "<div class=\"SRbodyinstock\">" + doc.stock + "<\/div> ";
 }  ;
 // added
strVar += "<\/div> "; // for icons

strVar += "<div class=SRBodyproddesc id=\"SRbodyproddesc" + doc.id + "\" style=\"width: 190px ; height: 120px; background-color: transparent ; \">";
strVar += "<a href=\"javascript:prod_inquiry('PI','N','"+ doc.aprodno +"')\">" + doc.aprodno;
strVar += "<br>" + snippet + "<\/a>";
if (doc.webspclmsg) { strVar += "<div class='pifxclass' > " + doc.webspclmsg + "</div>" } ;
if (doc.webfactory) { strVar +=  doc.webfactory } ;  
// strVar += "<br><a href=\"javascript:SRLineLoad('" + doc.id + "','" + doc.aprodno + "')\"> click here for pricing until i get lazy load working <\/a>";
// strVar += "<div id=\"SRcloseoutholder" + doc.id + "\" class=\"special\"><\/div>";
if (doc.closeout) {
// strVar += "<div class=\"closeout\">  <div style=\"label\"> Close Out <div class=\"labelhide\">" + doc.closeout  ;
strVar += "<div class=\"closeout\">  <div style=\"label\"> <div class=\"labelhide\">"  ;
strVar += "</div></div></div> " ;
            } ;
if (doc.discount) {
strVar += "<div class=\"discount\">  <div style=\"label\"> Already Marked Down!! <div class=\"labelhide\">" + doc.discount  ;
strVar += "</div></div></div> " ;
            } ;
// strVar += "<div id=\"SRdiscountholder" + doc.id + "\" class=\"special\"><\/div>";
// Added new iconbarwrap 12-20-13
strVar += "<div class=iconbarwrapg id=\"iconbarwrap" + doc.id + "\" >";

if (doc.videoxref) {
strVar += "<div class=\"SRVideo\"  style=\"height: 35px; width: 30px;float: left;\"> " ; 
strVar += "<a href=\"#\" onclick=\"iframewin=dhtmlwindow.open('iframebox', 'iframe', '" + doc.videoxref + "', 'Beadsmith Video', 'width=650px,height=400px,left=300px,top=100px,resize=0,scrolling=1'); return false\"> " ;
strVar += "<img src=\"https://img8.helby.com/webimages/video.gif\" class=\"hintanchor\" onmouseover=\"showhint('Click here for video!', this, event, '150px')\" style=\"border-style:none;\">  </a></div> " ;
}
if (doc.webgallery) {
strVar += "<div class=\"iconbar\"> ";
strVar += "<a href=\"#\" onclick=\"iframewin=dhtmlwindow.open('iframebox', 'iframe', '" + doc.webgallery + "', 'Beadsmith Gallery', 'width=760px,height=570px,left=300px,top=00px,resize=0,scrolling=1'); return false\"> " ;
strVar += "<img src=\"https://img8.helby.com/webimages/camera.png\" class=\"iconbarimage hintanchor\" onmouseover=\"showhint('Click here for a gallery of inspirational jewelry using this product.', this, event, '150px')\" style=\"border-style:none;\">  </a></div> " ;
}
if (doc.webnew) { strVar +=  doc.webnew } ;  

// strVar += "<div id=\"SRVideo" + doc.id + "\"><\/div> ";

// strVar += "<div id=\"SRProject" + doc.id + "\"><\/div> ";
if (doc.datasheetxref) {  strVar += datasheet(doc) ; }
if (doc.catpage) {
strVar += "<div class=\"SRcatpage\"  style=\"height: 35px; width: 30px;float: left;\"> " ; 
strVar += " <a target=new href=\"https://iws.helby.com/webimages/pdf/" + doc.catpage + "\" class=\"hintanchor\" onmouseover=\"showhint('Click here for Catalog Page', this, event, '150px')\">" ;
strVar +=" <img src=\"https://iws.helby.com/webimages/cat.gif\" style=\"border-style:none; margin-top:3px;\"> " ;
strVar +=" </a></div>" ;
// strVar += "<div id=\"SRCatPg\">" + doc.catpage +"<\/div>";
}
strVar += "<\/div> "; // for iconbarwrap
strVar += "<\/div> "; // for image
strVar += "<div class=SRbodyQTYLine id=\"SRbodyQTYLine" + doc.id + "\">";
strVar += "<div id=\"tabsPL" + doc.id + "\"><\/div>";
strVar += "<div id=\"typedivcontainer" + doc.id + "\"><\/div>";
strVar += "<\/div> ";
// strVar += "<div id=\"SRbodyqtybox\"><input tabindex=\"1\" type=\"text\" size=\"2\" maxlength=\"6\" name=\"" + doc.aprodno +"||EA|0||\" onchange=\"qtychk2(value,name)\"><\/div> ";
strVar += "<\/div>";      // for line 
 // var output = '<div><h2><img width=100 height=100 src=http://iws.helby.com/webimages/' + doc.image + '>' + doc.title + '</h2>';
 // output += '<p id="links_' + doc.id + '" class="links"></p>';
 // output += '<p>' + snippet + '</p></div>';
// added css updates in function 
$('#docs').css("float","left");
 $('div[id^="navigation"]').css("clear","both");
   
  return strVar;
};



//Standard line option
AjaxSolr.theme.prototype.result = function (doc, snippet) {   
 var strVar="";
 var CID = document.forms[0].CustomerId.value ;
 var OID = document.forms[0].orderno.value  ;
var url = document.location.href;
url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
url = url.substring(url.lastIndexOf("/") + 1, url.length);
if (doc.image == 'undefined' || doc.image == '') { doc.image = 'noprod.gif'} ;
strVar += "<div id='SRBodyLine" + doc.id + "' class='SRSearchLine' >";
strVar += "<div id=\"SRBodypicturewrap\">" 
// strVar += "\<a href='javascript:browsedetail("+ OID +",\""+ doc.aprodno +"\")'" ;
strVar += "<a href=\"javascript:prod_inquiry('PI','N','"+ doc.aprodno +"')\" " ;
strVar += " class=\"hintanchor\" onmouseover=\"showhintajax('" + url +"?&aprodno="+ doc.aprodno +"&orderno="+ OID +"&LOGINPATH=PIF&PAGEID=31&CUSTOMERID="+ CID +"', this, event, '150px')\">";
strVar += "<img id=\"SRBodyLineImage\" class=\"lazy\" ";
strVar += "src=\"https:\/\/iws.helby.com\/webimages\/"+ "spacer.gif" + "\" "  ;
strVar += " data-original=\"https:\/\/iws.helby.com\/webimages\/" + doc.image + "\" "  ;
strVar += " rel=\"SRLineLoad('" + doc.id + "','" + doc.aprodno + "')\" " ;
strVar += " style='border-style: none; display: inline-block;' width=\"100\" height=\"100\"><\/a><\/div>";
strVar += "<div class=SRBodyproddesc id=\"SRbodyproddesc" + doc.id + "\">";
// strVar += "\<a href='javascript:browsedetail("+ OID +",\""+ doc.aprodno +"\")'>" + doc.aprodno + "<\/a>";
strVar += "<a href=\"javascript:prod_inquiry('PI','N','"+ doc.aprodno +"')\">" + doc.aprodno + "<\/a>";
strVar += "<br><a href=\"javascript:prod_inquiry('PI','N','"+ doc.aprodno +"')\">" + snippet + "<\/a>";
// strVar += "<br><a href=\"javascript:SRLineLoad('" + doc.id + "','" + doc.aprodno + "')\"> click here for pricing until i get lazy load working <\/a>";
// strVar += "<div id=\"SRcloseoutholder" + doc.id + "\" class=\"special\"><\/div>";
if (doc.webspclmsg) { strVar += "<div class='pifxclass' > " + doc.webspclmsg + "</div>" } ; 
if (doc.webfactory) { strVar +=  doc.webfactory } ;  
if (doc.closeout) {
// strVar += "<div class=\"closeout\">  <div style=\"label\"> Close Out <div class=\"labelhide\">" + doc.closeout  ;
strVar += "<div class=\"closeout\">  <div style=\"label\"> <div class=\"labelhide\">"  ;
strVar += "</div></div></div> " ;
            } ;
if (doc.discount) {
strVar += "<div class=\"discount\">  <div style=\"label\"> Already Marked Down!! <div class=\"labelhide\">" + doc.discount  ;
strVar += "</div></div></div> " ;
            } ;
// strVar += "<div id=\"SRdiscountholder" + doc.id + "\" class=\"special\"><\/div>";
// added iconbarwrap
strVar += "<div class=iconbarwrap id=\"iconbarwrap" + doc.id + "\" >";
if (doc.videoxref) {
strVar += "<div class=\"SRVideo\"  style=\"height: 35px; width: 30px;float: left;\"> " ; 
strVar += "<a href=\"#\" onclick=\"iframewin=dhtmlwindow.open('iframebox', 'iframe', '" + doc.videoxref + "', 'Beadsmith Video', 'width=650px,height=400px,left=300px,top=100px,resize=0,scrolling=1'); return false\"> " ;
strVar += "<img src=\"https://img8.helby.com/webimages/video.gif\" class=\"hintanchor\" onmouseover=\"showhint('Click here for video!', this, event, '150px')\" style=\"border-style:none;\">  </a></div> " ;
}
if (doc.webgallery) {
strVar += "<div class=\"iconbar\"> ";
strVar += "<a href=\"#\" onclick=\"iframewin=dhtmlwindow.open('iframebox', 'iframe', '" + doc.webgallery + "', 'Beadsmith Gallery', 'width=760px,height=570px,left=300px,top=00px,resize=0,scrolling=1'); return false\"> " ;
strVar += "<img src=\"https://img8.helby.com/webimages/camera.png\" class=\"iconbarimage hintanchor\" onmouseover=\"showhint('Click here for a gallery of inspirational jewelry using this product.', this, event, '150px')\" style=\"border-style:none;\">  </a></div> " ;
}
if (doc.webnew) { strVar +=  doc.webnew } ;  
// strVar += "<div id=\"SRVideo" + doc.id + "\"><\/div> ";

if (doc.datasheetxref) {  strVar += datasheet(doc) ; }
if (doc.catpage) {
strVar += "<div class=\"SRcatpage\"  style=\"height: 35px; width: 30px;float: left;\"> " ; 
strVar += " <a target=new href=\"https://iws.helby.com/webimages/pdf/" + doc.catpage + "\" class=\"hintanchor\" onmouseover=\"showhint('Click here for Catalog Page', this, event, '150px')\">" ;
strVar +=" <img src=\"https://iws.helby.com/webimages/cat.gif\" style=\"border-style:none; margin-top:3px;\"> " ;
strVar +=" </a></div>" ;
// strVar += "<div id=\"SRCatPg\">" + doc.catpage +"<\/div>";
}
strVar += "<\/div> "; // for iconbarwrap
strVar += "<\/div> ";
strVar += "<div class=SRBodyiconwrap id=\"SRBodyiconwrap" + doc.id + "\">";
// strVar += "<div id=\"SRbodyinstock" + doc.id + "\"><\/div> ";
if (doc.stock) {
strVar += "<div class=\"SRbodyinstock\">" + doc.stock + "<\/div> ";
 }  ;
 // added
strVar += "<\/div> ";
strVar += "<div class=SRbodyQTYLine id=\"SRbodyQTYLine" + doc.id + "\">";
strVar += "<div id=\"tabsPL" + doc.id + "\"><\/div>";
strVar += "<div id=\"typedivcontainer" + doc.id + "\"><\/div>";
strVar += "<\/div> ";
strVar += "<div id=\"SRbodyqtybox\"><input tabindex=\"1\" type=\"text\" size=\"2\" maxlength=\"6\" name=\"" + doc.aprodno +"||EA|0||\" onchange=\"qtychk2(value,name)\"><\/div> ";
strVar += "<\/div>";
 // var output = '<div><h2><img width=100 height=100 src=http://iws.helby.com/webimages/' + doc.image + '>' + doc.title + '</h2>';
 // output += '<p id="links_' + doc.id + '" class="links"></p>';
 // output += '<p>' + snippet + '</p></div>';
  return strVar;
};


AjaxSolr.theme.prototype.snippet = function (doc) {
  var output = '';
  // console.log('DOCUMENT TEXT IS ' + doc.text.length) ;
//  if (doc.text.length > 10) {
if (doc.proddesc) { output +=  doc.proddesc;} ;
if (doc.proddesc2) {   output +=  ' ' + doc.proddesc2 ;} ;
// output += '<br/> <span style="color: #C60;font-size: small;margin: 0px 0px 0.25em;">Click here for suggested items </span> '
output += searchmessage
  //  output += '<span style="display:none;">' + doc.text;
  //  output += '</span> <a href="#" class="more" > Show More </a>';
//  }
//  else {
//    output +=  doc.proddesc;
//  }
  return output;
};

//end loaded code 6-4-13 

AjaxSolr.theme.prototype.tag = function (value, weight, handler) {
  return $('<br/><a href="#" class="tagcloud_item"/>').text(value).addClass('tagcloud_size_' + weight).click(handler) ;
};

AjaxSolr.theme.prototype.tagtsh = function (value, weight, handler) {
     //  var fqarray = value.split("_") ;
     //  var fval = fqarray[0];
     //  var fname = fqarray[1];
    //  var resp = fname +' (' + weight + ')' ;
       var resp = value +' (' + weight + ')' ;
  return $('<br/> <a href="#" class="tagcloud_item"/>').text(resp).click(handler) ;
};

AjaxSolr.theme.prototype.facet_link = function (value, handler) {
  return $('<a href="#"/>').text(value).click(handler);
};

AjaxSolr.theme.prototype.no_items_found = function () {
  return 'We are sorry, There were no items found using your current selection criteria <br> Please try a new search';
};

})(jQuery);



/*! Copyright (c) 2008 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.0.3
 * Requires jQuery 1.1.3+
 * Docs: http://docs.jquery.com/Plugins/livequery
 */

(function($) {
	
$.extend($.fn, {
	livequery: function(type, fn, fn2) {
		var self = this, q;
		
		// Handle different call patterns
		if ($.isFunction(type))
			fn2 = fn, fn = type, type = undefined;
			
		// See if Live Query already exists
		$.each( $.livequery.queries, function(i, query) {
			if ( self.selector == query.selector && self.context == query.context &&
				type == query.type && (!fn || fn.$lqguid == query.fn.$lqguid) && (!fn2 || fn2.$lqguid == query.fn2.$lqguid) )
					// Found the query, exit the each loop
					return (q = query) && false;
		});
		
		// Create new Live Query if it wasn't found
		q = q || new $.livequery(this.selector, this.context, type, fn, fn2);
		
		// Make sure it is running
		q.stopped = false;
		
		// Run it immediately for the first time
		q.run();
		
		// Contnue the chain
		return this;
	},
	
	expire: function(type, fn, fn2) {
		var self = this;
		
		// Handle different call patterns
		if ($.isFunction(type))
			fn2 = fn, fn = type, type = undefined;
			
		// Find the Live Query based on arguments and stop it
		$.each( $.livequery.queries, function(i, query) {
			if ( self.selector == query.selector && self.context == query.context && 
				(!type || type == query.type) && (!fn || fn.$lqguid == query.fn.$lqguid) && (!fn2 || fn2.$lqguid == query.fn2.$lqguid) && !this.stopped )
					$.livequery.stop(query.id);
		});
		
		// Continue the chain
		return this;
	}
});

$.livequery = function(selector, context, type, fn, fn2) {
	this.selector = selector;
	this.context  = context || document;
	this.type     = type;
	this.fn       = fn;
	this.fn2      = fn2;
	this.elements = [];
	this.stopped  = false;
	
	// The id is the index of the Live Query in $.livequery.queries
	this.id = $.livequery.queries.push(this)-1;
	
	// Mark the functions for matching later on
	fn.$lqguid = fn.$lqguid || $.livequery.guid++;
	if (fn2) fn2.$lqguid = fn2.$lqguid || $.livequery.guid++;
	
	// Return the Live Query
	return this;
};

$.livequery.prototype = {
	stop: function() {
		var query = this;
		
		if ( this.type )
			// Unbind all bound events
			this.elements.unbind(this.type, this.fn);
		else if (this.fn2)
			// Call the second function for all matched elements
			this.elements.each(function(i, el) {
				query.fn2.apply(el);
			});
			
		// Clear out matched elements
		this.elements = [];
		
		// Stop the Live Query from running until restarted
		this.stopped = true;
	},
	
	run: function() {
		// Short-circuit if stopped
		if ( this.stopped ) return;
		var query = this;
		
		var oEls = this.elements,
			els  = $(this.selector, this.context),
			nEls = els.not(oEls);
		
		// Set elements to the latest set of matched elements
		this.elements = els;
		
		if (this.type) {
			// Bind events to newly matched elements
			nEls.bind(this.type, this.fn);
			
			// Unbind events to elements no longer matched
			if (oEls.length > 0)
				$.each(oEls, function(i, el) {
					if ( $.inArray(el, els) < 0 )
						$.event.remove(el, query.type, query.fn);
				});
		}
		else {
			// Call the first function for newly matched elements
			nEls.each(function() {
				query.fn.apply(this);
			});
			
			// Call the second function for elements no longer matched
			if ( this.fn2 && oEls.length > 0 )
				$.each(oEls, function(i, el) {
					if ( $.inArray(el, els) < 0 )
						query.fn2.apply(el);
				});
		}
	}
};

$.extend($.livequery, {
	guid: 0,
	queries: [],
	queue: [],
	running: false,
	timeout: null,
	
	checkQueue: function() {
		if ( $.livequery.running && $.livequery.queue.length ) {
			var length = $.livequery.queue.length;
			// Run each Live Query currently in the queue
			while ( length-- )
				$.livequery.queries[ $.livequery.queue.shift() ].run();
		}
	},
	
	pause: function() {
		// Don't run anymore Live Queries until restarted
		$.livequery.running = false;
	},
	
	play: function() {
		// Restart Live Queries
		$.livequery.running = true;
		// Request a run of the Live Queries
		$.livequery.run();
	},
	
	registerPlugin: function() {
		$.each( arguments, function(i,n) {
			// Short-circuit if the method doesn't exist
			if (!$.fn[n]) return;
			
			// Save a reference to the original method
			var old = $.fn[n];
			
			// Create a new method
			$.fn[n] = function() {
				// Call the original method
				var r = old.apply(this, arguments);
				
				// Request a run of the Live Queries
				$.livequery.run();
				
				// Return the original methods result
				return r;
			}
		});
	},
	
	run: function(id) {
		if (id != undefined) {
			// Put the particular Live Query in the queue if it doesn't already exist
			if ( $.inArray(id, $.livequery.queue) < 0 )
				$.livequery.queue.push( id );
		}
		else
			// Put each Live Query in the queue if it doesn't already exist
			$.each( $.livequery.queries, function(id) {
				if ( $.inArray(id, $.livequery.queue) < 0 )
					$.livequery.queue.push( id );
			});
		
		// Clear timeout if it already exists
		if ($.livequery.timeout) clearTimeout($.livequery.timeout);
		// Create a timeout to check the queue and actually run the Live Queries
		$.livequery.timeout = setTimeout($.livequery.checkQueue, 20);
	},
	
	stop: function(id) {
		if (id != undefined)
			// Stop are particular Live Query
			$.livequery.queries[ id ].stop();
		else
			// Stop all Live Queries
			$.each( $.livequery.queries, function(id) {
				$.livequery.queries[ id ].stop();
			});
	}
});

// Register core DOM manipulation methods
$.livequery.registerPlugin('append', 'prepend', 'after', 'before', 'wrap', 'attr', 'removeAttr', 'addClass', 'removeClass', 'toggleClass', 'empty', 'remove');

// Run Live Queries when the Document is ready
$(function() { $.livequery.play(); });


// Save a reference to the original init method
var init = $.prototype.init;

// Create a new init method that exposes two new properties: selector and context
$.prototype.init = function(a,c) {
	// Call the original init and save the result
	var r = init.apply(this, arguments);
	
	// Copy over properties if they exist already
	if (a && a.selector)
		r.context = a.context, r.selector = a.selector;
		
	// Set properties
	if ( typeof a == 'string' )
		r.context = c || document, r.selector = a;
	
	// Return the result
	return r;
};

// Give the init function the jQuery prototype for later instantiation (needed after Rev 4091)
$.prototype.init.prototype = $.prototype;
	
})(jQuery);

(function ($) {

AjaxSolr.AutocompleteWidget = AjaxSolr.AbstractTextWidget.extend({
  beforeRequest: function () {
  //  $.cookie('SearchFilter','');
  },
  afterRequest: function () {
    $(this.target).find('input').unbind().removeData('events').val('');

    var self = this;

    var callback = function (response) {
      var list = [];
      for (var i = 0; i < self.fields.length; i++) {
        var field = self.fields[i];
        for (var facet in response.facet_counts.facet_fields[field]) {
          list.push({
            field: field,
            value: facet,
           text: facet + ' (' + response.facet_counts.facet_fields[field][facet] + ')'
 //          text: facet + ' (' + response.facet_counts.facet_fields[field][facet] + ') - ' + field
 
          });
        }
      }

      self.requestSent = false;
      $(self.target).find('input').unautocomplete().autocomplete(list, {
        formatItem: function(facet) {
          return facet.text;
        }
      }).result(function(e, facet) {
        self.requestSent = true;
       // removed all other querys 
        self.manager.store.remove('fq');
                  //added code for multiple words    
var xvalue =  $('#query').val() ;                           
var curval = 'allText:(';
var pval = ' OR aprodno:(';
var fqarray = [] ;
var rfqarray = xvalue.split(" ") ; // each word gets added
 // clena up values in array 
   for (var i = 0; i < rfqarray.length; i++) { 
    if ((rfqarray[i] !== '') && (rfqarray[i].charAt(0) !== '(')) {
           fqarray.push(rfqarray[i]); 
    }
  }
  // now actually process the array 
var fcnt = fqarray.length - 1
  for (var i = 0; i < fcnt; i++) { 
           curval += '"' + AjaxSolr.Parameter.CleanValue(fqarray[i]) + '"' +  ' AND ' ;
           pval += '' + AjaxSolr.Parameter.CleanValue(fqarray[i]) + '*' +  ' OR ' ;  
   }
    curval += '"' +  AjaxSolr.Parameter.CleanValue(fqarray[fcnt]) + '"' + ')';
    pval += '' +  AjaxSolr.Parameter.CleanValue(fqarray[fcnt]) + '*' + ')';
curval = curval + pval ;
// var xvalue = curval ;
         if (self.manager.store.addByValue('fq', curval )) {
   
   //     if (self.manager.store.addByValue('fq', facet.field + ':' + AjaxSolr.Parameter.escapeValue(facet.value))) {
             var fq = self.manager.store.values('fq');
     $.cookie('SearchFilter',fq);
     addfield("N","searchflag", document.forms[0].searchflag) ;
     addfield("1","searchptr", document.forms[0].searchptr) ;
     addfield("1","startptr", document.forms[0].startptr) ;
     addfield("SR","loginpath", document.forms[0].loginpath) ;
     addfield("","submitvar", document.forms[0].submitvar) ;
      showmodalsearch() ;
      // AddGoogleSearch() ;
    document.forms[0].submit();
        //  self.doRequest();
        }
      });

      // This has lower priority so that requestSent is set.
      $(self.target).find('input').bind('keydown', function(e) {
        if (self.requestSent === false && e.which == 13) {
          var value = $(this).val();
          //added code for multiple words             
var curval = 'allText:(';
var pval = ' OR aprodno:(';
var fqarray = [] ;
var rfqarray = value.split(" ") ; // each word gets added
 // clena up values in array 
   for (var i = 0; i < rfqarray.length; i++) { 
    if ((rfqarray[i] !== '') && (rfqarray[i].charAt(0) !== '(')) {
           fqarray.push(rfqarray[i]); 
    }
  }

var fcnt = fqarray.length - 1
  for (var i = 0; i < fcnt; i++) { 
           curval += '"' + AjaxSolr.Parameter.CleanValue(fqarray[i]) + '"' +  ' AND ' ;
           pval += '' + AjaxSolr.Parameter.CleanValue(fqarray[i]) + '*' +  ' OR ' ;  
   }
    curval += '"' +  AjaxSolr.Parameter.CleanValue(fqarray[fcnt]) + '"' + ')';
    pval += '' +  AjaxSolr.Parameter.CleanValue(fqarray[fcnt]) + '*' + ')';
    curval = curval + pval ;
                 // removed all other querys 
        self.manager.store.remove('fq');
          if (value && self.set(value)) {
          self.manager.store.addByValue('fq', curval )
     //var fq = self.manager.store.values('fq');
     $.cookie('SearchFilter',curval);
     addfield("N","searchflag", document.forms[0].searchflag) ;
     addfield("1","searchptr", document.forms[0].searchptr) ;
     addfield("1","startptr", document.forms[0].startptr) ;
     addfield("SR","loginpath", document.forms[0].loginpath) ;
      addfield("","submitvar", document.forms[0].submitvar) ;
      showmodalsearch() ;
      // AddGoogleSearch() ;
    document.forms[0].submit(); 
        //    self.doRequest();
          }
        }
      });
    } // end callback

    var params = [ 'rows=0&facet=true&facet.limit=-1&facet.mincount=1&json.nl=map' ];
    for (var i = 0; i < this.fields.length; i++) {
      params.push('facet.field=' + this.fields[i]);
    }
 // djf 2/1/13 - removed all filters on the autocomplete 
 //   var values = this.manager.store.values('fq');
  //   for (var i = 0; i < values.length; i++) {
// skipped search cat on autocomplete drop down 
 //    var fqarray = values[i].split(":") ;  var curval = fqarray[0] ;
 //    if (curval !== 'searchcat') {
 //     params.push('fq=' + encodeURIComponent(values[i]));
 //    }
 //   }
 // djf 3-7-13 - if they are typing words - add each one to qf
    var xvalue =  $('#query').val() ;
    if(xvalue !== '') {   params.push('fq=allText:' + encodeURIComponent(xvalue));   }
    params.push('q=' + this.manager.store.get('q').val());
    jQuery.getJSON(this.manager.solrUrl + 'select?' + params.join('&') + '&wt=json&json.wrf=?', {}, callback);
  }
});

})(jQuery);


// added caret code to deal with ie bug..

/*
 *
 * Copyright (c) 2010 C. F., Wong (<a href="http://cloudgen.w0ng.hk">Cloudgen Examplet Store</a>)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
(function($,len,createRange,duplicate){
	$.fn.caret=function(options,opt2){
		var start,end,t=this[0],browser=$.browser.msie;
		if(typeof options==="object" && typeof options.start==="number" && typeof options.end==="number") {
			start=options.start;
			end=options.end;
		} else if(typeof options==="number" && typeof opt2==="number"){
			start=options;
			end=opt2;
		} else if(typeof options==="string"){
			if((start=t.value.indexOf(options))>-1) end=start+options[len];
			else start=null;
		} else if(Object.prototype.toString.call(options)==="[object RegExp]"){
			var re=options.exec(t.value);
			if(re != null) {
				start=re.index;
				end=start+re[0][len];
			}
		}
		if(typeof start!="undefined"){
			if(browser){
				var selRange = this[0].createTextRange();
				selRange.collapse(true);
				selRange.moveStart('character', start);
				selRange.moveEnd('character', end-start);
				selRange.select();
			} else {
				this[0].selectionStart=start;
				this[0].selectionEnd=end;
			}
			this[0].focus();
			return this
		} else {
           if(browser){
				var selection=document.selection;
                if (this[0].tagName.toLowerCase() != "textarea") {
                    var val = this.val(),
                    range = selection[createRange]()[duplicate]();
                    range.moveEnd("character", val[len]);
                    var s = (range.text == "" ? val[len]:val.lastIndexOf(range.text));
                    range = selection[createRange]()[duplicate]();
                    range.moveStart("character", -val[len]);
                    var e = range.text[len];
                } else {
                    var range = selection[createRange](),
                    stored_range = range[duplicate]();
                    stored_range.moveToElementText(this[0]);
                    stored_range.setEndPoint('EndToEnd', range);
                    var s = stored_range.text[len] - range.text[len],
                    e = s + range.text[len]
                }
            } else {
				var s=t.selectionStart,
					e=t.selectionEnd;
			}
			var te=t.value.substring(s,e);
			return {start:s,end:e,text:te,replace:function(st){
				return t.value.substring(0,s)+st+t.value.substring(e,t.value[len])
			}}
		}
	}
})(jQuery,"length","createRange","duplicate");


(function ($) {

AjaxSolr.CurrentSearchWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,

  afterRequest: function () {
    var self = this;
    var links = [];

    var q = this.manager.store.get('q').val();
    if (q != '*:*') {
      links.push($('<a href="#"/>').html('<img src="https://iws.helby.com/webimages/X.gif" border="0">'+ q).click(function () {
        self.manager.store.get('q').val('*:*');
        self.doRequest();
        return false;
      }));
    }
        // WE HAVE A FILTER  SO SHOW ALL THE SIDE BAR OPTIONS - THEN HIDE THE ONES YOU SELECTED 
    //    $('#webtypes').show()  ;
    //    $('#webclasses').show()  ;
    //    $('#webcatgs').show()  ;
    //    $('#websubcatgs').show()  ;
    var fq = this.manager.store.values('fq');
    for (var i = 0, l = fq.length; i < l; i++) {
       var fqarray = fq[i].split(":") ;
     
       var fname = fqarray[0];
       var fval = fqarray[1];
       var  str = fval ; 
if (str.indexOf(")") > 0 ) { 
       var result = str.substring(str.indexOf("(") + 1, str.indexOf(")"));
} else {
     result = fname + " " + str ;
}
       var fval = result ; 
   //   if (fq[i].match(/[\[\{]\S+ TO \S+[\]\}]/)) {
   //     var field = fq[i].match(/^\w+:/)[0];
   //     var value = fq[i].substr(field.length + 1, 10);
       //        links.push($('<a href="#"/>').text('(x) ' + field + value).click(self.removeFacet(fq[i])));
  //      links.push($('<a href="#"/>').html('<img src="https://iws.helby.com/webimages/X.gif" border="0">' + value).click(self.removeFacet(fq[i])));
  //    } else {
//         links.push($('<a href="#"/>').text('(x) ' + fq[i]).click(self.removeFacet(fq[i])));

      if (fname == 'searchcat') { var fval = $("#footprintdivcontainer a").text(); }
if (fname == 'customers') { fval = " Remove History Filter" ; } ;
      if (fval == '') { var fval = "Drill Down Category"} ; 
       links.push($('<a href="#"/>').html('<img src="https://iws.helby.com/webimages/X.gif" border="0">' + fval).click(self.removeFacet(fq[i])));
     
      // DONT DISPLAY THE DRILL DOWN LINKS FROM HERE 
        // hide the drill down of the one's that are showing
      //  $('#' + fname).hide()  ;
  //    }
    }
     // $('.tagcloud').show()  ;
      
    if (links.length >= 1) {
      links.unshift($('<a href="#"/>').html('<img src="https://iws.helby.com/webimages/X.gif" border="0"> Remove All Filters').click(function () {
        self.manager.store.get('q').val('*:*');
        self.manager.store.remove('fq');
        var fqc = $.cookie('SearchFilter', '') ; // set cookie to null
        document.forms[0].submitvar.value = '' ;
        // Send to Product Search if they have nothing
        changepath("PS") ; 
        self.doRequest();
      //  $('#webtypes').show()  ;
      //  $('#webclasses').hide()  ;
      //  $('#webcatgs').hide()  ;
     //   $('#websubcatgs').hide()  ;
        return false;
      }));
    }

    if (links.length) {
      AjaxSolr.theme('list_items', this.target, links);
    }
    else {
    //  $(this.target).html('<div>Showing All Products...</div>');
    }
  },
  removeFacet: function (facet) {
    var self = this;
    return function () {
      if (self.manager.store.removeByValue('fq', facet)) {
      // updated to update cookie as well 
      var fq = self.manager.store.values('fq');
       if (fq.length >= 1) { 
       $.cookie('SearchFilter',fq);
       self.doRequest();
       } else { 
       // SET search filters to null on new search no more filters
        $.cookie('SearchFilter','');
        changepath("PS") ;
       }        
      }
      return false;
    };
  }
});

})(jQuery);

// $Id$

(function ($) {

/**
 * A pager widget for jQuery.
 *
 * <p>Heavily inspired by the Ruby on Rails will_paginate gem.</p>
 *
 * @expects this.target to be a list.
 * @class PagerWidget
 * @augments AjaxSolr.AbstractWidget
 * @todo Don't use the manager to send the request. Request only the results,
 * not the facets. Update only itself and the results widget.
 */
AjaxSolr.PagerWidget = AjaxSolr.AbstractWidget.extend(
  /** @lends AjaxSolr.PagerWidget.prototype */
  {
  /**
   * How many links are shown around the current page.
   *
   * @field
   * @public
   * @type Number
   * @default 4
   */
  innerWindow: 10,

  /**
   * How many links are around the first and the last page.
   *
   * @field
   * @public
   * @type Number
   * @default 1
   */
  outerWindow: 2,

  /**
   * The previous page link label.
   *
   * @field
   * @public
   * @type String
   * @default "&laquo; previous"
   */
  prevLabel: '&laquo; Previous',

  /**
   * The next page link label.
   *
   * @field
   * @public
   * @type String
   * @default "next &raquo;"
   */
  nextLabel: 'Next &raquo;',

  /**
   * Separator between pagination links.
   *
   * @field
   * @public
   * @type String
   * @default ""
   */
  separator: ' ',

  /**
   * The current page number.
   *
   * @field
   * @private
   * @type Number
   */
  currentPage: null,

  /**
   * The total number of pages.
   *
   * @field
   * @private
   * @type Number
   */
  totalPages: null,

  /**
   * @returns {String} The gap in page links, which is represented by:
   *   <span class="pager-gap">&hellip;</span>
   */
  gapMarker: function () {
    return '<span class="pager-gap">&hellip;</span>';
  },

  /**
   * @returns {Array} The links for the visible page numbers.
   */
  windowedLinks: function () {
    var links = [];

    var prev = null;

    visible = this.visiblePageNumbers();
    for (var i = 0, l = visible.length; i < l; i++) {
      if (prev && visible[i] > prev + 1) links.push(this.gapMarker());
      links.push(this.pageLinkOrSpan(visible[i], [ 'pager-current' ]));
      prev = visible[i];
    }

    return links;
  },

  /**
   * @returns {Array} The visible page numbers according to the window options.
   */ 
  visiblePageNumbers: function () {
    var windowFrom = this.currentPage - this.innerWindow;
    var windowTo = this.currentPage + this.innerWindow;

    // If the window is truncated on one side, make the other side longer
    if (windowTo > this.totalPages) {
      windowFrom = Math.max(0, windowFrom - (windowTo - this.totalPages));
      windowTo = this.totalPages;
    }
    if (windowFrom < 1) {
      windowTo = Math.min(this.totalPages, windowTo + (1 - windowFrom));
      windowFrom = 1;
    }

    var visible = [];

    // Always show the first page
    visible.push(1);
    // Don't add inner window pages twice
    for (var i = 2; i <= Math.min(1 + this.outerWindow, windowFrom - 1); i++) {
      visible.push(i);
    }
    // If the gap is just one page, close the gap
    if (1 + this.outerWindow == windowFrom - 2) {
      visible.push(windowFrom - 1);
    }
    // Don't add the first or last page twice
    for (var i = Math.max(2, windowFrom); i <= Math.min(windowTo, this.totalPages - 1); i++) {
      visible.push(i);
    }
    // If the gap is just one page, close the gap
    if (this.totalPages - this.outerWindow == windowTo + 2) {
      visible.push(windowTo + 1);
    }
    // Don't add inner window pages twice
    for (var i = Math.max(this.totalPages - this.outerWindow, windowTo + 1); i < this.totalPages; i++) {
      visible.push(i);
    }
    // Always show the last page, unless it's the first page
    if (this.totalPages > 1) {
      visible.push(this.totalPages);
    }

    return visible;
  },

  /**
   * @param {Number} page A page number.
   * @param {String} classnames CSS classes to add to the page link.
   * @param {String} text The inner HTML of the page link (optional).
   * @returns The link or span for the given page.
   */
  pageLinkOrSpan: function (page, classnames, text) {
    text = text || page;

    if (page && page != this.currentPage) {
      return $('<a href="#"/>').html(text).attr('rel', this.relValue(page)).addClass(classnames[1]).click(this.clickHandler(page));
    }
    else {
      return $('<span/>').html(text).addClass(classnames.join(' '));
    }
  },

  /**
   * @param {Number} page A page number.
   * @returns {Function} The click handler for the page link.
   */
  clickHandler: function (page) {
    var self = this;
    return function () {
      self.manager.store.get('start').val((page - 1) * self.perPage());
      // added logic to add items to order.
      if (process_order(0)) {
      self.doRequest();
// ADDED FLOAT TO TOP
$('html, body').animate({ scrollTop: $('#SRfootprints').offset().top }, 'slow');
      }
      return false;
    }
  },

  /**
   * @param {Number} page A page number.
   * @returns {String} The <tt>rel</tt> attribute for the page link.
   */
  relValue: function (page) {
    switch (page) {
      case this.previousPage():
        return 'prev' + (page == 1 ? 'start' : '');
      case this.nextPage():
        return 'next';
      case 1:
        return 'start';
      default: 
        return '';
    }
  },

  /**
   * @returns {Number} The page number of the previous page or null if no previous page.
   */
  previousPage: function () {
    return this.currentPage > 1 ? (this.currentPage - 1) : null;
  },

  /**
   * @returns {Number} The page number of the next page or null if no next page.
   */
  nextPage: function () {
    return this.currentPage < this.totalPages ? (this.currentPage + 1) : null;
  },

  /**
   * An abstract hook for child implementations.
   *
   * @param {Number} perPage The number of items shown per results page.
   * @param {Number} offset The index in the result set of the first document to render.
   * @param {Number} total The total number of documents in the result set.
   */
  renderHeader: function (perPage, offset, total) {},

  /**
   * Render the pagination links.
   *
   * @param {Array} links The links for the visible page numbers.
   */
  renderLinks: function (links) {
    if (this.totalPages) {
      links.unshift(this.pageLinkOrSpan(this.previousPage(), [ 'pager-disabled', 'pager-prev' ], this.prevLabel));
      links.push(this.pageLinkOrSpan(this.nextPage(), [ 'pager-disabled', 'pager-next' ], this.nextLabel));
      AjaxSolr.theme('list_items', this.target, links, this.separator);
    }
  },

  /**
   * @returns {Number} The number of results to display per page.
   */
  perPage: function () {
    return parseInt(this.manager.response.responseHeader && this.manager.response.responseHeader.params && this.manager.response.responseHeader.params.rows || this.manager.store.get('rows').val() || 10);
  },

  /**
   * @returns {Number} The Solr offset parameter's value.
   */
  getOffset: function () {
    return parseInt(this.manager.response.responseHeader && this.manager.response.responseHeader.params && this.manager.response.responseHeader.params.start || this.manager.store.get('start').val() || 0);
  },

  afterRequest: function () {
    var perPage = this.perPage();
    var offset  = this.getOffset();
    var total   = parseInt(this.manager.response.response.numFound);

    // Normalize the offset to a multiple of perPage.
    offset = offset - offset % perPage;

    this.currentPage = Math.ceil((offset + 1) / perPage);
    this.totalPages = Math.ceil(total / perPage);

    $(this.target).empty();

    this.renderLinks(this.windowedLinks());
    this.renderHeader(perPage, offset, total);
  }
});

})(jQuery);
      (function ($) {

AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,

  beforeRequest: function () {
    $(this.target).html($('<img/>').attr('src', 'https://iws.helby.com/webimages/ajax-loader-small.gif'));
    // if we are not on the search results page - then save the search settings and call the search page
//    if (testObj(document.forms[0].pageid)) {  
//    var pageid = document.forms[0].pageid.value ;
//    if (pageid !=='2A') {
//     var fq = this.manager.store.values('fq');
//     addfield(fq,"submitvar", document.forms[0].submitvar) ;
//     addfield("N","searchflag", document.forms[0].searchflag) ;
//     addfield("1","searchptr", document.forms[0].searchptr) ;
//     addfield("1","startptr", document.forms[0].startptr) ;
//     addfield("SR","loginpath", document.forms[0].loginpath) ;
//      showmodalsearch() ;
//      // AddGoogleSearch() ;
//      document.forms[0].submit(); 
//    }    
//    }

// CHECK TO SEE IF ON SEARCH RESULTS PAGE IF SO ADD SORT AND ITEMS PER PAGE 
    if (testObj(document.forms[0].pageid)) {  
     // get view type 
      viewtype = $.cookie('viewtype'); 
      var pageid = document.forms[0].pageid.value ;
      if (pageid =='2A') {
          if (testObj(document.forms[0].itemspage)) {  
           var items = document.forms[0].itemspage.value ; 
           this.manager.store.remove('rows');
           this.manager.store.addByValue('rows', items);                                                  
            }
          if (testObj(document.forms[0].Changesort)) {  
          var sort_field = document.forms[0].Changesort.value ;
           this.manager.store.remove('sort');
           this.manager.store.addByValue('sort', sort_field);                                                  
          }
           // added code for keeping page
          if (testObj(document.forms[0].startptr)) {
            var pagenum = document.forms[0].startptr.value;
            if (pagenum > 1) {; // Only update if not 1 
              var startnum = (pagenum - 1) * items
              this.manager.store.remove('start');
              this.manager.store.addByValue('start', startnum);
              document.forms[0].startptr.value = "1";
            }
          }
       }
     }
     
          //if (testObj(document.forms[0].submitvar)) {  
          // var fq = document.forms[0].submitvar.value ;
           var fqc = $.cookie('SearchFilter') || '';        
           if (fqc !== '' && fqc !== 'null') {
         //  console.log('adding filters' + fq)
            this.manager.store.remove('fq');
            var fqarray = fqc.split(",") ;  // each parameter is in the cookie with a , 
               for (var i = 0, l = fqarray.length; i < l; i++) {
                var fname = fqarray[i];
                this.manager.store.addByValue('fq', fname);
              } 
           }
         // } 
           
  },

  facetLinks: function (facet_field, facet_values) {
    var links = [];
    if (facet_values) {
      for (var i = 0, l = facet_values.length; i < l; i++) {
        if (facet_values[i] !== undefined) {
          links.push(AjaxSolr.theme('facet_link', facet_values[i], this.facetHandler(facet_field, facet_values[i])));
        }
        else {
          links.push(AjaxSolr.theme('no_items_found'));
        }
      }
    }
    return links;
  },

  facetHandler: function (facet_field, facet_value) {
    var self = this;
    return function () {
      self.manager.store.remove('fq');
      self.manager.store.addByValue('fq', facet_field + ':' + AjaxSolr.Parameter.escapeValue(facet_value));
      self.doRequest();
      return false;
    };
  },

  sortHandler: function (sort_field, sort_value) {
    var self = this;
    return function () {
      self.manager.store.remove('sort');
      self.manager.store.addByValue('sort', sort_field + '+' + sort_value);
      self.doRequest();
      return false;
    };
  },
    rowHandler: function (items) {
    var self = this;
    return function () {
      self.manager.store.remove('rows');
      self.manager.store.addByValue('rows', items);
      self.doRequest();
      return false;
    };
  },
  
  afterRequest: function () {
    $(this.target).empty();
   if (this.manager.response.response.docs.length == 0){
     $(this.target).append(AjaxSolr.theme('no_items_found')) ;
      return ;
     }
    for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
      var doc = this.manager.response.response.docs[i];
        if (i == 0) {PCXLineLoad(doc.id) ; }
       // var viewtype = $('viewtype').val() ;
       if (viewtype == 'grid') {
        $(this.target).append(AjaxSolr.theme('resultgrid', doc, AjaxSolr.theme('snippet', doc)));
      } else {
       $(this.target).append(AjaxSolr.theme('result', doc, AjaxSolr.theme('snippet', doc)));
      }
   //   var items = [];
   //   items = items.concat(this.facetLinks('topics', doc.topics));
   //   items = items.concat(this.facetLinks('organisations', doc.organisations));
   //   items = items.concat(this.facetLinks('exchanges', doc.exchanges));
   //   AjaxSolr.theme('list_items', '#links_' + doc.id, items);
    
    }
     $('img.lazy').load(function() {
        var src = $(this).attr('src').split('/');
        var file = src[src.length - 1];
        // console.log(file + ' parsed');
        if (file != "spacer.gif") {      
        var dataval = $(this).attr('rel')   ;
        //console.log(dataval + ' loaded');
         eval(dataval) ; 
        }
    });
    $("img.lazy").lazyload({ effect: "fadeIn"});
  //  this.rowHandler(items) ;
   // this.sortHandler(sort_field, sort_value)  ;
  },

  init: function () {
    $('a.more').livequery(function () {
      $(this).toggle(function () {
        $(this).parent().find('span').show();
        $(this).text('less');
        return false;
      }, function () {
        $(this).parent().find('span').hide();
        $(this).text('more');
        return false;
      });
    });
  }
});

})(jQuery);

(function ($) {

AjaxSolr.TagcloudWidget = AjaxSolr.AbstractFacetWidget.extend({
  afterRequest: function () {
    if (this.manager.response.facet_counts.facet_fields[this.field] === undefined) {
      $(this.target).html(AjaxSolr.theme('no_items_found'));
      return;
    }

    var maxCount = 0;
    var objectedItems = [];
    for (var facet in this.manager.response.facet_counts.facet_fields[this.field]) {
    //  var farray = facet.split("_") ;
    //  var fval = farray[0];
    //  var fname = farray[1];
      var count = parseInt(this.manager.response.facet_counts.facet_fields[this.field][facet]);
      if (count > maxCount) {
        maxCount = count;
      }
  //    objectedItems.push({ facet: fname, count: count, fval: fval });
       objectedItems.push({ facet: facet, count: count });
    }
    objectedItems.sort(function (a, b) {
      return a.facet < b.facet ? -1 : 1;
    });

    $(this.target).empty();
    for (var i = 0, l = objectedItems.length; i < l; i++) {
      var facet = objectedItems[i].facet;
   //   var fval = objectedItems[i].fval;
  //    $(this.target).append(AjaxSolr.theme('tag', facet, parseInt(objectedItems[i].count / maxCount * 10), this.clickHandler(facet)));
      $(this.target).append(AjaxSolr.theme('tagtsh', facet, parseInt(objectedItems[i].count), this.clickHandler(facet)));
  //    $(this.target).append(AjaxSolr.theme('tagtsh', fname, parseInt(objectedItems[i].count), this.clickHandler(fval)));
  
    }
    // $(this.target).hide();
  }
});

})(jQuery);

/*
 * jQuery Autocomplete plugin 1.1
 *
 * Copyright (c) 2009 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.autocomplete.js 15 2009-08-22 10:30:27Z joern.zaefferer $
 */

;(function($) {
	
$.fn.extend({
	autocomplete: function(urlOrData, options) {
		var isUrl = typeof urlOrData == "string";
		options = $.extend({}, $.Autocompleter.defaults, {
			url: isUrl ? urlOrData : null,
			data: isUrl ? null : urlOrData,
			delay: isUrl ? $.Autocompleter.defaults.delay : 10,
			max: options && !options.scroll ? 10 : 150
		}, options);
		
		// if highlight is set to false, replace it with a do-nothing function
		options.highlight = options.highlight || function(value) { return value; };
		
		// if the formatMatch option is not specified, then use formatItem for backwards compatibility
		options.formatMatch = options.formatMatch || options.formatItem;
		
		return this.each(function() {
			new $.Autocompleter(this, options);
		});
	},
	result: function(handler) {
		return this.bind("result", handler);
	},
	search: function(handler) {
		return this.trigger("search", [handler]);
	},
	flushCache: function() {
		return this.trigger("flushCache");
	},
	setOptions: function(options){
		return this.trigger("setOptions", [options]);
	},
	unautocomplete: function() {
		return this.trigger("unautocomplete");
	}
});

$.Autocompleter = function(input, options) {

	var KEY = {
		UP: 38,
		DOWN: 40,
		DEL: 46,
		TAB: 9,
		RETURN: 13,
		ESC: 27,
		COMMA: 188,
		PAGEUP: 33,
		PAGEDOWN: 34,
		BACKSPACE: 8
	};

	// Create $ object for input element
	var $input = $(input).attr("autocomplete", "off").addClass(options.inputClass);

	var timeout;
	var previousValue = "";
	var cache = $.Autocompleter.Cache(options);
	var hasFocus = 0;
	var lastKeyPressCode;
	var config = {
		mouseDownOnSelect: false
	};
	var select = $.Autocompleter.Select(options, input, selectCurrent, config);
	
	var blockSubmit;
	
	// prevent form submit in opera when selecting with return key
	$.browser.opera && $(input.form).bind("submit.autocomplete", function() {
		if (blockSubmit) {
			blockSubmit = false;
			return false;
		}
	});
	
	// only opera doesn't trigger keydown multiple times while pressed, others don't work with keypress at all
	$input.bind(($.browser.opera ? "keypress" : "keydown") + ".autocomplete", function(event) {
		// a keypress means the input has focus
		// avoids issue where input had focus before the autocomplete was applied
		hasFocus = 1;
		// track last key pressed
		lastKeyPressCode = event.keyCode;
		switch(event.keyCode) {
		
			case KEY.UP:
				event.preventDefault();
				if ( select.visible() ) {
					select.prev();
				} else {
					onChange(0, true);
				}
				break;
				
			case KEY.DOWN:
				event.preventDefault();
				if ( select.visible() ) {
					select.next();
				} else {
					onChange(0, true);
				}
				break;
				
			case KEY.PAGEUP:
				event.preventDefault();
				if ( select.visible() ) {
					select.pageUp();
				} else {
					onChange(0, true);
				}
				break;
				
			case KEY.PAGEDOWN:
				event.preventDefault();
				if ( select.visible() ) {
					select.pageDown();
				} else {
					onChange(0, true);
				}
				break;
			
			// matches also semicolon
			case options.multiple && $.trim(options.multipleSeparator) == "," && KEY.COMMA:
			case KEY.TAB:
			case KEY.RETURN:
				if( selectCurrent() ) {
					// stop default to prevent a form submit, Opera needs special handling
					event.preventDefault();
					blockSubmit = true;
					return false;
				}
				break;
				
			case KEY.ESC:
				select.hide();
				break;
				
			default:
				clearTimeout(timeout);
				timeout = setTimeout(onChange, options.delay);
				break;
		}
	}).focus(function(){
		// track whether the field has focus, we shouldn't process any
		// results if the field no longer has focus
		hasFocus++;
	}).blur(function() {
		hasFocus = 0;
		if (!config.mouseDownOnSelect) {
			hideResults();
		}
	}).click(function() {
		// show select when clicking in a focused field
		if ( hasFocus++ > 1 && !select.visible() ) {
			onChange(0, true);
		}
	}).bind("search", function() {
		// TODO why not just specifying both arguments?
		var fn = (arguments.length > 1) ? arguments[1] : null;
		function findValueCallback(q, data) {
			var result;
			if( data && data.length ) {
				for (var i=0; i < data.length; i++) {
					if( data[i].result.toLowerCase() == q.toLowerCase() ) {
						result = data[i];
						break;
					}
				}
			}
			if( typeof fn == "function" ) fn(result);
			else $input.trigger("result", result && [result.data, result.value]);
		}
		$.each(trimWords($input.val()), function(i, value) {
			request(value, findValueCallback, findValueCallback);
		});
	}).bind("flushCache", function() {
		cache.flush();
	}).bind("setOptions", function() {
		$.extend(options, arguments[1]);
		// if we've updated the data, repopulate
		if ( "data" in arguments[1] )
			cache.populate();
	}).bind("unautocomplete", function() {
		select.unbind();
		$input.unbind();
		$(input.form).unbind(".autocomplete");
	});
	
	
	function selectCurrent() {
		var selected = select.selected();
		if( !selected )
			return false;
		
		var v = selected.result;
		previousValue = v;
		
		if ( options.multiple ) {
			var words = trimWords($input.val());
			if ( words.length > 1 ) {
				var seperator = options.multipleSeparator.length;
        var j = $(input).val(); var lj = j.length  ;
				var cursorAt = lj
      //  	var cursorAt = $(input).selection().start;
				var wordAt, progress = 0;
				$.each(words, function(i, word) {
					progress += word.length;
				// djf removed option to get to cursor - just show all - fixes issues in ie 
      	 if (cursorAt <= progress) {
						wordAt = i;
						return false;
					}
					progress += seperator;
				});
				words[wordAt] = v;
				// TODO this should set the cursor to the right position, but it gets overriden somewhere
				//$.Autocompleter.Selection(input, progress + seperator, progress + seperator);
				v = words.join( options.multipleSeparator );
			}
			v += options.multipleSeparator;
		}
		
		$input.val(v);
		hideResultsNow();
		$input.trigger("result", [selected.data, selected.value]);
		return true;
	}
	
	function onChange(crap, skipPrevCheck) {
		if( lastKeyPressCode == KEY.DEL ) {
			select.hide();
			return;
		}
		
		var currentValue = $input.val();
		
		if ( !skipPrevCheck && currentValue == previousValue )
			return;
		
		previousValue = currentValue;
		
		currentValue = lastWord(currentValue);
		if ( currentValue.length >= options.minChars) {
			$input.addClass(options.loadingClass);
			if (!options.matchCase)
				currentValue = currentValue.toLowerCase();
			request(currentValue, receiveData, hideResultsNow);
		} else {
			stopLoading();
			select.hide();
		}
	};
	
	function trimWords(value) {
		if (!value)
			return [""];
		if (!options.multiple)
			return [$.trim(value)];
		return $.map(value.split(options.multipleSeparator), function(word) {
			return $.trim(value).length ? $.trim(word) : null;
		});
	}
	
	function lastWord(value) {
		if ( !options.multiple )
			return value;
		var words = trimWords(value);
		if (words.length == 1) 
			return words[0];
		var cursorAt = $(input).selection().start;
		if (cursorAt == value.length) {
			words = trimWords(value)
		} else {
			words = trimWords(value.replace(value.substring(cursorAt), ""));
		}
		return words[words.length - 1];
	}
	
	// fills in the input box w/the first match (assumed to be the best match)
	// q: the term entered
	// sValue: the first matching result
	function autoFill(q, sValue){
		// autofill in the complete box w/the first match as long as the user hasn't entered in more data
		// if the last user key pressed was backspace, don't autofill
		if( options.autoFill && (lastWord($input.val()).toLowerCase() == q.toLowerCase()) && lastKeyPressCode != KEY.BACKSPACE ) {
			// fill in the value (keep the case the user has typed)
			$input.val($input.val() + sValue.substring(lastWord(previousValue).length));
			// select the portion of the value not typed by the user (so the next character will erase)
			$(input).selection(previousValue.length, previousValue.length + sValue.length);
		}
	};

	function hideResults() {
		clearTimeout(timeout);
		timeout = setTimeout(hideResultsNow, 200);
	};

	function hideResultsNow() {
		var wasVisible = select.visible();
		select.hide();
		clearTimeout(timeout);
		stopLoading();
		if (options.mustMatch) {
			// call search and run callback
			$input.search(
				function (result){
					// if no value found, clear the input box
					if( !result ) {
						if (options.multiple) {
							var words = trimWords($input.val()).slice(0, -1);
							$input.val( words.join(options.multipleSeparator) + (words.length ? options.multipleSeparator : "") );
						}
						else {
							$input.val( "" );
							$input.trigger("result", null);
						}
					}
				}
			);
		}
	};

	function receiveData(q, data) {
		if ( data && data.length && hasFocus ) {
			stopLoading();
			select.display(data, q);
			autoFill(q, data[0].value);
			select.show();
		} else {
			hideResultsNow();
		}
	};

	function request(term, success, failure) {
		if (!options.matchCase)
			term = term.toLowerCase();
		var data = cache.load(term);
		// recieve the cached data
		if (data && data.length) {
			success(term, data);
		// if an AJAX url has been supplied, try loading the data now
		} else if( (typeof options.url == "string") && (options.url.length > 0) ){
			
			var extraParams = {
				timestamp: +new Date()
			};
			$.each(options.extraParams, function(key, param) {
				extraParams[key] = typeof param == "function" ? param() : param;
			});
			
			$.ajax({
				// try to leverage ajaxQueue plugin to abort previous requests
				mode: "abort",
				// limit abortion to this input
				port: "autocomplete" + input.name,
				dataType: options.dataType,
				url: options.url,
				data: $.extend({
					q: lastWord(term),
					limit: options.max
				}, extraParams),
				success: function(data) {
					var parsed = options.parse && options.parse(data) || parse(data);
					cache.add(term, parsed);
					success(term, parsed);
				}
			});
		} else {
			// if we have a failure, we need to empty the list -- this prevents the the [TAB] key from selecting the last successful match
			select.emptyList();
			failure(term);
		}
	};
	
	function parse(data) {
		var parsed = [];
		var rows = data.split("\n");
		for (var i=0; i < rows.length; i++) {
			var row = $.trim(rows[i]);
			if (row) {
				row = row.split("|");
				parsed[parsed.length] = {
					data: row,
					value: row[0],
					result: options.formatResult && options.formatResult(row, row[0]) || row[0]
				};
			}
		}
		return parsed;
	};

	function stopLoading() {
		$input.removeClass(options.loadingClass);
	};

};

$.Autocompleter.defaults = {
    showCallback: function() {
      gettopsellertsh();
    },
	inputClass: "ac_input",
	resultsClass: "ac_results",
	loadingClass: "ac_loading",
	minChars: 1,
	delay: 400,
	matchCase: false,
	matchSubset: true,
	matchContains: false,
	cacheLength: 10,
	max: 100,
	mustMatch: false,
	extraParams: {},
	selectFirst: true,
	formatItem: function(row) { return row[0]; },
	formatMatch: null,
	autoFill: false,
	width: 400,
	multiple: true,
	multipleSeparator: " ",
	highlight: function(value, term) {
		return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
	},
    scroll: true,
    scrollHeight: 180
};

$.Autocompleter.Cache = function(options) {

	var data = {};
	var length = 0;
	
	function matchSubset(s, sub) {
		if (!options.matchCase) 
			s = s.toLowerCase();
		var i = s.indexOf(sub);
		if (options.matchContains == "word"){
			i = s.toLowerCase().search("\\b" + sub.toLowerCase());
		}
		if (i == -1) return false;
		return i == 0 || options.matchContains;
	};
	
	function add(q, value) {
		if (length > options.cacheLength){
			flush();
		}
		if (!data[q]){ 
			length++;
		}
		data[q] = value;
	}
	
	function populate(){
		if( !options.data ) return false;
		// track the matches
		var stMatchSets = {},
			nullData = 0;

		// no url was specified, we need to adjust the cache length to make sure it fits the local data store
		if( !options.url ) options.cacheLength = 1;
		
		// track all options for minChars = 0
		stMatchSets[""] = [];
		
		// loop through the array and create a lookup structure
		for ( var i = 0, ol = options.data.length; i < ol; i++ ) {
			var rawValue = options.data[i];
			// if rawValue is a string, make an array otherwise just reference the array
			rawValue = (typeof rawValue == "string") ? [rawValue] : rawValue;
			
			var value = options.formatMatch(rawValue, i+1, options.data.length);
			if ( value === false )
				continue;
				
			var firstChar = value.charAt(0).toLowerCase();
			// if no lookup array for this character exists, look it up now
			if( !stMatchSets[firstChar] ) 
				stMatchSets[firstChar] = [];

			// if the match is a string
			var row = {
				value: value,
				data: rawValue,
				result: options.formatResult && options.formatResult(rawValue) || value
			};
			
			// push the current match into the set list
			stMatchSets[firstChar].push(row);

			// keep track of minChars zero items
			if ( nullData++ < options.max ) {
				stMatchSets[""].push(row);
			}
		};

		// add the data items to the cache
		$.each(stMatchSets, function(i, value) {
			// increase the cache size
			options.cacheLength++;
			// add to the cache
			add(i, value);
		});
	}
	
	// populate any existing data
	setTimeout(populate, 25);
	
	function flush(){
		data = {};
		length = 0;
	}
	
	return {
		flush: flush,
		add: add,
		populate: populate,
		load: function(q) {
			if (!options.cacheLength || !length)
				return null;
			/* 
			 * if dealing w/local data and matchContains than we must make sure
			 * to loop through all the data collections looking for matches
			 */
			if( !options.url && options.matchContains ){
				// track all matches
				var csub = [];
				// loop through all the data grids for matches
				for( var k in data ){
					// don't search through the stMatchSets[""] (minChars: 0) cache
					// this prevents duplicates
					if( k.length > 0 ){
						var c = data[k];
						$.each(c, function(i, x) {
							// if we've got a match, add it to the array
							if (matchSubset(x.value, q)) {
								csub.push(x);
							}
						});
					}
				}				
				return csub;
			} else 
			// if the exact item exists, use it
			if (data[q]){
				return data[q];
			} else
			if (options.matchSubset) {
				for (var i = q.length - 1; i >= options.minChars; i--) {
					var c = data[q.substr(0, i)];
					if (c) {
						var csub = [];
						$.each(c, function(i, x) {
							if (matchSubset(x.value, q)) {
								csub[csub.length] = x;
							}
						});
						return csub;
					}
				}
			}
			return null;
		}
	};
};

$.Autocompleter.Select = function (options, input, select, config) {
	var CLASSES = {
		ACTIVE: "ac_over"
	};
	
	var listItems,
		active = -1,
		data,
		term = "",
		needsInit = true,
		element,
		list;
	
	// Create results
	function init() {
		if (!needsInit)
			return;
		element = $("<div/>")
		.hide()
		.addClass(options.resultsClass)
		.css("position", "absolute")
		.appendTo(document.body);
	
		list = $("<ul/>").appendTo(element).mouseover( function(event) {
			if(target(event).nodeName && target(event).nodeName.toUpperCase() == 'LI') {
	            active = $("li", list).removeClass(CLASSES.ACTIVE).index(target(event));
			    $(target(event)).addClass(CLASSES.ACTIVE);            
	        }
		}).click(function(event) {
			$(target(event)).addClass(CLASSES.ACTIVE);
			select();
			// TODO provide option to avoid setting focus again after selection? useful for cleanup-on-focus
			input.focus();
			return false;
		}).mousedown(function() {
			config.mouseDownOnSelect = true;
		}).mouseup(function() {
			config.mouseDownOnSelect = false;
		});
		
		if( options.width > 0 )
			element.css("width", options.width);
			
		needsInit = false;
	} 
	
	function target(event) {
		var element = event.target;
		while(element && element.tagName != "LI")
			element = element.parentNode;
		// more fun with IE, sometimes event.target is empty, just ignore it then
		if(!element)
			return [];
		return element;
	}

	function moveSelect(step) {
		listItems.slice(active, active + 1).removeClass(CLASSES.ACTIVE);
		movePosition(step);
        var activeItem = listItems.slice(active, active + 1).addClass(CLASSES.ACTIVE);
        if(options.scroll) {
            var offset = 0;
            listItems.slice(0, active).each(function() {
				offset += this.offsetHeight;
			});
            if((offset + activeItem[0].offsetHeight - list.scrollTop()) > list[0].clientHeight) {
                list.scrollTop(offset + activeItem[0].offsetHeight - list.innerHeight());
            } else if(offset < list.scrollTop()) {
                list.scrollTop(offset);
            }
        }
	};
	
	function movePosition(step) {
		active += step;
		if (active < 0) {
			active = listItems.size() - 1;
		} else if (active >= listItems.size()) {
			active = 0;
		}
	}
	
	function limitNumberOfItems(available) {
		return options.max && options.max < available
			? options.max
			: available;
	}
	
	function fillList() {
		list.empty();
		var max = limitNumberOfItems(data.length);
		for (var i=0; i < max; i++) {
			if (!data[i])
				continue;
			var formatted = options.formatItem(data[i].data, i+1, max, data[i].value, term);
			if ( formatted === false )
				continue;
			var li = $("<li/>").html( options.highlight(formatted, term) ).addClass(i%2 == 0 ? "ac_even" : "ac_odd").appendTo(list)[0];
			$.data(li, "ac_data", data[i]);
		}
		listItems = list.find("li");
		if ( options.selectFirst ) {
			listItems.slice(0, 1).addClass(CLASSES.ACTIVE);
			active = 0;
		}
		// apply bgiframe if available
		if ( $.fn.bgiframe )
			list.bgiframe();
	}
	
	return {
		display: function(d, q) {
			init();
			data = d;
			term = q;
			fillList();
		},
		next: function() {
			moveSelect(1);
		},
		prev: function() {
			moveSelect(-1);
		},
		pageUp: function() {
			if (active != 0 && active - 8 < 0) {
				moveSelect( -active );
			} else {
				moveSelect(-8);
			}
		},
		pageDown: function() {
			if (active != listItems.size() - 1 && active + 8 > listItems.size()) {
				moveSelect( listItems.size() - 1 - active );
			} else {
				moveSelect(8);
			}
		},
		hide: function() {
			element && element.hide();
			listItems && listItems.removeClass(CLASSES.ACTIVE);
			active = -1;
      options.hideCallback && options.hideCallback(); // Invoke callback function if set
		},
		visible : function() {
			return element && element.is(":visible");
		},
		current: function() {
			return this.visible() && (listItems.filter("." + CLASSES.ACTIVE)[0] || options.selectFirst && listItems[0]);
		},
		show: function() {
			var offset = $(input).offset();
			element.css({
				width: typeof options.width == "string" || options.width > 0 ? options.width : $(input).width(),
				top: offset.top + 20 + input.offsetHeight,
				left: offset.left 
			}).show();
// 				left: offset.left - $(input).width()
            if(options.scroll) {
                list.scrollTop(0);
                list.css({
					maxHeight: options.scrollHeight,
					overflow: 'auto'
				});
				
                if($.browser.msie && typeof document.body.style.maxHeight === "undefined") {
					var listHeight = 0;
					listItems.each(function() {
						listHeight += this.offsetHeight;
					});
					var scrollbarsVisible = listHeight > options.scrollHeight;
                    list.css('height', scrollbarsVisible ? options.scrollHeight : listHeight );
					if (!scrollbarsVisible) {
						// IE doesn't recalculate width when scrollbar disappears
						listItems.width( list.width() - parseInt(listItems.css("padding-left")) - parseInt(listItems.css("padding-right")) );
					}
                }
                
            }
          options.showCallback && options.showCallback(); // Invoke callback function if set
		},
		selected: function() {
			var selected = listItems && listItems.filter("." + CLASSES.ACTIVE).removeClass(CLASSES.ACTIVE);
			return selected && selected.length && $.data(selected[0], "ac_data");
		},
		emptyList: function (){
			list && list.empty();
		},
		unbind: function() {
			element && element.remove();
		}
	};
};

$.fn.selection = function(start, end) {
	if (start !== undefined) {
		return this.each(function() {
			if( this.createTextRange ){
				var selRange = this.createTextRange();
				if (end === undefined || start == end) {
					selRange.move("character", start);
					selRange.select();
				} else {
					selRange.collapse(true);
					selRange.moveStart("character", start);
					selRange.moveEnd("character", end);
					selRange.select();
				}
			} else if( this.setSelectionRange ){
				this.setSelectionRange(start, end);
			} else if( this.selectionStart ){
				this.selectionStart = start;
				this.selectionEnd = end;
			}
		});
	}
	var field = this[0];
	if ( field.createTextRange ) {
		var range = document.selection.createRange(),
			orig = field.value,
			teststring = "<->",
			textLength = range.text.length;
		range.text = teststring;
		var caretAt = field.value.indexOf(teststring);
		field.value = orig;
		this.selection(caretAt, caretAt + textLength);
		return {
			start: caretAt,
			end: caretAt + textLength
		}
	} else if( field.selectionStart !== undefined ){
		return {
			start: field.selectionStart,
			end: field.selectionEnd
		}
	}
};

})(jQuery);
// $Id$

/**
 * Strip whitespace from the beginning and end of a string.
 *
 * @returns {String} The trimmed string.
 */
String.prototype.trim = function () {
  return this.replace(/^ +/, '').replace(/ +$/, '');
};

/**
 * A utility method for escaping HTML tag characters.
 * <p>From Ruby on Rails.</p>
 *
 * @returns {String} The escaped string.
 */
String.prototype.htmlEscape = function () {
  return this.replace(/"/g, '&quot;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/&/g, '&amp;');
};

/**
 * Escapes the string without affecting existing escaped entities.
 * <p>From Ruby on Rails.</p>
 *
 * @returns {String} The escaped string
 */
String.prototype.escapeOnce = function () {
  return this.replace(/"/g, '&quot;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/&(?!([a-zA-Z]+|#\d+);)/g, '&amp;');
};

/**
 * <p>From Ruby on Rails.</p>
 *
 * @see http://www.w3.org/TR/html4/types.html#type-name
 */
String.prototype.sanitizeToId = function () {
  return this.replace(/\]/g, '').replace(/[^-a-zA-Z0-9:.]/g, '_');
};

/**
 * Does the string end with the specified <tt>suffix</tt>?
 * <p>From Ruby on Rails.</p>
 *
 * @param {String} suffix The specified suffix.
 * @returns {Boolean}
 */
String.prototype.endsWith = function (suffix) {
  return this.substring(this.length - suffix.length) == suffix;
};

/**
 * Does the string start with the specified <tt>prefix</tt>?
 * <p>From Ruby on Rails.</p>
 *
 * @param {String} prefix The speficied prefix.
 * @returns {Boolean}
 */
String.prototype.startsWith = function (prefix) {
  return this.substring(0, prefix.length) == prefix;
};

/**
 * Equivalent to PHP's two-argument version of strtr.
 *
 * @see http://php.net/manual/en/function.strtr.php
 * @param {Object} replacePairs An associative array in the form: {'from': 'to'}
 * @returns {String} A translated copy of the string.
 */
String.prototype.strtr = function (replacePairs) {
  var str = this;
  for (var from in replacePairs) {
    str = str.replace(new RegExp(from, 'g'), replacePairs[from]);
  }
  return str;
};

// $Id$

/**
 * Appends the given items to the given list, optionally inserting a separator
 * between the items in the list.
 *
 * @param {String} list The list to append items to.
 * @param {Array} items The list of items to append to the list.
 * @param {String} [separator] A string to add between the items.
 * @todo Return HTML rather than modify the DOM directly.
 */
AjaxSolr.theme.prototype.list_items = function (list, items, separator) {
  jQuery(list).empty();
  for (var i = 0, l = items.length; i < l; i++) {
    var li = jQuery('<li/>');
    if (AjaxSolr.isArray(items[i])) {
      for (var j = 0, m = items[i].length; j < m; j++) {
        if (separator && j > 0) {
          li.append(separator);
        }
        li.append(items[i][j]);
      }
    }
    else {
      if (separator && i > 0) {
        li.append(separator);
      }
      li.append(items[i]);
    }
    jQuery(list).append(li);
  }
};
   
function TopSearch() {
var values = $('#query').val() ;
// REMOVED ABILILTY TO JUST BROWSE ITEMS 
if (values == '') { alert("Please enter a value to search for.. ") ; return ; }

var curval = 'allText:(';
var pval = ' OR aprodno:(' ;
var fqarray = values.split(" ") ; // each word gets added
var fcnt = fqarray.length - 1
for (var i = 0; i < fcnt; i++) { 
if (fqarray[i] !== '') {
// curval += '' + AjaxSolr.Parameter.CleanValue(fqarray[i]) + '' + ' AND ' ; 
  curval += '"' + AjaxSolr.Parameter.CleanValue(fqarray[i]) + '"' + ' AND ' ; 
  pval += '' + AjaxSolr.Parameter.CleanValue(fqarray[i]) + '*' + ' OR ' ;
}
}
 // curval += '' + AjaxSolr.Parameter.CleanValue(fqarray[fcnt]) + '' + ')';
   curval += '"' + AjaxSolr.Parameter.CleanValue(fqarray[fcnt]) + '"' + ')';
   pval += '' + AjaxSolr.Parameter.CleanValue(fqarray[fcnt]) + '*' + ')';
   sval = curval + pval ;
 $.cookie('SearchFilter',sval);
 addfield("N","searchflag", document.forms[0].searchflag) ;
 addfield("1","searchptr", document.forms[0].searchptr) ;
 addfield("1","startptr", document.forms[0].startptr) ;
 addfield("SR","loginpath", document.forms[0].loginpath) ;
 addfield("","submitvar", document.forms[0].submitvar) ;
 showmodalsearch() ;
 // AddGoogleSearch() ;
 document.forms[0].submit();
}
// added prodsearch function for stock alerts 
function ProdSearch(values) {
//var values = $('#query').val() ;
var pval = 'aprodno:(' ;
pval += '' + AjaxSolr.Parameter.CleanValue(values) + ')';
 $.cookie('SearchFilter',pval);
 addfield("N","searchflag", document.forms[0].searchflag) ;
 addfield("1","searchptr", document.forms[0].searchptr) ;
 addfield("1","startptr", document.forms[0].startptr) ;
 addfield("SR","loginpath", document.forms[0].loginpath) ;
 addfield("","submitvar", document.forms[0].submitvar) ;
 // showmodalsearch() ;
 // AddGoogleSearch() ;
 document.forms[0].submit();
}


 function browsepathG(x,svar)
 {
 var fq = "searchcat:" + svar.substr(2, svar.length) + "*" ;
  $.cookie('SearchFilter',fq);
 // Added Cookie based search filters
  addfield(svar,"submitvar", document.forms[0].submitvar) ;
  addfield("Y","searchflag", document.forms[0].searchflag) ;
  addfield("1","searchptr", document.forms[0].searchptr) ;
  addfield("1","startptr", document.forms[0].startptr) ;
  addfield(x,"loginpath", document.forms[0].loginpath) ;
    document.forms[0].submit();
 }
 function browsepath(x,svar)
 {
 var fq = "searchcat:" + svar.substr(2, svar.length) + "*" ;
  $.cookie('SearchFilter',fq);
 // Added Cookie based search filters
  addfield(svar,"submitvar", document.forms[0].submitvar) ;
  addfield("Y","searchflag", document.forms[0].searchflag) ;
  addfield("1","searchptr", document.forms[0].searchptr) ;
  addfield("1","startptr", document.forms[0].startptr) ;
  addfield(x,"loginpath", document.forms[0].loginpath) ;
    document.forms[0].submit();
 }
function showhintajax_saved(pageurl, obj, e, tipwidth){
x=getposOffset(obj, "left")
y=getposOffset(obj, "top")
// pleft=x+"px" ;
  pleft=x+5+obj.offsetWidth+"px" ; // added 20px padding plus offset
 ptop=y-350+"px"
//  ptop = "40px" ; // hardcode 130 as top..
//  pleft = "300px" ; //hardcode 300 as left
if ( $("#mouseoverhintbox").length ){
} else {
var divblock=document.createElement("div") ;
divblock.setAttribute("id", "mouseoverhintbox") ;
document.body.appendChild(divblock) ;
}
 //               "position": "fixed",
  $("#mouseoverhintbox").css({
          "top": ptop,
          "left": pleft
  });
   $('#mouseoverhintbox').addClass("shadowmouse") ;
   $('#mouseoverhintbox').html("<div id=Loader></div>");
   $("#mouseoverhintbox").fadeIn("fast");
var params = "" ;
// BEGIN GET QUERY STRING CODE ;
queryVar = pageurl ;
var inq = pageurl.indexOf('?');
queryVar = queryVar.substring(inq + 1);
queryVar = unescape(queryVar);
var params = queryVar ;
 jQuery.ajax({
      type: "POST",
      url: pageurl,
      data: params ,
      dataType: "html",
      success: function(data) {
 // var xhtml = $(data).find('anyType').text() ;
       // $('#mouseoverhintbox').html(data);
       ddrivetip(data, "", "200") ;
        // alert('Load was performed.');
       $("#mouseoverhintbox").fadeOut("fast");
      }
 }) ;
 obj.onmouseout=closepopup ;
}

// added new showajaxhint functions 
function showhintajax(pageurl, obj, e, tipwidth){
 offsetxpoint=60 //Customize x offset of tooltip
 offsetypoint=20 //Customize y offset of tooltip
 ie=document.all
 ns6=document.getElementById && !document.all
 enabletip=false
if ( $("#mouseoverhintbox").length ){
} else {
var divblock=document.createElement("div") ;
divblock.setAttribute("id", "mouseoverhintbox") ;
document.body.appendChild(divblock) ;
}
if (ie||ns6)
 tipobj=document.all? document.all["mouseoverhintbox"] : document.getElementById? document.getElementById("mouseoverhintbox") : ""

// x=getposOffset(obj, "left")
// y=getposOffset(obj, "top")
// pleft=x+"px" ;
//  pleft=x+5+obj.offsetWidth+"px" ; // added 20px padding plus offset
// ptop=y-350+"px"
//  ptop = "40px" ; // hardcode 130 as top..
//  pleft = "300px" ; //hardcode 300 as left
 //               "position": "fixed", "top": ptop, "left": pleft,
  // $("#mouseoverhintbox").css({"position": "absolute"});
   $('#mouseoverhintbox').addClass("shadowmouse") ;
   $('#mouseoverhintbox').html("<div id=Loader></div>");
   $("#mouseoverhintbox").fadeIn("fast");
var params = "" ;
// BEGIN GET QUERY STRING CODE ;
queryVar = pageurl ;
var inq = pageurl.indexOf('?');
queryVar = queryVar.substring(inq + 1);
queryVar = unescape(queryVar);
var params = queryVar ;
 jQuery.ajax({
      type: "POST",
      url: pageurl,
      data: params ,
      dataType: "html",
      success: function(data) {
 // var xhtml = $(data).find('anyType').text() ;
       // $('#mouseoverhintbox').html(data);
       ddrivetip(data, "", "") ;
       positiontip(e) ;
        // alert('Load was performed.');
      // $("#mouseoverhintbox").fadeOut("fast");
      }
 }) ;
 obj.onmouseout=closepopup ;
}

// added new showajaxhint functions 


enabletip=false ;

function ietruebody(){
return (document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body
}

function ddrivetip(thetext, thecolor, thewidth){
if (ns6||ie){
if (typeof thewidth!="undefined") tipobj.style.width=thewidth+"px"
if (typeof thecolor!="undefined" && thecolor!="") tipobj.style.backgroundColor=thecolor
tipobj.innerHTML=thetext
enabletip=true
return false
}
}

function positiontip(e){
if (enabletip){
var curX=(ns6)?e.pageX : event.clientX+ietruebody().scrollLeft;
var curY=(ns6)?e.pageY : event.clientY+ietruebody().scrollTop;
//Find out how close the mouse is to the corner of the window
var rightedge=ie&&!window.opera? ietruebody().clientWidth-event.clientX-offsetxpoint : window.innerWidth-e.clientX-offsetxpoint-20
var bottomedge=ie&&!window.opera? ietruebody().clientHeight-event.clientY-offsetypoint : window.innerHeight-e.clientY-offsetypoint-20

var leftedge=(offsetxpoint<0)? offsetxpoint*(-1) : -1000


//if the horizontal distance isn't enough to accomodate the width of the context menu
if (rightedge<tipobj.offsetWidth)
//move the horizontal position of the menu to the left by it's width
tipobj.style.left=ie? ietruebody().scrollLeft+event.clientX-tipobj.offsetWidth+"px" : window.pageXOffset+e.clientX-tipobj.offsetWidth+"px"
else if (curX<leftedge)
tipobj.style.left="5px"
else
//position the horizontal position of the menu where the mouse is positioned
tipobj.style.left=curX+offsetxpoint+"px"

//same concept with the vertical position
if (bottomedge<tipobj.offsetHeight)
tipobj.style.top=ie? ietruebody().scrollTop+event.clientY-tipobj.offsetHeight-offsetypoint+"px" : window.pageYOffset+e.clientY-tipobj.offsetHeight-offsetypoint+"px"
else
tipobj.style.top=curY+offsetypoint+"px"
tipobj.style.visibility="visible"
 // added top edge logic
var topedge = parseInt(tipobj.style.top, 10);
if(topedge< $(document).scrollTop() ) tipobj.style.top= $(document).scrollTop() + "px"
}
}
jQuery.fn.cssNumber = function(prop){
    var v = parseInt(this.css(prop),10);
    return isNaN(v) ? 0 : v;
};
function hideddrivetip(){
if (ns6||ie){
enabletip=false
tipobj.style.visibility="hidden"
tipobj.style.left="-1000px"
tipobj.style.backgroundColor=''
tipobj.style.width=''
}
}


// added slahses codes 
function addcslashes (str, charlist) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %  note 1: We show double backslashes in the return value example code below because a JavaScript string will not
  // %  note 1: render them as backslashes otherwise
  // *     example 1: addcslashes('foo[ ]', 'A..z'); // Escape all ASCII within capital A to lower z range, including square brackets
  // *     returns 1: "\\f\\o\\o\\[ \\]"
  // *     example 2: addcslashes("zoo['.']", 'z..A'); // Only escape z, period, and A here since not a lower-to-higher range
  // *     returns 2: "\\zoo['\\.']"
   // *     example 3: addcslashes("@a\u0000\u0010\u00A9", "\0..\37!@\177..\377") == '\\@a\\000\\020\\302\\251'); // Escape as octals those specified and less than 32 (0x20) or greater than 126 (0x7E), but not otherwise 
  // *     returns 3: true
  // *     example 4: addcslashes("\u0020\u007E", "\40..\175") == '\\ ~'); // Those between 32 (0x20 or 040) and 126 (0x7E or 0176) decimal value will be backslashed if specified (not octalized)
  // *     returns 4: true
  // *     example 5: addcslashes("\r\u0007\n", '\0..\37'); // Recognize C escape sequences if specified
  // *     returns 5: "\\r\\a\\n"
  // *     example 6: addcslashes("\r\u0007\n", '\0'); // Do not recognize C escape sequences if not specified
  // *     returns 7: "\r\u0007\n"
  var target = '',
    chrs = [],
    i = 0,
    j = 0,
    c = '',
    next = '',
    rangeBegin = '',
    rangeEnd = '',
    chr = '',
    begin = 0,
    end = 0,
    octalLength = 0,
    postOctalPos = 0,
    cca = 0,
    escHexGrp = [],
    encoded = '',
    percentHex = /%([\dA-Fa-f]+)/g;
  var _pad = function (n, c) {
    if ((n = n + '').length < c) {
      return new Array(++c - n.length).join('0') + n;
    }
    return n;
  };

  for (i = 0; i < charlist.length; i++) {
    c = charlist.charAt(i);
    next = charlist.charAt(i + 1);
    if (c === '\\' && next && (/\d/).test(next)) { // Octal
      rangeBegin = charlist.slice(i + 1).match(/^\d+/)[0];
      octalLength = rangeBegin.length;
      postOctalPos = i + octalLength + 1;
      if (charlist.charAt(postOctalPos) + charlist.charAt(postOctalPos + 1) === '..') { // Octal begins range
        begin = rangeBegin.charCodeAt(0);
        if ((/\\\d/).test(charlist.charAt(postOctalPos + 2) + charlist.charAt(postOctalPos + 3))) { // Range ends with octal
          rangeEnd = charlist.slice(postOctalPos + 3).match(/^\d+/)[0];
          i += 1; // Skip range end backslash
        } else if (charlist.charAt(postOctalPos + 2)) { // Range ends with character
          rangeEnd = charlist.charAt(postOctalPos + 2);
        } else {
          throw 'Range with no end point';
        }
        end = rangeEnd.charCodeAt(0);
        if (end > begin) { // Treat as a range
          for (j = begin; j <= end; j++) {
            chrs.push(String.fromCharCode(j));
          }
        } else { // Supposed to treat period, begin and end as individual characters only, not a range
          chrs.push('.', rangeBegin, rangeEnd);
        }
        i += rangeEnd.length + 2; // Skip dots and range end (already skipped range end backslash if present)
      } else { // Octal is by itself
        chr = String.fromCharCode(parseInt(rangeBegin, 8));
        chrs.push(chr);
      }
      i += octalLength; // Skip range begin
    } else if (next + charlist.charAt(i + 2) === '..') { // Character begins range
      rangeBegin = c;
      begin = rangeBegin.charCodeAt(0);
      if ((/\\\d/).test(charlist.charAt(i + 3) + charlist.charAt(i + 4))) { // Range ends with octal
        rangeEnd = charlist.slice(i + 4).match(/^\d+/)[0];
        i += 1; // Skip range end backslash
      } else if (charlist.charAt(i + 3)) { // Range ends with character
        rangeEnd = charlist.charAt(i + 3);
      } else {
        throw 'Range with no end point';
      }
      end = rangeEnd.charCodeAt(0);
      if (end > begin) { // Treat as a range
        for (j = begin; j <= end; j++) {
          chrs.push(String.fromCharCode(j));
        }
      } else { // Supposed to treat period, begin and end as individual characters only, not a range
        chrs.push('.', rangeBegin, rangeEnd);
      }
      i += rangeEnd.length + 2; // Skip dots and range end (already skipped range end backslash if present)
    } else { // Character is by itself
      chrs.push(c);
    }
  }

  for (i = 0; i < str.length; i++) {
    c = str.charAt(i);
    if (chrs.indexOf(c) !== -1) {
      target += '\\';
      cca = c.charCodeAt(0);
      if (cca < 32 || cca > 126) { // Needs special escaping
        switch (c) {
        case '\n':
          target += 'n';
          break;
        case '\t':
          target += 't';
          break;
        case '\u000D':
          target += 'r';
          break;
        case '\u0007':
          target += 'a';
          break;
        case '\v':
          target += 'v';
          break;
        case '\b':
          target += 'b';
          break;
        case '\f':
          target += 'f';
          break;
        default:
          //target += _pad(cca.toString(8), 3);break; // Sufficient for UTF-16
          encoded = encodeURIComponent(c);

          // 3-length-padded UTF-8 octets
          if ((escHexGrp = percentHex.exec(encoded)) !== null) {
            target += _pad(parseInt(escHexGrp[1], 16).toString(8), 3); // already added a slash above
          }
          while ((escHexGrp = percentHex.exec(encoded)) !== null) {
            target += '\\' + _pad(parseInt(escHexGrp[1], 16).toString(8), 3);
          }
          break;
        }
      } else { // Perform regular backslashed escaping
        target += c;
      }
    } else { // Just add the character unescaped
      target += c;
    }
  }
  return target;
}

/**
 * Cleans a value, to be used in, for example, an fq parameter. Surrounds
 * strings containing special characters with a \.
 *
 * @public
 * @param {String|Number} value The value.
 * @returns {String} The cleaned value.
 */
AjaxSolr.Parameter.CleanValue = function (value) {
  // If the field value has a bad charachec, preface it with \,
var badchars = '+-&!(){}[]^"*?:';
value =  addcslashes(value,badchars) ;
  return value;
}
 // Added  global release detaul function 
 function release_detail(path,x) {
  addfield("1","startptr", document.forms[0].startptr) ;
  addfield(path,"loginpath", document.forms[0].loginpath) ;
  addfield(x,"mdsorderno", document.forms[0].mdsorderno) ;
  addfield("6","pageid", document.forms[0].startptr) ;
 // document.template.loginpath.value = path ;
 // document.template.pageid.value = 6 ;
 // document.template.startptr.value = 1 ;
//  document.template.mdsorderno.value = x ;
  document.forms[0].submit() ;
}
// added new automcpleted functions 

function gettopsellertsh() {
  // blank out existing results 
  if ($("#bsell").length) {
    $("#bsell").html("");
  } else {
    $(".ac_results").append('<div id="bsell"> </div>');
  }
  if ($("#tsell").length) {
    $("#tsell").html("");
  } else {
    $(".ac_results").prepend('<div id="tsell"> </div>');
  }
  // $("#bsell").append(bhtml) ;
  if ($("#query").length > 0) {
    sval = $("#query").val();
    fqval = makefilter($("#query").val());
  } else {
    if ($("#queryother").length > 0) {
      sval = $("#queryother").val();
      fqval = makefilter($("#queryother").val());
    } else {
      // no value to search so return
      return;
    };
  };
  // added header and suggestions 
  $.ajax({
    dataType: 'json',
    type: 'get',
    url: Manager.solrUrl + 'select?rows=5&sort=hotseller desc&wt=json&q=*:*&fq=' + fqval,
    success: function(data) {
      bhtml = "<table> <tr> <th>  Recommended Top Searches  </th> </tr> ";
      lcount = true;
      for (i = 0; i < data.response.docs.length; i++) {
        item = data.response.docs[i];
        //     bhtml = bhtml + '<td class="bsellline"><a href=javascript:setsearch("' + item.aprodno + '") > <img style="float:left" height=50 width=50 src="http://iws.helby.com/webimages/' + item.image + '" ></a></td> <td class="bsellline"><a href=javascript:setsearch("' + item.aprodno + '") > ' + item.aprodno + ' - ' + item.proddesc + ' ' + item.proddesc2 + '</a></td>' ;
        // ie didn't like the assignment?? 
        pdesc = data.response.docs[i].proddesc;
        if (data.response.docs[i].proddesc2) {
          pdesc = pdesc + " " + data.response.docs[i].proddesc2;
        }
        if (lcount) {
          bhtml = bhtml + '<tr><td class="ac_even"><a href=javascript:setsearch("' + data.response.docs[i].aprodno + '") > <img style="float:left" height=30 width=30 src="http://iws.helby.com/webimages/' + data.response.docs[i].image + '" ></a><a href=javascript:setsearch("' + data.response.docs[i].aprodno + '") > ' + data.response.docs[i].aprodno + ' - ' + pdesc + '</a></td> </tr>';
          lcount = false;
        } else {
          bhtml = bhtml + '<tr><td class="ac_odd"><a href=javascript:setsearch("' + data.response.docs[i].aprodno + '") > <img style="float:left" height=30 width=30 src="http://iws.helby.com/webimages/' + data.response.docs[i].image + '" ></a><a href=javascript:setsearch("' + data.response.docs[i].aprodno + '") > ' + data.response.docs[i].aprodno + ' - ' + pdesc + ' </a></td> </tr>';
          lcount = true;
        }
      }
      bhtml = bhtml + " </table> ";
      thtml = '<table> <tr> <th>Click Search to Search our entire catalog for: <br/> <em> ' + sval + ' </em> </th> </tr>';
      thtml += ' <tr> <td>Our Suggestions </td> </tr> </table>';
      $("#bsell").html(bhtml);
      $("#tsell").html(thtml);
    },
  });
  //  $(".ac_results").append(bhtml) ; 
}
function makefilter(value) {
  var curval = 'allText:(';
  var pval = ' OR aprodno:(';
  var fqarray = [];
  var rfqarray = value.split(" "); // each word gets added
  // clena up values in array 
  for (var i = 0; i < rfqarray.length; i++) {
    if ((rfqarray[i] !== '') && (rfqarray[i].charAt(0) !== '(')) {
      fqarray.push(rfqarray[i]);
    }
  }
  // now actually process the array 
  var fcnt = fqarray.length - 1
  for (var i = 0; i < fcnt; i++) {
    curval += '"' + AjaxSolr.Parameter.CleanValue(fqarray[i]) + '"' + ' AND ';
    pval += '' + AjaxSolr.Parameter.CleanValue(fqarray[i]) + '*' + ' OR ';
  }
  curval += '"' + AjaxSolr.Parameter.CleanValue(fqarray[fcnt]) + '"' + ')';
  pval += '' + AjaxSolr.Parameter.CleanValue(fqarray[fcnt]) + '*' + ')';
  curval = curval + pval;
  return curval
}
function setsearch(aprodno) {
  if ($("#query").length > 0) {
    $("#query").val(aprodno);
  } else {
    if ($("#queryother").length > 0) {
      $("#queryother").val(aprodno);
    } else {
      // no value to update so return
      // ; 
    };
  };
  PageSearchSetup(aprodno)
}
// added to update search 
function PageSearchSetup(values) {
  // had issues passing values so just check all variables.
  if ($("#query").length > 0) {
    fqval = makefilter($("#query").val());
  } else {
    if ($("#queryother").length > 0) {
      fqval = makefilter($("#queryother").val());
    } else {
      // no value to search so return
      return;
    };
  };
  $.cookie('SearchFilter', fqval);
  // save the data as a cookie - then just call the dorequest from the weblink. 
  //nhref = 'default.htm?weblink=PageSearch()';
  //  window.location.replace(nhref);
  addfield("N","searchflag", document.forms[0].searchflag) ;
  addfield("1","searchptr", document.forms[0].searchptr) ;
  addfield("1","startptr", document.forms[0].startptr) ;
  addfield("SR","loginpath", document.forms[0].loginpath) ;
  addfield("","submitvar", document.forms[0].submitvar) ;
  showmodalsearch() ;
   // AddGoogleSearch() ;
  document.forms[0].submit();
}
// added new global datasheet 
function datasheet(doc) {
  var output = '';
if (doc.datasheetxref) {
output += "<div class=\"SRProject\"  style=\"height: 35px; width: 30px;float: left;\"> " ;
output +=" <a href=javascript:ShowDataSheet('" + doc.datasheetxref + "')  class=\"hintanchor\" onmouseover=\"showhint('Click here for Project Ideas/MSDS Sheets', this, event, '150px')\">" ;
output +=" <img src=\"https://iws.helby.com/webimages/project.gif\" style=\"border-style:none; margin-top:3px;\"> " ;
output +=" </a></div>"
}
return output;
};
// JavaScript Document FOR NEW Price Group Widget 
(function($) {
  AjaxSolr.PriceGroupWidget = AjaxSolr.AbstractFacetWidget.extend({
    afterRequest: function() {
      if (this.manager.response.facet_counts.facet_fields[this.field] == undefined) {
        //       $(this.target).html(AjaxSolr.theme('no_items_found'));
        return;
      }
      var maxCount = 0;
      var objectedItems = [];
      var start = this.manager.response.facet_counts.facet_ranges[this.field].start;
      var gap = this.manager.response.facet_counts.facet_ranges[this.field].gap;
      var loopCounter = 0;
      for (var count in this.manager.response.facet_counts.facet_ranges[this.field].counts) {
        rangeStart = Number(count);
        //       rangeStart = start + gap * loopCounter;
        rangeEnd = rangeStart + gap;
        displaylabel = "$" + rangeStart + ' - ' + "$" + rangeEnd;
        label = rangeStart + ' TO ' + rangeEnd;
        loopCounter++;
        facet = this.manager.response.facet_counts.facet_fields[this.field];
        objectedItems.push({
          label: label,
          displaylabel: displaylabel,
          count: this.manager.response.facet_counts.facet_ranges[this.field].counts[count]
        });
      }
      objectedItems.sort(function(a, b) {
        return parseFloat(a.label) > parseFloat(b.label) ? -1 : 1;
      });
      $(this.target).empty();
      for (var i = 0, l = objectedItems.length; i < l; i++) {
        var xctr = l - i - 1
        // to account for zero index subtract 1 
        var displaylabel = objectedItems[xctr].displaylabel;
        var label = '[' + objectedItems[xctr].label + ']';
        $(this.target).append(AjaxSolr.theme('pricegroup', displaylabel, objectedItems[xctr].count, 

this.clickHandler(label)));
      }
    },
    fq: function(label, exclude) {
      var fq_value = label;
      return (exclude ? '-' : '') + this.field + ':' + fq_value;
    }
  });
})(jQuery);
AjaxSolr.theme.prototype.pricegroup = function(value, label, handler) {
  return $('<a href="#" />').append(value).append(' (' + label + ') <br/>').click(handler);
};
// JavaScript Document  AjaxSolr.MultiChoiceWidget 
// Multiple Choice Selection Widget with check boxes 
(function($) {
  AjaxSolr.MultiChoiceWidget = AjaxSolr.AbstractFacetWidget.extend({
    originalData: null,
    afterRequest: function() {
      var selected = [],
          unselected = []
          
          if (this.manager.response.facet_counts.facet_fields[this.field] === undefined) {
          //       $(this.target).html('no items found in current selection');
          return;
          }
          
          var objectedItems = [];
      for (var facet in this.manager.response.facet_counts.facet_fields[this.field]) {
        var count = parseInt(this.manager.response.facet_counts.facet_fields[this.field][facet]);
        if (this.manager.store.find('fq', new RegExp(this.fq(facet)))) {
          selected.push({
            facet: facet,
            field: this.field,
            count: count
          });
        } else if (facet) {
          unselected.push({
            facet: facet,
            field: this.field,
            count: count
          });
        }
/*
        objectedItems["__"+facet]=count;
    }
    if (null == this.originalData) {
        this.originalData = objectedItems;
    */
      }
     // added sorting
    unselected.sort(function (a, b) {
      return a.facet < b.facet ? -1 : 1;
    });
      // 	$(this.target).prev().empty();
      // Added Header
      var header = '<div class="accordionButton" id="B' + this.id + '"> ' + this.displayname + ' &#9660; </div>';
      //  var header = '<div class="accordionButton" id="B' + this.id + '"> ' + this.id +  ' &#9660; </div>' ;
      //  var header = '<div class="accordionButton" id="B' + this.id + '"> ' + this.id +  ' Filter &#9650; &#9660; </div>' ;
      var uid = '#B' + this.id;
      $(this.target).empty();
      $(uid).remove(); // Get rid of header if it's there
      //  <div class="accordionContent"> '  ;
      //Selected items
      for (var i = 0, l = selected.length; i < l; i++) {
        var facet = selected[i].facet;
       // facet.toLowerCase().capitalize() ; 
        var count = selected[i].count;
        var ff = selected[i].field;
        $(this.target).append(
        $('<input id="' + ff + '-' + facet + '" class="tagcloud_item" type="checkbox" checked="checked" name="' + ff + '-' + facet + '" value="' + facet + '" >' + facet.toLowerCase().capitalize() + '(' + count + ')' + '<br>')
        // 	     $('<input id="'+ff+'-'+facet+'" class="tagcloud_item" type="checkbox" checked="checked" name="'+ff+'-'+facet+'" value="'+facet+'" >')
        .text(' ').click(this.unclickHandler(facet, this.field))
        // 	     .text(facet+'('+ count +')').click(this.unclickHandler(facet, this.field))  
        );
      }
      //Unselected items
      for (var i = 0, l = unselected.length; i < l; i++) {
        var count = unselected[i].count;
        var facet = unselected[i].facet;
        var ff = unselected[i].field;
        $(this.target).append(
        // 			     $('<input id="'+ff+'-'+facet+'" class="tagcloud_item" type="checkbox" name="'+ff+'-'+facet+'" value="'+facet+'" >')
        $('<input id="' + ff + '-' + facet + '" class="tagcloud_item" type="checkbox"  name="' + ff + '-' + facet + '" value="' + facet + '" >' + facet.toLowerCase().capitalize() + '(' + count + ')' + '<br>').text(' ').click(this.clickHandler(facet)));
      }
      //if( $.trim( $(this.target).html() ).length ) {
      if (selected.length || unselected.length) { // we have data so add accordion logic
        $(this.target).before(header);
        $(this.target).prev().click(function() {
          $(this).next().toggle("slow");
        });
        $(this.target).addClass("accordionContent");
        //  $('div.accordionButton').click(function() {
        // $(this).next().toggle( "slow" );
        //   })
      } else {
        $(this.target).empty();
      }
    }
  });
})(jQuery);

$(document).ready(function() {
//  $(".tab_content").hide(); //Hide all content
//  var linkpass = $(location).attr('hash');
//  if (linkpass !== '') {
//  $(linkpass).addClass("active"); //Add "active" class to selected tab
//  $(linkpass).fadeIn();
//  } else { 
//  $("ul.tabs li:first").addClass("active").show(); //Activate first tab
//  $(".tab_content:first").show(); //Show first tab content
//  }
 //On Click Event
//  $("ul.tabs li").click(function() {
//  $("ul.tabs li").removeClass("active"); //Remove any "active" class
//  $(this).addClass("active"); //Add "active" class to selected tab
//  $(".tab_content").hide(); //Hide all tab content
//  var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
//  $(activeTab).fadeIn();
// //  drawMenus(); 
//  return false;
//  });
});
String.prototype.capitalize = function () 
{
    var letters = "\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00DF-\\u00F6\\u00F8-\\u00FF\\u0101\\u0103\\u0105\\u0107\\u0109\\u010B\\u010D\\u010F\\u0111\\u0113\\u0115\\u0117\\u0119\\u011B\\u011D\\u011F\\u0121\\u0123\\u0125\\u0127\\u0129\\u012B\\u012D\\u012F\\u0131\\u0133\\u0135\\u0137\\u0138\\u013A\\u013C\\u013E\\u0140\\u0142\\u0144\\u0146\\u0148\\u0149\\u014B\\u014D\\u014F\\u0151\\u0153\\u0155\\u0157\\u0159\\u015B\\u015D\\u015F\\u0161\\u0163\\u0165\\u0167\\u0169\\u016B\\u016D\\u016F\\u0171\\u0173\\u0175\\u0177\\u017A\\u017C\\u017E-\\u0180\\u0183\\u0185\\u0188\\u018C\\u018D\\u0192\\u0195\\u0199-\\u019B\\u019E\\u01A1\\u01A3\\u01A5\\u01A8\\u01AA\\u01AB\\u01AD\\u01B0\\u01B4\\u01B6\\u01B9\\u01BA\\u01BD-\\u01BF\\u01C6\\u01C9\\u01CC\\u01CE\\u01D0\\u01D2\\u01D4\\u01D6\\u01D8\\u01DA\\u01DC\\u01DD\\u01DF\\u01E1\\u01E3\\u01E5\\u01E7\\u01E9\\u01EB\\u01ED\\u01EF\\u01F0\\u01F3\\u01F5\\u01F9\\u01FB\\u01FD\\u01FF\\u0201\\u0203\\u0205\\u0207\\u0209\\u020B\\u020D\\u020F\\u0211\\u0213\\u0215\\u0217\\u0219\\u021B\\u021D\\u021F\\u0221\\u0223\\u0225\\u0227\\u0229\\u022B\\u022D\\u022F\\u0231\\u0233-\\u0239\\u023C\\u023F\\u0240\\u0242\\u0247\\u0249\\u024B\\u024D\\u024F-\\u0293\\u0295-\\u02AF\\u0371\\u0373\\u0377\\u037B-\\u037D\\u0390\\u03AC-\\u03CE\\u03D0\\u03D1\\u03D5-\\u03D7\\u03D9\\u03DB\\u03DD\\u03DF\\u03E1\\u03E3\\u03E5\\u03E7\\u03E9\\u03EB\\u03ED\\u03EF-\\u03F3\\u03F5\\u03F8\\u03FB\\u03FC\\u0430-\\u045F\\u0461\\u0463\\u0465\\u0467\\u0469\\u046B\\u046D\\u046F\\u0471\\u0473\\u0475\\u0477\\u0479\\u047B\\u047D\\u047F\\u0481\\u048B\\u048D\\u048F\\u0491\\u0493\\u0495\\u0497\\u0499\\u049B\\u049D\\u049F\\u04A1\\u04A3\\u04A5\\u04A7\\u04A9\\u04AB\\u04AD\\u04AF\\u04B1\\u04B3\\u04B5\\u04B7\\u04B9\\u04BB\\u04BD\\u04BF\\u04C2\\u04C4\\u04C6\\u04C8\\u04CA\\u04CC\\u04CE\\u04CF\\u04D1\\u04D3\\u04D5\\u04D7\\u04D9\\u04DB\\u04DD\\u04DF\\u04E1\\u04E3\\u04E5\\u04E7\\u04E9\\u04EB\\u04ED\\u04EF\\u04F1\\u04F3\\u04F5\\u04F7\\u04F9\\u04FB\\u04FD\\u04FF\\u0501\\u0503\\u0505\\u0507\\u0509\\u050B\\u050D\\u050F\\u0511\\u0513\\u0515\\u0517\\u0519\\u051B\\u051D\\u051F\\u0521\\u0523\\u0525\\u0561-\\u0587\\u1D00-\\u1D2B\\u1D62-\\u1D77\\u1D79-\\u1D9A\\u1E01\\u1E03\\u1E05\\u1E07\\u1E09\\u1E0B\\u1E0D\\u1E0F\\u1E11\\u1E13\\u1E15\\u1E17\\u1E19\\u1E1B\\u1E1D\\u1E1F\\u1E21\\u1E23\\u1E25\\u1E27\\u1E29\\u1E2B\\u1E2D\\u1E2F\\u1E31\\u1E33\\u1E35\\u1E37\\u1E39\\u1E3B\\u1E3D\\u1E3F\\u1E41\\u1E43\\u1E45\\u1E47\\u1E49\\u1E4B\\u1E4D\\u1E4F\\u1E51\\u1E53\\u1E55\\u1E57\\u1E59\\u1E5B\\u1E5D\\u1E5F\\u1E61\\u1E63\\u1E65\\u1E67\\u1E69\\u1E6B\\u1E6D\\u1E6F\\u1E71\\u1E73\\u1E75\\u1E77\\u1E79\\u1E7B\\u1E7D\\u1E7F\\u1E81\\u1E83\\u1E85\\u1E87\\u1E89\\u1E8B\\u1E8D\\u1E8F\\u1E91\\u1E93\\u1E95-\\u1E9D\\u1E9F\\u1EA1\\u1EA3\\u1EA5\\u1EA7\\u1EA9\\u1EAB\\u1EAD\\u1EAF\\u1EB1\\u1EB3\\u1EB5\\u1EB7\\u1EB9\\u1EBB\\u1EBD\\u1EBF\\u1EC1\\u1EC3\\u1EC5\\u1EC7\\u1EC9\\u1ECB\\u1ECD\\u1ECF\\u1ED1\\u1ED3\\u1ED5\\u1ED7\\u1ED9\\u1EDB\\u1EDD\\u1EDF\\u1EE1\\u1EE3\\u1EE5\\u1EE7\\u1EE9\\u1EEB\\u1EED\\u1EEF\\u1EF1\\u1EF3\\u1EF5\\u1EF7\\u1EF9\\u1EFB\\u1EFD\\u1EFF-\\u1F07\\u1F10-\\u1F15\\u1F20-\\u1F27\\u1F30-\\u1F37\\u1F40-\\u1F45\\u1F50-\\u1F57\\u1F60-\\u1F67\\u1F70-\\u1F7D\\u1F80-\\u1F87\\u1F90-\\u1F97\\u1FA0-\\u1FA7\\u1FB0-\\u1FB4\\u1FB6\\u1FB7\\u1FBE\\u1FC2-\\u1FC4\\u1FC6\\u1FC7\\u1FD0-\\u1FD3\\u1FD6\\u1FD7\\u1FE0-\\u1FE7\\u1FF2-\\u1FF4\\u1FF6\\u1FF7\\u210A\\u210E\\u210F\\u2113\\u212F\\u2134\\u2139\\u213C\\u213D\\u2146-\\u2149\\u214E\\u2184\\u2C30-\\u2C5E\\u2C61\\u2C65\\u2C66\\u2C68\\u2C6A\\u2C6C\\u2C71\\u2C73\\u2C74\\u2C76-\\u2C7C\\u2C81\\u2C83\\u2C85\\u2C87\\u2C89\\u2C8B\\u2C8D\\u2C8F\\u2C91\\u2C93\\u2C95\\u2C97\\u2C99\\u2C9B\\u2C9D\\u2C9F\\u2CA1\\u2CA3\\u2CA5\\u2CA7\\u2CA9\\u2CAB\\u2CAD\\u2CAF\\u2CB1\\u2CB3\\u2CB5\\u2CB7\\u2CB9\\u2CBB\\u2CBD\\u2CBF\\u2CC1\\u2CC3\\u2CC5\\u2CC7\\u2CC9\\u2CCB\\u2CCD\\u2CCF\\u2CD1\\u2CD3\\u2CD5\\u2CD7\\u2CD9\\u2CDB\\u2CDD\\u2CDF\\u2CE1\\u2CE3\\u2CE4\\u2CEC\\u2CEE\\u2D00-\\u2D25\\uA641\\uA643\\uA645\\uA647\\uA649\\uA64B\\uA64D\\uA64F\\uA651\\uA653\\uA655\\uA657\\uA659\\uA65B\\uA65D\\uA65F\\uA663\\uA665\\uA667\\uA669\\uA66B\\uA66D\\uA681\\uA683\\uA685\\uA687\\uA689\\uA68B\\uA68D\\uA68F\\uA691\\uA693\\uA695\\uA697\\uA723\\uA725\\uA727\\uA729\\uA72B\\uA72D\\uA72F-\\uA731\\uA733\\uA735\\uA737\\uA739\\uA73B\\uA73D\\uA73F\\uA741\\uA743\\uA745\\uA747\\uA749\\uA74B\\uA74D\\uA74F\\uA751\\uA753\\uA755\\uA757\\uA759\\uA75B\\uA75D\\uA75F\\uA761\\uA763\\uA765\\uA767\\uA769\\uA76B\\uA76D\\uA76F\\uA771-\\uA778\\uA77A\\uA77C\\uA77F\\uA781\\uA783\\uA785\\uA787\\uA78C\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFF41-\\uFF5A\\u0041-\\u005A\\u00C0-\\u00D6\\u00D8-\\u00DE\\u0100\\u0102\\u0104\\u0106\\u0108\\u010A\\u010C\\u010E\\u0110\\u0112\\u0114\\u0116\\u0118\\u011A\\u011C\\u011E\\u0120\\u0122\\u0124\\u0126\\u0128\\u012A\\u012C\\u012E\\u0130\\u0132\\u0134\\u0136\\u0139\\u013B\\u013D\\u013F\\u0141\\u0143\\u0145\\u0147\\u014A\\u014C\\u014E\\u0150\\u0152\\u0154\\u0156\\u0158\\u015A\\u015C\\u015E\\u0160\\u0162\\u0164\\u0166\\u0168\\u016A\\u016C\\u016E\\u0170\\u0172\\u0174\\u0176\\u0178\\u0179\\u017B\\u017D\\u0181\\u0182\\u0184\\u0186\\u0187\\u0189-\\u018B\\u018E-\\u0191\\u0193\\u0194\\u0196-\\u0198\\u019C\\u019D\\u019F\\u01A0\\u01A2\\u01A4\\u01A6\\u01A7\\u01A9\\u01AC\\u01AE\\u01AF\\u01B1-\\u01B3\\u01B5\\u01B7\\u01B8\\u01BC\\u01C4\\u01C7\\u01CA\\u01CD\\u01CF\\u01D1\\u01D3\\u01D5\\u01D7\\u01D9\\u01DB\\u01DE\\u01E0\\u01E2\\u01E4\\u01E6\\u01E8\\u01EA\\u01EC\\u01EE\\u01F1\\u01F4\\u01F6-\\u01F8\\u01FA\\u01FC\\u01FE\\u0200\\u0202\\u0204\\u0206\\u0208\\u020A\\u020C\\u020E\\u0210\\u0212\\u0214\\u0216\\u0218\\u021A\\u021C\\u021E\\u0220\\u0222\\u0224\\u0226\\u0228\\u022A\\u022C\\u022E\\u0230\\u0232\\u023A\\u023B\\u023D\\u023E\\u0241\\u0243-\\u0246\\u0248\\u024A\\u024C\\u024E\\u0370\\u0372\\u0376\\u0386\\u0388-\\u038A\\u038C\\u038E\\u038F\\u0391-\\u03A1\\u03A3-\\u03AB\\u03CF\\u03D2-\\u03D4\\u03D8\\u03DA\\u03DC\\u03DE\\u03E0\\u03E2\\u03E4\\u03E6\\u03E8\\u03EA\\u03EC\\u03EE\\u03F4\\u03F7\\u03F9\\u03FA\\u03FD-\\u042F\\u0460\\u0462\\u0464\\u0466\\u0468\\u046A\\u046C\\u046E\\u0470\\u0472\\u0474\\u0476\\u0478\\u047A\\u047C\\u047E\\u0480\\u048A\\u048C\\u048E\\u0490\\u0492\\u0494\\u0496\\u0498\\u049A\\u049C\\u049E\\u04A0\\u04A2\\u04A4\\u04A6\\u04A8\\u04AA\\u04AC\\u04AE\\u04B0\\u04B2\\u04B4\\u04B6\\u04B8\\u04BA\\u04BC\\u04BE\\u04C0\\u04C1\\u04C3\\u04C5\\u04C7\\u04C9\\u04CB\\u04CD\\u04D0\\u04D2\\u04D4\\u04D6\\u04D8\\u04DA\\u04DC\\u04DE\\u04E0\\u04E2\\u04E4\\u04E6\\u04E8\\u04EA\\u04EC\\u04EE\\u04F0\\u04F2\\u04F4\\u04F6\\u04F8\\u04FA\\u04FC\\u04FE\\u0500\\u0502\\u0504\\u0506\\u0508\\u050A\\u050C\\u050E\\u0510\\u0512\\u0514\\u0516\\u0518\\u051A\\u051C\\u051E\\u0520\\u0522\\u0524\\u0531-\\u0556\\u10A0-\\u10C5\\u1E00\\u1E02\\u1E04\\u1E06\\u1E08\\u1E0A\\u1E0C\\u1E0E\\u1E10\\u1E12\\u1E14\\u1E16\\u1E18\\u1E1A\\u1E1C\\u1E1E\\u1E20\\u1E22\\u1E24\\u1E26\\u1E28\\u1E2A\\u1E2C\\u1E2E\\u1E30\\u1E32\\u1E34\\u1E36\\u1E38\\u1E3A\\u1E3C\\u1E3E\\u1E40\\u1E42\\u1E44\\u1E46\\u1E48\\u1E4A\\u1E4C\\u1E4E\\u1E50\\u1E52\\u1E54\\u1E56\\u1E58\\u1E5A\\u1E5C\\u1E5E\\u1E60\\u1E62\\u1E64\\u1E66\\u1E68\\u1E6A\\u1E6C\\u1E6E\\u1E70\\u1E72\\u1E74\\u1E76\\u1E78\\u1E7A\\u1E7C\\u1E7E\\u1E80\\u1E82\\u1E84\\u1E86\\u1E88\\u1E8A\\u1E8C\\u1E8E\\u1E90\\u1E92\\u1E94\\u1E9E\\u1EA0\\u1EA2\\u1EA4\\u1EA6\\u1EA8\\u1EAA\\u1EAC\\u1EAE\\u1EB0\\u1EB2\\u1EB4\\u1EB6\\u1EB8\\u1EBA\\u1EBC\\u1EBE\\u1EC0\\u1EC2\\u1EC4\\u1EC6\\u1EC8\\u1ECA\\u1ECC\\u1ECE\\u1ED0\\u1ED2\\u1ED4\\u1ED6\\u1ED8\\u1EDA\\u1EDC\\u1EDE\\u1EE0\\u1EE2\\u1EE4\\u1EE6\\u1EE8\\u1EEA\\u1EEC\\u1EEE\\u1EF0\\u1EF2\\u1EF4\\u1EF6\\u1EF8\\u1EFA\\u1EFC\\u1EFE\\u1F08-\\u1F0F\\u1F18-\\u1F1D\\u1F28-\\u1F2F\\u1F38-\\u1F3F\\u1F48-\\u1F4D\\u1F59\\u1F5B\\u1F5D\\u1F5F\\u1F68-\\u1F6F\\u1FB8-\\u1FBB\\u1FC8-\\u1FCB\\u1FD8-\\u1FDB\\u1FE8-\\u1FEC\\u1FF8-\\u1FFB\\u2102\\u2107\\u210B-\\u210D\\u2110-\\u2112\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u2130-\\u2133\\u213E\\u213F\\u2145\\u2183\\u2C00-\\u2C2E\\u2C60\\u2C62-\\u2C64\\u2C67\\u2C69\\u2C6B\\u2C6D-\\u2C70\\u2C72\\u2C75\\u2C7E-\\u2C80\\u2C82\\u2C84\\u2C86\\u2C88\\u2C8A\\u2C8C\\u2C8E\\u2C90\\u2C92\\u2C94\\u2C96\\u2C98\\u2C9A\\u2C9C\\u2C9E\\u2CA0\\u2CA2\\u2CA4\\u2CA6\\u2CA8\\u2CAA\\u2CAC\\u2CAE\\u2CB0\\u2CB2\\u2CB4\\u2CB6\\u2CB8\\u2CBA\\u2CBC\\u2CBE\\u2CC0\\u2CC2\\u2CC4\\u2CC6\\u2CC8\\u2CCA\\u2CCC\\u2CCE\\u2CD0\\u2CD2\\u2CD4\\u2CD6\\u2CD8\\u2CDA\\u2CDC\\u2CDE\\u2CE0\\u2CE2\\u2CEB\\u2CED\\uA640\\uA642\\uA644\\uA646\\uA648\\uA64A\\uA64C\\uA64E\\uA650\\uA652\\uA654\\uA656\\uA658\\uA65A\\uA65C\\uA65E\\uA662\\uA664\\uA666\\uA668\\uA66A\\uA66C\\uA680\\uA682\\uA684\\uA686\\uA688\\uA68A\\uA68C\\uA68E\\uA690\\uA692\\uA694\\uA696\\uA722\\uA724\\uA726\\uA728\\uA72A\\uA72C\\uA72E\\uA732\\uA734\\uA736\\uA738\\uA73A\\uA73C\\uA73E\\uA740\\uA742\\uA744\\uA746\\uA748\\uA74A\\uA74C\\uA74E\\uA750\\uA752\\uA754\\uA756\\uA758\\uA75A\\uA75C\\uA75E\\uA760\\uA762\\uA764\\uA766\\uA768\\uA76A\\uA76C\\uA76E\\uA779\\uA77B\\uA77D\\uA77E\\uA780\\uA782\\uA784\\uA786\\uA78B\\uFF21-\\uFF3A\\u01C5\\u01C8\\u01CB\\u01F2\\u1F88-\\u1F8F\\u1F98-\\u1F9F\\u1FA8-\\u1FAF\\u1FBC\\u1FCC\\u1FFC\\u02B0-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0374\\u037A\\u0559\\u0640\\u06E5\\u06E6\\u07F4\\u07F5\\u07FA\\u081A\\u0824\\u0828\\u0971\\u0E46\\u0EC6\\u10FC\\u17D7\\u1843\\u1AA7\\u1C78-\\u1C7D\\u1D2C-\\u1D61\\u1D78\\u1D9B-\\u1DBF\\u2071\\u207F\\u2090-\\u2094\\u2C7D\\u2D6F\\u2E2F\\u3005\\u3031-\\u3035\\u303B\\u309D\\u309E\\u30FC-\\u30FE\\uA015\\uA4F8-\\uA4FD\\uA60C\\uA67F\\uA717-\\uA71F\\uA770\\uA788\\uA9CF\\uAA70\\uAADD\\uFF70\\uFF9E\\uFF9F\\u01BB\\u01C0-\\u01C3\\u0294\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0621-\\u063F\\u0641-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u0800-\\u0815\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0972\\u0979-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D28\\u0D2A-\\u0D39\\u0D3D\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E45\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EDC\\u0EDD\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8B\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10D0-\\u10FA\\u1100-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17DC\\u1820-\\u1842\\u1844-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C77\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u2135-\\u2138\\u2D30-\\u2D65\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u3006\\u303C\\u3041-\\u3096\\u309F\\u30A1-\\u30FA\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31B7\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCB\\uA000-\\uA014\\uA016-\\uA48C\\uA4D0-\\uA4F7\\uA500-\\uA60B\\uA610-\\uA61F\\uA62A\\uA62B\\uA66E\\uA6A0-\\uA6E5\\uA7FB-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA6F\\uAA71-\\uAA76\\uAA7A\\uAA80-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB\\uAADC\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA2D\\uFA30-\\uFA6D\\uFA70-\\uFAD9\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF66-\\uFF6F\\uFF71-\\uFF9D\\uFFA0-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC";
    var regex = new RegExp("(^|[^" + letters + "])([" + letters + "])", "g");
    return this.replace(regex, function (s, m1, m2) { return m1 + m2.toUpperCase(); });
  //  this.toLowerCase().replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g, function(letter) {
  //  return letter.toUpperCase();
  //  });
};

AjaxSolr.theme.prototype.no_items_found = function() {
  var no_msg = "Unfortunately our search was unable to find any results. Please try a new search.";
  var no_msg = no_msg + '<br> <div id="DISCContent"> </div>';
  //   'We are sorry, There were no items found using your current selection criteria <br> Please try a new search <div id="DISCContent"> </div>';
  var fq = $.cookie('SearchFilter') || '';
  var fqarray = fq.split(":");
  var fname = fqarray[0];
  var fval = fqarray[1];
  var str = fval;
  if (str.indexOf(")") > 0) {
    var result = str.substring(str.indexOf("(") + 1, str.indexOf(")"));
  } else {
    result = fname + " " + str;
  }
  var fval = result;
  var parms = window.location + '?ORDERNO=' + document.forms[0].orderno.value + '&CUSTOMERID=' + document.forms[0].CustomerId.value + '&LOGINPATH=DISC&pageid=31&APRODNO=' + fval;
  var t1 = setTimeout(widgetload(parms, '#DISCContent'), 500);
  return no_msg;
};
// JavaScript Document  AjaxSolr.SingleChoiceWidget
// Single Choice Selection Widget with check boxe 
(function($) {
  AjaxSolr.SingleChoiceWidget = AjaxSolr.AbstractFacetWidget.extend({
    originalData: null,
    afterRequest: function() {
      var selected = [],
          unselected = []
          
          if (this.manager.response.facet_counts.facet_fields[this.field] === undefined) {
          //       $(this.target).html('no items found in current selection');
          return;
          }
          
          var objectedItems = [];
      for (var facet in this.manager.response.facet_counts.facet_fields[this.field]) {
        var count = parseInt(this.manager.response.facet_counts.facet_fields[this.field][facet]);
        if (facet == this.specific) {
          if (this.manager.store.find('fq', new RegExp(this.fq(facet)))) {
            selected.push({
              facet: facet,
              field: this.field,
              count: count
            });
          } else if (facet) {
            unselected.push({
              facet: facet,
              field: this.field,
              count: count
            });
          }
          // only show the customer his history
        }
      }
      // added sorting
      unselected.sort(function(a, b) {
        return a.facet < b.facet ? -1 : 1;
      });
      // 	$(this.target).prev().empty();
      // Added Header
      var header = '<div class="accordionButton" id="B' + this.id + '"> ' + this.displayname + ' &#9660; </div>';
      //  var header = '<div class="accordionButton" id="B' + this.id + '"> ' + this.id +  ' &#9660; </div>' ;
      //  var header = '<div class="accordionButton" id="B' + this.id + '"> ' + this.id +  ' Filter &#9650; &#9660; </div>' ;
      var uid = '#B' + this.id;
      $(this.target).empty();
      $(uid).remove(); // Get rid of header if it's there
      //  <div class="accordionContent"> '  ;
      //Selected items
      for (var i = 0, l = selected.length; i < l; i++) {
        var facet = selected[i].facet;
        var count = selected[i].count;
        var ff = selected[i].field;
        $(this.target).append(
        //         $('<input id="' + ff + '-' + facet + '" class="tagcloud_item" type="checkbox" checked="checked" name="' + ff + '-' + facet + '" value="' + facet + '" >' + facet + '(' + count + ')' + '<br>')
        $('<input id="' + ff + '-' + facet + '" class="tagcloud_item" type="checkbox" checked="checked" name="' + ff + '-' + facet + '" value="' + facet + '" >' + "Show Only Purchased" + '(' + count + ')' + '<br>')
        // 	     $('<input id="'+ff+'-'+facet+'" class="tagcloud_item" type="checkbox" checked="checked" name="'+ff+'-'+facet+'" value="'+facet+'" >')
        .text(' ').click(this.unclickHandler(facet, this.field))
        // 	     .text(facet+'('+ count +')').click(this.unclickHandler(facet, this.field))  
        );
      }
      //Unselected items
      for (var i = 0, l = unselected.length; i < l; i++) {
        var count = unselected[i].count;
        var facet = unselected[i].facet;
        var ff = unselected[i].field;
        $(this.target).append(
        // 			     $('<input id="'+ff+'-'+facet+'" class="tagcloud_item" type="checkbox" name="'+ff+'-'+facet+'" value="'+facet+'" >')
        $('<input id="' + ff + '-' + facet + '" class="tagcloud_item" type="checkbox"  name="' + ff + '-' + facet + '" value="' + facet + '" >' + "Show Only Purchased" + '(' + count + ')' + '<br>').text(' ').click(this.clickHandler(facet)));
      }
      //if( $.trim( $(this.target).html() ).length ) {
      if (selected.length || unselected.length) { // we have data so add accordion logic
        $(this.target).before(header);
        $(this.target).prev().click(function() {
          $(this).next().toggle("slow");
        });
        $(this.target).addClass("accordionContent");
        //  $('div.accordionButton').click(function() {
        // $(this).next().toggle( "slow" );
        //   })
      } else {
        $(this.target).empty();
      }
    }
  });
})(jQuery);
// CORRECTED TO ALLOW FOR IE 9   3-15-16 
function SearchSubmitsm() {
  Sstr = document.getElementById("prodidsm").value;
  Sstr = Sstr + "|" + document.getElementById("proddescsm").value;
  if (testObj(document.getElementById("histflag"))) {
    var a = document.getElementById("histflag").checked;
    if (a == true) {
      addfield("Y", "histflag", document.forms[0].histflag);
    }
  }
  addfield(Sstr, "submitvar", document.forms[0].submitvar);
  addfield("Y", "searchflag", document.forms[0].searchflag);
  addfield("1", "searchptr", document.forms[0].searchptr);
  addfield("1", "startptr", document.forms[0].startptr);
  addfield("SR", "loginpath", document.forms[0].loginpath);
  showmodalsearch();
  AddGoogleSearch();
  document.forms[0].submit();
}
// djf 10-26-17 - added keypress override. 
//$(element).off('click'); //Removes a previously added click listener using the on method
$(window).unbind('keypress') ;
$(window).bind('keypress', function(e){  
//  if ($("#query:focus") && (e.keyCode === 13)) { 

  if (document.activeElement.name == 'query' && (e.keyCode === 13)) { 
     SearchSubmitsm() ;
    // console.log("Enter Key Pressed") ; 
    }
  }) ; 
;

// JavaScript Document  AjaxSolr.BinaryChoiceWidget
// Binary (Yes/No) Choice Selection Widget with check boxes 
(function($) {
  AjaxSolr.BinaryChoiceWidget = AjaxSolr.AbstractFacetWidget.extend({
    originalData: null,
    afterRequest: function() {
      var selected = [] ;
          if (this.manager.response.facet_counts.facet_fields[this.field] === undefined) {
          return;
          }         
      var header = '<div class="accordionButton" id="B' + this.id + '"> ' + this.displayname + ' &#9660; </div>';
      var uid = '#B' + this.id;
      $(this.target).empty();
      $(uid).remove(); // Get rid of header if it's there
      for (var facet in this.manager.response.facet_counts.facet_fields[this.field]) {
        var count = parseInt(this.manager.response.facet_counts.facet_fields[this.field][facet]);
        if (facet == this.specific) {
            $(this.target).append(
            $('<input id="Y' + this.field + '-' + facet + '" class="tagcloud_item" type="checkbox"  name="' + this.field + '-' + facet + '" value="' + facet + '" >' + this.labelyes + '(' + count + ')' + '<br>')
//             .text(' ').click(this.unclickHandler(facet, this.field))
        .text(' ').click(this.clickHandler(facet))
            );
            //Unselected items
            var ff =  this.field;
// djf1224             var ff = "-" + this.field;
        var negfacet = "(NOT " + facet + ")" ; 
            var tcount = this.manager.response.response.numFound  - count ; 
        $(this.target).append(
        $('<input id="N' + ff + '-' + facet + '" class="tagcloud_item" type="checkbox"  name="' + ff + '-' + facet + '" value="' + facet + '" >' + this.labelno + '(' + tcount + ')' + '<br>')
// djf1224        $('<input id="' + ff + '-' + facet + '" class="tagcloud_item" type="checkbox"  name="' + ff + '-' + negfacet + '" value="' + facet + '" >' + this.labelno + '(' + tcount + ')' + '<br>')
        .text(' ').click(this.clickHandler(negfacet))
//djf1224        .text(' ').click(this.clickHandler(this.fq(facet,true)))
        );
        $(this.target).before(header);
        $(this.target).prev().click(function() {
          $(this).next().toggle("slow");
        });
        $(this.target).addClass("accordionContent");
       }
     }  
   } 
  });
})(jQuery);
function templatesearch(templ) { ;
    $('[name=loginpath]').val("CL") ;
    $('[name=searchflag]').val("Y") ;
    var hval = '<option selected value="' + templ + '">Search Template</option>' ; 
    $('[name=customlist]').each(function () {
       if ($(this).is("input")) {  $(this).val(templ); } ;      
       if ($(this).is("select")) {  $(this).html(hval); } ; 
    });;
     document.forms[0].submit() ;
}
