(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cake-decorators"] = factory();
	else
		root["cake-decorators"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _cake2 = __webpack_require__(/*! ./cake */ 1);
	
	var _cake = _interopRequireWildcard(_cake2);
	
	exports.cake = _cake;

/***/ },
/* 1 */
/*!*********************!*\
  !*** ./src/cake.js ***!
  \*********************/
/***/ function(module, exports) {

	/**
	 * Cake - Recipes for configurable decorators
	 **/
	
	"use strict";
	
	exports.__esModule = true;
	exports.identity = identity;
	exports.enumerable = enumerable;
	exports.configurable = configurable;
	exports.writable = writable;
	exports.memoize = memoize;
	exports.cache = cache;
	exports.cacheAsync = cacheAsync;
	
	function identity(value) {
	  return value;
	}
	
	/**
	 * @function enumerable
	 * @type decorator
	 * @param { Boolean } value - whether the property is enumerable or not
	 * @return { DecoratorFunction }
	 **/
	
	function enumerable(value) {
	  return function (target, name, descriptor) {
	    descriptor.enumerable = value;
	    return descriptor;
	  };
	}
	
	/**
	 * @function configurable
	 * @type decorator
	 * @param { Boolean } value - whether the property is configurable or not
	 * @return { DecoratorFunction }
	 **/
	
	function configurable(value) {
	  return function (target, name, descriptor) {
	    descriptor.configurable = value;
	    return descriptor;
	  };
	}
	
	/**
	 * @function writable
	 * @type decorator
	 * @param { Boolean } value - whether the property is writable or not
	 * @return { DecoratorFunction }
	 **/
	
	function writable(value) {
	  return function (target, key, descriptor) {
	    descriptor.writable = value;
	    return descriptor;
	  };
	}
	
	/**
	 * Hash for memoized getters / setters
	 **/
	var memoized = new WeakMap();
	
	/**
	 * @function memozie
	 * @source https://github.com/wycats/javascript-decorators
	 * @type decorator
	 * @param { Boolean } value - whether the property is enumerable or not
	 * @return { Void }
	 **/
	
	function memoize(target, name, descriptor) {
	  var getter = descriptor.get;
	  var setter = descriptor.set;
	
	  descriptor.get = function () {
	    var table = memoizationFor(this);
	    if (name in table) return table[name];
	    return table[name] = getter.call(this);
	  };
	
	  descriptor.set = function (val) {
	    var table = memoizationFor(this);
	    if (table[name] == val) return;
	    setter.call(this, val);
	    table[name] = val;
	  };
	}
	
	function memoizationFor(obj) {
	  var table = memoized.get(obj);
	
	  if (!table) {
	    table = Object.create(null);
	    memoized.set(obj, table);
	  }
	
	  return table;
	}
	
	/**
	 * @function cache
	 * @type decorator
	 * @param { Object } driver - format is { get: Function, set: Function }
	 * @param { Function } getKey - method that returns the unique identifier
	 * @return { DescriptorFunction }
	 **/
	
	function cache(_ref) {
	  var get = _ref.get;
	  var set = _ref.set;
	  var getKey = arguments.length <= 1 || arguments[1] === undefined ? identity : arguments[1];
	
	  return function (target, name, descriptor) {
	    var fn = descriptor.value;
	
	    descriptor.value = function cachedDecoratedMethod(params) {
	      var key = getKey(params);
	      var cached = get(key);
	
	      if (cached) {
	        return cached;
	      } else {
	        var result = fn.call(target, params);
	        set(key, result);
	        return result;
	      }
	    };
	
	    return descriptor;
	  };
	}
	
	/**
	 * @function cacheAsync
	 * @type decorator
	 * @param { Object } driver - format is { get: Function, set: Function }
	 * @param { Function } getKey - method that returns the unique identifier
	 * @return { DescriptorFunction }
	 **/
	
	function cacheAsync(_ref2) {
	  var get = _ref2.get;
	  var set = _ref2.set;
	  var getKey = arguments.length <= 1 || arguments[1] === undefined ? identity : arguments[1];
	
	  return function (target, name, descriptor) {
	    var fn = descriptor.value;
	
	    descriptor.value = function cachedDecoratedMethod(params) {
	      var key, cached, result;
	      return regeneratorRuntime.async(function cachedDecoratedMethod$(context$3$0) {
	        while (1) switch (context$3$0.prev = context$3$0.next) {
	          case 0:
	            key = getKey(params);
	            context$3$0.next = 3;
	            return regeneratorRuntime.awrap(get(key));
	
	          case 3:
	            cached = context$3$0.sent;
	
	            if (!cached) {
	              context$3$0.next = 8;
	              break;
	            }
	
	            return context$3$0.abrupt("return", cached);
	
	          case 8:
	            context$3$0.next = 10;
	            return regeneratorRuntime.awrap(fn.call(target, params));
	
	          case 10:
	            result = context$3$0.sent;
	            context$3$0.next = 13;
	            return regeneratorRuntime.awrap(set(key, result));
	
	          case 13:
	            return context$3$0.abrupt("return", result);
	
	          case 14:
	          case "end":
	            return context$3$0.stop();
	        }
	      }, null, this);
	    };
	
	    return descriptor;
	  };
	}
	
	var localStorageDriver = {
	  get: function get(key) {
	    return localStorage.getItem(key);
	  },
	
	  set: function set(key, value) {
	    localStorage.setItem(key, value);
	  }
	};
	exports.localStorageDriver = localStorageDriver;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=cake-decorators.js.map