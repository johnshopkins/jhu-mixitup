/* global require: false */
/* global module: false */

var mixitup = require("mixitup");
var mixitupMultifilter = require("mixitup-multifilter");

var Views = {
  TargetSet: require("./TargetSetView")
};

module.exports = Backbone.View.extend({

  initialize: function (options) {

    this.controls = options.controls;
    this.dispatcher = options.dispatcher;
    this.state = options.state || null;
    this.config = this.setConfig(options);

    // listen to some events
    this.setupListeners();

    // parse the targetset
    var targets = new Views.TargetSet({
      targets: this.$el.find(this.config.selectors.target),
      models: options.models || {},
      views: options.views || {}
    });

  },

  setupListeners: function () {

    this.dispatcher.on("mixitup:set:selector", this.setSelector, this);
    this.dispatcher.on("mixitup:sort", this.setSort, this);

  },

  setSelector: function (group, filter) {

    var selector = filter ? "." + filter : [];

    this.mixer.setFilterGroupSelectors("keyword", selector);
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

    var defaults = {
      multifilter: { enable: true },
      selectors: { target: ".item" }
    };

    if (this.state) {
      defaults.callbacks = { onMixEnd: this.state.setHash.bind(this.state) };
    }

    return $.extend({}, defaults, options.config || {});

  },

  render: function () {

    // render the controls
    this.controls.render();

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
