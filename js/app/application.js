  
// Application

define(['app/components',
  'controllers/MatchesTableViewController'],
  function(component, MatchesTableViewController)
{
'use strict';


var matchesTableController = MatchesTableViewController.create();

window.matchesTableController = matchesTableController;


});