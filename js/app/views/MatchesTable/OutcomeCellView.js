
// Outcome Cell view

define( function(){
	'use strict';

	var OutcomeCellView = Backbone.View.extend({
		events: {
			'click a.Bet': 'handleBetClick'
		},

		_templateMethod:  window.com.betbrain.nextLiveMatches.outcome,

		initialize: function(){
			// console.log('%cnew OutcomeCellView', 'color:#A2A2A2');
			this.model.on('change', this.render, this);
		},

		render: function(){
			console.log('%cOutcomeCellView.render', 'color:green');
			var content = this._templateMethod({ 'outcome': this.model.attributes });
			var el = $(content);
			this.$el.replaceWith(el);
			this.setElement(el);
			el.addClass('Changed');
		},

		handleBetClick: function(evt) {
			evt.preventDefault();
			console.log('handleBetClick')
		},

		destroy: function() {
			this.off().remove();
		}
	});

	return OutcomeCellView;


});