  
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
RTF.Config.urls.xhr = 'http://dragos.betonvalue.com/rtfajax';
RTF.Config.wsReconnectAttempts = 0;
RTF.Config.sequence = ['WebSocket'];


var rtf = window.RTFApi = window.rtf = RTF.Api.get();
rtf.addUrlParameter('clientId', (new Date).getTime());
rtf.addUrlParameter('jSessionId', "61B1E7817C270A1BC3877B0CCB6C685E");


// @todo transform to:
//    rtf.on('update:nextLiveMatches')
//    rtf.getChannel('nextLiveMatches').on('update')
//    rtf.getChannel('nextLiveMatches').on('api:error')
//    rtf.channels.on('error:nextLiveMatches').
//    rtf.channels.on('update:nextLiveMatches').

// rtf.on('message:nextLiveMatches', function(updatesObj) {
rtf.subscriptionsHandler.on('update:nextLiveMatches', function(updatesObj) {
  cl('______________________________________________________')
  cl('message:nextLiveMatches', updatesObj);
  cl('______________________________________________________')
  // matchesTableController.processUpdatesList(updatesObj);
  
  _.each(updatesObj, function(update, updateTypeName) {
    // cl(updateTypeName)
    // cl(update)
    matchesTableController.processMatchesListUpdates(update);
  });
});

rtf.subscriptionsHandler.on('update:testChannel', function(updatesObj) {
  cl('______________________________________________________')
  cl('message:testChannel', updatesObj);
  cl('______________________________________________________')
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