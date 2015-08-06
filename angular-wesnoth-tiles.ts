/// <reference path="typings/tsd.d.ts"/>
/// <reference path="bower_components/wesnoth-tiles/bin/wesnoth-tiles.d.ts"/>

// app.directive('ngSparkline', function() {
//   return {
//     restrict: 'A',
//     template: '<div class="sparkline"></div>'
//   }
// });

module WesnothTiles {

}

var wesnothTiles = angular.module("WesnothTiles", []);

wesnothTiles.directive("wesnothTiles", function() {
  return {
    template: "<canvas></canvas>",
    scope: {
      model: "=",
      onHexClicked: "&"
    },
    controller: WesnothTiles.Angular.Controller.$controllerId
  };
});

module WesnothTiles.Angular {
  export class HexMap {
    private $version = 0;

    rows = new Map<number, Map<number, IHex>>();

    get(q: number, r: number): IHex {
      var row = this.rows.get(q);
      if (row == undefined)
        return undefined;
      return row.get(r);
    }

    set(hex: IHex): void {
      var row = this.rows.get(hex.q);
      if (row == undefined) {
        row = new Map<number, IHex>();
        this.rows.set(hex.q, row);
      }
      row.set(hex.r, hex);
      this.$version++;
    }

    iterate(callback: (hex: IHex) => void) {
      this.rows.forEach(row => row.forEach(callback));
    }

    // This property helps change tracking - whenever hex is changed it gets bumped. 
    // Thanks to it directive knows when to redraw.
    get version(): number {
      return this.$version;
    }

  }

  export interface IWesnothTilesScope extends ng.IScope {
    onHexClicked(hex: IHex): void;
    model: HexMap;
  }

  export interface IModel {
    hexes: HexMap;
  }

  export interface IHex {
    q: number;
    r: number;
    terrain: WesnothTiles.ETerrain;
    overlay: WesnothTiles.EOverlay;
    fog: boolean;
  }

  export class Controller {
    static $controllerId = "WesnothAngularController"
    static $inject = ["$scope", "$element"];

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private map: WesnothTiles.TilesMap;
    private projection: WesnothTiles.IProjection;

    private oldMap: HexMap;

    constructor(private $scope: IWesnothTilesScope, element: JQuery) {
      this.canvas = <HTMLCanvasElement>element.find("canvas")[0];
      this.ctx = this.canvas.getContext("2d");

      WesnothTiles.createMap().then(map => {
        this.map = map;

        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;

        this.projection = {
          left: Math.floor(-this.canvas.width / 2),
          right: Math.floor(this.canvas.width / 2),
          top: Math.floor(-this.canvas.height / 2),
          bottom: Math.floor(this.canvas.height / 2),
          x: 0,
          y: 0,
        };

        this.anim();
        // this.loadDisk();

        this.canvas.addEventListener('click', ev => {

          var rect = this.canvas.getBoundingClientRect();
          var x = ev.clientX - rect.left;
          var y = ev.clientY - rect.top;

          var pos = WesnothTiles.pointToHexPos(x - this.canvas.width / 2, y - this.canvas.height / 2);

          ev.preventDefault();
          if ($scope.onHexClicked !== undefined) {
            var hex = $scope.model.get(pos.q, pos.r);
            if (hex !== undefined)
              $scope.onHexClicked(hex);
          }
        });

        $scope.$watch("model.version",() => {
          this.rebuild();
        })
        this.rebuild();
      });
    }

    private rebuild() {
      if (this.$scope.model.version === 0)
        return;

      // We need to find changes in the model.
      var builder = this.map.getBuilder(this.oldMap === undefined);
      
      // This map will become the this.oldMap after this redraw.
      var nextOldMap = new HexMap();

      this.$scope.model.iterate(hex => {
        if (this.oldMap !== undefined) {
          var oldHex = this.oldMap.get(hex.q, hex.r);
          if (oldHex !== undefined
            && oldHex === hex
            && oldHex.terrain === hex.terrain
            && oldHex.overlay === hex.overlay
            && oldHex.fog === hex.fog) {
            return;
          }
        }
        builder.setTile(hex.q, hex.r, hex.terrain, hex.overlay, hex.fog);
      });

      builder.promise().then(() => this.map.rebuild());
    }

    private anim = () => {
      requestAnimationFrame(timestamp => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.map.redraw(this.ctx, this.projection, timestamp);
        this.anim();
      })

    }
  }
}

wesnothTiles.controller(WesnothTiles.Angular.Controller.$controllerId, WesnothTiles.Angular.Controller)