/* global require: false */
/* global module: false */

var templates = { checkbox: require("../../templates/checkbox.html") };

var Views = {
  Control: require("./ControlView")
};

var CheckboxView = module.exports = Views.Control.extend({

  template: templates.checkbox,

  events: {
    "click .toggle-expand": "toggleExpand"
  },

  toggleExpand: function (e) {

    // toggle icon
    this.toggleIcon.toggleClass("fa-minus-square-o fa-plus-square-o");

    // change icon label
    var find = open ? "Expand" : "Collapse";
    var replace = open ? "Collapse" : "Expand";

    var label = this.toggleIcon.attr("aria-label");
    this.toggleIcon.attr("aria-label", label.replace(find, replace));

    // open child filters
    this.childFilters.toggleClass("open");
    this.childFilters.attr("aria-hidden", !this.childFilters.hasClass("open"));

  },

  /**
   * Sets the parentElement attribute to true if this
   * checkbox if a parent category. Sets to false if this
   * checkbox is a subcategory.
   *
   * This attribute determines whether the expand icon
   * displays or not.
   */
  setParentElementAttr: function () {

    this.children = this.model.get("children");

    if (this.children && this.children.length > 0) {
      this.model.set("parentElement", true);
      this.$el.addClass("parent-level");
      this.open = false;
    } else {
      this.model.set("parentElement", false);
    }

  },

  setCheckedAttr: function () {

    this.model.set("checked", false);

  },

  createChildViews: function () {

    // create child filter views

    // save off icon for later toggling
    this.toggleIcon = this.$el.find(".toggle-expand i");

    // create .child-filters div to store filters in
    this.childFilters = $("<div />")
      .addClass("child-filters")
      .attr("aria-hidden", true);

    this.$el.append(this.childFilters);

    var self = this;

    this.childViews = [];

    $.each(this.children, function (id, child) {

      child.parentElement = false;
      child.ui = self.model.get("ui");

      var model = new Backbone.Model(child);

      var view = new CheckboxView({
        model: model,
        parent: self
      });

      self.childViews.push(view);
      self.childFilters.append(view.render().el);

    });

  },

  render: function () {

    this.setParentElementAttr();
    this.setCheckedAttr();

    Views.Control.prototype.render.call(this);

    if (this.children && this.children.length > 0) {
      this.createChildViews();
    }

    return this;

  }

});
