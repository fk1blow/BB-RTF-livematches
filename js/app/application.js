  
// Application

define(['skm/rtf/RTFApi',
  'controllers/MatchesTableViewController'],
  function(RTF, MatchesTableViewController)
{
'use strict';


/*require(['skm/rtf/RTFApi'], function() {
  cl('asta e callback-ul apela, dupa ce modulul a fost incarcat')
});*/



var tplhtml = com.betbrain.nextLiveMatches.matchesList(jsonMatches);
$('#NextLiveMatchesRTF').html(tplhtml);




var matchesTableController = MatchesTableViewController.create();
matchesTableController.processMatchesInitialDump(jsonMatches);
window.mtc = matchesTableController;





var host = window.location.host;
if (host.indexOf('radu.')>-1||host.indexOf('dragos.')>-1)
    host = host+":8080";


host = 'dragos.betonvalue.com';

RTF.Config.WebSocket.reconnectAttempts = 0;
// RTF.Config.sequence = ['WebSocket', 'XHR'];
RTF.Config.sequence = ['WebSocket'];
// RTF.Config.sequence = ['XHR'];

RTF.Config.WebSocket.url = 'ws://' + host + ':80/rtfws';
RTF.Config.XHR.url = 'http://' + window.location.host + '/rtfajax';



var rtf = window.RTFApi = window.rtf = RTF.Api.getInstance();
rtf.addUrlParameter('clientId', (new Date).getTime());
rtf.addUrlParameter('jSessionId', 'C743D52D31C1723B82E7BAAA13D1B4D6');


rtf.on('message:nextLiveMatches', function(updatesObj) {
  console.log('______________________________________________________')
  console.log('message:nextLiveMatches', updatesObj);
  
  _.each(updatesObj, function(json,type) {
    matchesTableController.processMatchesListUpdates(type, json);
  });
});

rtf.on('message:testChannel', function(updatesObj) {
  console.log('______________________________________________________')
  console.log('message:testChannel', updatesObj);
  console.log('______________________________________________________')
});

rtf.on('error:testChannel', function(updatesObj) {
  console.log('%cmessage:error', 'color:red', updatesObj);
});


rtf.on('deactivated:connector', function() {
  cl('connector deactivated... for some reason')
})



// Adding a Channel
rtf.addChannel({
  name: 'nextLiveMatches',
  params: { matches: 10, live: true }
});

// rtf.addChannel({
//   name: 'testChannel',
//   params: { live: true }
// });


// rtf.startUpdates();





});