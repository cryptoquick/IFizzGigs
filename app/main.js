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
	$('.userInput').on('focus', function () {
		$(this).val('');
	})
	.on('blur', function () {
		if ($(this).val() === '')
			$(this).val('Facebook Username');
	})
	.val('Facebook Username');

	/* Set up some models and views for our Facebook users */
	// Yours
	var yourum = new user.model({'title': 'yours'});
	$('.user').append('<div class="user_' + yourum.get('title') + '">');
	var youruv = new user.view({model: yourum});

	// Theirs
	var theirum = new user.model({'title': 'theirs'});
	$('.user').append('<div class="user_' + theirum.get('title') + '">');
	var theiruv = new user.view({model: theirum});

	// Make a collection and store our users
	var UsersCollection = Backbone.Collection.extend({
		model: user.model
	});

	ifgs.users = new UsersCollection([yourum, theirum]);

	var LikesCollection = Backbone.Collection.extend({
		model: likes.model
	});

	ifgs.likes = new LikesCollection();
	
	// Number of likes fetched. Likes will run a comparison after state 2.
	ifgs.likeState = 0;

	$('#reset').click(function () {
		// Had to cut this off early, here's a kludge:
		document.location.reload();
		/*likes.reset(user);
		$('#userInputFields').show();
		$(this).hide();*/
	})
});