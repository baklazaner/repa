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
          this.allRMData = result.getRepeatMasker();
          this.color = Settings.default().color;
          window.dispatch.on('unfocus.view', function() {
            console.log('unfocusing');
          });
          window.dispatch.on('focus.view', function(clusterIndex) {
            console.log('focusing', clusterIndex);
            $__4.zone.run(function() {
              $__4.nodeToIndex = result.nodeToIndex;
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
            templateUrl: 'components/graph/GraphView.html'
          })];
        }});
      Object.defineProperty(GraphView, "parameters", {get: function() {
          return [[NgZone]];
        }});
    }
  };
});
