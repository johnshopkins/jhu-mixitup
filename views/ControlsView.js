/* global require: false */
/* global module: false */

var getScriptData = require("get-script-data");

var Views = {
  // button: require("./filters/ButtonFilterSet"),
  CheckboxSet: require("./controls/CheckboxSetView")
  // SearchSet: require("./controls/SearchSetView")
};

module.exports = Backbone.View.extend({

  initialize: function (options) {

    this.dispatcher = options.dispatcher;
    this.state = options.state || null;
    this.ui = options.ui || "form";
    this.onRender = typeof options.onRender == "function" ? options.onRender : null;

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

    var options = this.getDefaultOptions(label);
    options.collection = this.createCollection(data.options);

    return new Views.CheckboxSet(options);

  },

  getDefaultOptions: function (label) {

    return {
      label: label,
      dispatcher: this.dispatcher
    };

  },

  render: function () {

    var self = this;

    $.each(getScriptData(this.$el), function (label, data) {

      var type = data.type;
      var functionName = "create_" + type;

      if (!self[functionName]) return this;

      var view = self[functionName].call(self, data, label);

      if (self.state) self.state.groups.push(view.groupName);
      self.$el.append(view.render().el);

    });

    if (this.onRender) this.onRender();

    return this;

  }

});
