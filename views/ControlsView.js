/* global require: false */
/* global module: false */

var getScriptData = require("get-script-data");

var Views = {
  // button: require("./filters/ButtonFilterSet"),
  checkbox: require("./controls/CheckboxSetView")
  // search: require("./filters/SearchFilterSet")
};

module.exports = Backbone.View.extend({

  initialize: function (options) {

    // checkbox display settings
    this.ui = options.ui || "form";
    this.state = options.state || null;

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

  createCollection: function (options) {

    var self = this;

    var models = $.map(options, function (attributes) {
      attributes.ui = self.ui;
      attributes.tabIndex = self.tabIndex;
      return new Backbone.Model(attributes);
    });

    return new Backbone.Collection(models);

  },

  // create_button: function (data, label) {
  //
  //   // convert each button data to a backbone model
  //   var self = this;
  //   var models = $.map(data.options, function (attributes, id) {
  //     attributes.tabIndex = self.tabIndex.button || "input";
  //     attributes.ui = self.ui;
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

    return new Views.checkbox({
      collection: this.createCollection(data.options),
      label: label
    });

  },
  //
  // create_search: function (data, label) {
  //
  //   data.tabIndex = this.tabIndex.search || "input";
  //   data.ui = this.ui;
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
      if (self.state) self.state.groups.push(filter.groupName);
      self.$el.append(filter.render().el);
    });

    if (typeof callback == "function") {
      callback();
    }

    return this;

  }

});
