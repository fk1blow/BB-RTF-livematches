  
// Components

define(['skm/k/Object',
  'underscore'],
  function(SKMObject)
{
'use strict';


var Component = {};


/*
  UI Components
  -------------
 */


Component.ui = {};


Component.ui.TableView = Backbone.View.extend({
  _rowSelector: 'li',

  _rowViews: null,

  _adapter: null,

  addRowAt: function(index) {},

  removeRowAt: function(index) {},

  getRowAt: function(index) {},

  prerender: function(content) {},

  eachRow: function(cb, ctx) {
    var $rows = this.$el.find(this._rowSelector);
    var that = this, elem = null;
    $rows.each(function() {
      elem = $(this);
      cb.call(ctx || that, elem);
    });
  },

  // TBD
  /*renderEachRowItem: function() {
    var adapter = this.getAdapter();
    var view = null;

    adapter.eachItem(function(item) {
      view = this.getView(item);
    });
  },*/

  getAdapter: function() {
    return this._adapter;
  },

  setAdapter: function(adapterInstance) {
    this._adapter = adapterInstance;
  }
});


/*
  Data Components
  ---------------
 */


Component.data = {};


Component.data.AbstractAdapter = SKMObject.extend({
  _dataSource: null,

  _viewItems: null,

  setDataSource: function(data) {},

  getDataSource: function() {},

  getCount: function() {},

  getItem: function(position) {},

  getView: function() {},

  eachItem: function(cb, ctx) {},

  addViewItem: function(id, view) {},

  removeViewItem: function(id) {}
});


Component.data.ArrayAdapter = Component.data.Adapter.extend({
  initialize: function() {
    this._dataSource = null;
    this._viewItems = {};
  },

  getDataSource: function() {
    return this._dataSource;
  },

  setDataSource: function(data) {
    this._dataSource = data;
  },

  getItem: function(position) {
    var dataItem = null, list = this._dataSource;
    if ( list.length && position < list.length ) {
      dataItem = list[position];
    }
    return dataItem;
  },
  
  getCount: function() {
    return this._dataSource.length;
  },

  eachItem: function(cb, ctx) {
    var data = this.getDataSource();
    var len = this.getCount();
    for ( var i = 0; i < len; i++ ) {
      cb.call(ctx || this, data[i]);
    }
  },

  removeItemAt: function(position) {
    var list = this.getDataSource();
    var item = list.splice(position, 1);
    this.removeView(this.getViewAtIndex(position));
  },

  getViewById: function(id) {
    return this._viewItems[id];
  },

  getViewAtIndex: function(index) {
    var list = this._viewItems;
    var item, view = null, counter = 0;
    for ( item in list ) {
      if ( index === counter ) {
        view = list[item];
        break;
      }
      counter++;
    }
    return view;
  },

  addViewItem: function(id, view) {
    this._viewItems[id] = view;
  }
});


return Component;


});