  
// Components

define(['skm/k/Object',
  'app/components',
  'views/MatchesTableViews'],
  function(SKMObject, component, tableViews)
{
'use strict';


var MatchesTableAdapter = component.data.ArrayAdapter.extend({
  buidViewFromElement: function(viewEl) {
    var view = new tableViews.RowItemView({ el: viewEl });
    return view;
  },

  removeView: function(view) {
    view.remove();
    delete this._viewItems[view.cid];
  }
});


return MatchesTableAdapter;


});
