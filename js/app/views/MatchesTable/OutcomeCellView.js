define( function(){
	'use strict';

	var OutcomeCellView = Backbone.View.extend({
		events: {
			'click a.Bet': 'handleBetClick'
		},

		/**
		 * Google Closure Template Object
		 * Use the predefined methods to render the template
		 * @type {[Object]}
		 */
		_templateMethod:  window.com.betbrain.nextLiveMatches.outcome,

		initialize: function(){
			// console.log('%cnew OutcomeCellView', 'color:#A2A2A2');
			this.model.on('change', function(){
				this.render();
			}, this)
		},

		/**
		 * Returns the compiled template with data from the model
		 * @return {String} 
		 */
		createTemplate: function(){
			if(this.model) {
				return this._templateMethod({ outcome: this.model.attributes });
			} else {
				console.log('Instantiation ERROR! The view has been initialized without a MODEL !!', this);
				return false;
			}
		},

		/**
		 * Appends the template to the container $el property of the view
		 * @return {void} 
		 */
		render: function(){
			console.log('%cOutcomeCellView.rerender', 'color:green');
			var content = this._templateMethod({ 'outcome': this.model.attributes });
			var el = $(content);
			this.$el.replaceWith(el);
			this.setElement(el);
		},

		handleBetClick: function(evt) {
			evt.preventDefault();
			console.log('handleBetClick')
		}
	});

	return OutcomeCellView;


});