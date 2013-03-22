  
// Event Details model

define(['models/OutcomeCellModel'], function(OutcomeModel) {
'use strict';


var EventItemModel = Backbone.Model.extend({
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

  idAttribute: 'eventId',

  outcomesModels: null,

  initialize: function() {
    this.on('change:outcomes', this._updateOutcomesModels, this);
    this._buildOutcomeCellModel();
  },

  getOutcomeModelByIndex: function(index) {
    return this.outcomesModels[index];
  },

  destroy: function() {
    this.outcomesModels.splice(0);
    this.outcomesModels = null;
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
  },


  /*
    Private
   */
  

  _updateOutcomesModels: function() {
    var outcomesModelsArr = this.outcomesModels;
    var outcomesUpdatesList = this.get('outcomes');
    
    if ( outcomesModelsArr.length ) {
      _.each(outcomesUpdatesList, function(outcome, idx) {
        if ( outcomesModelsArr[outcome.index] )
          outcomesModelsArr[outcome.index].set(outcome);
      });
    }
  },

  _buildOutcomeCellModel: function() {
    var outcomes = this.attributes.outcomes;
    var i = 0, item, model, len = outcomes.length;
    this.outcomesModels = [];
    for (; i < len; i++ ) {
      item = outcomes[i];
      model = new OutcomeModel(item);
      this.outcomesModels.push(model);
    }
  }
});


return EventItemModel;


});