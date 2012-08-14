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
		initialize: function () {
			this.url = 'https://graph.facebook.com/';
		},

		compare: function (subject) {

		}
	});

	likes.view = Backbone.View.extend({
		el: $('.likes')
	});

	return likes;
});