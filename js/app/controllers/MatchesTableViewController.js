  
// Match Table ViewController implementation

define(['app/components', 'skm/k/Object', 'views/MatchesTable/TableWrapper'],
  function(component, SKMObject, matchesTableViews)
{
'use strict';


var MatchTableController = SKMObject.extend({
  _matchesTableView: null,

  initialize: function() {
    this._matchesTableView = new matchesTableViews.MatchesTable();
    this._matchesTableView.wrapEachRowWithSubviews();
  },





  updateMatchRow: function(matchData) {
    // var eventId = matchData['eventId'];
    // var rowView = this._matchesTableView.getRowById(eventId);
    
    // rowView.refresh(matchData);
  },

  createMatchRow: function(matchData) {
    var eventId = matchData['eventId'];
    var rowView = this._matchesTableView.createNewRow(eventId);
    rowView.render(matchData);
    this._matchesTableView.appendRow(rowView);
  },





  removeMatchRow: function(matchId) {
    this._matchesTableView.removeRowById(matchId);
  },

  removeBetCell: function(matchId, cellIndex) {
    var rowView = this._matchesTableView.getRowById(matchId);
    rowView.removeBetCell(cellIndex);
  }
});


return MatchTableController;


});