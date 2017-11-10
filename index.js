/* global module: false */

module.exports = {

  Container: require("./views/ContainerView"),
  Controls: require("./views/ControlsView"),
  HashState: require("./views/HashStateView"),
  TargetSet: require("./views/TargetSetView"),

  controls: {
    Checkbox: require("./views/controls/CheckboxView"),
    CheckboxSet: require("./views/controls/CheckboxSetView"),
    Clear: require("./views/controls/ClearView"),
    Control: require("./views/controls/ControlView"),
    ControlSet: require("./views/controls/ControlSetView")
  }

};
