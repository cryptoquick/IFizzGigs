define([
	'zepto',
	'underscore',
	'backbone',
	'handlebars',
	'text!tpl/likes.html'
],
function ($, _, Backbone, Handlebars, html) {
	var likes = {};

	likes.model = Backbone.Model.extend({
		user: {},

		initialize: function (args) {
			var title = args.title,
				user = ifgs.users.where({'title': title})[0]

			this.set({'user': user});
			this.url = 'https://graph.facebook.com/' + user.get('username') + '/likes?access_token=' + user.accessToken;

			// Immediately fetch likes data
			this.fetch();
		},

		compare: function (subject0, subject1) {
			var likeIDs0 = _.pluck(subject0.get('data'), 'id');
				likeIDs1 = _.pluck(subject1.get('data'), 'id');

			// console.log(subject0.data, subject1.data);
			this.set({'matches': _.intersection(likeIDs0, likeIDs1)}, {'silent': true});
		}
	});

	likes.view = Backbone.View.extend({
		el: $('.likes'),

		initialize: function () {
			// Render when the model is changed
			this.model.bind('change', function () {
				ifgs.likeState++;

				console.log(ifgs.likeState);
				
				if (ifgs.likeState == 2) {
					this.model.compare(ifgs.likes.at(0), ifgs.likes.at(1));
					this.render();
				}
			}, this);
		},

		template: Handlebars.compile(html),

		render: function (matches) {
			this.$el.html(this.template({'likeID': this.model.get('matches')}));
			var title = this.model.get('user');

			$('#userInputFields').hide();
			$('#reset').show();

			// this.model.clear({'silent': true});
			// this.model.set({'user': title}, {'silent': true});
			// ifgs.likeState = 0; // Reset, but be careful about change events.
		}
	});

	likes.reset = function (user) {
		/* Make some models and views for our Facebook users */
		// Make sure we're working with clean elements
		$('.user').empty();
		$('.likes').empty();

		// Reset our collections
		ifgs.likes.reset();
		ifgs.users.reset();

		// Yours
		var yourum = new user.model({'title': 'yours'});
		var youruv = new user.view({model: yourum});

		// Theirs
		var theirum = new user.model({'title': 'theirs'});
		var theiruv = new user.view({model: theirum});

		// Make a collection and store our users
		ifgs.users.add([yourum, theirum]);
		
		// Number of likes fetched. Likes will run a comparison after state 2.
		ifgs.likeState = 0;
	}

	return likes;
});