  
// RowItemView

define(['app/components',
  'views/MatchesTable/EventDetailsView',
  'views/MatchesTable/OutcomeCellView'],
  function(component, EventDetailsView, OutcomeCell)
{
'use strict';


var EventItem = Backbone.View.extend({
  tagName: 'li',

  className: 'TheMatch',

  events: {
    'click .MDContainer.MDxContainer': function(evt) {
      evt.preventDefault();
      console.log('test clicks on new rows')
    }
  },

  _eventDetailsView: null,

  _betCellViews: null,

  _templateSuffix: 'match',

  initialize: function() {
    // console.log('%cnew EventItemView', 'color:#A2A2A2');
    this._eventDetailsView = null;
    this._betCellViews = [];
  },

  /*
    Commands
   */

  render: function(data) {
    console.log('%cEventItemView.render', 'color:green', data);
    var tplRender = com.betbrain.nextLiveMatches[this._templateSuffix];
    var content = tplRender({ match: data });
    this.setElement(content);
    return this;
  },

  renderChildren: function() {
    console.log('%cEventItemView.renderChildren', 'color:green');
    if ( ! this.model ) {
      console.log('%cEventItemView.renderChildren : no model provided'
        + ' for this event item!');
    }
    this._buildMatchesDetailsView();
    this._buildOutcomeCellsViews();
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
    this.model.on('change:index', this._handleChangedViewIndex, this);
    return this;
  },

  destroy: function() {
    // unbind from model and remove reference
    this.model.off('change:index', this._handleChangedViewIndex, this);
    this.model = null;

    // revemo details view
    this._eventDetailsView.destroy();
    this._eventDetailsView = null;

    // remove outcomes cells views
    for (var i = 0; i < this._betCellViews.lenght; i++) {
      this._betCellViews[i].destroy();
    }
    this._betCellViews = null;

    // unbind event from this view and remove from dom
    this.off().remove();
  },


  /*
    Private
   */
  

  _handleChangedViewIndex: function() {
    this.$el.addClass('Changed');
  },
  
  _buildMatchesDetailsView: function() {
    var view = new EventDetailsView({
      el: this.$el.find('div.MatchDetails'),
      model: this.model
    });
    this._eventDetailsView = view;
  },

  _buildOutcomeCellsViews: function() {
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
