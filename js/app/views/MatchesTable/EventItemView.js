  
// RowItemView

define(['app/components',
  'views/MatchesTable/EventDetailsView',
  'views/MatchesTable/OutcomeCellView'],
  function(component, EventDetailsCell, OutcomeCell)
{
'use strict';


var EventItem = Backbone.View.extend({
  tagName: 'li',

  className: 'TheMatch',

  events: {
    'click .MDContainer.MDxContainer': function(evt) {
      evt.preventDefault();
      cl('test clicks on new rows')
    }
  },

  _eventDetailsView: null,

  _betCellViews: null,

  _templateSuffix: 'match',

  initialize: function() {
    cl('%cnew EventItemView', 'color:#A2A2A2');
    this._eventDetailsView = null;
    this._betCellViews = [];
  },

  /*
    Commands
   */

  render: function(data) {
    cl('%cRowItem.render', 'color:green', data);
    var tplRender = com.betbrain.nextLiveMatches[this._templateSuffix];
    var content = tplRender({ match: data });
    this.setElement(content);
    this.buildChildViews();
  },

  buildChildViews: function() {
    this._buildMatchesDetailsView();
    this._buildBetCellsViews();
    return this;
  },

  removeOutcomeCell: function(cellIndex) {
    var cellView = this._betCellViews[cellIndex];
    this._betCellViews.splice(cellIndex, 1);
    cellView.remove();
    cellView = null;
  },

  setModel: function(model) {
    this.model = model;
    return this;
  },


  /*
    Private
   */
  
  _buildMatchesDetailsView: function() {
    var view = new EventDetailsCell({
      el: this.$el.find('div.MatchDetails'),
      model: this.model
    });
    this._eventDetailsView = view;
  },

  _buildBetCellsViews: function() {
    var $cells = this.$el.find('.OddsList li.Outcome');
    var that = this, cellView = null, item;
    
    $cells.each(function(idx) {
      item = $(this);
      cellView = new OutcomeCell({
        el: item,
        model: that.model.getOutcomeModelByIndex(idx)
      });
      that._betCellViews.push(cellView);
    });
  }
});


return EventItem;


});
