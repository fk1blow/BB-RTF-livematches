define([], function(){
	'use strict';

	var OutcomeCellModel = Backbone.Model.extend( {
		/**
		 * Model must be initialized with this attribute as a JSON object
		 * @type {[JSON]}
		 */
		match: null,
	} );

	return OutcomeCellModel; 
});