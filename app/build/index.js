System.register("index", ["angular2/core", "angular2/platform/browser", "angular2/router", "components/intro/intro", "components/graph/GraphView", "DataMining/Result"], function($__export) {
  "use strict";
  var Component,
      bind,
      provide,
      NgZone,
      bootstrap,
      ROUTER_PROVIDERS,
      RouteConfig,
      ROUTER_DIRECTIVES,
      APP_BASE_HREF,
      LocationStrategy,
      HashLocationStrategy,
      Intro,
      GraphView,
      Result,
      Main;
  return {
    setters: [function($__m) {
      Component = $__m.Component;
      bind = $__m.bind;
      provide = $__m.provide;
      NgZone = $__m.NgZone;
    }, function($__m) {
      bootstrap = $__m.bootstrap;
    }, function($__m) {
      ROUTER_PROVIDERS = $__m.ROUTER_PROVIDERS;
      RouteConfig = $__m.RouteConfig;
      ROUTER_DIRECTIVES = $__m.ROUTER_DIRECTIVES;
      APP_BASE_HREF = $__m.APP_BASE_HREF;
      LocationStrategy = $__m.LocationStrategy;
      HashLocationStrategy = $__m.HashLocationStrategy;
    }, function($__m) {
      Intro = $__m.Intro;
    }, function($__m) {
      GraphView = $__m.GraphView;
    }, function($__m) {
      Result = $__m.Result;
    }],
    execute: function() {
      Main = function() {
        function Main(zone) {
          var $__4 = this;
          this.menu = false;
          console.log('App start');
          console.log('location.pathname', location.pathname);
          window.dispatch = d3.dispatch('unfocus', 'focus', 'menu');
          window.dispatch.on('menu', function() {
            console.log('enabling menu');
            $__4.menu = true;
          });
        }
        return ($traceurRuntime.createClass)(Main, {graphAvailable: function() {
            return this.menu;
          }}, {});
      }();
      $__export("Main", Main);
      Object.defineProperty(Main, "annotations", {get: function() {
          return [new Component({
            selector: 'main',
            directives: [Intro, ROUTER_DIRECTIVES],
            template: "\n        <h1>REPA</h1> \n        <nav>\n            > <a [routerLink]=\"['Intro']\">Intro</a>\n            <span [hidden]=\"!graphAvailable()\">\n            > <a [routerLink]=\"['Graph']\">Graph</a>\n            > <a [routerLink]=\"['Graph']\">Save</a>\n            </span>\n            <span [hidden]=\"graphAvailable()\" class=\"fake\">\n            > Graph > Save\n            </span>\n        </nav>\n        <hr>\n        <router-outlet></router-outlet>\n    "
          }), new RouteConfig([{
            path: '/',
            redirectTo: ['Intro']
          }, {
            path: '/intro',
            name: 'Intro',
            component: Intro,
            useAsDefault: true
          }, {
            path: '/graph',
            name: 'Graph',
            component: GraphView
          }])];
        }});
      Object.defineProperty(Main, "parameters", {get: function() {
          return [[NgZone]];
        }});
      bootstrap(Main, [ROUTER_PROVIDERS, bind(APP_BASE_HREF).toValue('/'), provide(LocationStrategy, {useClass: HashLocationStrategy})]);
    }
  };
});
