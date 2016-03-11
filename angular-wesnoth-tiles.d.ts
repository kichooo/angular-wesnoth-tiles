/// <reference path="typings/tsd.d.ts" />
/// <reference path="bower_components/wesnoth-tiles/bin/wesnoth-tiles.d.ts" />
declare const wesnothTiles: ng.IModule;
declare module WesnothTiles.Angular {
    class HexMap {
        private $version;
        rows: Map<number, Map<number, IHex>>;
        get(q: number, r: number): IHex;
        set(hex: IHex): void;
        private setToVoidIfEmpty(q, r);
        iterate(callback: (hex: IHex) => void): void;
        version: number;
    }
    interface IWesnothTilesScope extends ng.IScope {
        onHexClicked(parasm: {
            hex: IHex;
        }): void;
        model: HexMap;
        showCursor?(): boolean;
        scrollable?(): boolean;
    }
    interface IModel {
        hexes: HexMap;
    }
    interface IHex {
        q: number;
        r: number;
        terrain: WesnothTiles.ETerrain;
        overlay: WesnothTiles.EOverlay;
        fog: boolean;
    }
    class Controller {
        private $scope;
        static $controllerId: string;
        static $inject: string[];
        private canvas;
        private ctx;
        private map;
        private projection;
        private oldMap;
        private jQueryCanvas;
        private action;
        private dragStartX;
        private dragStartY;
        private actionStartX;
        private actionStartY;
        constructor($scope: IWesnothTilesScope, element: JQuery, $config: WesnothTiles.IConfig);
        private init;
        private rebuild();
        private anim;
        private onMouseClick;
        private onMouseMove;
        private onMouseUp;
        private onMouseDown;
        private onMouseLeave;
    }
}
