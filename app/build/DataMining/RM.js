System.register("DataMining/RM", [], function($__export) {
  "use strict";
  var RepeatMarker;
  return {
    setters: [],
    execute: function() {
      RepeatMarker = function() {
        function RepeatMarker(path) {
          this.path = path;
        }
        return ($traceurRuntime.createClass)(RepeatMarker, {
          process: function() {
            return this.readFile(this.path);
          },
          readFile: function(path) {
            var promise = new Promise(function(resolve, reject) {
              if (!path) {
                reject('Wrong path!');
                return;
              } else {
                console.log('path to RM summary table', path);
              }
              console.log('reading RM summary in async');
              var csv = require('csv');
              var fs = require('fs');
              var parser = csv.parse({
                columns: true,
                delimiter: '\t'
              }, function(err, data) {
                var rm = [];
                var clusterRm = {};
                data.forEach(function(line, i) {
                  var index = i % 3;
                  if (index === 0) {
                    clusterRm = {};
                    clusterRm.size = parseInt(line.All_Reads_Number.trim(), 10);
                    clusterRm.hits = filterLine(line);
                  } else if (index === 1) {} else if (index === 2) {
                    rm.push(clusterRm);
                  }
                });
                console.log('RM data', rm);
                resolve(rm);
              });
              fs.createReadStream(path).pipe(parser);
            });
            return promise;
            function filterLine(line) {
              var reserved = ['class/fammily ', 'All_Reads_Length', 'All_Reads_Number'];
              var filtered = {};
              Object.keys(line).forEach(function(key) {
                if (reserved.indexOf(key) < 0) {
                  var value = parseInt(line[key].trim(), 10);
                  if (value > 0) {
                    filtered[key] = value;
                  }
                }
              });
              return filtered;
            }
          }
        }, {});
      }();
      $__export("RepeatMarker", RepeatMarker);
    }
  };
});
