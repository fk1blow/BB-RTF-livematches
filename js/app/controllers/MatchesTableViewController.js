  
// Match Table ViewController implementation

define(['skm/k/Object',
  'skm/util/Subscribable',
  'views/MatchesTable/WrapperView'],
  function(SKMObject, Subscribable, Wrapper)
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

  initialize: function() {
    this._wrapperView = new Wrapper();
    this._wrapperView.wrapViewFromInitialDump(jsonMatches.matches);
    
    // Add bindings to the virtual rtf object
    window.vrtf.on('changed:field', this.handleEventDetailsChanged, this);
  },

  handleEventDetailsChanged: function(eventId, changes) {
    cl('%chandleEventDetailsChanged', 'color:green;', eventId, changes);
    var row = this._wrapperView.getRowById(eventId);
    row.eventDetailsModel.set(changes);
  },
});


return MatchTableController;


});