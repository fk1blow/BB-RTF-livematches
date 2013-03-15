  
// RowItemView

define(['app/components',
  'views/MatchesTable/MatchesCell',
  'views/MatchesTable/BetCell'],
  function(component, MatchesCell, BetCell)
{
'use strict';


var RowItem = Backbone.View.extend({
  _matchDetailsView: null,

  _betCellsViews: null,

  _templateSuffix: 'match',

  initialize: function() {
    cl('%cnew RowItem', 'color:#A2A2A2');
    this._matchDetailsView = null;
    this._betCellsViews = [];
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
    this._buildBetCellsViews();
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
    var view = new MatchesCell({ el: this.$el.find('div.MatchDetails') });
    this._matchDetailsView = view;
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
});


var MatchesTable = component.ui.TableView.extend({
  el: $('#NextLiveMatchesRTF'),

  rowSelector: 'li.TheMatch',

  initialize: function() {
    cl('%cnew MatchesTable', 'color:#A2A2A2');
    this._rowViews = {};
  },
  
  wrapEachRowWithSubviews: function() {
    var that = this, view = null;
    this.eachRow(function(elem) {
      view = new RowItem({ el: elem });
      view.buildChildViews();
      this.addRow(elem.attr('data-matchid'), view);
    });
    view = null;
  },

  createNewRow: function(rowId) {
    var view = new RowItem();
    this.addRow(rowId, view);
    return view;
  },

  appendRow: function(rowView) {
    this.$el.append(rowView.el);
  }
});


return {
  RowItemView: RowItem,
  MatchesTable: MatchesTable
}


});
