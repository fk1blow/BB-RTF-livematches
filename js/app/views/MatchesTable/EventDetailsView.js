  
// Matches Cell

define([], function() {
'use strict';


var EventDetails = Backbone.View.extend({
  initialize: function() {
    console.log('%cnew EventDetails', 'color:#A2A2A2');

    this.model.on('change:tournamentName',
      this.handleChangedTournamentName, this);

    this.model.on('change:tournamentNameLink change:seeAllMatches',
      this.handleChangeTournamentnameLink, this);

    this.model.on('change:locationName', this.handleChangedLocationName, this);

    this.model.on('change:betTypeName', this.handleChangedBettypeName, this);

    this.model.on('change:scopeName', this.handleChangedScopeName, this);
    
    this.model.on('change:groupParam', this.handleChangedGroupParam, this);

    this.model.on('change:disciplineNameLink change:locationNameLink'
      + ' change:seeSportCompetitionTitle',
      this.handleChangedDisciplinenameLink, this);

    this.model.on('change:disciplineName',
      this.handleChangeDisciplineName, this);
    
    this.model.on('change:link change:scopeLink change:betTypeLink'
      + ' change:seeMatchNow change:name', this.handleChangedLink, this);

    this.model.on('change:providers', this.handleChangedProviders, this);
    
    this.model.on('change:payout', this.handleChangedPayout, this);

    this.model.on('change:brEvent change:epEvent',
      this.handleChangedCoverage, this);

    this.model.on('change:startTime change:passedTime',
      this.handleChangedMatchTime, this);

    this.model.on('change:isLive', this.handleChangedIsLive, this);

    this.model.on('change:score', this.handleChangedScore, this);
  },

  handleChangedTournamentName: function() {
    var tournamentName = this.model.get('tournamentName');
    this.$el.find('span.Tour').html(tournamentName);
  },

  handleChangeTournamentnameLink: function() {
    var link = this.model.get('tournamentNameLink');
    var title = this.model.get('seeAllMatches');
    this.$el.find('.MDLink.TourLink')
  },

  handleChangedLocationName: function() {
    this.$el.find('.Flag').html(this.model.get('locationName'));
  },

  handleChangedBettypeName: function() {
    this.$el.find('span.ShowingBetType')
      .html(this.model.get('betTypeName'));
  },

  handleChangedScopeName: function() {
    var el = this.$el.find('span.ShowingBetType').find('.scopeName');
    var text = '', prev = el.html();

    if ( this.model.get('defaultScope') ) {
      text = ', ' + this.model.get('scopeName');
    }
    el.html(text);
  },

  handleChangedGroupParam: function() {
    var el = this.$el.find('span.ShowingBetType').find('.groupParam');
    var groupParam = '', text = '', prev = el.html();

    if ( this.model.get('hasGroup')
         && (groupParam = this.model.get('groupParam')) )
    {
      text = ', ' + groupParam;
    }
    el.html(text);
  },

  handleChangedDisciplinenameLink: function() {
    var sportLink = '/' + this.model.get('disciplineNameLink') + '/';
    var regionLink = sportLink + this.model.get('locationNameLink') + '/';
    this.$el.find('.MDLink.SportLink').attr('href', sportLink);
    this.$el.find('.MDLink.RegionLink')
      .attr('href', regionLink)
      .attr('title', this.model.get('seeSportCompetitionTitle'));
  },

  handleChangeDisciplineName: function() {
    var icon = this.model.get('SportIcon');
    this.$el.find('.SportIcon').html(icon);   
  },

  handleChangedLink: function() {
    var timeAttrs = this.model.getTimeAttributes();
    var scoreAttrs = this.model.getScoreAttributes();
    var linkAttrs = this.model.getLinkAttributes();
    var attrs = _.extend({}, linkAttrs.match, timeAttrs.match, scoreAttrs.match);
    var tpl = com.betbrain.nextLiveMatches.matchLink({ match: attrs });
    this.$el.find('a.MatchLink').replaceWith(tpl);
  },

  handleChangedProviders: function() {
    var tpl = com.betbrain.nextLiveMatches.matchBookies({
      match: { providers: this.model.get('providers') }
    });
    this.$el.find('.BookieNo').replaceWith(tpl);
  },

  handleChangedPayout: function() {
    var $container = null;

    if ( this.model.get('betTypePayout') === true ) {
      $container = this.$el.find('div.MDxInfo');
      $container.find('.ShowingPayout').remove();

      var tpl = com.betbrain.nextLiveMatches.matchPayout({
        match: { payout: this.model.get('payout') }
      });
      $container.prepend(tpl);
    }
  },

  handleChangedCoverage: function() {
    var attrs = this.model.attributes;
    var tpl = com.betbrain.nextLiveMatches.matchCoverage({
      match: { epEvent: attrs.epEvent, brEvent: attrs.brEvent }
    });
    this.$el.find('div.coverage').html(tpl);
  },

  handleChangedMatchTime: function(model) {
    var attrs = this.model.getTimeAttributes();
    this._renderTime(attrs);
  },

  handleChangedIsLive: function() {
    var attrs = this.model.getTimeAttributes();
    this.trigger('isLive', true);
    this._renderTime(attrs);
    this._renderScore();
  },

  handleChangedScore: function() {
    this._renderScore();
  },

  /*
    Renderers
   */
  
  _renderScore: function() {
    var attrs = this.model.getScoreAttributes();
    var tpl = com.betbrain.nextLiveMatches.matchScore(attrs);
    this.$el.find('span.Score').replaceWith(tpl);
  },
  
  _renderTime: function(attributes) {
    var tpl = com.betbrain.nextLiveMatches.matchTime(attributes);
    this.$el.find('.Timing').replaceWith(tpl);
  } 
});


return EventDetails;


});
