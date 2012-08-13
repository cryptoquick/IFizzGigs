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
	// Initialize UI Events
	$('.user').find('.userInput').on('focus', function () {
		$(this).val('');
	})
	.on('blur', function () {
		if ($(this).val() === '')
			$(this).val('Facebook Username');
	})
	.val('Facebook Username');

	// Yours
	var yourum = new user.model();
	yourum.set({'whose': 'yours'});
	$('.user').append('<div class="user_' + yourum.get('whose') + '">');
	var youruv = new user.view({model: yourum});
	// youruv.setElement($('.user_' + yourum.get('whose')));
	// console.log($('.user_' + yourum.get('whose')));

	// Theirs
	var theirum = new user.model();
	theirum.set({'whose': 'theirs'});
	$('.user').append('<div class="user_' + theirum.get('whose') + '">');
	var theiruv = new user.view({model: theirum});
	// theiruv.setElement($('.user_' + theirum.get('whose')));

	// yourum.fetch();
	// theirum.fetch();
});