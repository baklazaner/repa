System.register("DataMining/SmartPath", [], function($__export) {
  "use strict";
  var SmartPath;
  return {
    setters: [],
    execute: function() {
      SmartPath = function() {
        function SmartPath(path) {
          this.shell = require('shelljs');
          this.path = path;
        }
        return ($traceurRuntime.createClass)(SmartPath, {
          getAnyFilePath: function(filename) {
            return this.shell.find(this.path).filter(function(file) {
              return file.match(filename);
            })[0].toString();
          },
          getClusterConnectionsPath: function() {
            return this.shell.find(this.path).filter(function(file) {
              return file.match(/clusterConnections.txt/);
            }).toString();
          },
          getSummaryTablePath: function() {
            return this.getAnyFilePath(/CLUSTER_ANNOTATION_SUMMARY_TABLE.csv/);
          },
          getClassificationPath: function() {
            return this.getAnyFilePath(/automatic_classification.csv/);
          },
          getSummaryPath: function() {
            return this.getAnyFilePath(/summary$/);
          },
          getRMPath: function() {
            return this.getAnyFilePath(/RM_output_tablesummary.csv/);
          },
          getBlastxPath: function() {
            return this.getAnyFilePath(/seqClust\/clustering\/blastx$/);
          }
        }, {});
      }();
      $__export("SmartPath", SmartPath);
    }
  };
});
