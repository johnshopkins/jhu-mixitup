/* global require: false */
/* global module: false */

module.exports = Backbone.View.extend({

  className: "filter",

  initialize: function (options) {

    this.dispatcher = options.dispatcher;

  },

  render: function () {

    this.model.set("uniqueId", this.cid);
    this.$el.append(this.template(this.model.toJSON()));

    return this;

  }

});
