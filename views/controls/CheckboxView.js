/* global require: false */
/* global module: false */
/* global logger: false */

var templates = { checkbox: require("../../templates/checkbox.html") };

var CheckboxView = module.exports = Backbone.View.extend({

  template: templates.checkbox,
  className: "filter",

  initialize: function () {

    // // add icon click event
    // this.events["click .toggle-expand"] = "iconClick";
    //
    // if (this.model.get("tabIndex") === "label") {
    //   this.events["click label button"] = "buttonClick";
    // }

  },

  // iconClick: function (e) {
  //
  //   e.preventDefault();
  //
  //   this.toggleIcon.toggleClass("fa-minus-square-o fa-plus-square-o");
  //   this.childFilters.toggleClass("open");
  //
  //   var newScreenReaderText;
  //
  //   if (this.childFilters.hasClass("open")) {
  //     this.childFilters.removeAttr("aria-hidden");
  //     newScreenReaderText = this.screenReaderText.text().replace("Expand", "Collapse");
  //     this.screenReaderText.text(newScreenReaderText);
  //   } else {
  //     this.childFilters.attr("aria-hidden", true);
  //     newScreenReaderText = this.screenReaderText.text().replace("Collapse", "Expand");
  //     this.screenReaderText.text(newScreenReaderText);
  //   }
  //
  // },
  //
  // /**
  //  * Essentially the same thing as onChange,
  //  * but this function reacts to the clicking
  //  * (or tabbing to and activating) of the label.
  //  */
  // buttonClick: function (e) {
  //
  //   e.stopPropagation();
  //
  //   var checked = this.input.prop("checked");
  //
  //   if (checked) {
  //     this.input.prop("checked", false);
  //     this.deactivateFilter();
  //   } else {
  //     this.input.prop("checked", true);
  //     this.activateFilter();
  //   }
  //
  // },

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
    this.screenReaderText = this.$el.find(".toggle-expand .visuallyhidden");

    // create .child-filters div to store filters in
    this.childFilters = $("<div />")
      .addClass("child-filters")
      .attr("aria-hidden", true);

    this.$el.append(this.childFilters);

    var self = this;

    this.childViews = [];

    $.each(this.children, function (id, child) {

      child.parentElement = false;
      child.tabIndex = self.model.get("tabIndex");
      child.labelStyle = self.model.get("labelStyle");

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

    this.model.set("uniqueId", this.cid);
    this.$el.append(this.template(this.model.toJSON()));

    if (this.children && this.children.length > 0) {
      this.createChildViews();
    }

    return this;

  }

});
