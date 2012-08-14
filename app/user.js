define([
	'zepto',
	'underscore',
	'backbone',
	'handlebars',
	'app/likes',
	'text!tpl/user.html'
],
function ($, _, Backbone, Handlebars, likes, html) {
	var user = {};

	user.collection = Backbone.Collection.extend({

	});

	user.model = Backbone.Model.extend({
		initialize: function () {
			this.url = 'https://graph.facebook.com/';
		}
	});

	user.view = Backbone.View.extend({
		el: $('.user'),

		initialize: function () {
			// Render when the model is changed
			this.model.bind('change', function () {
				// The model change event is rather unspecific, so, we need to make sure it has the right data
				if (this.model.get('title'))
					this.render();
			}, this);

			$('.userInput').on('keypress', $.proxy(this.keyEvent, this));
			$('.userInputSubmit').on('click', $.proxy(this.clickEvent, this));
		},

		render: function (evt) {
			// Render serialized model to compiled template
			this.$el.find('.user_' + this.model.get('title')).html(this.template(this.model.toJSON()));
		},

		/*events: {
			'keypress .userInput': 'keyEvent',
			'click .userInputSubmit': 'clickEvent'
		},*/

		template: Handlebars.compile(html),

		keyEvent: function (evt) {
			// If return key is pressed, set the graph
			if (evt.which == 13) {
				evt.preventDefault();
				this.fetchData(this);
			}
		},

		clickEvent: function () {
			this.fetchData(this);
		},

		nameField: '',

		fetchData: function (self) {
			this.nameField = $('.userInput').val();

			// Validate Namefield
			if (this.nameField.length > 0 && this.nameField != 'Facebook Username') {
				// Check if user is already logged in
				var self = this;

				FB.getLoginStatus(function(response) {
					if (response.authResponse) {
						console.log('Already logged in!');
						self.fetchOperation(response);
					}
					// If not, log in
					else {
						FB.login(function(response) {
							if (response.authResponse) {
								console.log('Welcome!  Fetching your information...');
								FB.api('/me', function(response) {
									console.log('Good to see you, ' + response.name + '.');
									self.fetchOperation(response);
								});
							} else {
								console.log('User cancelled login or did not fully authorize.');
							}
						}, {scope: 'user_about_me,friends_about_me,user_likes,friends_likes,user_photos,friends_photos'});
					}
				});
			}
		},

		fetchOperation: function (response) {
			// Fetch our own data, preserving 'title' attribute
			var title = this.model.get('title');
			this.model.clear({'silent': true});
			this.model.set({'title': title});
			this.model.accessToken = response.authResponse.accessToken;

			// Basic user data from Facebook
			if (this.model.get('title') == 'yours')
				this.model.url = 'https://graph.facebook.com/' + response.authResponse.userID + '?access_token=' + this.model.accessToken;
			else
				this.model.url = 'https://graph.facebook.com/' + this.nameField + '?access_token=' + this.model.accessToken;

			var self = this;

			this.model.fetch({
				success: function () {
					// Spark off some likes!
					self.initiateLikes();
				}
			});
		},

		initiateLikes: function () {
			// Similar to models and view creation in main.js
			var lm = new likes.model({'title': this.model.get('title')});
			var lv = new likes.view({model: lm});
			ifgs.likes.add(lm);
		}
	});
	
	return user;
});