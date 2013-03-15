  
// Bet Cell

define([], function() {
'use strict';


var BetCell = Backbone.View.extend({
  events: {
    'click a.Bet': 'handleCellClick'
  },

  initialize: function() {
    cl('%cnew BetCell', 'color:#A2A2A2', this.$el);
  },

  handleCellClick: function(evt) {
    evt.preventDefault();
    cl('BetCell.handleCellClick : ', $(evt.currentTarget));
  }
});


return BetCell;


});
