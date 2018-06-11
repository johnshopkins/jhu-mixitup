/* global require: false */
/* global module: false */

var $ = require("../../shims/jquery");
var Backbone = require("../../shims/backbone");

var Views = {
  Checkbox: require("./CheckboxView"),
  ControlSet: require("./ControlSetView")
};

module.exports = Views.ControlSet.extend({

  view: Views.Checkbox

});
