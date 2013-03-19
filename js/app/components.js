  
// Components

define(['skm/k/Object'],
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
  /**
   * Collection of row item view instances
   * @type {Object}
   */
  _rowViews: null,

  /**
   * Selector used to query dom, for each row of the table view
   * @type {String}
   */
  rowSelector: '>li',

  getRowById: function(id) {
    return this._rowViews[id];
  },

  addRow: function(id, view) {
    var list = this._rowViews;
    if ( id in list ) {
      throw new Error('TableView.addRow :: view with id '
        + id + ' already added');
    }
    list[id] = view;
  },

  removeRow: function(rowView) {
    //
  },

  removeRowById: function(id) {
    var row = null;
    if ( row = this._rowViews[id] ) {
      delete this._rowViews[id];
      row.remove();
      row = null;
    }
  },

  eachRow: function(cb, ctx) {
    var $rows = this.$el.find(this.rowSelector);
    var that = this, elem = null;
    $rows.each(function() {
      elem = $(this);
      cb.call(ctx || that, elem);
    });
  }
});


Component.ui.AdapterView = Backbone.View.extend({
  _adapter: null,

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


Component.data.Adapter = SKMObject.extend({
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