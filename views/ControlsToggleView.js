/* global require: false */
/* global module: false */


var templates = {
  toggle: require("../templates/toggle.html")
};

module.exports = Backbone.View.extend({

  className: "display-nav closed",
  template: templates.toggle,

  events: {
    "click": "onClick"
  },

  initialize: function (options) {

    this.dispatcher = options.dispatcher;

  },

  onClick: function (e) {

    this.$el.toggleClass("closed");
    this.trigger("form:display:toggle");

  },

  render: function () {

    this.$el.append(this.template());
    return this;

  }

});
