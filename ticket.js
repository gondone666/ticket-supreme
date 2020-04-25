const { performance } = require('perf_hooks');
const request = require('request-promise');
const { promises: fs } = require('fs');
const crypto = require("crypto");
const SocksProxyAgent = require('socks-proxy-agent');

var supjar = request.jar();
supjar._jar.setCookie('lastVisitedFragment=', 'https://www.supremenewyork.com/', (error, cookie) => {
});

var document = {
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

var navigator = {
	 userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1'
};

var window = {
	crypto: {
		getRandomValues: crypto.randomFillSync
	},
	__wasmExecute () {
	}	
}

var outputBuf = "";

var global = {
	Uint8Array,
	window,
	document,
	navigator,
	fs: {
		constants: { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1 },
		writeSync(fd, buf) {
			outputBuf += decoder.decode(buf);
			const nl = outputBuf.lastIndexOf("\n");
				if (nl != -1) {
					console.log(outputBuf.substr(0, nl));
					outputBuf = outputBuf.substr(nl + 1);
				}
				return buf.length;
		},
		write(fd, buf, offset, length, position, callback) {
			if (offset !== 0 || length !== buf.length || position !== null) {
				callback(enosys());
				return;
			}
			const n = this.writeSync(fd, buf);
			callback(null, n);
		},
		open(path, flags, mode, callback) { callback(enosys()); },
		fsync(fd, callback) { callback(null); },
	}
}

const enosys = () => {
	const err = new Error("not implemented");
	err.code = "ENOSYS";
	return err;
};

var b = new TextEncoder("utf-8"),
	e = new TextDecoder("utf-8"),
	g = [];
		
class Go  {
	constructor() {
		var a=this;
		a.exit = (code) => {
			if (code !== 0) {
				console.warn("exit code:", code);
			}
		};
		a._exitPromise = new Promise((resolve) => {
			a._resolveExitPromise = resolve;
		});
		a._pendingEvent = null;
		a._scheduledTimeouts = new Map();
		a._nextCallbackTimeoutID = 1;
			
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
			if ("number" === typeof d) isNaN(d) ? (c().setUint32(b + 4, 2146959360, !0), c().setUint32(b, 0, !0)) : 0 === d ? (c().setUint32(b + 4, 2146959360, !0), c().setUint32(b, 1, !0)) : c().setFloat64(b, d, !0);
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
				void 0 === f && (f = a._values.length, a._values.push(d), a._refs.set(d, f));
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
					return t + performance.now()
				},
				"runtime.sleepTicks": function(b) {
					setTimeout(a._inst.exports.go_scheduler, b)
				},
				"syscall/js.stringVal": function(a, b, c) {
					console.log('stringVal', arguments);
					b = l(b, c);
					d(a, b)
				},
				"syscall/js.valueGet": function(a, b, c, e) {
					console.log('valueget', arguments);
					c = l(c, e);
					b = f(b);
					c=='process'&&(c='fakeprocess'); //faked process object
					b = Reflect.get(b, c);
					d(a, b)
				},
				"syscall/js.valueSet": function(a, b, c, d) {
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
						d(a, w), c().setUint8(a + 8, 0)
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
					console.log('valueLength',arguments);
					return f(a).length
				},
				"syscall/js.valuePrepareString": function(a, e) {
					console.log('valuePrepareString',arguments);
					e = String(f(e));
					e = b.encode(e);
					d(a, e);
					a += 8;
					e = e.length;
					c().setUint32(a + 0, e, !0);
					c().setUint32(a + 4, Math.floor(e / 4294967296), !0)
				},
				"syscall/js.valueLoadString": function(b, c, d, e) {
					console.log('valueLoadString',arguments);
					b = f(b);
					(new Uint8Array(a._inst.exports.memory.buffer, c, d)).set(b)
				}
			}
		}
	};

	async run(instance) {
		this._inst = instance;
		this._values = [NaN, 0, null, true, false, global];
		this._refs = new Map();
		this._callbackShutdown = false;
		this.exited = false;

		while (true) {
			const callbackPromise = new Promise((resolve) => {
				this._resolveCallbackPromise = () => {
					if (this.exited) {
						throw new Error('bad callback: Go program has already exited');
					}
					setTimeout(resolve, 0);
				};
			});
			this._inst.exports._start();
			if (this.exited) {
				break;
			}
			await callbackPromise;
		}
	}

	_resume() {
		if (this.exited) {
			throw new Error("Go program has already exited");
		}
		this._inst.exports.resume();
		if (this.exited) {
			this._resolveExitPromise();
		}
	}

	_makeFuncWrapper(id) {
		const go = this;
		return function () {
			const event = { id: id, this: this, args: arguments };
			go._pendingEvent = event;
			go._resume();
			return event.result;
		};
	}
}

(async () => {	
	const go = new Go();
	const module = await WebAssembly.compile(await fs.readFile('./f.031a537.wasm'));	
	const instance = await WebAssembly.instantiate(module, go.importObject);
	go.run(instance);

	const info = {
		host: '127.0.0.1',
		port: 8888,
	};

	var agent = new SocksProxyAgent(info);
	
	var supreme = request.defaults({
		agent: agent,
		jar : supjar, 
		gzip: true,
		headers: {
			'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
			'Origin': 'https://www.supremenewyork.com',
			'Referer': 'https://www.supremenewyork.com/mobile/',
			'Sec-Fetch-Dest': 'empty',
			'Sec-Fetch-Mode': 'cors',
			'Sec-Fetch-Site': 'same-origin',
			'User-Agent': navigator.userAgent,
			'X-Requested-With': 'XMLHttpRequest'
		}		
	})
	const copitem = { //hanes M
		id: 304903,
		sizeid: 63127,
		styleid: 28535
	}
	
	await supjar._jar.setCookie(`lastVisitedFragment=products/${copitem.id}/${copitem.styleid}`, 'https://www.supremenewyork.com/', (error, cookie) => {
	});
	
	await supreme( 
		{
			method: 'POST',
			url: `https://www.supremenewyork.com/shop/${copitem.id}/add.json`,
			json: true,
			form: { // !!!!!!EU ATC FORM!!!!!!!
				size: copitem.sizeid,
				style: copitem.styleid,
				'qty': 1
			}
		}, (err, res, body) => {
			if (err) { console.log(err); }
			console.log(body);
			process.exit(0);
	});
	
})();