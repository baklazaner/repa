System.register("DataMining/Results", [], function($__export) {
  "use strict";
  var Result;
  return {
    setters: [],
    execute: function() {
      Result = function() {
        function Result() {
          console.log('creating instance of Results');
        }
        return ($traceurRuntime.createClass)(Result, {setResult: function(result) {
            console.log('setting result', result);
          }}, {getInstance: function() {
            if (!Results.instance) {
              Results.instance = new Results();
            }
            return Results.instance;
          }});
      }();
      $__export("Result", Result);
    }
  };
});
