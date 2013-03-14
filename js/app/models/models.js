;(function() {


window.RTFTest = window.RTFTest || {};
RTFTest.Models = {};


var MatchesTable = RTFTest.Models.MatchesTable = {};


MatchesTable.OutcomeItemCollection = Backbone.Collection.extend();


MatchesTable.OutcomeItemModel = Backbone.Model.extend({
  outcomeName: undefined,
  oddsValue: 0,
  bookieName: undefined
});


}());