;(function() {


window.RTFTest = window.RTFTest || {};
RTFTest.ViewControllers = {};


var MatchesTable = RTFTest.ViewControllers.MatchesTable = {};


MatchesTable.ContainerListController = function() {
  cl( '%cnew MatchesTable.ContainerListController', 'color:#A2A2A2' );

  // Create the main view
  this.view = new RTFTest.Views.MatchesTable.ContainerListView();
  this.view.on('after:render', this.buildViewRows, this);

  // render initial json dump
  this.view.render(rtfMatchesJSON);
}

MatchesTable.ContainerListController.prototype = {
  view: null,

  buildViewRows: function() {
    this.view.eachRowElement(function(id, el) {
      this.view.buildRowItem(id, el);
    }, this);
  }
}


// LiveMatchesTable.RowViewController = ViewController.extend({
//   setup: function(options) {
//     var opt = options || {};
//     Logger.debug( '%cnew LiveMatchesTable.RowViewController', 'color:#A2A2A2' );
//     this._buildRowItems(opt.itemRows);
//   },

//   _buildRowItems: function() {
//     //
//   }
// });


}());