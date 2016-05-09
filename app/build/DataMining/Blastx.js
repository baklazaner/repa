System.register("DataMining/Blastx", [], function($__export) {
  "use strict";
  var threshold,
      Blastx;
  return {
    setters: [],
    execute: function() {
      require('events').EventEmitter.prototype._maxListeners = 200;
      threshold = 5;
      Blastx = function() {
        function Blastx(path) {
          this.path = path;
        }
        return ($traceurRuntime.createClass)(Blastx, {
          process: function() {
            return this.readFiles(this.path);
          },
          readFiles: function(path) {
            console.log('blastx path', path);
            var promise = new Promise(function(resolve, reject) {
              if (!path) {
                reject('Wrong path!');
                return;
              } else {
                console.log('path to blastx folder', path);
              }
              console.log('reading blastx tables in async');
              var csv = require('csv');
              var fs = require('fs');
              var async = require('async');
              var domains = [];
              fs.readdir(path, function(err, files) {
                console.log('files', files);
                async.eachSeries(files, function(file, callback) {
                  if (file.endsWith('_domains.csv')) {
                    var parser = csv.parse({
                      columns: true,
                      delimiter: '\t'
                    }, function(err, data) {
                      domains[nameToIndex(file) - 1] = filterLine(data);
                    });
                    fs.createReadStream(path + '/' + file).pipe(parser);
                  }
                  async.setImmediate(function() {
                    callback(null);
                  });
                }, function done() {
                  console.log('blastx done');
                  console.log('domains', domains);
                  resolve(domains);
                });
              });
              function nameToIndex(name) {
                return parseInt(name.substring(2), 10);
              }
              function filterLine(data) {
                var filtered;
                if (data.length === 1 && data[0].x === 'no hits') {
                  filtered = undefined;
                } else {
                  filtered = data;
                }
                return filtered;
              }
            });
            return promise;
          }
        }, {});
      }();
      $__export("Blastx", Blastx);
    }
  };
});
