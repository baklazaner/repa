System.register("components/graph/MyDear", ["angular2/core"], function($__export) {
  "use strict";
  var Directive,
      MyDear;
  return {
    setters: [function($__m) {
      Directive = $__m.Directive;
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
    }
  };
});
