/* global require: false */
/* global module: false */

var Views = {
  Checkbox: require("./CheckboxView"),
  ControlSet: require("./ControlSetView")
};

module.exports = Views.ControlSet.extend({

  view: Views.Checkbox

});
