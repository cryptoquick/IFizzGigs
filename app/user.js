define([
	'zepto',
	'underscore',
	'backbone',
	'handlebars',
	'text!tpl/user.html'
],
function ($, _, Backbone, Handlebars, html) {
	var user = {};

	user.model = Backbone.Model.extend({
		initialize: function () {

		},
		url: function () {
			return 'https://graph.facebook.com/' + window.location.hash.substr(1);
		}
	});

	user.view = Backbone.View.extend({
		el: $('#user'),
		initialize: function () {
			this.model.bind('change', this.render, this);
		},
		render: function (evt) {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		template: Handlebars.compile(html)
	});
	
	return user;
});