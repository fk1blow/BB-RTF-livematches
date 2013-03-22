  
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



RTF.Config.setWSUrl('ws://10.0.3.55:8080/rtfws');
RTF.Config.setXHRUrl('http://radu.betbrain.com/rtfajax');

var rtf;
window.RTFApi = rtf = RTF.Api.get();

rtf.setClientId((new Date).getTime());
rtf.addSubscription('nextLiveMatches');
rtf.startUpdates();

rtf.getSubscription('nextLiveMatches').on('update', function(update) {
  var updatesArray = update['message'];
  _.each(updatesArray, function(matchesUpdatesItem) {
    matchesTableController.processMatchesListUpdates(matchesUpdatesItem);
  });
  
});


});