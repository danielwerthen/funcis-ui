GotComments = function () {};
SendComments = function () {};
$(function () {
	(function ($, Backbone, _) {
		var socket = io.connect('http://localhost:5000');
		socket.on('html', function (data) {
			$(data.selector).html(data.value);
		});
		socket.on('bind', function (data) {
			var el = $(data.selector);
			el.bind(data.events, function (e) {
				socket.emit('bind-event', { 
					selector: data.selector,
					val: el.val(),
					attrs: _.pick.apply(null, _.flatten([e, data.attrs || []])),
					id: data.id
				});
			});
		});
		socket.on('val', function (data) {
			socket.emit('val', {
				selector: data.selector,
				val: $(data.selector).val(),
				id: data.id
			});
		});
		socket.on('comments', function (data) {
			GotComments(data.data);
		});
		SendComments = function (data) {
			socket.emit('comments', {
				data: data
			});
		};
	})($, Backbone, _);
});
