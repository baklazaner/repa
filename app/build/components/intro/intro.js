System.register("components/intro/intro", ["angular2/core", "angular2/router", "DataMining/Analyzer", "DataMining/SummaryTable", "DataMining/Classification", "DataMining/SmartPath", "DataMining/Result", "DataMining/RepeatMasker", "DataMining/Blastx"], function($__export) {
  "use strict";
  var remote,
      app,
      dialog,
      electron,
      storage,
      Component,
      View,
      NgZone,
      Router,
      Analyzer,
      SummaryTable,
      Classification,
      SmartPath,
      Result,
      RepeatMasker,
      Blastx,
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
    }, function($__m) {
      RepeatMasker = $__m.RepeatMasker;
    }, function($__m) {
      Blastx = $__m.Blastx;
    }],
    execute: function() {
      remote = require('remote');
      app = remote.require('app');
      dialog = remote.require('dialog');
      electron = require('electron');
      electron.app = app;
      storage = remote.require('electron-json-storage');
      Intro = function() {
        function Intro(zone, router) {
          var $__3 = this;
          console.info('Intro Component Mounted Successfully');
          console.info('user data dir', app.getPath('userData'));
          this.threshold = 0;
          this.zone = zone;
          this.router = router;
          this.loading = false;
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
                $__3.setPath(path);
              });
            });
          },
          selectPath: function(path) {
            console.log('path selected', path);
            this.setPath(path);
          },
          mineData: function(path) {
            var $__3 = this;
            this.updateLoading(true);
            var smartPath = new SmartPath(path);
            var pathToCC = smartPath.getClusterConnectionsPath();
            var pathToSummary = smartPath.getSummaryPath();
            var pathToRM = smartPath.getRMPath();
            var pathToBlastx = smartPath.getBlastxPath();
            if (pathToCC) {
              this.updateHistory(path);
            }
            var analyzer = new Analyzer(pathToCC);
            analyzer.setThreshold(this.threshold);
            var rm = new RepeatMasker(pathToRM);
            var blastx = new Blastx(pathToBlastx);
            Promise.all([analyzer.process(), rm.process(), blastx.process()]).then(function(values) {
              var perResult = Result.getInstance();
              perResult.setSummaryPath(pathToSummary);
              var result = values[0];
              var rmTable = values[1];
              var blastxData = values[2];
              perResult.setDomains(blastxData);
              perResult.setRepeatMasker(rmTable);
              perResult.setResult(result);
              console.log('DataMining', values);
              $__3.updateLoading(false);
              $__3.enableMenu();
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
          },
          setPath: function(path) {
            this.path = path;
          },
          next: function() {
            var $__3 = this;
            console.log('next');
            if (!this.path) {
              return;
            }
            this.loading = true;
            setTimeout(function() {
              $__3.mineData($__3.path);
            }, 10);
          },
          updateLoading: function(value) {
            var $__3 = this;
            this.zone.run(function() {
              $__3.loading = value;
            });
          },
          enableMenu: function() {
            window.dispatch.menu();
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
