System.register("components/graph/GraphView", ["angular2/core", "angular2/common", "components/graph/Graph", "DataMining/Result", "components/graph/Settings"], function($__export) {
  "use strict";
  var Component,
      Directive,
      AfterViewInit,
      NgZone,
      ViewChild,
      NgStyle,
      Graph,
      Result,
      Settings,
      GraphView;
  return {
    setters: [function($__m) {
      Component = $__m.Component;
      Directive = $__m.Directive;
      AfterViewInit = $__m.AfterViewInit;
      NgZone = $__m.NgZone;
      ViewChild = $__m.ViewChild;
    }, function($__m) {
      NgStyle = $__m.NgStyle;
    }, function($__m) {
      Graph = $__m.Graph;
    }, function($__m) {
      Result = $__m.Result;
    }, function($__m) {
      Settings = $__m.Settings;
    }],
    execute: function() {
      GraphView = function() {
        function GraphView(zone) {
          var $__4 = this;
          var result = Result.getInstance();
          console.log('initiating graph view');
          this.zone = zone;
          this.extended = false;
          this.groups = result.getSuperClusters();
          this.info = result.getClusterInfo();
          this.color = Settings.default().color;
          window.dispatch = d3.dispatch('unfocus', 'focus');
          window.dispatch.on('unfocus.view', function() {
            console.log('unfocusing');
          });
          window.dispatch.on('focus.view', function(clusterIndex) {
            console.log('focusing', clusterIndex);
            $__4.zone.run(function() {
              $__4.superCluster = $__4.groups[clusterIndex];
              console.log('superCluster', $__4.superCluster);
              $__4.extended = true;
            });
          });
        }
        return ($traceurRuntime.createClass)(GraphView, {
          focus: function(clusterIndex) {
            console.log('focusing cluster @', clusterIndex);
            this.inDetail = false;
            window.dispatch.focus(clusterIndex);
            window.scrollTo(0, 0);
          },
          reset: function() {
            window.dispatch.unfocus();
            this.extended = false;
          },
          ngAfterViewInit: function() {
            console.log('done');
            console.log(this.mydear);
          },
          back: function() {
            this.inDetail = false;
          },
          detail: function(clusterN) {
            console.log('Showing detail about', clusterN);
            var settings = Settings.default();
            var result = Result.getInstance();
            var clusterInfo = result.getClusterInfo();
            var summaryPath = result.getSummaryPath();
            console.log('summary path', result.getSummaryPath());
            var prefix = clusterN.substring(0, 2);
            var postfix = clusterN.substring(2, clusterN.length);
            var numberOfZeros = 4;
            var format = prefix + ('0'.repeat(numberOfZeros - postfix.length)) + postfix;
            console.log('format', format);
            this.imgSrc = summaryPath + '/' + format + '/graphLayout.png';
            var index = postfix - 1;
            this.name = clusterN;
            this.detailInfo = filterDetailInfo(clusterN);
            this.repeatMasker = result.getRepeatMasker()[index].hits;
            this.domains = result.getDomains()[index];
            this.sortedDomains = result.getSortedDomains()[index];
            this.domainsByLineage = result.getSpecificLineage(index);
            console.log('maxHits', this.maxHits);
            console.log('domainsByLineage', this.domainsByLineage);
            if (this.domainsByLineage && this.domainsByLineage[0]) {
              this.maxHits = this.domainsByLineage[0][0].Hits;
              console.log('max hits', this.maxHits);
            }
            this.inDetail = true;
            function filterDetailInfo(clusterN) {
              if (!clusterInfo)
                return;
              var detailInfo = clusterInfo[clusterN];
              console.log('detail info', detailInfo);
              return detailInfo.filter(function(info) {
                return settings.info.detailKeys.indexOf(info.key) >= 0;
              });
            }
          },
          bgColor: function(i) {
            if (i % 2) {
              return 'white';
            } else {
              return '#EEE';
            }
          },
          barWidth: function(hits) {
            return (hits / this.maxHits * 430) + 'px';
          }
        }, {});
      }();
      $__export("GraphView", GraphView);
      Object.defineProperty(GraphView, "annotations", {get: function() {
          return [new Component({
            selector: 'graph-view',
            directives: [Graph, NgStyle],
            template: "\n        <h2>Graph View</h2>\n        <div class=\"left\">\n            <graph [hidden]=\"inDetail\">\n                <button [hidden]=\"!extended\" (click)=\"reset()\" id=\"back\" > Back </button>\n            </graph>\n            <div [hidden]=\"!inDetail\" class=\"detail\">\n                <button (click)=\"back()\">Back</button>\n                <h3 *ngIf=\"inDetail\" >{{name}} Detail</h3>\n                <img src=\"{{imgSrc}}\" alt=\"cluster layout \"/>\n                <h3>Summary</h3>\n                <table>\n                    <tr *ngFor=\"#info of detailInfo; #i = index\" [ngStyle]=\"{'background-color':bgColor(i) }\">\n                        <td class=\"key\">{{info.key}}</td><td>{{info.value}}</td>\n                    </tr>\n                </table>\n                <h3>Summary of RepeatMasker hits</h3>\n                <table>\n                    <thead>\n                        <tr>\n                            <td>Class.Family</td><td>hits</td><td>hits[%]</td>\n                        </tr>\n                    </thead> \n                    <tbody>   \n                        <tr *ngFor=\"#rm of repeatMasker; #i = index\" [ngStyle]=\"{'background-color':bgColor(i) }\">\n                            <td>{{rm.key}}</td><td>{{rm.value}}</td><td>{{rm.percentage | number:'.1' }}</td>\n                        </tr>\n                    </tbody>\n                </table>\n                <div *ngIf=\"sortedDomains != undefined\">\n                    <h3>Total number of similarity hits for each lineage</h3>\n                    <table class=\"lineage\">\n                        <thead>\n                            <tr><td>Lineage</td><td><span class=\"domain-name\">Domain</span>Hits</td></tr>\n                        </thead>\n                        <tr *ngFor=\"#lineage of domainsByLineage\">\n                            <td width=\"20%\">{{lineage[0].Lineage}}</td>\n                            <td width=\"80%\">\n                                <ul>\n                                    <li *ngFor=\"#entry of lineage\"><span class=\"domain-name\">{{entry.Domain}}</span><span>{{entry.Hits}}</span><span class=\"bar\" [ngStyle]=\"{'width': barWidth(entry.Hits) }\"></span></li>\n                                </ul>\n                            </td>\n                        </tr>\n                    </table>\n                </div>\n                <div *ngIf=\"domains != undefined\">\n                    <h3>Summary of TE domain hits from blastx</h3>\n                    <table>\n                        <thead>\n                            <tr>\n                                <td>Domain</td>\n                                <td>ID</td>\n                                <td>Type</td>\n                                <td>Lineage</td>\n                                <td>Hits</td>\n                                <td>MeanScore</td>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            <tr *ngFor=\"#domain of domains;  #i = index\" [ngStyle]=\"{'background-color':bgColor(i) }\">\n                                <td>{{domain.Domain}}</td>\n                                <td>{{domain.ID}}</td>\n                                <td>{{domain.Type}}</td>\n                                <td>{{domain.Lineage}}</td>\n                                <td>{{domain.Hits}}</td>\n                                <td>{{domain.MeanScore}}</td>\n                            </tr>\n                        </tbody>\n                    </table>\n                </div>\n            </div>\n        </div>\n        <div class=\"right clusters\" *ngIf=\"extended\">\n        <h3>Clusters details</h3>\n        <table>\n            <tr>\n                <td>Name (number of reads)</td>\n            </tr>\n            <tr *ngFor=\"#node of superCluster.clusters;\">\n                <td><button (click)=\"detail(node.name)\"><b>{{node.name}}</b> ({{node.size}}) </button></td>\n            </tr>\n        </table>\n        </div>\n        <div class=\"right\">  \n            <h3>SuperClusters</h3>\n            <table class=\"groups\">\n                <thead>\n                    <tr>\n                        <td></td><td>Size</td><td>Classification</td>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr *ngFor=\"#group of groups; #i = index\">\n                    <td><button (click)=\"focus(i)\" [ngStyle]=\"{'background-color': color(i) }\"><b>SuperCluster{{i+1}}</b></button></td>\n                    <td>{{group.clusters.length}}</td> \n                    <td *ngIf=\"group.classification\">{{group.classification[0].classification}}</td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n    "
          })];
        }});
      Object.defineProperty(GraphView, "parameters", {get: function() {
          return [[NgZone]];
        }});
    }
  };
});
