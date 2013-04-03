  
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



RTF.Config.urls.ws = 'ws://radu.betonvalue.com:8080/rtfws';
RTF.Config.urls.xhr = 'http://radu.betonvalue.com/rtfajax';
RTF.Config.wsReconnectAttempts = 0;
RTF.Config.sequence = ['WebSocket'];


var rtf = window.RTFApi = RTF.Api.get();
rtf.addUrlParameter('clientId', (new Date).getTime());
rtf.addUrlParameter('jSessionId', "28A6312E6F149611A08B24AA487C45A7");


rtf.on('message:nextLiveMatches', function(updatesObj) {
  cl('message:nextLiveMatches', updatesObj);
  // matchesTableController.processUpdatesList(updatesObj);
  
  // _.each(updatesObj, function(update, updateTypeName) {
  //   cl(updateTypeName)
  //   cl(update)
  //   // matchesTableController.processMatchesListUpdates(update);
  // });
});


rtf.on('message:error', function(updatesObj) {
  cl('%cmessage:error', 'color:red', updatesObj);
});


// rtf.addSubscription('nextLiveMatches').on('update', function(update) {
  /*var updatesArray = update['updateMessage'];
  _.each(updatesArray, function(matchesUpdatesItem) {
    matchesTableController.processMatchesListUpdates(matchesUpdatesItem);
  });*/
// });


// Works
/*rtf.startUpdates();*/

// Works
rtf.startUpdates({
  'nextLiveMatches' : { matches: 5, live: true },
  // 'otherNewLiveMatches': { matches: 10, outcomes: false } 
});


// rtf.subscribeToChannel('nextLiveMatches');
// rtf.subscribeToChannel('nextLiveMatches', { matches: 10, live: true });
// rtf.subscribeToChannel('otherMatches', { matches:5, outcomes: true });

});