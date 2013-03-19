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
		_templateMethod: window.com.betbrain.nextLiveMatches.outcome,

		initialize: function(){
			cl('%cnew OutcomeCellView', 'color:#A2A2A2');
			// this.$el.html( this.createTemplate() );
			this.model.on('change', function(){
				this.rerender();
			}, this)
		},

		/**
		 * Returns the compiled template with data from the model
		 * @return {[String]} 
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
		 * @return {[void]} 
		 */
		rerender: function(){
			this.$el.html( this.createTemplate() );
			// cl('View has been rerendered');
		},

		/**
		 * Updates the model data with attributes from the arguments
		 * @param  {[JSON]} args [must respect the following form]  { match: { outcomes: [ {}, .. ] } }
		 * @return {[void]}   
		 */
		updateModel: function(args){
			this.model.set( $.extend(true, {}, this.model.attributes, args) );
			// cl(this.model.changedAttributes());
		},

		handleBetClick: function(evt) {
			evt.preventDefault();
			cl('handleBetClick')
		}
	});

	return OutcomeCellView;


});