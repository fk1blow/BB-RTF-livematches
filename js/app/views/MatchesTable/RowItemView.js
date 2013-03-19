  
// RowItemView

define(['app/components',
  'views/MatchesTable/EventDetailsView',
  'models/EventDetailsModel',
  /*'views/MatchesTable/BetCell'*/],
  function(component, DetailsCell, EventDetailsModel)
{
'use strict';


var RowItem = Backbone.View.extend({
  _eventDetailsView: null,

  _betCellsViews: null,

  _templateSuffix: 'match',

  eventDetailsModel: null,

  initialize: function() {
    cl('%cnew RowItem', 'color:#A2A2A2');
    this._eventDetailsView = null;
    this._betCellsViews = [];
    // Aici se creaza si legatura dintr modelul de date si providerul de date
    // Providerul poate fi RTF sau un json static
    this.eventDetailsModel = new EventDetailsModel(this.options.modelJSON);
  },

  /*
    Queries
   */

  getBetCellView: function(index) {
    return this._betCellsViews[index];
  },

  /*
    Commands
   */

  render: function(data) {
    var content = this._getTemplateContent(data);
    this.$el.html(content);
    this.setElement(content, true);
    this.buildChildViews();
  },

  buildChildViews: function() {
    this._buildMatchesDetailsView();
    // this._buildBetCellsViews();
    return this;
  },

  removeBetCell: function(cellIndex) {
    var cellView = this._betCellsViews[cellIndex];
    this._betCellsViews.splice(cellIndex, 1);
    cellView.remove();
    cellView = null;
  },


  /*
    Private
   */
  
  _getTemplateContent: function(data) {
    var tplRender = com.betbrain.nextLiveMatches[this._templateSuffix];
    return tplRender({ match: data });
  },
  
  _buildMatchesDetailsView: function() {
    var view = new DetailsCell({
      el: this.$el.find('div.MatchDetails'),
      model: this.eventDetailsModel
    });
    view.on('isLive', this._changedMatchToLive, this);
    this._eventDetailsView = view;
  },

  _buildBetCellsViews: function() {
    var $cells = this.$el.find('.OddsList li.Outcome');
    var that = this, cellView = null, item;
    $cells.each(function() {
      item = $(this);
      cellView = new BetCell({ el: item });
      that._betCellsViews.push(cellView);
    });
  },

  _changedMatchToLive: function() {
    this.$el.removeClass('LiveSoon').addClass('LiveMatch');
  }
});


return RowItem;


});
