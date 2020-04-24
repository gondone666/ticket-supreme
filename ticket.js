const { promises: fs } = require('fs');
const { performance } = require('perf_hooks');
const crypto = require('crypto');
const request = require('request-promise');

process=undefined;

var navigator = {
	get userAgent() {
		return 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1';
	}
};

var window = {
	get navigator() {
		return navigator;
	},
	get document() {
		return document;
	},

	get crypto() {
		return {
			getRandomValues: crypto.randomFillSync
		};
	}
}

var supjar = request.jar();
supjar._jar.setCookie('lastVisitedFragment=', 'https://www.supremenewyork.com/', (error, cookie) => {
		
});

var document = {
	get body() {
		return '<html></html>';
	},
	 get cookie() {
		if (supjar!=undefined)
		{
			let c = supjar._jar.getCookieStringSync('https://www.supremenewyork.com');
			console.log('getcookie', c);
			return c;
		}	else return 'lastVisitedFragment=';
	},

	set cookie(value) {
		if (supjar!=undefined)
		{
			supjar._jar.setCookie(value, 'https://www.supremenewyork.com', (error, cookie) => {
				if (error) {
					throw error;
				}
			});
			console.log('setcookie',value);
		}	
	}
};

var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function(a) {
	var b = 0;
	return function() {
		return b < a.length ? {
			done: !1,
			value: a[b++]
		} : {
			done: !0
		}
	}
};
$jscomp.arrayIterator = function(a) {
	return {
		next: $jscomp.arrayIteratorImpl(a)
	}
};
$jscomp.makeIterator = function(a) {
	var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
	return b ? b.call(a) : $jscomp.arrayIterator(a)
};
$jscomp.getGlobal = function(a) {
	a = ["object" == typeof globalThis && globalThis, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global, a];
	for (var b = 0; b < a.length; ++b) {
		var e = a[b];
		if (e && e.Math == Math) return e
	}
	throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, e) {
	a != Array.prototype && a != Object.prototype && (a[b] = e.value)
};

$jscomp.polyfill = function(a, b, e, g) {
	if (b) {
		e = $jscomp.global;
		a = a.split(".");
		for (g = 0; g < a.length - 1; g++) {
			var f = a[g];
			f in e || (e[f] = {});
			e = e[f]
		}
		a = a[a.length - 1];
		g = e[a];
		b = b(g);
		b != g && null != b && $jscomp.defineProperty(e, a, {
			configurable: !0,
			writable: !0,
			value: b
		})
	}
};
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.polyfill("Promise", function(a) {
	function b() {
		this.batch_ = null
	}

	function e(a) {
		return a instanceof f ? a : new f(function(c, d) {
			c(a)
		})
	}
	if (a && !$jscomp.FORCE_POLYFILL_PROMISE) return a;
	b.prototype.asyncExecute = function(a) {
		if (null == this.batch_) {
			this.batch_ = [];
			var c = this;
			this.asyncExecuteFunction(function() {
				c.executeBatch_()
			})
		}
		this.batch_.push(a)
	};
	var g = $jscomp.global.setTimeout;
	b.prototype.asyncExecuteFunction = function(a) {
		g(a, 0)
	};
	b.prototype.executeBatch_ = function() {
		for (; this.batch_ && this.batch_.length;) {
			var a =
				this.batch_;
			this.batch_ = [];
			for (var b = 0; b < a.length; ++b) {
				var d = a[b];
				a[b] = null;
				try {
					d()
				} catch (m) {
					this.asyncThrow_(m)
				}
			}
		}
		this.batch_ = null
	};
	b.prototype.asyncThrow_ = function(a) {
		this.asyncExecuteFunction(function() {
			throw a;
		})
	};
	var f = function(a) {
		this.state_ = 0;
		this.result_ = void 0;
		this.onSettledCallbacks_ = [];
		var c = this.createResolveAndReject_();
		try {
			a(c.resolve, c.reject)
		} catch (d) {
			c.reject(d)
		}
	};
	f.prototype.createResolveAndReject_ = function() {
		function a(a) {
			return function(c) {
				d || (d = !0, a.call(b, c))
			}
		}
		var b = this,
			d = !1;
		return {
			resolve: a(this.resolveTo_),
			reject: a(this.reject_)
		}
	};
	f.prototype.resolveTo_ = function(a) {
		if (a === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
		else if (a instanceof f) this.settleSameAsPromise_(a);
		else {
			a: switch (typeof a) {
				case "object":
					var b = null != a;
					break a;
				case "function":
					b = !0;
					break a;
				default:
					b = !1
			}
			b ? this.resolveToNonPromiseObj_(a) : this.fulfill_(a)
		}
	};
	f.prototype.resolveToNonPromiseObj_ = function(a) {
		var b = void 0;
		try {
			b = a.then
		} catch (d) {
			this.reject_(d);
			return
		}
		"function" == typeof b ?
			this.settleSameAsThenable_(b, a) : this.fulfill_(a)
	};
	f.prototype.reject_ = function(a) {
		this.settle_(2, a)
	};
	f.prototype.fulfill_ = function(a) {
		this.settle_(1, a)
	};
	f.prototype.settle_ = function(a, b) {
		if (0 != this.state_) throw Error("Cannot settle(" + a + ", " + b + "): Promise already settled in state" + this.state_);
		this.state_ = a;
		this.result_ = b;
		this.executeOnSettledCallbacks_()
	};
	f.prototype.executeOnSettledCallbacks_ = function() {
		if (null != this.onSettledCallbacks_) {
			for (var a = 0; a < this.onSettledCallbacks_.length; ++a) h.asyncExecute(this.onSettledCallbacks_[a]);
			this.onSettledCallbacks_ = null
		}
	};
	var h = new b;
	f.prototype.settleSameAsPromise_ = function(a) {
		var b = this.createResolveAndReject_();
		a.callWhenSettled_(b.resolve, b.reject)
	};
	f.prototype.settleSameAsThenable_ = function(a, b) {
		var d = this.createResolveAndReject_();
		try {
			a.call(b, d.resolve, d.reject)
		} catch (m) {
			d.reject(m)
		}
	};
	f.prototype.then = function(a, b) {
		function d(a, b) {
			return "function" == typeof a ? function(b) {
				try {
					c(a(b))
				} catch (r) {
					l(r)
				}
			} : b
		}
		var c, l, e = new f(function(a, b) {
			c = a;
			l = b
		});
		this.callWhenSettled_(d(a, c), d(b, l));
		return e
	};
	f.prototype.catch = function(a) {
		return this.then(void 0, a)
	};
	f.prototype.callWhenSettled_ = function(a, b) {
		function d() {
			switch (c.state_) {
				case 1:
					a(c.result_);
					break;
				case 2:
					b(c.result_);
					break;
				default:
					throw Error("Unexpected state: " + c.state_);
			}
		}
		var c = this;
		null == this.onSettledCallbacks_ ? h.asyncExecute(d) : this.onSettledCallbacks_.push(d)
	};
	f.resolve = e;
	f.reject = function(a) {
		return new f(function(b, d) {
			d(a)
		})
	};
	f.race = function(a) {
		return new f(function(b, d) {
			for (var c = $jscomp.makeIterator(a), l = c.next(); !l.done; l = c.next()) e(l.value).callWhenSettled_(b,
				d)
		})
	};
	f.all = function(a) {
		var b = $jscomp.makeIterator(a),
			d = b.next();
		return d.done ? e([]) : new f(function(a, c) {
			function m(b) {
				return function(d) {
					k[b] = d;
					l--;
					0 == l && a(k)
				}
			}
			var k = [],
				l = 0;
			do k.push(void 0), l++, e(d.value).callWhenSettled_(m(k.length - 1), c), d = b.next(); while (!d.done)
		})
	};
	return f
}, "es6", "es3");
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
	$jscomp.initSymbol = function() {};
	$jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol)
};
$jscomp.SymbolClass = function(a, b) {
	this.$jscomp$symbol$id_ = a;
	$jscomp.defineProperty(this, "description", {
		configurable: !0,
		writable: !0,
		value: b
	})
};
$jscomp.SymbolClass.prototype.toString = function() {
	return this.$jscomp$symbol$id_
};
$jscomp.Symbol = function() {
	function a(e) {
		if (this instanceof a) throw new TypeError("Symbol is not a constructor");
		return new $jscomp.SymbolClass($jscomp.SYMBOL_PREFIX + (e || "") + "_" + b++, e)
	}
	var b = 0;
	return a
}();
$jscomp.initSymbolIterator = function() {
	$jscomp.initSymbol();
	var a = $jscomp.global.Symbol.iterator;
	a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("Symbol.iterator"));
	"function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {
		configurable: !0,
		writable: !0,
		value: function() {
			return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this))
		}
	});
	$jscomp.initSymbolIterator = function() {}
};
$jscomp.initSymbolAsyncIterator = function() {
	$jscomp.initSymbol();
	var a = $jscomp.global.Symbol.asyncIterator;
	a || (a = $jscomp.global.Symbol.asyncIterator = $jscomp.global.Symbol("Symbol.asyncIterator"));
	$jscomp.initSymbolAsyncIterator = function() {}
};
$jscomp.iteratorPrototype = function(a) {
	$jscomp.initSymbolIterator();
	a = {
		next: a
	};
	a[$jscomp.global.Symbol.iterator] = function() {
		return this
	};
	return a
};
$jscomp.underscoreProtoCanBeSet = function() {
	var a = {
			a: !0
		},
		b = {};
	try {
		return b.__proto__ = a, b.a
	} catch (e) {}
	return !1
};
$jscomp.setPrototypeOf = "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function(a, b) {
	a.__proto__ = b;
	if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
	return a
} : null;
$jscomp.generator = {};
$jscomp.generator.ensureIteratorResultIsObject_ = function(a) {
	if (!(a instanceof Object)) throw new TypeError("Iterator result " + a + " is not an object");
};
$jscomp.generator.Context = function() {
	this.isRunning_ = !1;
	this.yieldAllIterator_ = null;
	this.yieldResult = void 0;
	this.nextAddress = 1;
	this.finallyAddress_ = this.catchAddress_ = 0;
	this.finallyContexts_ = this.abruptCompletion_ = null
};
$jscomp.generator.Context.prototype.start_ = function() {
	if (this.isRunning_) throw new TypeError("Generator is already running");
	this.isRunning_ = !0
};
$jscomp.generator.Context.prototype.stop_ = function() {
	this.isRunning_ = !1
};
$jscomp.generator.Context.prototype.jumpToErrorHandler_ = function() {
	this.nextAddress = this.catchAddress_ || this.finallyAddress_
};
$jscomp.generator.Context.prototype.next_ = function(a) {
	this.yieldResult = a
};
$jscomp.generator.Context.prototype.throw_ = function(a) {
	this.abruptCompletion_ = {
		exception: a,
		isException: !0
	};
	this.jumpToErrorHandler_()
};
$jscomp.generator.Context.prototype.return = function(a) {
	this.abruptCompletion_ = {
		return: a
	};
	this.nextAddress = this.finallyAddress_
};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function(a) {
	this.abruptCompletion_ = {
		jumpTo: a
	};
	this.nextAddress = this.finallyAddress_
};
$jscomp.generator.Context.prototype.yield = function(a, b) {
	this.nextAddress = b;
	return {
		value: a
	}
};
$jscomp.generator.Context.prototype.yieldAll = function(a, b) {
	a = $jscomp.makeIterator(a);
	var e = a.next();
	$jscomp.generator.ensureIteratorResultIsObject_(e);
	if (e.done) this.yieldResult = e.value, this.nextAddress = b;
	else return this.yieldAllIterator_ = a, this.yield(e.value, b)
};
$jscomp.generator.Context.prototype.jumpTo = function(a) {
	this.nextAddress = a
};
$jscomp.generator.Context.prototype.jumpToEnd = function() {
	this.nextAddress = 0
};
$jscomp.generator.Context.prototype.setCatchFinallyBlocks = function(a, b) {
	this.catchAddress_ = a;
	void 0 != b && (this.finallyAddress_ = b)
};
$jscomp.generator.Context.prototype.setFinallyBlock = function(a) {
	this.catchAddress_ = 0;
	this.finallyAddress_ = a || 0
};
$jscomp.generator.Context.prototype.leaveTryBlock = function(a, b) {
	this.nextAddress = a;
	this.catchAddress_ = b || 0
};
$jscomp.generator.Context.prototype.enterCatchBlock = function(a) {
	this.catchAddress_ = a || 0;
	a = this.abruptCompletion_.exception;
	this.abruptCompletion_ = null;
	return a
};
$jscomp.generator.Context.prototype.enterFinallyBlock = function(a, b, e) {
	e ? this.finallyContexts_[e] = this.abruptCompletion_ : this.finallyContexts_ = [this.abruptCompletion_];
	this.catchAddress_ = a || 0;
	this.finallyAddress_ = b || 0
};
$jscomp.generator.Context.prototype.leaveFinallyBlock = function(a, b) {
	b = this.finallyContexts_.splice(b || 0)[0];
	if (b = this.abruptCompletion_ = this.abruptCompletion_ || b) {
		if (b.isException) return this.jumpToErrorHandler_();
		void 0 != b.jumpTo && this.finallyAddress_ < b.jumpTo ? (this.nextAddress = b.jumpTo, this.abruptCompletion_ = null) : this.nextAddress = this.finallyAddress_
	} else this.nextAddress = a
};
$jscomp.generator.Context.prototype.forIn = function(a) {
	return new $jscomp.generator.Context.PropertyIterator(a)
};
$jscomp.generator.Context.PropertyIterator = function(a) {
	this.object_ = a;
	this.properties_ = [];
	for (var b in a) this.properties_.push(b);
	this.properties_.reverse()
};
$jscomp.generator.Context.PropertyIterator.prototype.getNext = function() {
	for (; 0 < this.properties_.length;) {
		var a = this.properties_.pop();
		if (a in this.object_) return a
	}
	return null
};
$jscomp.generator.Engine_ = function(a) {
	this.context_ = new $jscomp.generator.Context;
	this.program_ = a
};
$jscomp.generator.Engine_.prototype.next_ = function(a) {
	this.context_.start_();
	if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_.next, a, this.context_.next_);
	this.context_.next_(a);
	return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.return_ = function(a) {
	this.context_.start_();
	var b = this.context_.yieldAllIterator_;
	if (b) return this.yieldAllStep_("return" in b ? b["return"] : function(a) {
		return {
			value: a,
			done: !0
		}
	}, a, this.context_.return);
	this.context_.return(a);
	return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.throw_ = function(a) {
	this.context_.start_();
	if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"], a, this.context_.next_);
	this.context_.throw_(a);
	return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.yieldAllStep_ = function(a, b, e) {
	try {
		var g = a.call(this.context_.yieldAllIterator_, b);
		$jscomp.generator.ensureIteratorResultIsObject_(g);
		if (!g.done) return this.context_.stop_(), g;
		var f = g.value
	} catch (h) {
		return this.context_.yieldAllIterator_ = null, this.context_.throw_(h), this.nextStep_()
	}
	this.context_.yieldAllIterator_ = null;
	e.call(this.context_, f);
	return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.nextStep_ = function() {
	for (; this.context_.nextAddress;) try {
		var a = this.program_(this.context_);
		if (a) return this.context_.stop_(), {
			value: a.value,
			done: !1
		}
	} catch (b) {
		this.context_.yieldResult = void 0, this.context_.throw_(b)
	}
	this.context_.stop_();
	if (this.context_.abruptCompletion_) {
		a = this.context_.abruptCompletion_;
		this.context_.abruptCompletion_ = null;
		if (a.isException) throw a.exception;
		return {
			value: a.return,
			done: !0
		}
	}
	return {
		value: void 0,
		done: !0
	}
};
$jscomp.generator.Generator_ = function(a) {
	this.next = function(b) {
		return a.next_(b)
	};
	this.throw = function(b) {
		return a.throw_(b)
	};
	this.return = function(b) {
		return a.return_(b)
	};
	$jscomp.initSymbolIterator();
	this[Symbol.iterator] = function() {
		return this
	}
};
$jscomp.generator.createGenerator = function(a, b) {
	b = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(b));
	$jscomp.setPrototypeOf && $jscomp.setPrototypeOf(b, a.prototype);
	return b
};
$jscomp.asyncExecutePromiseGenerator = function(a) {
	function b(b) {
		return a.next(b)
	}

	function e(b) {
		return a.throw(b)
	}
	return new Promise(function(g, f) {
		function h(a) {
			a.done ? g(a.value) : Promise.resolve(a.value).then(b, e).then(h, f)
		}
		h(a.next())
	})
};
$jscomp.asyncExecutePromiseGeneratorFunction = function(a) {
	return $jscomp.asyncExecutePromiseGenerator(a())
};
$jscomp.asyncExecutePromiseGeneratorProgram = function(a) {
	return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(a)))
};
$jscomp.checkEs6ConformanceViaProxy = function() {
	try {
		var a = {},
			b = Object.create(new $jscomp.global.Proxy(a, {
				get: function(e, g, f) {
					return e == a && "q" == g && f == b
				}
			}));
		return !0 === b.q
	} catch (e) {
		return !1
	}
};
$jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS = !1;
$jscomp.ES6_CONFORMANCE = $jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS && $jscomp.checkEs6ConformanceViaProxy();
$jscomp.owns = function(a, b) {
	return Object.prototype.hasOwnProperty.call(a, b)
};

$jscomp.polyfill("WeakMap", function(a) {
	function b() {
		if (!a || !Object.seal) return !1;
		try {
			var b = Object.seal({}),
				d = Object.seal({}),
				c = new a([
					[b, 2],
					[d, 3]
				]);
			if (2 != c.get(b) || 3 != c.get(d)) return !1;
			c.delete(b);
			c.set(d, 4);
			return !c.has(b) && 4 == c.get(d)
		} catch (k) {
			return !1
		}
	}

	function e() {}

	function g(a) {
		var b = typeof a;
		return "object" === b && null !== a || "function" === b
	}

	function f(a) {
		if (!$jscomp.owns(a, c)) {
			var b = new e;
			$jscomp.defineProperty(a, c, {
				value: b
			})
		}
	}

	function h(a) {
		var b = Object[a];
		b && (Object[a] = function(a) {
			if (a instanceof e) return a;
			f(a);
			return b(a)
		})
	}
	if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
		if (a && $jscomp.ES6_CONFORMANCE) return a
	} else if (b()) return a;
	var c = "$jscomp_hidden_" + Math.random();
	h("freeze");
	h("preventExtensions");
	h("seal");
	var n = 0,
		d = function(a) {
			this.id_ = (n += Math.random() + 1).toString();
			if (a) {
				a = $jscomp.makeIterator(a);
				for (var b; !(b = a.next()).done;) b = b.value, this.set(b[0], b[1])
			}
		};
	d.prototype.set = function(a, b) {
		if (!g(a)) throw Error("Invalid WeakMap key");
		f(a);
		if (!$jscomp.owns(a, c)) throw Error("WeakMap key fail: " +
			a);
		a[c][this.id_] = b;
		return this
	};
	d.prototype.get = function(a) {
		return g(a) && $jscomp.owns(a, c) ? a[c][this.id_] : void 0
	};
	d.prototype.has = function(a) {
		return g(a) && $jscomp.owns(a, c) && $jscomp.owns(a[c], this.id_)
	};
	d.prototype.delete = function(a) {
		return g(a) && $jscomp.owns(a, c) && $jscomp.owns(a[c], this.id_) ? delete a[c][this.id_] : !1
	};
	return d
}, "es6", "es3");
$jscomp.MapEntry = function() {};

$jscomp.polyfill("Map", function(a) {
	function b() {
		if ($jscomp.ASSUME_NO_NATIVE_MAP || !a || "function" != typeof a || !a.prototype.entries || "function" != typeof Object.seal) return !1;
		try {
			var b = Object.seal({
					x: 4
				}),
				c = new a($jscomp.makeIterator([
					[b, "s"]
				]));
			if ("s" != c.get(b) || 1 != c.size || c.get({
					x: 4
				}) || c.set({
					x: 4
				}, "t") != c || 2 != c.size) return !1;
			var e = c.entries(),
				f = e.next();
			if (f.done || f.value[0] != b || "s" != f.value[1]) return !1;
			f = e.next();
			return f.done || 4 != f.value[0].x || "t" != f.value[1] || !e.next().done ? !1 : !0
		} catch (k) {
			return !1
		}
	}
	if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
		if (a && $jscomp.ES6_CONFORMANCE) return a
	} else if (b()) return a;
	$jscomp.initSymbolIterator();
	var e = new WeakMap,
		g = function(a) {
			this.data_ = {};
			this.head_ = c();
			this.size = 0;
			if (a) {
				a = $jscomp.makeIterator(a);
				for (var b; !(b = a.next()).done;) b = b.value, this.set(b[0], b[1])
			}
		};
	g.prototype.set = function(a, b) {
		a = 0 === a ? 0 : a;
		var d = f(this, a);
		d.list || (d.list = this.data_[d.id] = []);
		d.entry ? d.entry.value = b : (d.entry = {
			next: this.head_,
			previous: this.head_.previous,
			head: this.head_,
			key: a,
			value: b
		}, d.list.push(d.entry), this.head_.previous.next = d.entry, this.head_.previous = d.entry, this.size++);
		return this
	};
	g.prototype.delete = function(a) {
		a = f(this, a);
		return a.entry && a.list ? (a.list.splice(a.index, 1), a.list.length || delete this.data_[a.id], a.entry.previous.next = a.entry.next, a.entry.next.previous = a.entry.previous, a.entry.head = null, this.size--, !0) : !1
	};
	g.prototype.clear = function() {
		this.data_ = {};
		this.head_ = this.head_.previous = c();
		this.size = 0
	};
	g.prototype.has = function(a) {
		return !!f(this, a).entry
	};
	g.prototype.get = function(a) {
		return (a = f(this, a).entry) && a.value
	};
	g.prototype.entries = function() {
		return h(this, function(a) {
			return [a.key, a.value]
		})
	};
	g.prototype.keys = function() {
		return h(this, function(a) {
			return a.key
		})
	};
	g.prototype.values = function() {
		return h(this, function(a) {
			return a.value
		})
	};
	g.prototype.forEach = function(a, b) {
		for (var c = this.entries(), d; !(d = c.next()).done;) d = d.value, a.call(b, d[1], d[0], this)
	};
	g.prototype[Symbol.iterator] = g.prototype.entries;
	var f = function(a, b) {
			var c = b && typeof b;
			"object" ==
			c || "function" == c ? e.has(b) ? c = e.get(b) : (c = "" + ++n, e.set(b, c)) : c = "p_" + b;
			var d = a.data_[c];
			if (d && $jscomp.owns(a.data_, c))
				for (a = 0; a < d.length; a++) {
					var k = d[a];
					if (b !== b && k.key !== k.key || b === k.key) return {
						id: c,
						list: d,
						index: a,
						entry: k
					}
				}
			return {
				id: c,
				list: d,
				index: -1,
				entry: void 0
			}
		},
		h = function(a, b) {
			var c = a.head_;
			return $jscomp.iteratorPrototype(function() {
				if (c) {
					for (; c.head != a.head_;) c = c.previous;
					for (; c.next != c.head;) return c = c.next, {
						done: !1,
						value: b(c)
					};
					c = null
				}
				return {
					done: !0,
					value: void 0
				}
			})
		},
		c = function() {
			var a = {};
			return a.previous =
				a.next = a.head = a
		},
		n = 0;
	return g
}, "es6", "es3");
$jscomp.polyfill("Reflect.getOwnPropertyDescriptor", function(a) {
	return a || Object.getOwnPropertyDescriptor
}, "es6", "es5");
$jscomp.polyfill("Reflect.getPrototypeOf", function(a) {
	return a || Object.getPrototypeOf
}, "es6", "es5");
$jscomp.findDescriptor = function(a, b) {
	for (; a;) {
		var e = Reflect.getOwnPropertyDescriptor(a, b);
		if (e) return e;
		a = Reflect.getPrototypeOf(a)
	}
};
$jscomp.polyfill("Reflect.get", function(a) {
	return a ? a : function(a, e, g) {
		if (2 >= arguments.length) return a[e];
		var b = $jscomp.findDescriptor(a, e);
		if (b) return b.get ? b.get.call(g) : b.value
	}
}, "es6", "es5");
$jscomp.polyfill("Reflect.isExtensible", function(a) {
	return a ? a : $jscomp.ASSUME_ES5 || "function" == typeof Object.isExtensible ? Object.isExtensible : function() {
		return !0
	}
}, "es6", "es3");
$jscomp.polyfill("Reflect.set", function(a) {
	return a ? a : function(a, e, g, f) {
		var b = $jscomp.findDescriptor(a, e);
		return b ? b.set ? (b.set.call(3 < arguments.length ? f : a, g), !0) : b.writable && !Object.isFrozen(a) ? (a[e] = g, !0) : !1 : Reflect.isExtensible(a) ? (a[e] = g, !0) : !1
	}
}, "es6", "es5");
$jscomp.polyfill("Reflect.apply", function(a) {
	if (a) return a;
	var b = Function.prototype.apply;
	return function(a, g, f) {
		return b.call(a, g, f)
	}
}, "es6", "es3");
$jscomp.objectCreate = $jscomp.ASSUME_ES5 || "function" == typeof Object.create ? Object.create : function(a) {
	var b = function() {};
	b.prototype = a;
	return new b
};

$jscomp.construct = function() {
	function a() {
		function a() {}
		new a;
		Reflect.construct(a, [], function() {});
		return new a instanceof a
	}
	if ("undefined" != typeof Reflect && Reflect.construct) {
		if (a()) return Reflect.construct;
		var b = Reflect.construct;
		return function(a, g, f) {
			a = b(a, g);
			f && Reflect.setPrototypeOf(a, f.prototype);
			return a
		}
	}
	return function(a, b, f) {
		void 0 === f && (f = a);
		f = $jscomp.objectCreate(f.prototype || Object.prototype);
		return Function.prototype.apply.call(a, f, b) || f
	}
}();

$jscomp.polyfill("Reflect.construct", function(a) {
	return $jscomp.construct
}, "es6", "es3");

try {
	
	(function() {
		if ("undefined" !== typeof window) window.global = window;
		else if ("undefined" !== typeof self) self.global = self;
		else throw Error("cannot export Go (neither window nor self is defined)");
		var a = "";
		global.window=window;
		global.document=document;
		global.navigator=navigator;
		
		global.fs = {
			constants: {
				O_WRONLY: -1,
				O_RDWR: -1,
				O_CREAT: -1,
				O_TRUNC: -1,
				O_APPEND: -1,
				O_EXCL: -1
			},
			writeSync: function(b, c) {
				a += e.decode(c);
				b = a.lastIndexOf("\n"); - 1 != b && (console.log(a.substr(0, b)), a = a.substr(b + 1));
				return c.length
			},
			write: function(a, b, f, d, e, g) {
				if (0 !== f || d !== b.length || null !== e) throw Error("not implemented");
				a = this.writeSync(a, b);
				g(null, a)
			},
			open: function(a, b, f, d) {
				a = Error("not implemented");
				a.code = "ENOSYS";
				d(a)
			},
			fsync: function(a, b) {
				b(null)
			}
		};
		var b = new TextEncoder("utf-8"),
			e = new TextDecoder("utf-8"),
			g = [];
			
		global.Go = function() {
			var a = this;

			this._callbackTimeouts = new Map;
			this._nextCallbackTimeoutID = 1;

			var c = function() {
					
					return new DataView(a._inst.exports.memory.buffer)
				},
				f = function(b) {
					var d = c().getFloat64(b, !0);
					if (0 !== d) {
						if (!isNaN(d)) return d;
						b = c().getUint32(b, !0);
						return a._values[b]
					}
				},
				d = function(b, d) {
					if ("number" ===
						typeof d) isNaN(d) ? (c().setUint32(b + 4, 2146959360, !0), c().setUint32(b, 0, !0)) : 0 === d ? (c().setUint32(b + 4, 2146959360, !0), c().setUint32(b, 1, !0)) : c().setFloat64(b, d, !0);
					else {
						switch (d) {
							case void 0:
								c().setFloat64(b, 0, !0);
								return;
							case null:
								c().setUint32(b + 4, 2146959360, !0);
								c().setUint32(b, 2, !0);
								return;
							case !0:
								c().setUint32(b + 4, 2146959360, !0);
								c().setUint32(b, 3, !0);
								return;
							case !1:
								c().setUint32(b + 4, 2146959360, !0);
								c().setUint32(b, 4, !0);
								return
						}
						var f = a._refs.get(d);
						void 0 === f && (f = a._values.length, a._values.push(d),
							a._refs.set(d, f));
						var e = 0;
						switch (typeof d) {
							case "string":
								e = 1;
								break;
							case "symbol":
								e = 2;
								break;
							case "function":
								e = 3
						}
						c().setUint32(b + 4, 2146959360 | e, !0);
						c().setUint32(b, f, !0)
					}
				},
				m = function(a, b, c) {
					c = Array(b);
					for (var d = 0; d < b; d++) c[d] = f(a + 8 * d);
					return c
				},
				l = function(b, c) {
					return e.decode(new DataView(a._inst.exports.memory.buffer, b, c))
				},
				
				t = Date.now() - performance.now();
			this.importObject = {
				wasi_unstable: {
					fd_write: function(a, b, d, f) {
						if (1 == a)
							for (a = 0; a < d; a++) {
								var k = b + 8 * a,
									q = c().getUint32(k + 0, !0);
								k = c().getUint32(k + 4, !0);
								for (var h = 0; h < k; h++) {
									var p = c().getUint8(q + h);
									13 != p && (10 == p ? (p = e.decode(new Uint8Array(g)), g = [], console.log(p)) : g.push(p))
								}
							} else console.error("invalid file descriptor:", a);
						c().setUint32(f, 0, !0);
						return 0
					}
				},
				env: {
					"runtime.ticks": function() {
						let tick=t + performance.now();
						console.log('ticks',tick);
						return tick;
					},
					"runtime.sleepTicks": function(b) {
						console.log('sleepTicks',b);
						setTimeout(a._inst.exports.go_scheduler, b)
					},
					"syscall/js.stringVal": function(a, b, c) {
						console.log('stringVal', arguments);
						b = l(b, c);
						d(a, b)
					},
					"syscall/js.valueGet": function(a, b, c, e) {
						console.log('valueget',arguments);
						c = l(c, e);
						b = f(b);
						b = Reflect.get(b, c);
						d(a, b)
					},
					"syscall/js.valueSet": function(a,
						b, c, d) {
						console.log('valueset',arguments);
						a = f(a);
						b = l(b, c);
						d = f(d);
						Reflect.set(a, b, d)
					},
					"syscall/js.valueIndex": function(a, b, c) {
						console.log('valueIndex', arguments);
						d(a, Reflect.get(f(b), c))
					},
					"syscall/js.valueSetIndex": function(a, b, c) {
						console.log('valueSetIndex', arguments);
						Reflect.set(f(a), b, f(c))
					},
					"syscall/js.valueCall": function(a, b, e, g, h, n, v) {
						console.log('valuecall',arguments);
						b = f(b);
						e = l(e, g);
						h = m(h, n, v);
						try {
							var k = Reflect.get(b, e);
							d(a, Reflect.apply(k, b, h));
							c().setUint8(a + 8, 1)
						} catch (x) {
							d(a, x), c().setUint8(a + 8, 0)
						}
					},
					"syscall/js.valueInvoke": function(a, b, e, g, h) {
						console.log('valueInvoke', arguments);
						try {
							var k = f(b),
								q = m(e, g, h);
							d(a, Reflect.apply(k, void 0, q));
							c().setUint8(a + 8, 1)
						} catch (w) {
							d(a,
								w), c().setUint8(a + 8, 0)
						}
					},
					"syscall/js.valueNew": function(a, b, e, g, h) {
						console.log('valueNew', arguments);
						b = f(b);
						e = m(e, g, h);
						try {
							d(a, Reflect.construct(b, e)), c().setUint8(a + 8, 1)
						} catch (u) {
							d(a, u), c().setUint8(a + 8, 0)
						}
					},
					"syscall/js.valueLength": function(a) {
						return f(a).length
					},
					"syscall/js.valuePrepareString": function(a, e) {
						e = String(f(e));
						e = b.encode(e);
						d(a, e);
						a += 8;
						e = e.length;
						c().setUint32(a + 0, e, !0);
						c().setUint32(a + 4, Math.floor(e / 4294967296), !0)
					},
					"syscall/js.valueLoadString": function(b, c, d, e) {
						b = f(b);
						(new Uint8Array(a._inst.exports.memory.buffer,
							c, d)).set(b)
					}
				}
			}
		};
		global.Go.prototype.run = function(a) {
			var b = this,
				e;
			return $jscomp.asyncExecutePromiseGeneratorProgram(function(c) {
				1 == c.nextAddress && (b._inst = a, b._values = [NaN, 0, null, !0, !1, global, b._inst.exports.memory, b], b._refs = new Map, b._callbackShutdown = !1, b.exited = !1, new DataView(b._inst.exports.memory.buffer));
				e = new Promise(function(a) {
					b._resolveCallbackPromise = function() {
						if (b.exited) throw Error("bad callback: Go program has already exited");
						setTimeout(a, 0)
					}
				});
				b._inst.exports._start();
				return b.exited ?
					c.jumpTo(0) : c.yield(e, 2)
			})
		};
		global.Go.prototype._resume = function() {
			if (this.exited) throw Error("Go program has already exited");
			this._inst.exports.resume();
			this.exited && this._resolveExitPromise()
		};
		global.Go.prototype._makeFuncWrapper = function(a) {
			var b = this;
			return function() {
				var c = {
					id: a,
					this: this,
					args: arguments
				};
				b._pendingEvent = c;
				b._resume();
				return c.result
			}
		};
		WebAssembly.instantiateStreaming || (WebAssembly.instantiateStreaming = function(a, b) {
			var c;
			return $jscomp.asyncExecutePromiseGeneratorProgram(function(d) {
				switch (d.nextAddress) {
					case 1:
						return d.yield(a,
							3);
					case 3:
						return d.yield(d.yieldResult.buffer, 2);
					break;
					case 2:
						return c = d.yieldResult, d.yield(WebAssembly.instantiate(c, b), 4);
					case 4:
						return d.return(d.yieldResult)
				}
			})
		});
		
		window.__wasmExecute = function() {};

		var f = new Go;
		WebAssembly.instantiateStreaming(fs.readFile('./f.031a537.wasm'), f.importObject).then(function(a) {
			wasm = a.instance;
			f.run(wasm)
		}).catch(function(a) {
			console.log(a)
		})
	})()
} catch (a) {
	console.log(a)
};