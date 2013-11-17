var UI = require('./ui'),
	ui = new UI();

ui.on('socket', function (id) {
	ui.bind('#search', 'click', {}, id, function () {
		ui.render('views/search.jade', {}, '#main', id);
		setTimeout(function () {
		ui.bind('#search-box', 'change', {}, id, function (sel, val, attrs) {
			ui.html(val, '#search-result', id);
		});
		}, 500);
	});
	ui.bind('#settings', 'click', {}, id, function () {
		ui.render('views/settings.jade', {}, '#main', id);
	});
});
