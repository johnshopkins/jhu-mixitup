/* global require: false */
/* global module: false */

var getScriptData = require("get-script-data");

var Views = {
  CheckboxSet: require("./controls/CheckboxSetView"),
  Clear: require("./controls/ClearView"),
  ControlsToggle: require("./ControlsToggleView")
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

  renderToggle: function () {

    var self = this;

    var toggle = new Views.ControlsToggle({ dispatcher: this.dispatcher });
    this.$el.append(toggle.render().el);

    this.listenTo(toggle, "form:display:toggle", function () {
      self.form.toggleClass("closed");
    });

  },

  renderForm: function () {

    var self = this;

    // render each item in the form
    $.each(getScriptData(this.$el), function (label, data) {

      var type = data.type;
      var functionName = "create_" + type;

      if (!self[functionName]) return this;

      var view = self[functionName].call(self, data, label);

      if (self.state) self.state.groups.push(view.groupName);
      self.form.append(view.render().el);

    });

  },

  renderClearButton: function () {

    var clear = new Views.Clear();
    this.form.append(clear.render().el);

  },

  render: function () {

    var self = this;

    // create the form
    this.form = $("<form />").addClass("closed");

    this.renderToggle();
    this.renderForm();
    this.renderClearButton();

    // append the form
    this.$el.append(this.form);

    if (this.onRender) this.onRender();

    return this;

  }

});
