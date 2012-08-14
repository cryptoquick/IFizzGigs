define([
	'zepto',
	'underscore',
	'backbone',
	'handlebars',
	'text!tpl/user.html'
],
function ($, _, Backbone, Handlebars, html) {
	var user = {};

	user.collection = Backbone.Collection.extend({

	});

	user.model = Backbone.Model.extend({
		initialize: function () {
			this.url = 'https://graph.facebook.com/';
		}
	});

	user.view = Backbone.View.extend({
		// el: $('.user_' + this.model.get('whose')),
		el: $('.user'),

		initialize: function () {
			// Render when the model is changed
			this.model.bind('change', function () {
				// The model change event is rather unspecific, so, we need to make sure it has the right data
				console.log(this.model.get('whose'));
				if (this.model.get('whose'))
					this.render();
			}, this);
		},

		render: function (evt) {
			console.log(this.model);
			// Render serialized model to compiled template
			this.$el.find('.user_' + this.model.get('whose')).html(this.template(this.model.toJSON()));
		},

		events: {
			'keypress .userInput': 'keyEvent',
			'click .userInputSubmit': 'clickEvent'
		},

		template: Handlebars.compile(html),

		keyEvent: function (evt) {
			// If return key is pressed, set the graph
			if (evt.which == 13) {
				evt.preventDefault();
				this.fetchData();
			}
		},

		clickEvent: function () {
			this.fetchData();
		},

		nameField: '',

		fetchData: function () {
			this.nameField = this.$el.find('.userInput').val();

			// Validate Namefield
			if (this.nameField.length > 0 && this.nameField != 'Facebook Username') {
				// Check if user is already logged in
				var that = this;

				FB.getLoginStatus(function(response) {
					if (response.authResponse) {
						console.log('Already logged in!');
						that.fetchOperation(response);
					}
					// If not, log in
					else {
						FB.login(function(response) {
							if (response.authResponse) {
								console.log('Welcome!  Fetching your information...');
								FB.api('/me', function(response) {
									console.log('Good to see you, ' + response.name + '.');
									that.fetchOperation(response);
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
			// Fetch our own data, preserving 'whose' attribute
			var whose = this.model.get('whose');
			this.model.clear();
			this.model.set({'whose': whose});
			this.model.accessToken = response.authResponse.accessToken;

			// Basic user data from Facebook
			if (this.model.get('whose') == 'yours')
				this.model.url = 'https://graph.facebook.com/' + response.authResponse.userID + '?access_token=' + this.model.accessToken;
			else
				this.model.url = 'https://graph.facebook.com/' + this.nameField + '?access_token=' + this.model.accessToken;

			this.model.fetch();
		}
	});
	
	return user;
});