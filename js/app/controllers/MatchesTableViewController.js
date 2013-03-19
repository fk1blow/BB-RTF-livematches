  
// Match Table ViewController implementation

define(['skm/k/Object',
  'skm/util/Subscribable',
  'models/EventDetailsModel',
  'views/MatchesTable/WrapperView'],
  function(SKMObject, Subscribable, EventDetailsModel, Wrapper)
{
'use strict';





var VirtualRTF = SKMObject.extend(Subscribable, {
  fields: {
    name: '',
    isLive: false,
    epEvent: false,
    score: ''
  },

  setField: function(eventId, field, value) {
    this.fields[field] = value;
    var changes = {};
    changes[field] = value;
    this.fire('changed:field', eventId, changes);
  }
});

window.vrtf = VirtualRTF.create();


var tplhtml = com.betbrain.nextLiveMatches.matchesList(jsonMatches);
$('#NextLiveMatchesRTF').html(tplhtml);












var MatchTableController = SKMObject.extend({
  _wrapperView: null,

  _eventsCollection: null,

  initialize: function() {
    this._wrapperView = new Wrapper();

    // Create the Event Details model collection
    this._eventsCollection = new Backbone.Collection();

    // Destroy model when remove from collection
    this._eventsCollection.on('remove', function(model) {
      model.destroy();
    });
    
    // Create the rows alongside the models
    this._prerenderFromJson(jsonMatches.matches);

    // Add bindings to the virtual rtf object
    window.vrtf.on('changed:field', this.handleEventDetailsChanged, this);
  },

  addMatch: function(jsonMatch) {
    var model = new EventDetailsModel(jsonMatch);
    this._eventsCollection.add(model);
    var view = this._wrapperView.getNewRow();
    view.setModel(model).render(jsonMatch);
    this._wrapperView.addRow(model.id, view).appendRow(view);
  },

  removeMatch: function(eventId) {
    this._eventsCollection.remove(eventId);
    this._wrapperView.removeRowById(eventId);
  },

  addOutcome: function() {
    //
  },

  removeOutcome: function() {
    //
  },

  handleEventDetailsChanged: function(eventId, changes) {
    cl('%chandleEventDetailsChanged', 'color:green;', eventId, changes);
    var model = this._eventsCollection.get(eventId);

    cl(model)

    model.set(changes);
    // var row = this._wrapperView.getRowById(eventId);
    // row.eventDetailsModel.set(changes);
  },

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