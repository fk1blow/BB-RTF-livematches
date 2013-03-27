 
// Match Table ViewController implementation

define(['skm/k/Object',
  'skm/util/Subscribable',
  'models/MatchesTableModel',
  'views/MatchesTable/WrapperView'],
  function(SKMObject, Subscribable, MatchesTableModel, Wrapper)
{
'use strict';


var MatchTableController = SKMObject.extend({
  _wrapperView: null,

  _matchesTableModel: null,

  initialize: function() {
    this._wrapperView = new Wrapper();
    
    // Create the Event Details model collection
    this._matchesTableModel = new MatchesTableModel();

    // Move this event, directly on [_wrapperView]
    // Create the view for each new created match
    this._matchesTableModel.on('created:match',
      this._handleCreatedMatch, this);

    // Move this event, directly on [_wrapperView]
    // Handles a match, removed from matches talbe's event list
    this._matchesTableModel.on('removed:match',
      this._handleRemovedMatch, this);
  },

  processMatchesListUpdates: function(updatesJson) {
    var updateArr = updatesJson['nextLiveMatches'];
    var createItems, updateItems, deleteItems;
    
    if ( createItems = updateArr['create'] )
      this._matchesTableModel.createMatchesList(createItems);
    if ( updateItems = updateArr['update'] )
      this._matchesTableModel.updateMatchesList(updateItems);
    if ( deleteItems = updateArr['delete'] )
      this._matchesTableModel.removeMatchesList(deleteItems);
  },

  processMatchesInitialDump: function(initialJson) {
    this._handleInitialMatchesDump(initialJson);
  },


  /*
    Private
   */


  _handleInitialMatchesDump: function(matchesDumpJson) {
    var view, model, matchesArr = matchesDumpJson.matches;
    
    _.each(matchesArr, function(matchAttrs) {
      model = this._matchesTableModel.addMatch(matchAttrs, false);
      
      view = this._wrapperView.getNewRowByMatchId(model.id);
      view.setModel(model);
      view.renderChildren();

      this._wrapperView.addRow(model.id, view);
      this._wrapperView.renderRow(view);
    }, this);
  },

  _handleRemovedMatch: function(matchId) {
    this._wrapperView.removeRowById(matchId);
  },

  _handleCreatedMatch: function(matchModel) {

    var view = this._wrapperView.getNewRow();
    view.setModel(matchModel);
    view.render(matchModel.attributes);
    view.renderChildren();
    
    this._wrapperView.addRow(matchModel.id, view);
    this._wrapperView.renderRow(view, matchModel.index);
  }
});


return MatchTableController;


});
