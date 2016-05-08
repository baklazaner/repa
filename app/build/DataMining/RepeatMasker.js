System.register("DataMining/RepeatMasker", [], function($__export) {
  "use strict";
  var threshold,
      RepeatMasker;
  return {
    setters: [],
    execute: function() {
      threshold = 5;
      RepeatMasker = function() {
        function RepeatMasker(path) {
          this.path = path;
        }
        return ($traceurRuntime.createClass)(RepeatMasker, {
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
                    clusterRm.hits = filterLine(line, clusterRm.size);
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
            function filterLine(line, size) {
              var reserved = ['class/fammily ', 'All_Reads_Length', 'All_Reads_Number'];
              var filtered = [];
              Object.keys(line).forEach(function(key) {
                if (reserved.indexOf(key) < 0) {
                  var value = parseInt(line[key].trim(), 10);
                  var percentage = value / size * 100;
                  if (value > 0 && percentage > threshold) {
                    filtered.push({
                      key: key,
                      value: value,
                      percentage: percentage
                    });
                  }
                }
              });
              return filtered;
            }
          }
        }, {});
      }();
      $__export("RepeatMasker", RepeatMasker);
    }
  };
});
