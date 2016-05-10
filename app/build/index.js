System.register("index", ["angular2/core", "angular2/platform/browser", "angular2/router", "components/intro/intro", "components/graph/GraphView"], function($__export) {
  "use strict";
  var Component,
      bind,
      provide,
      ViewChild,
      bootstrap,
      ROUTER_PROVIDERS,
      RouteConfig,
      ROUTER_DIRECTIVES,
      APP_BASE_HREF,
      LocationStrategy,
      HashLocationStrategy,
      Intro,
      GraphView,
      Main;
  return {
    setters: [function($__m) {
      Component = $__m.Component;
      bind = $__m.bind;
      provide = $__m.provide;
      ViewChild = $__m.ViewChild;
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
    }],
    execute: function() {
      Main = function() {
        function Main() {
          console.log('App start');
          console.log('location.pathname', location.pathname);
        }
        return ($traceurRuntime.createClass)(Main, {}, {});
      }();
      $__export("Main", Main);
      Object.defineProperty(Main, "annotations", {get: function() {
          return [new Component({
            selector: 'main',
            directives: [Intro, ROUTER_DIRECTIVES],
            template: "\n        <h1>REPA</h1> \n        <nav>\n            > <a [routerLink]=\"['Intro']\">Intro</a>\n            > <a [routerLink]=\"['Graph']\">Graph</a>\n            > <a [routerLink]=\"['Graph']\">Export</a>\n        </nav>\n        <hr>\n        <router-outlet></router-outlet>\n    "
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
      bootstrap(Main, [ROUTER_PROVIDERS, bind(APP_BASE_HREF).toValue('/'), provide(LocationStrategy, {useClass: HashLocationStrategy})]);
    }
  };
});
