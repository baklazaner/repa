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
      MyDear,
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
      MyDear = function() {
        function MyDear() {
          console.log('Oh my dear!');
        }
        return ($traceurRuntime.createClass)(MyDear, {test: function() {
            console.log('test method');
          }}, {});
      }();
      $__export("MyDear", MyDear);
      Object.defineProperty(MyDear, "annotations", {get: function() {
          return [new Directive({selector: 'my-dear'})];
        }});
      GraphView = function() {
        function GraphView(zone) {
          var $__4 = this;
          var result = Result.getInstance();
          console.log('initiating graph view');
          this.zone = zone;
          this.extended = false;
          this.groups = result.getResult().clusters;
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
            this.detailInfo = filterDetailInfo(clusterN);
            this.repeatMasker = result.getRepeatMasker()[index].hits;
            this.domains = result.getDomains()[index];
            this.inDetail = true;
            function filterDetailInfo(clusterN) {
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
          }
        }, {});
      }();
      $__export("GraphView", GraphView);
      Object.defineProperty(GraphView, "annotations", {get: function() {
          return [new Component({
            selector: 'graph-view',
            directives: [Graph, MyDear, NgStyle],
            template: "\n        <h2>Graph View</h2>\n        <div class=\"left\">\n            <graph [hidden]=\"inDetail\">\n                <button [hidden]=\"!extended\" (click)=\"reset()\" id=\"back\" > Back </button>\n            </graph>\n            <div [hidden]=\"!inDetail\" class=\"detail\">\n                <button (click)=\"back()\">Back</button>\n                <h3 *ngIf=\"inDetail\" >{{detailInfo[0].value}} Detail</h3>\n                <img src=\"{{imgSrc}}\" alt=\"cluster layout \"/>\n                <h3>Summary</h3>\n                <table>\n                    <tr *ngFor=\"#info of detailInfo; #i = index\" [ngStyle]=\"{'background-color':bgColor(i) }\">\n                        <td class=\"key\">{{info.key}}</td><td>{{info.value}}</td>\n                    </tr>\n                </table>\n                <h3>Summary of RepeatMasker hits</h3>\n                <table>\n                    <thead>\n                        <tr>\n                            <td>Class.Family</td><td>hits</td><td>hits[%]</td>\n                        </tr>\n                    </thead> \n                    <tbody>   \n                        <tr *ngFor=\"#rm of repeatMasker; #i = index\" [ngStyle]=\"{'background-color':bgColor(i) }\">\n                            <td>{{rm.key}}</td><td>{{rm.value}}</td><td>{{rm.percentage | number:'.1' }}</td>\n                        </tr>\n                    </tbody>\n                </table>\n                <div *ngIf=\"domains != undefined\">\n                    <h3>Summary of TE domain hits from blastx</h3>\n                    <table>\n                        <thead>\n                            <tr>\n                                <td>Domain</td><td>ID</td><td>Type</td><td>Lineage</td><td>Hits</td><td>MeanScore</td>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            <tr *ngFor=\"#domain of domains;  #i = index\" [ngStyle]=\"{'background-color':bgColor(i) }\">\n                                <td>{{domain.Domain}}</td>\n                                <td>{{domain.ID}}</td>\n                                <td>{{domain.Type}}</td>\n                                <td>{{domain.Lineage}}</td>\n                                <td>{{domain.Hits}}</td>\n                                <td>{{domain.MeanScore}}</td>\n                            </tr>\n                        </tbody>\n                    </table>\n                </div>\n            </div>\n        </div>\n        <div class=\"right clusters\" *ngIf=\"extended\">\n        <h3>Clusters details</h3>\n        <table>\n            <tr>\n                <td>Name (number of reads)</td>\n            </tr>\n            <tr *ngFor=\"#node of superCluster.clusters;\">\n                <td><button (click)=\"detail(node.name)\"><b>{{node.name}}</b> ({{node.size}}) </button></td>\n            </tr>\n        </table>\n        </div>\n        <div class=\"right\">  \n            <h3>SuperClusters</h3>\n            <table class=\"groups\">\n                <thead>\n                    <tr>\n                        <td></td><td>Size</td><td>Classification</td>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr *ngFor=\"#group of groups; #i = index\">\n                    <td><button (click)=\"focus(i)\" [ngStyle]=\"{'background-color': color(i) }\"><b>SuperCluster{{i+1}}</b></button></td>\n                    <td>{{group.clusters.length}}</td> \n                    <td>{{group.classification[0].classification}}</td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n    "
          })];
        }});
      Object.defineProperty(GraphView, "parameters", {get: function() {
          return [[NgZone]];
        }});
    }
  };
});
