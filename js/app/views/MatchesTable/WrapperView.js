  
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

  /**
   * Inserts a new row view
   *
   * @description Inserts a new element to the table view,
   * at the tail or at a specified index. If the index is not found or not
   * speficied, it will be appended at the end of the table view.
   * @param  {Object} view  a reference to an instance of EventItemView
   * @param  {Number} index the index at which the view's el should pe placed
   */
  renderRow: function(view, index) {
    console.log('%cWrapper.renderRow', 'color:green', view.$el);
    var $elAtIndex = null, $view = view.$el;
    if ( index ) {
      $elAtIndex = this.el.find('li.TheMatch').eq(index);
      if ( $elAtIndex.length )
        $view.insertBefore($elAtIndex);
      else
        this.$el.append($view);
    } else {
      this.$el.append($view);
    }
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
