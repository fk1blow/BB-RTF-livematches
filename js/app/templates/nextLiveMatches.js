// This file was automatically generated from nextLiveMatches.soy.
// Please don't edit this file by hand.

if (typeof com == 'undefined') { var com = {}; }
if (typeof com.betbrain == 'undefined') { com.betbrain = {}; }
if (typeof com.betbrain.nextLiveMatches == 'undefined') { com.betbrain.nextLiveMatches = {}; }


com.betbrain.nextLiveMatches.emptyCell = function(opt_data, opt_ignored) {
  return '<li class="Outcome Outcome' + opt_data.outcomeNr + ' EmptyCell">&nbsp;</li>';
};


com.betbrain.nextLiveMatches.outcome = function(opt_data, opt_ignored) {
  return ((opt_data.outcome.isOutcome == true) ? '<li class="Outcome Outcome' + opt_data.outcome.index + '"><a rel="external nofollow" target="' + opt_data.outcome.target + '" href="' + opt_data.outcome.href + '" title="' + opt_data.outcome.outcomeBestOdds + '" class="Bet" id="' + opt_data.outcome.outcomeId + '"><span class="Odds">' + opt_data.outcome.odds + '</span><span class="OutcomeName">' + opt_data.outcome.name + '</span><span class="BookmakerMatchListing  PP-' + opt_data.outcome.providerId + '"><span class="BL OTLogo">Bookmaker:</span><span class="BM OTBookie">' + opt_data.outcome.providerName + '</span></span></a></li>' : '') + ((opt_data.outcome.isOutcome == false) ? (opt_data.outcome.isGroup == true) ? com.betbrain.nextLiveMatches.paramCell(soy.$$augmentMap(opt_data, {parameter: opt_data.outcome.groupKey, outcomeNr: opt_data.outcome.index})) : com.betbrain.nextLiveMatches.emptyCell(soy.$$augmentMap(opt_data, {outcomeNr: opt_data.outcome.index})) : '');
};


com.betbrain.nextLiveMatches.paramCell = function(opt_data, opt_ignored) {
  return '<li class="Outcome Outcome' + opt_data.outcomeNr + '"><span class="Param">' + opt_data.parameter + '</span></li>';
};


com.betbrain.nextLiveMatches.matchTime = function(opt_data, opt_ignored) {
  return '\t' + ((opt_data.match.passedTime && ! (opt_data.match.passedTime == null) && ! (opt_data.match.passedTime == '')) ? '<span class="Timing" data-template="matchTime"><span class="DateTime" itemprop="startDate" data-rtf="passedTime">' + opt_data.match.startTime + ' </span>' + opt_data.match.passedTime + '</span>' : '<span class="Timing" data-template="matchTime"><span class="Setting DateTime" itemprop="startDate" data-rtf="startTime">' + opt_data.match.startTime + '</span></span>');
};


com.betbrain.nextLiveMatches.matchLink = function(opt_data, opt_ignored) {
  return '<a class="MDLink MatchLink MDxMatchLink" data-template="matchLink" data-rtf="link" href="/' + opt_data.match.link + '/' + opt_data.match.betTypeLink + '/' + opt_data.match.scopeLink + '" title="' + opt_data.match.seeMatchNow + '" itemprop="url"><span itemprop="summary" class="MDxEventName">' + opt_data.match.name + '</span>' + com.betbrain.nextLiveMatches.matchScore(opt_data) + com.betbrain.nextLiveMatches.matchTime(opt_data) + '</a>';
};


com.betbrain.nextLiveMatches.matchScore = function(opt_data, opt_ignored) {
  return (opt_data.match.score && ! (opt_data.match.score == null) && ! (opt_data.match.score == '')) ? '<span class="Score" data-template="matchScore" data-rtf="score"> ' + opt_data.match.score + ' </span>' : '<span class="Score LiveStatus" data-template="matchScore" data-rtf="score">' + ((opt_data.match.isLive == true) ? opt_data.match.tc_live + '!' : '') + '</span>';
};


com.betbrain.nextLiveMatches.matchCoverage = function(opt_data, opt_ignored) {
  return '<div class="coverage" data-template="matchCoverage">' + ((opt_data.match.brEvent) ? '<span class="Signal_BR" title="Match covered via BetRadar" data-rtf="brEvent" >BR</span>' : '') + ((opt_data.match.epEvent == true) ? '<span class="Signal_EP" title="Match covered via EnetPulse" data-rtf="epEvent">EP</span>' : '') + '</div>';
};


com.betbrain.nextLiveMatches.matchPayout = function(opt_data, opt_ignored) {
  return '\t' + ((! (opt_data.match.payout == null) && ! opt_data.match.payout == '') ? '<span class="ShowingPayout" data-rtf="payout" data-template="matchPayout">' + opt_data.match.payout + '</span>' : '');
};


com.betbrain.nextLiveMatches.matchOutcomes = function(opt_data, opt_ignored) {
  var output = '<ol class="OddsList ThreeWay" data-rtf="outcomes" data-template="matchOutcomes">';
  var outcomeList105 = opt_data.match.outcomes;
  var outcomeListLen105 = outcomeList105.length;
  for (var outcomeIndex105 = 0; outcomeIndex105 < outcomeListLen105; outcomeIndex105++) {
    var outcomeData105 = outcomeList105[outcomeIndex105];
    output += com.betbrain.nextLiveMatches.outcome(soy.$$augmentMap(opt_data, {outcome: outcomeData105}));
  }
  output += '</ol>';
  return output;
};


com.betbrain.nextLiveMatches.matchInfo = function(opt_data, opt_ignored) {
  return com.betbrain.nextLiveMatches.matchPayout(opt_data) + '<span class="ShowingBetType"><span class="betTypeName">' + opt_data.match.betTypeName + '</span><span class="scopeName">' + ((! opt_data.match.defaultScope) ? ', ' + opt_data.match.scopeName : '') + '</span><span class="groupParam">' + ((opt_data.match.hasGroup == true && opt_data.match.groupParam) ? ', ' + opt_data.match.groupParam : '') + '</span></span><span class="hidden">' + opt_data.match.matchOf + '</span><a class="MDLink SportLink" href="/' + opt_data.match.disciplineNameLink + '/" title="' + opt_data.match.seeSportBettingOdds + '" itemprop="eventType"><span class="SportIcon">' + opt_data.match.disciplineName + '</span></a><span class="hidden">' + opt_data.match.from + '</span><a class="MDLink RegionLink" href="/' + opt_data.match.disciplineNameLink + '/' + opt_data.match.locationNameLink + '/" title="' + opt_data.match.seeSportCompetitionTitle + '"><span class="Flag" itemprop="location">' + opt_data.match.locationName + '</span></a><span class="hidden">' + opt_data.match.matchOf + '</span><a class="MDLink TourLink" href="/' + opt_data.match.tournamentNameLink + '" title="' + opt_data.match.seeAllMatches + '"><span class="Tour">' + opt_data.match.tournamentName + '</span></a><span class="hidden">' + opt_data.match.showingBetType + '</span>' + com.betbrain.nextLiveMatches.matchCoverage(opt_data);
};


com.betbrain.nextLiveMatches.matchBookies = function(opt_data, opt_ignored) {
  return '<span class="BookieNo" data-rtf="providers" data-template="matchBookies"><span class="TotalBookies">' + opt_data.match.providers + '</span></span>';
};


com.betbrain.nextLiveMatches.match = function(opt_data, opt_ignored) {
  return '<li class="TheMatch  ' + ((opt_data.match.isLive == true) ? ' LiveMatch ' : ' LiveSoon ') + '  s-' + opt_data.match.disciplineId + ' c-' + opt_data.match.locationId + '" itemscope="itemscope" itemtype="http://data-vocabulary.org/Event" data-matchid="' + opt_data.match.eventId + '" data-template="match"><div class="MatchDetails"><div class="MDContainer MDxContainer">' + com.betbrain.nextLiveMatches.matchBookies(opt_data) + com.betbrain.nextLiveMatches.matchLink(opt_data) + '</div><div class="MDxInfo">' + com.betbrain.nextLiveMatches.matchInfo(opt_data) + '</div></div>' + com.betbrain.nextLiveMatches.matchOutcomes(opt_data) + '</li>';
};


com.betbrain.nextLiveMatches.matchesList = function(opt_data, opt_ignored) {
  var output = '\t';
  var matchList187 = opt_data.create;
  var matchListLen187 = matchList187.length;
  for (var matchIndex187 = 0; matchIndex187 < matchListLen187; matchIndex187++) {
    var matchData187 = matchList187[matchIndex187];
    output += com.betbrain.nextLiveMatches.match(soy.$$augmentMap(opt_data, {match: matchData187}));
  }
  return output;
};
