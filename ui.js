var express = require('express'),
	http = require('http'),
	jade = require('jade'),
	socket_io = require('socket.io'),
	util = require('util'),
	_ = require('underscore'),
	events = require('events');

function UI(opt) {
	var app = this.app = express(),
		server = this.server = http.createServer(app),
		io = this.io = socket_io.listen(server),
		self = this;

	events.EventEmitter.call(this);
	this.sockets = {};
	this._binds = {};
	this._sid = 0;
	this._cbid = 0;

	io.set('log level', 0);

	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
	app.use(express.static(__dirname + '/bower_components'));

	app.get('/', function (req, res) {
		res.render('index');
	});

	io.sockets.on('connection', function (socket) {
		var id = self._sid++;
		self.sockets[id] = socket;
		self.emit('socket', id);

		socket.on('bind-event', function (data) {
			var ch = self._binds[data.id];
			if (ch && _.isFunction(ch)) {
				ch(data.selector, data.val, data.attrs);
			}
		});
	});

	this.socks = function socks(sid) {
		if (sid === undefined || sid === null)
			return io.sockets;
		return self.sockets[sid];
	}

	this.render = function (view, options, selector, sid) {
		jade.renderFile(view, options, function (err, html) {
			if (err) {
				return fn(err);
			}
			self.socks(sid).emit('html', { selector: selector, value: html });
		});
	};
	this.html = function (html, selector, sid) {
		self.socks(sid).emit('html', { selector: selector, value: html });
	};
	this.bind = function (selector, events, attrs, sid, fn) {
		var cbid = self._cbid++;
		if (_.isFunction(sid)) {
			fn = sid;
			sid = undefined;
		}
		self._binds[cbid] = fn;
		self.socks(sid).emit('bind', { selector: selector, 
			events: events, 
			attrs: attrs, 
			id: cbid
		});
	};

	this.val = function (selector, sid, fn) {
		var cbid = self._cbid++;
		if (_.isFunction(sid)) {
			fn = sid;
			sid = undefined;
		}
		self._binds[cbid] = fn;
		self.socks(sid).emit('val', {
			selector: selector,
			id: cbid
		});
	};

	server.listen(opt && opt.port || 5000);
}

util.inherits(UI, events.EventEmitter);


module.exports = UI;
