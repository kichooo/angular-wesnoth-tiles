/// <reference path="../../angular-wesnoth-tiles.d.ts"/>
/// <reference path="../../typings/tsd.d.ts"/>
// / <reference path="bower_components/wesnoth-tiles/bin/wesnoth-tiles.d.ts"/>
var app = angular.module("testApp", ["WesnothTiles"]);

interface AppScope extends ng.IScope {
  model: WesnothTiles.Angular.HexMap;
}

class TestContoller {
  static $controllerId = "TestController"
  static $inject = ["$scope", "$element"];

  constructor(private $scope: AppScope, $element: JQuery) {
    $scope.model = new WesnothTiles.Angular.HexMap();
    
  }

  onHexClicked(h: WesnothTiles.Angular.IHex) {
    console.log("clicked hex!", h);
  }
}

app.controller(TestContoller.$controllerId, TestContoller);