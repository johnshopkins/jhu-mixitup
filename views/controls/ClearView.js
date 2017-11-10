/* global require: false */
/* global module: false */

var templates = { clear: require("../../templates/clear.html") };

var CheckboxView = module.exports = Backbone.View.extend({

  tagName: "button",
  className: "small clear-button",
  template: templates.clear,

  render: function () {

    this.$el.attr("type", "reset");
    this.$el.attr("aria-label", "Clear filters in this section");

    this.$el.append(this.template());
    return this;

  }

});
