/// <reference path="typings/tsd.d.ts"/>
/// <reference path="bower_components/wesnoth-tiles/bin/wesnoth-tiles.d.ts"/>

// app.directive('ngSparkline', function() {
//   return {
//     restrict: 'A',
//     template: '<div class="sparkline"></div>'
//   }
// });

module WesnothTiles {
  var dupa = "pies";

}

var wesnothTiles = angular.module("WesnothTiles", []);

wesnothTiles.directive("wesnothTiles", function () {
    return {
        template: "<canvas></canvas>",
        scope: {

        },
        controller: WesnothTiles.Angular.Controller.$controllerId
    };
});


module WesnothTiles.Angular {
  export class Controller {
    static $controllerId = "WesnothAngularController"
    static $inject = ["$scope", "$element"];

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private map: WesnothTiles.TilesMap;
    private projection: WesnothTiles.IProjection;
    constructor(private $scope: ng.IScope, element: JQuery) {
      this.canvas = <HTMLCanvasElement>element.find("canvas")[0];
      this.ctx = this.canvas.getContext("2d");

      WesnothTiles.createMap().then(map => {
        this.map = map;

        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;

        this.projection = {
          left: -this.canvas.width / 2,
          right: this.canvas.width / 2,
          top: -this.canvas.height / 2,
          bottom: this.canvas.height / 2,
          x: 0,
          y: 0,
        };

        this.anim();
        this.loadDisk();
      });
    }

    private anim = () => {
      requestAnimationFrame(timestamp => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.map.redraw(this.ctx, this.projection, timestamp);
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.canvas.width / 2, this.canvas.height / 2, 32, 32);
        this.anim();
      })
      
    }

  private loadDisk(): void {
    
    this.map.clear().then(() => {
    var mapBuilder = this.map.getBuilder(true);
    mapBuilder = this.loadRing(mapBuilder, 5, ETerrain.ABYSS);
    mapBuilder = this.loadRing(mapBuilder, 6, ETerrain.ABYSS);
    mapBuilder = this.loadRing(mapBuilder, 7, ETerrain.VOID);

    for (var i = 0; i < 5; i++) {
      mapBuilder = mapBuilder.setTile(-6, i + 1, ETerrain.WATER_OCEAN)
        .setTile(-5, i, ETerrain.WATER_OCEAN)
        .setTile(-4, i - 1, ETerrain.SAND_BEACH);
    }


    mapBuilder = mapBuilder.setTile(5, -5, ETerrain.GRASS_DRY)
      .setTile(4, -5, ETerrain.GRASS_DRY, EOverlay.TRASH)
      .setTile(3, -5, ETerrain.GRASS_DRY, EOverlay.VILLAGE_ORC)
      .setTile(2, -5, ETerrain.GRASS_DRY)
      .setTile(4, -4, ETerrain.HILLS_DRY)

      .setTile(3, -4, ETerrain.SWAMP_MUD)
      .setTile(2, -4, ETerrain.SWAMP_MUD)
      .setTile(1, -4, ETerrain.SWAMP_MUD)

      .setTile(1, -3, ETerrain.MOUNTAIN_DRY)
      .setTile(2, -3, ETerrain.SWAMP_MUD)

      .setTile(0, -2, ETerrain.MOUNTAIN_DRY)


      .setTile(3, -3, ETerrain.HILLS_DRY)

      .setTile(6, -5, ETerrain.GRASS_DRY)
      .setTile(6, -4, ETerrain.FROZEN_SNOW)
      .setTile(6, -3, ETerrain.HILLS_SNOW, EOverlay.SNOW_FOREST)
      .setTile(6, -2, ETerrain.FROZEN_SNOW, EOverlay.SNOW_FOREST)
      .setTile(6, -1, ETerrain.FROZEN_SNOW, EOverlay.SNOW_FOREST)

      .setTile(4, -1, ETerrain.MOUNTAIN_SNOW)
      .setTile(3, -1, ETerrain.MOUNTAIN_SNOW)
      .setTile(4, -2, ETerrain.MOUNTAIN_SNOW)
      .setTile(5, -2, ETerrain.MOUNTAIN_SNOW)
      .setTile(2, 0, ETerrain.MOUNTAIN_SNOW)
      .setTile(3, 0, ETerrain.MOUNTAIN_SNOW)
      .setTile(5, -3, ETerrain.HILLS_SNOW)
      .setTile(4, -3, ETerrain.HILLS_DRY)
      .setTile(5, -4, ETerrain.GRASS_DRY)

      .setTile(5, -1, ETerrain.FROZEN_SNOW, EOverlay.SNOW_FOREST)
      .setTile(5, 0, ETerrain.FROZEN_SNOW)

      .setTile(4, 0, ETerrain.FROZEN_SNOW, EOverlay.VILLAGE_HUMAN)
      .setTile(4, 1, ETerrain.FROZEN_SNOW)

      .setTile(3, 1, ETerrain.FROZEN_ICE)
      .setTile(3, 2, ETerrain.FROZEN_ICE)

      .setTile(2, 1, ETerrain.FROZEN_ICE)
      .setTile(2, 2, ETerrain.FROZEN_ICE)
      .setTile(2, 3, ETerrain.FROZEN_ICE)

      .setTile(1, 2, ETerrain.FROZEN_ICE)
      .setTile(1, 3, ETerrain.FROZEN_ICE)

      .setTile(0, 3, ETerrain.WATER_OCEAN)
      .setTile(0, 4, ETerrain.WATER_OCEAN)

      .setTile(-3, 2, ETerrain.GRASS_GREEN)
      .setTile(-3, 3, ETerrain.GRASS_GREEN)
      .setTile(-3, 1, ETerrain.GRASS_SEMI_DRY)
      .setTile(-3, 0, ETerrain.GRASS_DRY, EOverlay.DETRITUS)
      .setTile(-3, -1, ETerrain.SAND_DESERT, EOverlay.OASIS)
      .setTile(-3, -2, ETerrain.HILLS_DESERT, EOverlay.PALM_DESERT)

      .setTile(-2, 2, ETerrain.GRASS_GREEN, EOverlay.WOODS_PINE)
      .setTile(-2, 3, ETerrain.GRASS_GREEN)
      .setTile(-2, 1, ETerrain.GRASS_SEMI_DRY, EOverlay.WOODS_PINE)
      .setTile(-2, 0, ETerrain.GRASS_DRY, EOverlay.LITER)
      .setTile(-2, -1, ETerrain.SAND_DESERT, EOverlay.DESERT_PLANTS)
      .setTile(-2, -2, ETerrain.SAND_DESERT, EOverlay.PALM_DESERT)
      .setTile(-2, -3, ETerrain.HILLS_DESERT, EOverlay.VILLAGE_DESERT)

      .setTile(-1, -3, ETerrain.HILLS_DESERT)
      .setTile(-1, -2, ETerrain.MOUNTAIN_DRY)

      .setTile(-1, 3, ETerrain.WATER_OCEAN)
      .setTile(-1, 1, ETerrain.GRASS_SEMI_DRY, EOverlay.WOODS_PINE)
      .setTile(-1, 2, ETerrain.GRASS_SEMI_DRY, EOverlay.VILLAGE_ELVEN)

      .setTile(0, 1, ETerrain.MOUNTAIN_BASIC)
      .setTile(0, 2, ETerrain.HILLS_REGULAR)

      .setTile(1, 1, ETerrain.FROZEN_SNOW)

      .setTile(2, -1, ETerrain.MOUNTAIN_BASIC)
      .setTile(3, -2, ETerrain.MOUNTAIN_BASIC)
      .setTile(1, 0, ETerrain.MOUNTAIN_BASIC)

      .setTile(1, -1, ETerrain.SWAMP_WATER)
      .setTile(2, -2, ETerrain.SWAMP_WATER, EOverlay.VILLAGE_SWAMP)
      .setTile(1, -2, ETerrain.SWAMP_WATER)
      .setTile(0, 0, ETerrain.SWAMP_WATER)


      .setTile(-1, 0, ETerrain.WATER_COAST_TROPICAL, EOverlay.VILLAGE_COAST)
      .setTile(-1, -1, ETerrain.WATER_COAST_TROPICAL)
      .setTile(0, -1, ETerrain.WATER_COAST_TROPICAL)

      .setTile(0, -3, ETerrain.MOUNTAIN_VOLCANO)
      .setTile(0, -4, ETerrain.SAND_DESERT);

    for (var i = 0; i < 4; i++) {
      mapBuilder = mapBuilder.setTile(-2 - i, 4 + 1, ETerrain.WATER_OCEAN)
        .setTile(-1 - i, 4, ETerrain.WATER_OCEAN);
    }
    return mapBuilder.promise();
  }).then(() => this.map.rebuild());
}

 loadRing(mapBuilder: WesnothTiles.MapBuilder, radius, terrain): WesnothTiles.MapBuilder {
  for (var i = 0; i < radius; i++) {
    mapBuilder = mapBuilder.setTile(2 + i, -radius - 1, terrain)
      .setTile(2 + radius, i - radius - 1, terrain)
      .setTile(2 + radius - i, i - 1, terrain)
      .setTile(-2 - i, radius + 1, terrain)
      .setTile(-2 - radius, radius - i + 1, terrain)
      .setTile(-2 + i - radius, -i + 1, terrain);
  }

  // tilesMap.setTerrain(1, -radius - 1, terrain));
  return mapBuilder.setTile(1, -radius, terrain)
    .setTile(0, -radius, terrain)
    .setTile(-1, -radius + 1, terrain)
    .setTile(-2, -radius + 1, terrain)
    .setTile(-1, radius, terrain)
    .setTile(0, radius, terrain)
    .setTile(1, radius - 1, terrain)
    .setTile(2, radius - 1, terrain);
}


  }
}

wesnothTiles.controller(WesnothTiles.Angular.Controller.$controllerId, WesnothTiles.Angular.Controller)