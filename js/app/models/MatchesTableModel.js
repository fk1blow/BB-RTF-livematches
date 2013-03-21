
// Matches Table model - main module model :D

define(['models/EventItemModel'],
  function(EventModel)
{
'use strict';


var eventsCollection = new Backbone.Collection();


var MatchesTableModel = Backbone.Model.extend({
  /**
   * Adds a new event and creates its model
   * 
   * @param {JSON} jsonMatchEvent The object representing the new
   * match/event to be added
   */
  addMatch: function(jsonMatchEvent, triggersEvent) {
    var eventItem = new EventModel(jsonMatchEvent);
    eventsCollection.add(eventItem);
    if ( triggersEvent != false )
      this.trigger('created:match', eventItem);
    return eventItem;
  },

  /**
   * Removes a match and destroys it
   * 
   * @param  {String} id event item/match id
   */
  removeMatch: function(id) {
    var eventItem = eventsCollection.get(id);
    eventItem.destroy();
    eventsCollection.remove(id);
    this.trigger('removed:™', id);
  },

  /**
   * Updates the matches and their attributes
   *
   * @description If collection doesn't contain the model
   * with this eventId, create it and add it to the collection
   * 
   * @param  {Array} matchesArr list of matches to be updated
   */
  updateMatchesList: function(matchesArr) {
    var eventItem = null;
    _.each(matchesArr, function(matchAttributes) {
      if ( eventItem = eventsCollection.get(matchAttributes.eventId) )
        eventItem.set(matchAttributes);
      else
        this.addMatch(matchAttributes);
    }, this);
  },
  
  /**
   * For a list (JSON) of matches, create a new EventModel instance
   *
   * @description it iteratest over the list,
   * creating a new instance of [EventModel]
   * and adds it to the eventsCollection
   * 
   * @param  {JSON} matchesArr json list of matches to be created
   */
  createNewMatchesList: function(matchesArr) {
    return true;
  },

  removeMatchesList: function() {
    return true;
  }
});


return MatchesTableModel;


});