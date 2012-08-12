require.config({
	baseUrl: 'lib',
	paths: {
		underscore: 'lodash',
		app: '../app',
		tpl: '../tpl'
	},
	shim: {
		zepto: {
			exports: '$'
		},
		backbone: {
			deps: ['underscore', 'zepto'],
			exports: 'Backbone'
		},
		handlebars: {
			exports: 'Handlebars'
		}
	}
});

require([
	'zepto',
	'underscore',
	'backbone',
	'app/user',
	'app/likes'
],
function ($, _, Backbone, user, likes) {
	var um = new user.model();
	var uv = new user.view({model: um});

	um.fetch();

	ui();
});