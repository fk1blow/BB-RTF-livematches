  
// RowItemView

define(['app/components',
  'views/MatchesTable/EventItemView',
  /*'views/MatchesTable/MatchesCell',
  'views/MatchesTable/BetCell'*/],
  function(component, RowItem)
{
'use strict';


var Wrapper = component.ui.TableView.extend({
  el: $('#NextLiveMatchesRTF'),

  rowSelector: 'li.TheMatch',

  initialize: function() {
    cl('%cnew Wrapper', 'color:#A2A2A2');
    this._rowViews = {};
  },

  renderRow: function(view) {
    cl('%cWrapper.renderRow', 'color:green', view.$el);
    this.$el.append(view.$el);
  },

  getNewRow: function(options) {
    return new RowItem(options || {});
  },

  getNewRowByMatchId: function(id) {
    var element = this.$el.find('li[data-matchid="' + id + '"]');
    return this.getNewRow({ el: element });
  }
});


return Wrapper;


});
