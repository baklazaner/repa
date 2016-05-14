System.register("DataMining/Validation", [], function($__export) {
  "use strict";
  var Validation;
  return {
    setters: [],
    execute: function() {
      Validation = function() {
        function Validation(result) {
          this.result = result;
        }
        return ($traceurRuntime.createClass)(Validation, {
          validate: function(className, cluster) {
            if (className === 'LTR/Copia') {
              console.log('validating Copia');
              return this.validateByModel(cluster, ['GAG', 'PROT', 'INT', 'RT', 'RH']);
            }
            if (className === 'LTR/Gypsy') {
              console.log('validating Gypsy');
              return this.validateByModel(cluster, ['GAG', 'PROT', 'RT', 'RH', 'INT']);
            }
            return null;
          },
          validateByModel: function(cluster, model, startNode) {
            var $__3 = this;
            var isValid = false;
            var modelIndex = 0;
            var node;
            var found = false;
            var clusterLength = cluster.length;
            if (startNode === undefined) {
              for (var i = 0; i < clusterLength; i++) {
                node = cluster[i];
                var lineage = this.result.getSpecificLineage(node.clIndex - 1);
                if (lineage) {
                  var domains = lineage[0];
                  checkDomain(domains);
                  if (found === true) {
                    clusterLength = 0;
                    console.log('found in', node);
                    console.log('modelIndex', modelIndex);
                  }
                } else {
                  console.log('node has no lineage');
                }
              }
              if (!found) {
                return unsuccessful();
              }
            } else {
              console.log('starting at', startNode);
              node = startNode;
            }
            console.log('node', node);
            found = false;
            node.links.forEach(function(link) {
              if (found) {
                return;
              }
              console.log('looking in neighbour');
              var closest = link.to;
              var domains = $__3.result.getSpecificLineage(closest.clIndex - 1)[0];
              checkDomain(domains);
              if (found) {
                console.log('found in neighbour');
                node = closest;
              }
            });
            if (!found) {
              return unsuccessful();
            }
            if (isValid) {
              return successful();
            }
            console.log('continue');
            var newModel = model.filter(function(e, i) {
              return i >= modelIndex;
            });
            return this.validateByModel(cluster, newModel, node);
            function checkDomain(domains) {
              var simpleDomains = domains.map(function(d) {
                return d.Domain;
              });
              console.log('simpleDomains', simpleDomains);
              var length = simpleDomains.length;
              for (var j = 0,
                  l = 0; j < length * length; j++, l = j % length) {
                var lookingFor = model[modelIndex];
                if (lookingFor === simpleDomains[l].substring(4)) {
                  console.log('found', lookingFor);
                  modelIndex++;
                  found = true;
                  if (modelIndex === (model.length)) {
                    console.warn('~~~ MODEL VALID ~~~');
                    isValid = true;
                    ;
                    return true;
                  }
                }
              }
            }
            function unsuccessful() {
              return {
                reason: 'Can\'t find ' + model[modelIndex] + ' in order',
                valid: false
              };
            }
            function successful() {
              return {valid: true};
            }
          }
        }, {});
      }();
      $__export("Validation", Validation);
    }
  };
});
