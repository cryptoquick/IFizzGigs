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
			this.url = 'https://graph.facebook.com/' + window.location.hash.substr(1);
		}
	});

	user.view = Backbone.View.extend({
		el: $('.user'),

		initialize: function () {
			// Render when the model is changed
			this.model.bind('change', this.render, this);

			// Render upon init, too
			this.render();
		},

		render: function (evt) {
			// Render
			this.$el.html(this.template(this.model.toJSON()));

			// Events
			this.$el.find('.userInput').on('focus', function () {
				$(this).val('');
			})
			.on('blur', function () {
				if ($(this).val() == '')
					$(this).val('Facebook Username');
			})
			.val('Facebook Username');

			// For chaining
			return this;
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

		fetchData: function () {
			var nameField = this.$el.find('.userInput').val();

			if (nameField.length > 0 && nameField !== 'Facebook Username') {
				this.model.clear();
				this.model.url = 'https://graph.facebook.com/' + nameField;
				this.model.fetch();
			}
		}
	});
	
	return user;
});