var _ = require('underscore'),
	jade = require('jade'),
	marked = require('marked'),
	funcis = require('funcis');


module.exports = {
	register: function (app) {
		var dNode = app.node('Data'),
			store = {},
			inty;
		dNode.functions.add('Compile', function (str,locals, next) {
			jade.render(str, locals, function (err, html) {
				if (err) return next(err.message);
				next(html);
			});
		});

		dNode.functions.add('Markdown', function (str, locals, next) {
			marked(str,  function (err, content) {
				if (err) return next(err.message);
				next(content);
			});
		});

		dNode.functions.add('Interval', function (time, next) {
			if (inty) clearInterval(inty);
			setInterval(next, time);
		});

		dNode.functions.add('Time', function (next) {
			var t = new Date();
			next(t.getHours(), t.getMinutes(), t.getSeconds());
		});

		dNode.functions.add('Store', function (key, value, next) {
			store[key] = value;
			next();
		});

		dNode.functions.add('Load', function (key, next) {
			next(store[key]);
		});


		return dNode;
	}
};
