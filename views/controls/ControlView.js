/* global require: false */
/* global module: false */

var $ = require("../../shims/jquery");
var Backbone = require("../../shims/backbone");

module.exports = Backbone.View.extend({

  className: "filter",

  initialize: function (options) {

    this.dispatcher = options.dispatcher;

  },

  render: function () {

    var id = this.model.get("id");
    this.model.set("uniqueId", id ? id : this.cid);
    this.$el.append(this.template(this.model.toJSON()));

    return this;

  }

});
