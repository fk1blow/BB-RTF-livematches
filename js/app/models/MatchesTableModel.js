
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
   * @param {JSON} jsonMatchAttributes The object representing the new
   * match/event to be added
   */
  addMatch: function(jsonMatchAttributes, triggersEvent) {
    var eventItem = new EventModel(jsonMatchAttributes);
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
    var eventItemModel = eventsCollection.get(id);
    if ( eventItemModel ) {
      eventItemModel.destroy();
      eventsCollection.remove(id);
      this.trigger('removed:match', id);
    }
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
    var eventItem = null, newIdx = undefined, currentIdx;
    _.each(matchesArr, function(matchAttributes) {
      if ( eventItem = eventsCollection.get(matchAttributes.eventId) ) {
        newIdx = matchAttributes.index;
        currentIdx = eventItem.get('index');
        // if index has been updated
        if ( newIdx != undefined && newIdx != currentIdx ) {
          this.trigger('changed:index', eventItem, newIdx);
        }
        eventItem.set(matchAttributes);
      }
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
  createMatchesList: function(matchesArr) {
    _.each(matchesArr, function(matchAttributes) {
      if ( eventsCollection.get(matchAttributes.eventId) )
        console.log('%cMatchesTableModel.createMatchesList : event with id '
          + matchAttributes.eventId + ' already created', 'color:green');
      else
          this.addMatch(matchAttributes);
    }, this);
  },

  /**
   * Removes a list of matches - EventModel instances
   *
   * @description based on a JSON of events - event id's - iterate
   * over each item and call [removeMatch]
   * @param  {JSON} matchesArr the list of matches to be destroyed
   */
  removeMatchesList: function(matchesArr) {
    _.each(matchesArr, function(matchAttribute) {
      this.removeMatch(matchAttribute.eventId);
    }, this);
  }
});


return MatchesTableModel;


});