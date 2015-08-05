/// <reference path="../../angular-wesnoth-tiles.d.ts"/>
/// <reference path="../../typings/tsd.d.ts"/>
// / <reference path="bower_components/wesnoth-tiles/bin/wesnoth-tiles.d.ts"/>
var app = angular.module("testApp", ["WesnothTiles"]);

import ETerrain = WesnothTiles.ETerrain;
import EOverlay = WesnothTiles.EOverlay;

interface AppScope extends ng.IScope {
  model: WesnothTiles.Angular.HexMap;
}

class TestContoller {
  static $controllerId = "TestController"
  static $inject = ["$scope", "$element"];

  constructor(private $scope: AppScope, $element: JQuery) {
    $scope.model = new WesnothTiles.Angular.HexMap();
    this.loadDisk();
 }

  onHexClicked(h: WesnothTiles.Angular.IHex) {
    console.log("clicked hex!", h);
  }

  changeHex() {
    this.$scope.model.set({ q: 0, r: 0, terrain: ETerrain.GRASS_DRY, overlay: EOverlay.VILLAGE_HUMAN, fog: false}); 
  }


  private loadDisk(): void {


    this.loadRing(5, ETerrain.ABYSS);
    this.loadRing(6, ETerrain.ABYSS);
    this.loadRing(7, ETerrain.VOID);

    for (var i = 0; i < 5; i++) {
      this.$scope.model.set({ q: -6, r: i + 1, terrain: ETerrain.WATER_OCEAN, overlay: EOverlay.NONE, fog: false});
      this.$scope.model.set({ q: -5, r: i, terrain: ETerrain.WATER_OCEAN, overlay: EOverlay.NONE, fog: false});
      this.$scope.model.set({ q: -4, r: i - 1, terrain: ETerrain.SAND_BEACH, overlay: EOverlay.NONE, fog: false});
    }

    this.$scope.model.set({ q: 5, r: -5, terrain: ETerrain.GRASS_DRY, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 4, r: -5, terrain: ETerrain.GRASS_DRY, overlay: EOverlay.TRASH, fog: false});
    this.$scope.model.set({ q: 3, r: -5, terrain: ETerrain.GRASS_DRY, overlay: EOverlay.VILLAGE_ORC, fog: false});
    this.$scope.model.set({ q: 2, r: -5, terrain: ETerrain.GRASS_DRY, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 4, r: -4, terrain: ETerrain.HILLS_DRY, overlay: EOverlay.NONE, fog: false});

    this.$scope.model.set({ q: 3, r: -4, terrain: ETerrain.SWAMP_MUD, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 2, r: -4, terrain: ETerrain.SWAMP_MUD, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 1, r: -4, terrain: ETerrain.SWAMP_MUD, overlay: EOverlay.NONE, fog: false});

    this.$scope.model.set({ q: 1, r: -3, terrain: ETerrain.MOUNTAIN_DRY, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 2, r: -3, terrain: ETerrain.SWAMP_MUD, overlay: EOverlay.NONE, fog: false});

    this.$scope.model.set({ q: 0, r: -2, terrain: ETerrain.MOUNTAIN_DRY, overlay: EOverlay.NONE, fog: false});

    this.$scope.model.set({ q: 3, r: -3, terrain: ETerrain.HILLS_DRY, overlay: EOverlay.NONE, fog: false});

    this.$scope.model.set({ q: 6, r: -5, terrain: ETerrain.GRASS_DRY, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 6, r: -4, terrain: ETerrain.FROZEN_SNOW, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 6, r: -3, terrain: ETerrain.HILLS_SNOW, overlay: EOverlay.SNOW_FOREST, fog: false});
    this.$scope.model.set({ q: 6, r: -2, terrain: ETerrain.FROZEN_SNOW, overlay: EOverlay.SNOW_FOREST, fog: false});
    this.$scope.model.set({ q: 6, r: -1, terrain: ETerrain.FROZEN_SNOW, overlay: EOverlay.SNOW_FOREST, fog: false});
      
    this.$scope.model.set({ q: 4, r: -1, terrain: ETerrain.MOUNTAIN_SNOW, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 3, r: -1, terrain: ETerrain.MOUNTAIN_SNOW, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 4, r: -2, terrain: ETerrain.MOUNTAIN_SNOW, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 5, r: -2, terrain: ETerrain.MOUNTAIN_SNOW, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 2, r: -0, terrain: ETerrain.MOUNTAIN_SNOW, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 3, r: -0, terrain: ETerrain.MOUNTAIN_SNOW, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 5, r: -3, terrain: ETerrain.HILLS_SNOW, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 4, r: -3, terrain: ETerrain.HILLS_DRY, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 5, r: -4, terrain: ETerrain.GRASS_DRY, overlay: EOverlay.NONE, fog: false});

    this.$scope.model.set({ q: 5, r: -1, terrain: ETerrain.FROZEN_SNOW, overlay: EOverlay.SNOW_FOREST, fog: false});
    this.$scope.model.set({ q: 5, r: 0, terrain: ETerrain.FROZEN_SNOW, overlay: EOverlay.NONE, fog: false});

    this.$scope.model.set({ q: 4, r: 0, terrain: ETerrain.FROZEN_SNOW, overlay: EOverlay.VILLAGE_HUMAN, fog: false});
    this.$scope.model.set({ q: 4, r: 1, terrain: ETerrain.FROZEN_SNOW, overlay: EOverlay.NONE, fog: false});

    this.$scope.model.set({ q: 3, r: 1, terrain: ETerrain.FROZEN_ICE, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 3, r: 2, terrain: ETerrain.FROZEN_ICE, overlay: EOverlay.NONE, fog: false});

    this.$scope.model.set({ q: 2, r: 1, terrain: ETerrain.FROZEN_ICE, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 2, r: 2, terrain: ETerrain.FROZEN_ICE, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 2, r: 3, terrain: ETerrain.FROZEN_ICE, overlay: EOverlay.NONE, fog: false});

    this.$scope.model.set({ q: 1, r: 2, terrain: ETerrain.FROZEN_ICE, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 1, r: 3, terrain: ETerrain.FROZEN_ICE, overlay: EOverlay.NONE, fog: false});

    this.$scope.model.set({ q: 0, r: 3, terrain: ETerrain.WATER_OCEAN, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 0, r: 4, terrain: ETerrain.WATER_OCEAN, overlay: EOverlay.NONE, fog: false});
   
    this.$scope.model.set({ q: -3, r: 2, terrain: ETerrain.GRASS_GREEN, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: -3, r: 3, terrain: ETerrain.GRASS_GREEN, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: -3, r: 1, terrain: ETerrain.GRASS_SEMI_DRY, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: -3, r: 0, terrain: ETerrain.GRASS_DRY, overlay: EOverlay.DETRITUS, fog: false});
    this.$scope.model.set({ q: -3, r: -1, terrain: ETerrain.SAND_DESERT, overlay: EOverlay.OASIS, fog: false});
    this.$scope.model.set({ q: -3, r: -2, terrain: ETerrain.HILLS_DESERT, overlay: EOverlay.PALM_DESERT, fog: false});

    this.$scope.model.set({ q: -2, r: 2, terrain: ETerrain.GRASS_GREEN, overlay: EOverlay.WOODS_PINE, fog: false});
    this.$scope.model.set({ q: -2, r: 3, terrain: ETerrain.GRASS_GREEN, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: -2, r: 1, terrain: ETerrain.GRASS_SEMI_DRY, overlay: EOverlay.WOODS_PINE, fog: false});
    this.$scope.model.set({ q: -2, r: 0, terrain: ETerrain.GRASS_DRY, overlay: EOverlay.LITER, fog: false});
    this.$scope.model.set({ q: -2, r: -1, terrain: ETerrain.SAND_DESERT, overlay: EOverlay.DESERT_PLANTS, fog: false});
    this.$scope.model.set({ q: -2, r: -2, terrain: ETerrain.SAND_DESERT, overlay: EOverlay.PALM_DESERT, fog: false});
    this.$scope.model.set({ q: -2, r: -3, terrain: ETerrain.HILLS_DESERT, overlay: EOverlay.VILLAGE_DESERT, fog: false});

    this.$scope.model.set({ q: -1, r: -3, terrain: ETerrain.HILLS_DESERT, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: -1, r: -2, terrain: ETerrain.MOUNTAIN_DRY, overlay: EOverlay.NONE, fog: false});

    this.$scope.model.set({ q: -1, r: 3, terrain: ETerrain.WATER_OCEAN, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: -1, r: 1, terrain: ETerrain.GRASS_SEMI_DRY, overlay: EOverlay.WOODS_PINE, fog: false});
    this.$scope.model.set({ q: -1, r: 2, terrain: ETerrain.GRASS_SEMI_DRY, overlay: EOverlay.VILLAGE_ELVEN, fog: false});

    this.$scope.model.set({ q: 0, r: 1, terrain: ETerrain.MOUNTAIN_BASIC, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 0, r: 2, terrain: ETerrain.HILLS_REGULAR, overlay: EOverlay.NONE, fog: false});

    this.$scope.model.set({ q: 1, r: 1, terrain: ETerrain.FROZEN_SNOW, overlay: EOverlay.NONE, fog: false});


    this.$scope.model.set({ q: 2, r: -1, terrain: ETerrain.MOUNTAIN_BASIC, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 3, r: -2, terrain: ETerrain.MOUNTAIN_BASIC, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 1, r: 0, terrain: ETerrain.MOUNTAIN_BASIC, overlay: EOverlay.NONE, fog: false});

    this.$scope.model.set({ q: 1, r: -1, terrain: ETerrain.SWAMP_WATER, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 2, r: -2, terrain: ETerrain.SWAMP_WATER, overlay: EOverlay.VILLAGE_SWAMP, fog: false});
    this.$scope.model.set({ q: 1, r: -2, terrain: ETerrain.SWAMP_WATER, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 0, r: 0, terrain: ETerrain.SWAMP_WATER, overlay: EOverlay.NONE, fog: false});

    this.$scope.model.set({ q: -1, r: 0, terrain: ETerrain.WATER_COAST_TROPICAL, overlay: EOverlay.VILLAGE_COAST, fog: false});
    this.$scope.model.set({ q: -1, r: -1, terrain: ETerrain.WATER_COAST_TROPICAL, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 0, r: -1, terrain: ETerrain.WATER_COAST_TROPICAL, overlay: EOverlay.NONE, fog: false});

    this.$scope.model.set({ q: 0, r: -3, terrain: ETerrain.MOUNTAIN_VOLCANO, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 0, r: -4, terrain: ETerrain.SAND_DESERT, overlay: EOverlay.NONE, fog: false});

    for (var i = 0; i < 4; i++) {
      this.$scope.model.set({ q: -2 - i, r: 4 + 1, terrain: ETerrain.WATER_OCEAN, overlay: EOverlay.NONE, fog: false});
      this.$scope.model.set({ q: -1 - i, r: 4, terrain: ETerrain.WATER_OCEAN, overlay: EOverlay.NONE, fog: false});
      // mapBuilder = mapBuilder.setTile(-2 - i, 4 + 1, ETerrain.WATER_OCEAN)
      //   .setTile(-1 - i, 4, ETerrain.WATER_OCEAN);
    }
}

 loadRing(radius, terrain): void {
  for (var i = 0; i < radius; i++) {
    this.$scope.model.set({ q: 2 + i, r: -radius -1, terrain: terrain, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 2 + radius, r: i -radius - 1, terrain: terrain, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 2 + radius -i, r: i - 1, terrain: terrain, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: -2 - i, r: radius + 1, terrain: terrain, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: -2 - radius, r: radius - i + 1, terrain: terrain, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: -2 + i - radius, r:  -i + 1, terrain: terrain, overlay: EOverlay.NONE, fog: false});
    
    this.$scope.model.set({ q: 1, r: -radius, terrain: terrain, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 0 , r: -radius, terrain: terrain, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: -1, r: -radius + 1, terrain: terrain, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: -2, r: -radius + 1, terrain: terrain, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: -1, r: radius, terrain: terrain, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 0, r:  radius, terrain: terrain, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 1, r:  radius - 1, terrain: terrain, overlay: EOverlay.NONE, fog: false});
    this.$scope.model.set({ q: 2, r:  radius - 1, terrain: terrain, overlay: EOverlay.NONE, fog: false});

// return mapBuilder.setTile(1, -radius, terrain)
//     .setTile(0, -radius, terrain)
//     .setTile(-1, -radius + 1, terrain)
//     .setTile(-2, -radius + 1, terrain)
//     .setTile(-1, radius, terrain)
//     .setTile(0, radius, terrain)
//     .setTile(1, radius - 1, terrain)
//     .setTile(2, radius - 1, terrain);


    // mapBuilder = mapBuilder.setTile(2 + i, -radius - 1, terrain)
    //   .setTile(2 + radius, i - radius - 1, terrain)
    //   .setTile(2 + radius - i, i - 1, terrain)
    //   .setTile(-2 - i, radius + 1, terrain)
    //   .setTile(-2 - radius, radius - i + 1, terrain)
    //   .setTile(-2 + i - radius, -i + 1, terrain);
  }

  // tilesMap.setTerrain(1, -radius - 1, terrain));
  // return mapBuilder.setTile(1, -radius, terrain)
  //   .setTile(0, -radius, terrain)
  //   .setTile(-1, -radius + 1, terrain)
  //   .setTile(-2, -radius + 1, terrain)
  //   .setTile(-1, radius, terrain)
  //   .setTile(0, radius, terrain)
  //   .setTile(1, radius - 1, terrain)
  //   .setTile(2, radius - 1, terrain);
}

}

app.controller(TestContoller.$controllerId, TestContoller);