var UI = require('./ui'),
	_ = require('underscore'),
	funcis = require('funcis'),
	onConnections = [],
	ui = new UI();



ui.on('socket', function (id) {
	for (var i in onConnections) {
		onConnections[i](id);
	}
	/*ui.bind('#search', 'click', {}, id, function () {
		ui.render('views/search.jade', {}, '#main', id);
		setTimeout(function () {
		ui.bind('#search-box', 'change', {}, id, function (sel, val, attrs) {
			ui.html(val, '#search-result', id);
		});
		}, 500);
	});
	ui.bind('#settings', 'click', {}, id, function () {
		ui.render('views/settings.jade', {}, '#main', id);
	});*/
});

module.exports = {
	register: function (app) {
		var uiNode = app.node('UI');
		uiNode.functions.add('OnConnection', function (next) {
			onConnections.push(next);
		});

		uiNode.functions.add('Render', function (view, options, selector, id, next) {
			if (_.isFunction(id)) {
				next = id;
				id = null;
			}
			if (!!id) {
				ui.render(view, {}, selector, id);
			} else {
				ui.render(view, {}, selector);
			}
			next();
		});

		uiNode.functions.add('Bind', function (selector, events, attrs, id, next) {
			if (_.isFunction(id)) {
				next = id;
				id = null;
			}
			ui.bind(selector, events, attrs, id, function (sel, val, attrs) {
				next(sel, val, attrs);
			});
		});

		uiNode.functions.add('Html', function (selector, value, id, next) {
			if (_.isFunction(id)) {
				next = id;
				id = null;
			}
			ui.html(value, selector, id);
			next();
		});


		uiNode.functions.add('Val', function (selector, id, next) {
			if (_.isFunction(id)) {
				next = id;
				id = null;
			}
			ui.val(selector, id, function (val) {
				next(val);
			});
		});
		return uiNode;
	}
};
