/* global require: false */
/* global module: false */

var templates = {
  noresults: require("../templates/noresults.html")
};

module.exports = Backbone.View.extend({

  className: "noresults",
  template: templates.noresults,

  initialize: function () {

    this.showing = false;

  },

  show: function () {

    if (!this.showing) this.$el.addClass("show");
    this.showing = true;

  },

  hide: function () {

    if (this.showing) this.$el.removeClass("show");
    this.showing = false;

  },

  render: function () {

    this.$el.append(this.template());
    return this;

  }

});
