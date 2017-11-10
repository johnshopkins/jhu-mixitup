/* global require: false */
/* global module: false */

var getScriptData = require("get-script-data");

/**
 * Setup models and views on target items
 */
module.exports = Backbone.View.extend({

  initialize: function (options) {

    this.targets = options.targets;
    this.models = options.models;
    this.views = options.views;

    this.render();

  },

  render: function () {

    var self = this;

    $.each(this.targets, function (i, target) {

      target = $(target);
      var data = getScriptData(target);

      if (!data || !data.type) return;

      if (!self.models[data.type] || !self.views[data.type]) return;

      var model = new self.models[data.type](data);

      new self.views[data.type]({
        el: target,
        model: model
      });

    });

    return this;

  }

});
