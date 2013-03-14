  
// RowItemView

define(['app/components'], function(component) {
'use strict';


var RowItem = Backbone.View.extend({
  initialize: function() {
    cl('%cnew RowItem', 'color:#A2A2A2', this.$el);
  }
});


var Container = component.ui.TableView.extend({
  _rowSelector: 'li.TheMatch',
  
  // This render should be made from the adapter
  // as a hackish method to wrap the already generated html
  // with a view object
  wrapRenderedContent: function() {
    var adapter = this.getAdapter();
    var view = null;
    
    // The view doesn't need to know about the adapter
    // The iteration can be made from the adapter and for each item
    // a view caa be constructed
    // [adapter.eachVisualItem / adapter.eachPrerenderedItem]
    // could be used to iterate over each adapter without needing to query the dom!!!
    this.eachRow(function(elem) {
      view = adapter.buidViewFromElement(elem);
      adapter.addViewItem(elem.attr('data-matchid'), view);
    });
  },

  prerender: function(template, templateData) {
    this.$el.html(template.render(templateData));
  }
});


return {
  RowItemView: RowItem,
  ContainerView: Container
}


});
