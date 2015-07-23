/// <reference path="typings/tsd.d.ts" />
/// <reference path="bower_components/wesnoth-tiles/bin/wesnoth-tiles.d.ts" />
declare module WesnothTiles {
}
declare var wesnothTiles: ng.IModule;
declare module WesnothTiles.Angular {
    class Controller {
        private $scope;
        static $controllerId: string;
        static $inject: string[];
        private canvas;
        private ctx;
        private map;
        private projection;
        constructor($scope: ng.IScope, element: JQuery);
        private anim;
        private loadDisk();
        loadRing(mapBuilder: WesnothTiles.MapBuilder, radius: any, terrain: any): WesnothTiles.MapBuilder;
    }
}
