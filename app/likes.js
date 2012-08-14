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
			var title = args.title;
			this.user = ifgs.users.where({'title': title})[0];
			this.url = 'https://graph.facebook.com/' + this.user.get('username') + '/likes?access_token=' + this.user.accessToken;

			// Immediately fetch likes data
			this.fetch();
		},

		compare: function (subject0, subject1) {
			var likeIDs0 = _.pluck(subject0.get('data'), 'id');
				likeIDs1 = _.pluck(subject1.get('data'), 'id');

			// console.log(subject0.data, subject1.data);
			this.set('interLikes', _.intersection(likeIDs0, likeIDs1));
			console.log(subject0, subject1, likeIDs0, likeIDs1, this.get('interLikes'));
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

		render: function (interLikes) {
			console.log(this.model.get('interLikes'), this.template);
			this.$el.html(this.template({'likeID': this.model.get('interLikes')}));
		}
	});

	return likes;
});