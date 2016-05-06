System.register("components/graph/Settings", [], function($__export) {
  "use strict";
  var settings,
      Settings;
  return {
    setters: [],
    execute: function() {
      settings = {
        width: 780,
        height: 680,
        padding: 10,
        size: {
          range: [0, 30],
          domain: [1, 2000000]
        },
        strength: {
          range: [0, 1],
          domain: [1, 160000]
        },
        force: {
          charge: -80,
          gravity: 0.02,
          linkDistance: 60
        },
        zoom: {
          extent: [0.5, 5],
          zoomed: 1.5
        },
        color: d3.scale.category20(),
        info: {priorityKeys: ['Automatic\nclassification', 'number of reads']}
      };
      Settings = function() {
        function Settings() {}
        return ($traceurRuntime.createClass)(Settings, {}, {
          default: function() {
            return settings;
          },
          adapted: function(result) {
            var nodes = result.nodes;
            var connections = result.connections;
            var max = 0;
            Object.keys(nodes).forEach(function(key) {
              if (nodes[key] > max) {
                max = nodes[key];
              }
            });
            var linkMax = 0;
            connections.forEach(function(con) {
              if (con.strength > linkMax) {
                linkMax = con.strength;
              }
            });
            var copy = JSON.parse(JSON.stringify(settings));
            copy.size.domain = [1, max];
            copy.strength.domain = [1, linkMax];
            copy.color = settings.color;
            return copy;
          }
        });
      }();
      $__export("Settings", Settings);
    }
  };
});
