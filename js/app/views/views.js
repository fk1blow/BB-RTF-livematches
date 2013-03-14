
;(function() {


window.RTFTest = window.RTFTest || {};
RTFTest.Views = {};


var MatchesTable = RTFTest.Views.MatchesTable = {};


MatchesTable.ContainerListView = Backbone.View.extend({
  _subviews: null,

  el: $('#NextLiveMatchesRTF'),

  initialize: function() {
    this._subviews = {};
  },

  render: function(contentJson) {
    var initialDumpTpl = new EJS({url:'js/nextLiveMatches.ejs'});
    this.$el.html(initialDumpTpl.render(contentJson));
    this.trigger('after:render');
  },

  /*buildRowItem function(callback, ctx) {
    var $rowList = this.$el.find('li.TheMatch');
    var that = this, row, view;

    $rowList.each(function() {
      row = $(this);
      view = new MatchesTable.RowItemView({ el: row });
      that._subviews[row.attr('data-matchid')] = view;
    });
  },*/
  
  buildRowItem: function(id, item) {
    var view = new MatchesTable.RowItemView({ el: item });
    this._subviews[id] = view;
  },

  eachRowElement: function(cb, ctx) {
    var $list = this.$el.find('li.TheMatch');
    var that = this, item;
    $list.each(function() {
      item = $(this);
      cb.call(ctx || that, item.attr('data-matchid'), item);
    });
  }
});


MatchesTable.RowItemView = Backbone.View.extend({
  _subviews: [],

  initialize: function() {
    // cl('%cnew MatchesTable.RowItemView', 'color:#A2A2A2' );
    this._prepareMatchDetailsView();
    this._prepareOddsListView();
  },

  _prepareMatchDetailsView: function() {
    var $list = this.$el.find('.MatchDetails');
    var view, that = this, matchDetailsView;
    this._subviews = {};

    $list.each(function(item) {
      view = new MatchesTable.MatchDetailsView({ el: $(this) });
      that._subviews['MatchDetails'] = view;
    });
  },

  _prepareOddsListView: function() {
    var view, $list = this.$el.find('.OddsList');
    view = new MatchesTable.OddsListContainerView({ el: $list[0] });
    this._subviews['OddsList'] = view;
  }
});


MatchesTable.MatchDetailsView = Backbone.View.extend({
  initialize: function() {
    // cl('%cnew MatchesTable.MatchDetailsView', 'color:#A2A2A2' );
  }
});


MatchesTable.OddsListContainerView = Backbone.View.extend({
  _subviews: null, 

  initialize: function() {
    // cl('%cnew MatchesTable.OddsListContainerView', 'color:#A2A2A2' );
    this._subviews = [];
    this._prepareOddsListItemViews();
  },

  _prepareOddsListItemViews: function() {
    var view, that = this, $list = this.$el.find('.Outcome');
    $list.each(function(item) {
      view = new MatchesTable.OddsListItemView({ el: $(this) });
      that._subviews.push(view);
    });
  }
});


/*
  Item cell / outcome cell
 */


MatchesTable.OddsListItemView = Backbone.View.extend({
  _outcomeCellView: null,

  initialize: function() {
    this._prepareOutcomeCellView();
  },

  _prepareOutcomeCellView: function() {
    this._outcomeCellView = new MatchesTable.OutcomeCellView({
      el: this.$el.find('a.Bet'),
      model: new RTFTest.Models.MatchesTable.OutcomeItemModel()
    });
  }
});


MatchesTable.OutcomeCellView = Backbone.View.extend({
  events: {
    'click': 'handleCellClick'
  },

  initialize: function() {
    var el = this.$el;
    this.model.set('outcomeName', el.find('.OutcomeName').html());
    this.model.set('oddsValue', el.find('.Odds').html());
    this.model.set('bookieName', el.find('.OTBookie').html());

    cl(this.model)
  },

  handleCellClick: function(evt) {
    evt.preventDefault();
    cl('handleCellClick')
  }
});


});