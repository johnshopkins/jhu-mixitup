/* global require: false */
/* global module: false */

module.exports = Backbone.View.extend({

  tagName: "fieldset",

  initialize: function (options) {

    this.dispatcher = options.dispatcher;
    this.label = options.label || null;
    this.groupName = this.label.toLowerCase().replace(" ", "");

  },

  append: function (model) {

    var view = new this.view({
      dispatcher: this.dispatcher,
      model: model
    });

    this.$el.append(view.render().el);

  },

  render: function () {

    this.$el.attr("data-filter-group", this.groupName);

    if (this.label) this.$el.append($("<legend />").text(this.label));

    if (this.collection) {

      // add each element
      this.collection.each(this.append, this);

    } else if (this.model) {

      this.append(this.model);

    }

    return this;

  }

});
