System.register("DataMining/Classification", [], function($__export) {
  "use strict";
  var Classification;
  return {
    setters: [],
    execute: function() {
      Classification = function() {
        function Classification(path) {
          this.path = path;
        }
        return ($traceurRuntime.createClass)(Classification, {
          process: function() {
            return this.readFile(this.path);
          },
          readFile: function(path) {
            var promise = new Promise(function(resolve, reject) {
              if (!path) {
                reject('Wrong path!');
                return;
              } else {
                console.log('path to Classification table', path);
              }
              console.log('reading Classification in async');
              var csv = require('csv');
              var fs = require('fs');
              var parser = csv.parse({
                columns: true,
                delimiter: '\t'
              }, function(err, data) {
                var superClusters = {};
                data.forEach(function(line) {
                  if (superClusters[line.super_cluster] === undefined) {
                    superClusters[line.super_cluster] = new Array();
                  }
                  superClusters[line.super_cluster].push(line);
                });
                resolve(superClusters);
              });
              fs.createReadStream(path).pipe(parser);
            });
            return promise;
          }
        }, {});
      }();
      $__export("Classification", Classification);
    }
  };
});
