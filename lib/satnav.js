(function(w, d) {

	/*
	 *
	 *	Satnav.js Routing
	 *  @author: Joe Harlow
	 *
	 */

	'use strict';

	var _sN,
		_otherwise,
		_promise,
		_current,
		_params = {},
		_ = {},
		_routes = [],
		_listeners = {},
		_settings = {
			poll : 25,							// hashchange Polyfill poll interval
			html5 : false,						// use pushState if available
			force : false						// force hashchange events
		};

	_.setup = function(fn) {
		var ev = _settings.html5 && 'pushState' in w.history ? 'popstate' : 'hashchange';
		if (_settings.force) _.force();
		if (('on' + ev) in w) {
			_.listen(w, ev, fn);
		} else {
			var oH = w.location.href;
			setInterval(function() {
				var nH = w.location.href;
				if (oH !== nH) {
					oH = nH;
					fn.call(w);
				}
			}, _settings.poll);
		}
	};

	_.force = function() {
		var a = d.getElementsByTagName('a');
		var _click = function() {
			var href = this.getAttribute('href');
			var s = _.sanitize(href.substr(href.indexOf('#') + 1));
			if (s === _current) {
				_.change();
			}
		};

		for (var i = 0; i < a.length; i++) {
			var el = a[i];
			if (el.hasAttribute('href') && el.getAttribute('href').indexOf('#') !== -1) {
				_.listen(el, 'click', _click);
			}
		}
	};

	_.promise = function() {
		var _t = this;
		_t.stack = [];

		_t.then = function(fn) {
			_t.stack.push(fn);
		};

		_t.resolve = function() {
			while (_t.stack.length) {
				return _t.stack.shift().call(_sN);
			}
		};
	};

	_.route = function(path, directions) {
		var params = [];
		path = '^' + path;
		path = path.replace(/(\?)?\{([^}]+)\}/g, function(match, optional, param) {
			params.push({ name : param, optional : (typeof optional !== 'undefined') ? true : false });
			return '([\\w-.]+)?';
		}).replace(/\//g, '\\/?');
		path += '\\/?$';
		_routes.push({ regex : new RegExp(path), params : params, directions : directions });
	};

	_.change = function() {
		_current = _.state();
		var route = _.match(_current);
		if (route) {
			var old = _params;
			_params = route.params;
			var change = _.dispatch('change', _params, old);
			if (_settings.html5 && 'pushState' in w.history) {
				w.history.replaceState(_.extend(_params, { hash : _current }), '{Satnav}', '/' + _current);
			}
			var end = function() {
				route.directions.call(_sN, _params);
			};
			if (change instanceof _.promise) {
				_promise.then(end);
			} else {
				end();
			}
		} else {
			w.location.hash = _otherwise || '';
		}
	};

	_.sanitize = function(path) {
		return path.replace(/^\//g, '');
	};

	_.match = function(h) {
		for (var r in _routes) {
			var route = _routes[r];
			var matched = h.match(route.regex);
			if (matched) {
				var p = {};
				for (var i = 1, len = matched.length; i < len; i++) {
					if (typeof matched[i] === 'undefined' && !route.params[i-1].optional) {
						throw new Error('[Satnav] A required route parameter was not defined');
					} else if (typeof matched[i] !== 'undefined') {
						p[route.params[i-1].name] = matched[i];
					}
				}
				return { directions : route.directions, params : p };
			}
		}
		return undefined;
	};

	_.dispatch = function(ev)
	{
		var args = Array.prototype.slice.call(arguments, 1);
		return ev in _listeners && _listeners[ev].apply(_sN, args);
	};

	_.state = function()
	{
		return w.history.state && w.history.state.hash ? w.history.state.hash : _.sanitize(w.location.hash.substr(1));
	};

	_.extend = function(obj, ext)
	{
		for (var prop in ext) {
			obj[prop] = (obj.hasOwnProperty(prop)) ? obj[prop] : ext[prop];
		}
		return obj;
	};

	_.listen = (function() {
		if (w.addEventListener) {
			return function(el, ev, fn) {
				el.addEventListener(ev, fn, false);
			};
		} else if (w.attachEvent) {
			return function(el, ev, fn) {
				el.attachEvent('on' + ev, function() { fn.call(el); }, false);
			};
		}
	})();

	_sN = function(config) {
		_settings = _.extend(config, _settings);
		return _sN;
	};

	_sN.defer = (function() {
		_promise = new _.promise();
		return _promise;
	})();

	_sN.resolve = function() {
		setTimeout(_promise.resolve, 1);
	};

	_sN.navigate = function(route) {
		if ('path' in route) {
			if (_routes.length === 0) {
				_.setup(_.change);
			}
			_.route(_.sanitize(route.path), ('directions' in route) ? route.directions : function() {});
		} else {
			throw new Error('[Satnav] A required argument was not defined');
		}
		return _sN;
	};

	_sN.otherwise = function(route) {
		_otherwise = (typeof route === 'string') ? _.sanitize(route) : ('path' in route) ? _.sanitize(route.path) : '';
		return _sN;
	};

	_sN.change = function(fn) {
		_listeners.change = fn;
		return _sN;
	};

	_sN.go = function() {
		_.change();
		return _sN;
	};

	if (typeof w.define === 'function' && w.define.amd) {
		w.define('Satnav', [], function() {
			return _sN;
		});
	} else if (typeof w.module !== 'undefined' && w.module.exports) {
		w.module.exports = _sN;
	} else {
		w.sN = w.Satnav = _sN;
	}

})(window, document);
