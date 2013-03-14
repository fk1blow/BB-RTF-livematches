  
// Application

define(['app/components',
  'app/MatchesTableAdapter',
  'views/MatchesTableViews'],
  function(component, MatchesTableAdapter, tableViews)
{
'use strict';


// table adapter
var matchesAdapter = MatchesTableAdapter.create();
matchesAdapter.setDataSource(rtfMatchesJSON.matches);


// matches table view
var matchesTableView = window.matchesTableView = new tableViews.ContainerView({
  el: $('#NextLiveMatchesRTF')
});
matchesTableView.setAdapter(matchesAdapter);
matchesTableView.prerender(new EJS({url: 'js/app/templates/nextLiveMatches.ejs'}), rtfMatchesJSON );
matchesTableView.wrapRenderedContent();



});