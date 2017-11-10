/* global require: false */
/* global module: false */
/* global logger: false */

var getScriptData = require("get-script-data");

var Views = {
  // button: require("./filters/ButtonFilterSet"),
  checkbox: require("./controls/CheckboxSetView")
  // search: require("./filters/SearchFilterSet")
};

module.exports = Backbone.View.extend({

  initialize: function (options) {

    // checkbox display settings
    this.labelStyle = options.labelStyle || "default";
    this.tabIndex = options.tabIndex || "default";

    var data = getScriptData(this.$el);

    var self = this;
    this.filters = $.map(data, function (data, label) {

      var type = data.type;

      var functionName = "create_" + type;

      if (self[functionName]) {
        return self[functionName].call(self, data, label);
      } else {
        return null;
      }

    });

  },

  // create_button: function (data, label) {
  //
  //   // convert each button data to a backbone model
  //   var self = this;
  //   var models = $.map(data.options, function (attributes, id) {
  //     attributes.tabIndex = self.tabIndex.button || "input";
  //     attributes.labelStyle = self.labelStyle;
  //     return new Backbone.Model(attributes);
  //   });
  //
  //   // create a button view
  //   return new Views.button({
  //     label: label,
  //     collection: new Backbone.Collection(models),
  //     vent: this.vent,
  //     hashFilters: this.hashFilters,
  //     useHash: this.useHash
  //   });
  //
  // },
  //
  create_checkbox: function (data, label) {

    var self = this;

    var models = $.map(data.options, function (attributes) {
      attributes.labelStyle = self.labelStyle;
      attributes.tabIndex = self.tabIndex;
      return new Backbone.Model(attributes);
    });

    return new Views.checkbox({
      collection: new Backbone.Collection(models),
      label: label
    });

  },
  //
  // create_search: function (data, label) {
  //
  //   data.tabIndex = this.tabIndex.search || "input";
  //   data.labelStyle = this.labelStyle;
  //
  //   return new Views.search({
  //     label: label,
  //     model: new Backbone.Model(data),
  //     vent: this.vent,
  //     hashFilters: this.hashFilters,
  //     useHash: this.useHash
  //   });
  //
  // },

  render: function (callback) {

    var self = this;
    _.each(this.filters, function (filter) {
      self.$el.append(filter.render().el);
    });

    if (typeof callback == "function") {
      callback();
    }

    return this;

  }

});
