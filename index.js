var funcis = require('funcis'),
	app = funcis(),
	dataNode = require('./data-node').register(app),
	uiNode = require('./ui-node').register(app);


app.script('init');

