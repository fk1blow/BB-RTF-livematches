  
// RowItemView

define(['app/components',
  'views/MatchesTable/EventItemView',
  /*'views/MatchesTable/MatchesCell',
  'views/MatchesTable/BetCell'*/],
  function(component, EventItemView)
{
'use strict';


var Wrapper = component.ui.TableView.extend({
  el: $('#NextLiveMatchesRTF'),

  rowSelector: 'li.TheMatch',

  initialize: function() {
    console.log('%cnew Wrapper', 'color:#A2A2A2');
    this._rowViews = {};
  },

  renderRow: function(view) {
    console.log('%cWrapper.renderRow', 'color:green', view.$el);
    this.$el.append(view.$el);
  },

  getNewRow: function(options) {
    return new EventItemView(options || {});
  },

  getNewRowByMatchId: function(id) {
    var element = this.$el.find('li[data-matchid="' + id + '"]');
    return this.getNewRow({ el: element });
  }
});


return Wrapper;


});
