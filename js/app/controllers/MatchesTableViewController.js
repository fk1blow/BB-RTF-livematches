 
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

    // Create the view for each new created match
    this._matchesTableModel.on('created:match',
      this._handleCreatedMatch, this);

    // Handles a match, removed from matches talbe's event list
    this._matchesTableModel.on('removed:match',
      this._handleRemovedMatch, this);
  },

  // matchesTableController.removeMatch(192711145)
  removeMatch: function(eventId) {
    this._matchesTableModel.removeMatch(eventId);
  },

  processMatchesListUpdates: function(updatesJson) {
    var update = updatesJson['nextLiveMatches'];
    this._matchesTableModel.updateMatchesList(update.matches);
  },

  processMatchesInitialDump: function(initialJson) {
    var view, model, matchesArr = initialJson.matches;
    _.each(matchesArr, function(matchAttrs) {
      model = this._matchesTableModel.addMatch(matchAttrs, false);
      
      view = this._wrapperView.getNewRowByMatchId(model.id);
      view.setModel(model);
      view.buildChildViews();

      this._wrapperView.addRow(model.id, view);
      this._wrapperView.renderRow(view);
    }, this);
  },


  /*
    Private
   */


   _handleRemovedMatch: function(matchId) {
    this._wrapperView.removeRowById(matchId);
   },

  _handleCreatedMatch: function(matchModel) {
    var view = this._wrapperView.
    view.render(matchModel.attributes);
    this._wrapperView.addRow(matchModel.id, view);
    this._wrapperView.renderRow(view);
  }
});


var xxx_MatchTableController = SKMObject.extend({
  _wrapperView: null,

  _eventsCollection: null,

  initialize: function() {
    this._wrapperView = new Wrapper();

    // Create the Event Details model collection
    this._eventsCollection = new Backbone.Collection();

    // Create the rows alongside the models
    this._prerenderFromJson(jsonMatches.matches);
  },

  // matchesTableController.addMatch(jsonMatches['matches'][1])
  addMatch: function(jsonMatch) {
    var model = new EventDetailsModel(jsonMatch);
    this._eventsCollection.add(model);
    var view = this._wrapperView.getNewRow();
    view.setModel(model);
    view.render(jsonMatch);
    this._wrapperView.addRow(model.id, view);
    // this._wrapperView.appendRowToHtml(view);
  },

  // matchesTableController.removeMatch(192711145)
  removeMatch: function(eventId) {
    this._eventsCollection.get(eventId).destroy();
    this._eventsCollection.remove(eventId);
    this._wrapperView.removeRowById(eventId);
  },

  processUpdates: function(matchJson) {
    var eventModel = this._eventsCollection.get(matchJson['eventId']);
    if ( eventModel )
      eventModel.set(matchJson);
  },

  /*updateOutcomesForEvent: function(jsonMatchesList) {
    _.each(jsonMatchesList, function(item) {
      cl(item)
    });
  },*/


  /*
    Private
   */


  _prerenderFromJson: function(jsonMatches) {
    var len, i = 0, evId, model, view;
    _.each(jsonMatches, function(item) {
      model = new EventDetailsModel(item);
      // Add model to the events model collection
      this._eventsCollection.add(model);
      // Create the View and add its model
      view = this._wrapperView.getNewRowByMatchId(item['eventId']);
      view.setModel(model).buildChildViews();
      // Add it to the WrapperView instance
      this._wrapperView.addRow(item['eventId'], view);
    }, this);
  }
});


return MatchTableController;


});