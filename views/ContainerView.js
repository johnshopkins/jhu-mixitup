/* global require: false */
/* global module: false */

var Analytics = require("analytics");
var mixitup = require("mixitup");
var mixitupMultifilter = require("mixitup-multifilter");

var Views = {
  TargetSet: require("./TargetSetView"),
  NoResults: require("./NoResultsView")
};

module.exports = Backbone.View.extend({

  initialize: function (options) {

    if (options.track) {
      this.analytics = new Analytics();
      this.app = options.track;
    }

    this.controls = options.controls;
    this.dispatcher = options.dispatcher;
    this.state = options.state || null;
    this.config = this.setConfig(options);

    // listen to some events
    this.setupListeners();

    this.$el.attr("aria-live", "polite");

    // parse the targetset
    new Views.TargetSet({
      targets: this.$el.find(this.config.selectors.target),
      models: options.models || {},
      views: options.views || {}
    });

    // create a view to show when there are no results
    this.noresults = new Views.NoResults({ dispatcher: this.dispatcher });

  },

  setupListeners: function () {

    /**
     * Hook to manually set selector filter
     * Examples:
     *  - To fitler: this.dispatcher.trigger("mixitup:set:selector", "keyword", ".blah");
     *  - To reset:  this.dispatcher.trigger("mixitup:set:selector", "keyword", null);
     */
    this.dispatcher.on("mixitup:set:selector", this.setSelector, this);

    /**
     * Hook to manually trigger sorting by a order by an order
     * Examples:
     *  - To sort:  this.dispatcher.trigger("mixitup:sort", "rel", "asc");
     *  - To reset: this.dispatcher.trigger("mixitup:sort", "default");
     */
    this.dispatcher.on("mixitup:sort", this.setSort, this);

  },

  setSelector: function (group, filter) {

    var selector = [];

    if (filter) {
      filter = Array.isArray(filter) ? filter : [filter];
      selector = filter.map(function (filter) {
        return "." + filter;
      });
    }

    this.mixer.setFilterGroupSelectors(group, selector);
    this.mixer.parseFilterGroups();

  },

  setSort: function (order_by, order) {

    var sort = order_by;
    if (order) sort += ":" + order;

    this.mixer.sort(sort);

  },

  /**
   * Merge passed configuration with default configuration
   * @param  {object} options View options
   * @return {object}         Merged configuration
   */
  setConfig: function (options) {

    var self = this;

    var defaults = {
      multifilter: { enable: true },
      selectors: { target: ".item" },
      callbacks: {
        onMixStart: function () {
          self.noresults.hide();
        },
        onMixFail: function () {
          self.noresults.show();
        }
      }
    };

    if (this.state) {
      defaults.callbacks.onMixEnd = this.state.setHash.bind(this.state);
    }

    if (this.analytics) {
      defaults.callbacks.onMixClick = function () {
        self.analytics.trackEvent({
          eventCategory: self.app,
          eventAction: "Click filter",
          eventLabel: $(this).data('name')
        });
      };
    }

    return $.extend({}, defaults, options.config || {});

  },

  render: function () {

    // render the controls
    this.controls.render();

    // append no results view
    this.$el.append(this.noresults.render().el);

    // instantiate the mixer
    mixitup.use(mixitupMultifilter);
    this.mixer = mixitup(this.$el, this.config);

    // init the hash state
    if (this.state) {
      this.state.mixer = this.mixer;
      this.state.ready();
    }

    return this;

  }

});
