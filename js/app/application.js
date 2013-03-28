  
// Application

define(['skm/rtf/RTFApi',
  'controllers/MatchesTableViewController'],
  function(RTF, MatchesTableViewController)
{
'use strict';




var tplhtml = com.betbrain.nextLiveMatches.matchesList(jsonMatches);
$('#NextLiveMatchesRTF').html(tplhtml);




var matchesTableController = MatchesTableViewController.create();
matchesTableController.processMatchesInitialDump(jsonMatches);
window.mtc = matchesTableController;



// return;



RTF.Config.urls.ws = 'ws://stage.betonvalue.com/rtfws';
RTF.Config.urls.xhr = 'http://radu.betonvalue.com/rtfajax';
RTF.Config.wsReconnectAttempts = 5;
RTF.Config.sequence = ['WebSocket', 'XHR'];


var rtf = window.RTFApi = RTF.Api.get();

rtf.addUrlParameter('clientId', (new Date).getTime());
rtf.addUrlParameter('jSessionId', 'E75959D079E502C82BC26993C11A37E1.tomcat2');

// rtf.addSubscription('anotherSub');

rtf.addSubscription('nextLiveMatches').on('update', function(update) {
  var updatesArray = update['message'];
  _.each(updatesArray, function(matchesUpdatesItem) {
    matchesTableController.processMatchesListUpdates(matchesUpdatesItem);
  });
});


rtf.startUpdates();



});