  
// Event Details model

define([], function() {
'use strict';


var EventDetailsModel = Backbone.Model.extend({
  defaults: {
    groupParam: null,
    isLive: false,

    brEvent: false,
    epEvent: false,

    link: "",
    score: "",
    seeAllMatches: "",
    showingBetType: "",
    from: "",
    locationName: "",
    scopeLink: "",
    payout: 0,
    scopeName: "",
    startTime: "",
    seeEventIds: false,
    eventId: 0,
    providers: 0,
    disciplineName: "",
    name: "",
    tournamentName: "",
    tc_live: "",
    betTypeName: "",
    disciplineId: 0,
    scopeId: 0,
    tournamentId: 0,
    index: 0,
    seeMatchNow: "",
    betTypeLink: "",
    disciplineNameLink: "",
    betTypePayout: false,
    tournamentNameLink: "",
    hasGroup: false,
    seeSportCompetitionTitle: "",
    passedTime: 0,
    defaultScope: true,
  },

  initialize: function() {
    cl('%cnew EventDetailsModel', 'color:#A2A2A2');
  },

  getTimeAttributes: function() {
    var attrs = this.attributes;
    return {
        match: {
            passedTime: attrs.passedTime,
            startTime: attrs.startTime
        }
    }
  },

  getScoreAttributes: function() {
    var attrs = this.attributes;
    return {
        match: {
          score: attrs.score,
          isLive: attrs.isLive,
          tc_live: attrs.tc_live
        }
    }
  },

  getLinkAttributes: function() {
    var attrs = this.attributes;
    return {
      match: {
        link: attrs.link,
        betTypeLink: attrs.betTypeLink,
        scopeLink: attrs.scopeLink,
        seeMatchNow: attrs.seeMatchNow,
        name: attrs.name
      }
    }
  },

  hasScore: function() {
    var score = this.get('score');
    if ( score && score.length ) {
        return true;
    }
    return false
  }
});


return EventDetailsModel;


});