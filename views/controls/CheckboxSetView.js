/* global require: false */
/* global module: false */
/* global logger: false */

var Views = {
  Checkbox: require("./CheckboxView"),
  Clear: require("./ClearView")
};

module.exports = Backbone.View.extend({

  tagName: "fieldset",
  view: Views.Checkbox,

  initialize: function (options) {

    this.label = options.label || null;

  },

  append: function (model) {

    var view = new this.view({ model: model });
    this.$el.append(view.render().el);

  },

  render: function () {

    this.$el.attr("data-filter-group", "");

    if (this.label) this.$el.append($("<legend />").text(this.label));

    // add each element
    this.collection.each(this.append, this);

    // add clear button
    var clear = new Views.Clear();
    this.$el.append(clear.render().el);

    return this;

  }

});
