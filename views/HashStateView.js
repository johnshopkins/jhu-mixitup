/* global require: false */
/* global module: false */

var $ = require("../shims/jquery");
var Backbone = require("../shims/backbone");

module.exports = Backbone.View.extend({

  initialize: function (options) {

    this.dispatcher = options.dispatcher;
    this.groups = {};

  },

  ready: function () {

    this.state = this.deserializeHash();
    this.filterMixerByGroupsState();

  },

  /**
   * Deserializes a hash segment (if present) into in an object.
   * @return {object|null}
   */
  deserializeHash: function () {

    var hash = window.location.hash;

    if (!hash.match(/^#\!/)) return null; // named anchor

    hash = window.location.hash.replace(/^#!\//g, "");
    if (!hash) return null;

    var obj = {};
    var groups = [];

    groups = hash.split("&");

    groups.forEach(function(group) {
      var pair = group.split("=");
      var groupName = pair[0];
      var selected = pair[1];

      if (selected) {
        obj[groupName] = selected.split(",");
      }

    });

    return obj;
  },

  /**
   * Serializes a groupsState object into a string.
   *
   * @param   {object}    groupsState
   * @return  {string}
   */

  serializeGroupsState: function (groupsState) {

    var output = '';

    for (var key in groupsState) {
      var values = groupsState[key];

      if (!values.length) continue;

      output += key + '=';
      output += values.join(',');
      output += '&';
    }

    output = output.replace(/&$/g, '');

    return output;

  },

  /**
   * Filters the mixer and updates the multifilter UI
   * @param  {boolean}        [animate]
   * @return {Promise}
   */
  filterMixerByGroupsState: function (animate) {

    if (!this.state) return;

    var self = this;

    $.each(this.groups, function (group, settings) {

      // get active filters on this group
      var active = self.state[group] || [];

      // hook into when a filter group is filtered
      self.dispatcher.trigger("filter:init:" + group, active);

      if (settings.mixed) {
        // set active filters on the mixer
        self.mixer.setFilterGroupSelectors(group, active.map(self.getSelectorFromValue));
      }

    });

    return this.mixer.parseFilterGroups(animate ? true : false);

  },

  /**
   * Get the currently active filters on each control group
   * @return {object}
   */
  getGroupsState: function () {

    var self = this;
    var states = {};

    $.each(this.groups, function (group, settings) {

      var selectors = settings.mixed ? self.mixer.getFilterGroupSelectors(group) : settings.selector;

      if (!selectors) {
        // if a group is not controlled by mixitup AND it hasn't been set yet
        selectors = [];
      }

      states[group] = selectors.map(self.getValueFromSelector);

    });

    return states;

  },

  setHash: function (state) {

    // Construct an object representing the current state of each filter group
    var groupsState = this.getGroupsState();

    // Create a URL hash string by serializing the groupsState object
    var serialized = this.serializeGroupsState(groupsState);
    var newHash = "#!/" + serialized;

    if (serialized && newHash !== window.location.hash) {
      // set new hash
      history.pushState(null, document.title, window.location.pathname + newHash);
    } else if (!serialized) {
      // no filters selected, remove hash
      history.pushState(null, document.title, window.location.pathname);
    } else {
      // leave the hash alone - page just initialized
    }

  },

  getValueFromSelector: function (selector) {
    return selector.replace(/^./, "");
  },

  getSelectorFromValue: function (value) {
    return "." + value;
  }

});
