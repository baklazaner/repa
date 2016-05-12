System.register("DataMining/Result", [], function($__export) {
  "use strict";
  var domainHitsThreshold,
      ResultData,
      GraphData,
      Result;
  return {
    setters: [],
    execute: function() {
      domainHitsThreshold = 10;
      ResultData = function() {
        function ResultData() {}
        return ($traceurRuntime.createClass)(ResultData, {}, {});
      }();
      GraphData = function() {
        function GraphData() {}
        return ($traceurRuntime.createClass)(GraphData, {}, {});
      }();
      Result = function() {
        function Result() {
          console.log('creating instance of Results');
          this.result = new ResultData();
          this.graph = new GraphData();
          this.clusterInfo;
          this.summaryPath;
          this.superClusters = [];
          this.classification;
          this.repeatMasker;
          this.domains;
          this.sortedDomains;
          this.domainsByLineage;
        }
        return ($traceurRuntime.createClass)(Result, {
          setResult: function(result) {
            console.log('setting result', result);
            this.result.connections = result.connections;
            this.result.nodes = result.nodes;
            this.result.clusters = result.clusters;
            this.superClusters = toSuperClusters(result.clusters);
            function toSuperClusters(clusters) {
              var r = [];
              clusters.forEach(function(cluster) {
                r.push({clusters: cluster});
              });
              return r;
            }
          },
          getResult: function() {
            return this.result;
          },
          setClassification: function(classification) {
            console.log('setting classification', classification);
            this.classification = classification;
          },
          setClusterInfo: function(clusterInfo) {
            var $__5 = this;
            var filtered = {};
            Object.keys(clusterInfo).forEach(function(cluster) {
              var info = clusterInfo[cluster];
              filtered[cluster] = [];
              Object.keys(info).forEach(function(key) {
                if (info[key] != "0" && info[key] != "") {
                  filtered[cluster].push({
                    key: key,
                    value: info[key]
                  });
                }
              });
              var index = parseInt(info['Super\ncluster'], 10) - 1;
              if ($__5.superClusters[index] === undefined) {
                $__5.superClusters[index] = {
                  classification: $__5.classification[index + 1],
                  clusters: []
                };
              }
              $__5.superClusters[index].clusters.push({
                name: info.cluster,
                size: info['number of reads']
              });
            });
            console.log('filtered', filtered);
            console.log('superClusters', this.superClusters);
            this.result.clusters = this.superClusters;
            this.clusterInfo = filtered;
          },
          getClusterInfo: function() {
            return this.clusterInfo;
          },
          getSuperClusters: function() {
            return this.superClusters;
          },
          getGraphData: function() {
            var $__5 = this;
            if (this.graph.nodes === undefined || this.graph.links === undefined) {
              var nodes = this.result.nodes;
              var nodeOrder = {};
              this.graph.nodes = [];
              this.graph.links = [];
              var nodeToCluster = convertClusters(this.result.clusters);
              var i = 0;
              for (var name in nodes) {
                var group = nodeToCluster[name];
                if (group !== undefined) {
                  this.graph.nodes.push({
                    name: name,
                    size: nodes[name],
                    group: group,
                    info: this.clusterInfo ? this.clusterInfo[name] : undefined,
                    repeatMasker: this.repeatMasker[group],
                    domains: this.domains ? this.domains[group] : undefined,
                    sortedDomains: this.sortedDomains[group],
                    fixed: false
                  });
                  nodeOrder[name] = i;
                  i++;
                }
              }
              this.result.connections.forEach(function(con) {
                if (nodeOrder[con.node2] === undefined || nodeOrder[con.node1] === undefined) {
                  return;
                }
                $__5.graph.links.push({
                  source: nodeOrder[con.node1],
                  target: nodeOrder[con.node2],
                  value: con.strength,
                  group: nodeToCluster[con.node1],
                  weight: 1
                });
              });
            }
            return this.graph;
            function convertClusters(clusters) {
              var nameToCluster = {};
              var counter = 0;
              clusters.forEach(function(cluster) {
                cluster.forEach(function(node) {
                  nameToCluster[node.name] = counter;
                });
                counter++;
              });
              return nameToCluster;
            }
          },
          setSummaryPath: function(path) {
            this.summaryPath = path;
          },
          getSummaryPath: function() {
            return this.summaryPath;
          },
          setRepeatMasker: function(data) {
            this.repeatMasker = data;
          },
          getRepeatMasker: function() {
            return this.repeatMasker;
          },
          setDomains: function(data) {
            var _ = require('underscore');
            var sortedDomains = [];
            var domainsByLineage = [];
            data.forEach(function(domains) {
              var res = undefined;
              if (domains !== undefined) {
                res = _.chain(domains).groupBy(function(d) {
                  return d.Domain + '#' + d.Lineage;
                }).map(function(d) {
                  var hits = _.reduce(d, function(memo, obj) {
                    return memo + parseInt(obj.Hits, 10);
                  }, 0);
                  if (hits >= domainHitsThreshold) {
                    return {
                      Domain: d[0].Domain,
                      Lineage: d[0].Lineage,
                      Hits: hits
                    };
                  } else {
                    return null;
                  }
                }).without(null).value();
                domainsByLineage.push(_.groupBy(res, 'Lineage'));
              } else {
                domainsByLineage.push(undefined);
              }
              sortedDomains.push(res);
            });
            console.log('sortedDomains', sortedDomains);
            console.log('domainsByLineage', domainsByLineage);
            this.domains = data;
            this.sortedDomains = sortedDomains;
            this.domainsByLineage = domainsByLineage;
          },
          getDomains: function() {
            return this.domains;
          },
          getSortedDomains: function() {
            return this.sortedDomains;
          },
          getDomainsByLineage: function() {
            return this.domainsByLineage;
          },
          getSpecificLineage: function(n) {
            var value = this.domainsByLineage[n];
            if (!value) {
              return value;
            }
            return Object.keys(value).map(function(key) {
              return value[key];
            });
          }
        }, {getInstance: function() {
            if (!Result.instance) {
              Result.instance = new Result();
            }
            return Result.instance;
          }});
      }();
      $__export("Result", Result);
    }
  };
});
