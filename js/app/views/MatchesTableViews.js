  
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

  wrapRenderedContent: function() {
    var adapter = this.getAdapter();
    var view = null;
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