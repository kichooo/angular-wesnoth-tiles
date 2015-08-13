/// <reference path="typings/tsd.d.ts"/>
/// <reference path="bower_components/wesnoth-tiles/bin/wesnoth-tiles.d.ts"/>

module WesnothTiles {

}

var wesnothTiles = angular.module("WesnothTiles", []);

wesnothTiles.directive("wesnothTiles", function() {
  return {
    template: "<canvas></canvas>",
    scope: {
      model: "=",
      onHexClicked: "&",
      showCursor: "&",
      scrollable: "&"
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
    onHexClicked(parasm: { hex: IHex }): void;
    model: HexMap;
    showCursor?(): boolean;
    scrollable?(): boolean;
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
    private jQueryCanvas;
    private action = EAction.NONE;
    private dragStartX: number;
    private dragStartY: number;
    private actionStartX: number;
    private actionStartY: number;

    constructor(private $scope: IWesnothTilesScope, element: JQuery) {
      this.jQueryCanvas = element.find("canvas")
      this.canvas = <HTMLCanvasElement>this.jQueryCanvas[0];
      this.ctx = this.canvas.getContext("2d");

      WesnothTiles.createMap().then(this.init);
    }

    private init = (map: WesnothTiles.TilesMap): void => {
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

      // this.jQueryCanvas.on("click", this.onMouseClick);

      this.$scope.$watch("model.version",() => {
        this.rebuild();
      })

      this.jQueryCanvas.on("mouseup", this.onMouseUp);
      this.jQueryCanvas.on("mousemove", this.onMouseMove);
      this.jQueryCanvas.on("mousedown", this.onMouseDown);
      this.jQueryCanvas.on("mouseleave", this.onMouseLeave);

      // this.$scope.$watch("showCursor()", this.onShowCursorChange);
      // this.onShowCursorChange(this.$scope.showCursor());

      // this.$scope.$watch("scrollable()", this.onShowCursorChange);
      // this.onScrollableChange(this.$scope.scrollable());

      this.rebuild();
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

    private onMouseClick = (ev: MouseEvent) => {
      var rect = this.canvas.getBoundingClientRect();
      var x = ev.clientX - rect.left;
      var y = ev.clientY - rect.top;

      var pos = WesnothTiles.pointToHexPos(x + this.projection.left, y + this.projection.top);

      ev.preventDefault();
      var hex = this.$scope.model.get(pos.q, pos.r);
      if (hex !== undefined) {
        this.$scope.$apply(() => {
          this.$scope.onHexClicked({ hex: hex });
        });
      }
    }

    private onMouseMove = (ev: MouseEvent) => {
      if (this.action == EAction.NONE) {
        if (this.$scope.showCursor()) {
          this.map.setCursorVisibility(true);
          var rect = this.canvas.getBoundingClientRect();
          var x = ev.clientX - rect.left + this.projection.left;
          var y = ev.clientY - rect.top + this.projection.top;
          this.map.moveCursor(x, y);
        }        
      } else {
        if (this.$scope.scrollable()) {
          var rect = this.canvas.getBoundingClientRect();
          this.projection.left = this.actionStartX + this.dragStartX - ev.clientX;
          this.projection.top = this.actionStartY + this.dragStartY - ev.clientY;          
          this.projection.right = this.projection.left + this.canvas.width;
          this.projection.bottom = this.projection.top + this.canvas.height;

          // check if still a click...
          if ((this.actionStartX - ev.clientX) * (this.actionStartX - ev.clientX) +
            (this.actionStartY - ev.clientY) * (this.actionStartY - ev.clientY) > 100)
            this.action = EAction.SCROLL;
        }                
      }
      
    }

    private onMouseUp = (ev: MouseEvent) => {
      if (this.action === EAction.CLICK && this.action !== EAction.SCROLL) {
        if (angular.isFunction(this.$scope.onHexClicked)) {
          this.onMouseClick(ev);
          // handle click  
        }
        
      }

      this.action = EAction.NONE;
    }

    private onMouseDown = (ev: MouseEvent) => {
      if (this.action != EAction.NONE)
        return;
      this.action = EAction.CLICK;

      var rect = this.canvas.getBoundingClientRect();
      this.dragStartX = this.projection.left;
      this.dragStartY = this.projection.top;
      this.actionStartX = ev.clientX;
      this.actionStartY =  ev.clientY;
    }

    private onMouseLeave = (ev: MouseEvent) => {
      this.map.setCursorVisibility(false);
      this.action = EAction.NONE;
    }

    private onScrollableChange = (newVal: boolean): void => {

    }

    private onShowCursorChange = (newVal: boolean): void => {
      if (newVal === true) {
        this.map.setCursorVisibility(true);
        this.jQueryCanvas.on("mousemove", this.onMouseMove);
        this.jQueryCanvas.on("mouseleave", this.onMouseLeave);
      } else {
        this.map.setCursorVisibility(false);
        this.jQueryCanvas.off("mousemove");
        this.jQueryCanvas.off("mouseleave");
      }
    }

  }

  enum EAction {
    NONE,
    SCROLL,
    CLICK // click might also be a scroll.
  }

}

wesnothTiles.controller(WesnothTiles.Angular.Controller.$controllerId, WesnothTiles.Angular.Controller)