  
// RowItemView

define(['app/components',
  'views/MatchesTable/RowItemView',
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

  wrapViewFromInitialDump: function(matchesJson) {
    var that = this, len = matchesJson.length, i = 0;
    var view = null, evId, item;

    for ( i = 0; i < len; i++ ) {
      item = matchesJson[i];
      evId = item['eventId'];
      view = new RowItem({
        el: this.$el.find('li[data-matchid="' + evId + '"]'),
        modelJSON: item
      });
      view.buildChildViews();
      this.addRow(evId, view);
    }
  },
  
  wrapEachRowWithSubviews: function() {
    var that = this, view = null;
    this.eachRow(function(elem) {
      view = new RowItem({ el: elem });
      view.buildChildViews();
      this.addRow(elem.attr('data-matchid'), view);
    });
    view = null;
  },

  createNewRow: function(rowId) {
    var view = new RowItem();
    this.addRow(rowId, view);
    return view;
  },

  appendRow: function(rowView) {
    this.$el.append(rowView.el);
  }
});


return Wrapper;


});
