System.register("DataMining/Analyzer", [], function($__export) {
  "use strict";
  var Node2,
      Link2,
      Cluster2,
      Analyzer;
  return {
    setters: [],
    execute: function() {
      Node2 = function() {
        function Node2(name) {
          this.name = name;
          this.clIndex = Node2.nameToIndex(name);
          this.links = new Array();
          this.visited = false;
        }
        return ($traceurRuntime.createClass)(Node2, {linkTo: function(strength, node) {
            this.links.push(new Link2(strength, node));
          }}, {
          nameToIndex: function(clName) {
            return parseInt(clName.substring(2), 10);
          },
          createPair: function(nodeName1, nodeName2, strength) {
            var node1 = new Node2(nodeName1);
            var node2 = new Node2(nodeName2);
            node1.linkTo(strength, node2);
            node2.linkTo(strength, node1);
            return [node1, node2];
          }
        });
      }();
      Link2 = function() {
        function Link2(strength, toNode) {
          this.strength = strength;
          this.to = toNode;
        }
        return ($traceurRuntime.createClass)(Link2, {}, {});
      }();
      Cluster2 = function() {
        function Cluster2() {
          this.list = [];
        }
        return ($traceurRuntime.createClass)(Cluster2, {
          addPair: function(name1, name2, strength) {
            var node1;
            var node2;
            this.list.forEach(function(node) {
              if (node.name === name1) {
                node1 = node;
              }
              if (node.name === name2) {
                node2 = node;
              }
            });
            if (node1 !== undefined && node2 !== undefined) {
              node1.linkTo(strength, node2);
              node2.linkTo(strength, node1);
            } else if (node1 === undefined && node2 !== undefined) {
              var nd1 = new Node2(name1);
              nd1.linkTo(strength, node2);
              node2.linkTo(strength, nd1);
              this.list.push(nd1);
            } else if (node1 !== undefined && node2 === undefined) {
              var nd2 = new Node2(name2);
              nd2.linkTo(strength, node1);
              node1.linkTo(strength, nd2);
              this.list.push(nd2);
            } else if (node1 === undefined && node2 === undefined) {
              var pair = Node2.createPair(name1, name2, strength);
              this.list.push(pair[0]);
              this.list.push(pair[1]);
            } else {
              console.error('Unexpected state when adding pair!');
            }
          },
          each: function(nodeFnx, clusterFnx) {
            var cluster = [];
            console.info('cluster each');
            if (nodeFnx === undefined) {}
            this.list.forEach(function(node) {
              if (node.visited === false) {
                cluster = [];
                step(node);
                clusterFnx ? clusterFnx(cluster) : '';
              }
            });
            function step(node) {
              node.visited = true;
              nodeFnx ? nodeFnx(node) : '';
              cluster.push(node);
              node.links.forEach(function(link) {
                var linkedNode = link.to;
                if (linkedNode.visited !== true) {
                  step(linkedNode);
                }
              });
            }
            this.list.forEach(function(node) {
              node.visited = false;
            });
          },
          printList: function() {
            var print = '';
            this.list.forEach(function(node) {
              print += 'node ' + node.name + '\t links[';
              node.links.forEach(function(link) {
                print += link.to.name + ',';
              });
              print += ']\n';
            });
            return print;
          }
        }, {});
      }();
      Analyzer = function() {
        function Analyzer(path) {
          console.log('Analyzer is getting ready');
          this.limit = 200;
          this.path = path;
          this.threshold = 10;
        }
        return ($traceurRuntime.createClass)(Analyzer, {
          setClusterLimit: function(limit) {
            this.limit = limit;
          },
          findoutClusterLimit: function() {
            if (!this.clusterFolder)
              return;
            var fs = require('fs');
            this.limit = fs.readdirSync(this.clusterFolder).length;
            console.log('Cluster limit:', this.limit);
            return this.limit;
          },
          setClusterPath: function(path) {
            this.clusterFolder = path;
          },
          setThreshold: function(t) {
            console.log('Analyzer setting threshold', t);
            this.threshold = t;
          },
          process: function() {
            return this.readFile(this.path);
          },
          readFile: function(path) {
            var $__6 = this;
            var limit = this.limit;
            var threshold = this.threshold;
            var connections = [];
            var nodes = {};
            var cluster = new Cluster2();
            var options = this.options;
            var promise = new Promise(function(resolve, reject) {
              if (!path) {
                reject('Wrong path!');
                return;
              }
              console.log('reading file async:', path);
              var lineReader = require('readline').createInterface({input: require('fs').createReadStream($__6.path)});
              lineReader.on('line', processLine);
              lineReader.on('close', function() {
                var clusters = [];
                cluster.each(undefined, function(c) {
                  clusters.push(c);
                });
                resolve({
                  connections: connections,
                  nodes: nodes,
                  clusters: clusters
                });
              });
            });
            function processLine(line) {
              var connection = line.split(' ');
              var strength = parseInt(connection[2], 10);
              var node1 = connection[0];
              var node2 = connection[1];
              if (strength > threshold) {
                if (node1 !== node2) {
                  cluster.addPair(node1, node2, strength);
                  connections.push({
                    node1: node1,
                    node2: node2,
                    strength: strength
                  });
                } else {
                  if (strength > 10) {
                    var id = Node2.nameToIndex(node1);
                    if (id <= limit) {
                      nodes[node1] = strength;
                    }
                  }
                }
              }
            }
            return promise;
          }
        }, {});
      }();
      $__export("Analyzer", Analyzer);
    }
  };
});
