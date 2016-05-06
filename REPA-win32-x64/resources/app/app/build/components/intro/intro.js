System.register("components/intro/intro", ["angular2/core", "angular2/router", "DataMining/Analyzer", "DataMining/SummaryTable", "DataMining/Classification", "DataMining/SmartPath", "DataMining/Result"], function($__export) {
  "use strict";
  var remote,
      dialog,
      storage,
      app,
      Component,
      View,
      NgZone,
      Router,
      Analyzer,
      SummaryTable,
      Classification,
      SmartPath,
      Result,
      Intro;
  return {
    setters: [function($__m) {
      Component = $__m.Component;
      View = $__m.View;
      NgZone = $__m.NgZone;
    }, function($__m) {
      Router = $__m.Router;
    }, function($__m) {
      Analyzer = $__m.Analyzer;
    }, function($__m) {
      SummaryTable = $__m.SummaryTable;
    }, function($__m) {
      Classification = $__m.Classification;
    }, function($__m) {
      SmartPath = $__m.SmartPath;
    }, function($__m) {
      Result = $__m.Result;
    }],
    execute: function() {
      remote = require('remote');
      dialog = remote.require('dialog');
      storage = remote.require('electron-json-storage');
      app = remote.require('app');
      Intro = function() {
        function Intro(zone, router) {
          var $__3 = this;
          console.info('Intro Component Mounted Successfully');
          console.info('user data dir', app.getPath('userData'));
          this.threshold = 10;
          this.zone = zone;
          this.router = router;
          this.loading = false;
          this.updateLoading = function(value) {
            $__3.zone.run(function() {
              $__3.loading = value;
            });
          };
          storage.has('history', function(error, hasKey) {
            if (!hasKey) {
              console.log('no history key');
              storage.set('history', {
                history: true,
                paths: []
              }, function(error) {
                if (error)
                  throw error;
              });
            }
          });
          storage.get('history', function(error, data) {
            console.log('history', data);
            if (error)
              throw error;
            $__3.zone.run(function() {
              $__3.history = data;
            });
          });
        }
        return ($traceurRuntime.createClass)(Intro, {
          openDialog: function() {
            var $__3 = this;
            dialog.showOpenDialog({properties: ['openDirectory']}, function(paths) {
              if (!paths) {
                console.warn('No path selected');
                return;
              }
              var path = paths[0];
              console.log('path:', path);
              $__3.zone.run(function() {
                $__3.loading = true;
              });
              $__3.mineData(path);
            });
          },
          selectPath: function(path) {
            console.log('path selected', path);
            this.mineData(path);
          },
          mineData: function(path) {
            var $__3 = this;
            var smartPath = new SmartPath(path);
            var pathToCC = smartPath.getClusterConnectionsPath();
            var pathToST = smartPath.getSummaryTablePath();
            var pathToCLSV = smartPath.getClassificationPath();
            var pathToSummary = smartPath.getSummaryPath();
            console.log('path To CLSV', pathToCLSV);
            if (pathToCC) {
              this.updateHistory(path);
            }
            var summary = new SummaryTable(pathToST);
            var classification = new Classification(pathToCLSV);
            var analyzer = new Analyzer(pathToCC);
            analyzer.setThreshold(this.threshold);
            var perResult = Result.getInstance();
            perResult.setSummaryPath(pathToSummary);
            Promise.all([analyzer.process(), summary.process(), classification.process()]).then(function(values) {
              var result = values[0];
              var clusterInfo = values[1];
              var classification = values[2];
              perResult.setClassification(classification);
              perResult.setResult(result);
              perResult.setClusterInfo(clusterInfo);
              console.log('DataMining', values);
              $__3.updateLoading(false);
              $__3.router.parent.navigate(['Graph']);
              console.log('values', values);
            }).catch(function(error) {
              console.error('Erorr at processing file in Analyzer', error);
              $__3.updateLoading(false);
            });
          },
          updateHistory: function(path) {
            var $__3 = this;
            console.log('updating history');
            var newHistory = {paths: processHistory(path, this.history.paths)};
            storage.set('history', newHistory, function(error) {
              if (error)
                throw error;
            });
            this.zone.run(function() {
              $__3.history = newHistory;
            });
            function processHistory(newPath, paths) {
              if (paths === undefined) {
                return [newPath];
              }
              var index = paths.indexOf(newPath);
              if (index !== -1) {
                moveInArray(paths, index, 0);
              } else {
                paths = [newPath].concat(paths);
              }
              return paths.splice(0, 10);
              function moveInArray(arr, fromIndex, toIndex) {
                var element = arr[fromIndex];
                arr.splice(fromIndex, 1);
                arr.splice(toIndex, 0, element);
              }
            }
          }
        }, {});
      }();
      $__export("Intro", Intro);
      Object.defineProperty(Intro, "annotations", {get: function() {
          return [new Component({
            selector: 'intro',
            templateUrl: 'components/intro/intro.html'
          })];
        }});
      Object.defineProperty(Intro, "parameters", {get: function() {
          return [[NgZone], [Router]];
        }});
    }
  };
});