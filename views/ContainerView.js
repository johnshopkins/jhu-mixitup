/* global require: false */
/* global module: false */

var mixitup = require("mixitup");
var mixitupMultifilter = require("mixitup-multifilter");

var Views = {
  TargetSet: require("./TargetSetView")
};

module.exports = Backbone.View.extend({

  initialize: function (options) {

    this.state = options.state ? options.state : null;
    this.dispatcher = options.dispatcher;
    this.config = this.setConfig(options);

    // parse the targetset
    var targets = new Views.TargetSet({
      targets: this.$el.find(this.config.selectors.target),
      models: options.models || {},
      views: options.views || {}
    });

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
