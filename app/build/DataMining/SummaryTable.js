System.register("DataMining/SummaryTable", [], function($__export) {
  "use strict";
  var SummaryTable;
  return {
    setters: [],
    execute: function() {
      SummaryTable = function() {
        function SummaryTable(path) {
          this.path = path;
        }
        return ($traceurRuntime.createClass)(SummaryTable, {
          process: function() {
            return this.readFile(this.path);
          },
          readFile: function(path) {
            var promise = new Promise(function(resolve, reject) {
              if (!path) {
                reject('Wrong path!');
                return;
              } else {
                console.log('path to summary table', path);
              }
              console.log('reading Summary Table in async');
              var csv = require('csv');
              var fs = require('fs');
              var parser = csv.parse({
                columns: true,
                delimiter: '\t'
              }, function(err, data) {
                console.log('STdata', data);
                var clusterInfo = {};
                data.forEach(function(cluster) {
                  clusterInfo[cluster.cluster] = cluster;
                });
                resolve(clusterInfo);
              });
              fs.createReadStream(path).pipe(parser);
            });
            return promise;
          }
        }, {});
      }();
      $__export("SummaryTable", SummaryTable);
    }
  };
});
