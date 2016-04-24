/// <reference path="typings/tsd.d.ts"/>
/// <reference path="bower_components/wesnoth-tiles/bin/wesnoth-tiles.d.ts"/>
const wesnothTiles = angular.module("WesnothTiles", [])
    .constant("$config", {
    path: ""
})
    .directive("wesnothTiles", () => ({
    template: "<canvas></canvas>",
    scope: {
        model: "=",
        onHexClicked: "&",
        showCursor: "&",
        scrollable: "&",
        onPreDraw: "&",
        onPostDraw: "&",
    },
    controller: ($scope, $element, $config) => new WesnothTiles.Angular.Controller($scope, $element, $config)
}));
var WesnothTiles;
(function (WesnothTiles) {
    var Angular;
    (function (Angular) {
        // Class - model of the map. It contains functions to ease
        class HexMap {
            constructor() {
                this.$version = 0;
                this.rows = new Map();
            }
            get(q, r) {
                const row = this.rows.get(q);
                return row ? row.get(r) : undefined;
            }
            set(hex) {
                let row = this.rows.get(hex.q);
                if (row === undefined) {
                    row = new Map();
                    this.rows.set(hex.q, row);
                }
                row.set(hex.r, hex);
                this.setToVoidIfEmpty(hex.q + 1, hex.r);
                this.setToVoidIfEmpty(hex.q - 1, hex.r);
                this.setToVoidIfEmpty(hex.q, hex.r + 1);
                this.setToVoidIfEmpty(hex.q, hex.r - 1);
                this.setToVoidIfEmpty(hex.q + 1, hex.r - 1);
                this.setToVoidIfEmpty(hex.q - 1, hex.r + 1);
                this.$version++;
            }
            setToVoidIfEmpty(q, r) {
                if (this.get(q, r) === undefined) {
                    let row = this.rows.get(q);
                    if (row === undefined) {
                        row = new Map();
                        this.rows.set(q, row);
                    }
                    row.set(r, { q: q, r: r, terrain: WesnothTiles.ETerrain.VOID, overlay: WesnothTiles.EOverlay.NONE, fog: false });
                }
            }
            iterate(callback) {
                this.rows.forEach(row => row.forEach(callback));
            }
            // This property helps change tracking - whenever hex is changed it gets bumped. 
            // Thanks to it directive knows when to redraw.
            get version() {
                return this.$version;
            }
            clone() {
                const hexMap = new HexMap();
                this.rows.forEach((row, q) => {
                    const newRow = new Map();
                    hexMap.rows.set(q, newRow);
                    row.forEach((h, r) => {
                        newRow.set(r, angular.copy(h));
                    });
                });
                return hexMap;
            }
        }
        Angular.HexMap = HexMap;
        class Controller {
            constructor($scope, element, $config) {
                this.$scope = $scope;
                this.action = EAction.NONE;
                this.init = (map) => {
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
                    this.$scope.$watch("model.version", () => this.rebuild());
                    this.jQueryCanvas.on("mouseup", this.onMouseUp);
                    this.jQueryCanvas.on("mousemove", this.onMouseMove);
                    this.jQueryCanvas.on("mousedown", this.onMouseDown);
                    this.jQueryCanvas.on("mouseleave", this.onMouseLeave);
                    this.rebuild();
                };
                // Animation frame - must be on repeat as there are animations.
                this.anim = () => {
                    requestAnimationFrame(timestamp => {
                        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                        this.$scope.onPreDraw({ ctx: this.ctx });
                        this.map.redraw(this.ctx, this.projection, timestamp);
                        this.$scope.onPostDraw({ ctx: this.ctx });
                        this.anim();
                    });
                };
                this.onMouseClick = (ev) => {
                    const rect = this.canvas.getBoundingClientRect();
                    const x = ev.clientX - rect.left;
                    const y = ev.clientY - rect.top;
                    const pos = WesnothTiles.pointToHexPos(x + this.projection.left, y + this.projection.top);
                    ev.preventDefault();
                    const hex = this.$scope.model.get(pos.q, pos.r);
                    if (hex !== undefined) {
                        this.$scope.$apply(() => {
                            this.$scope.onHexClicked({ hex: hex });
                        });
                    }
                };
                this.onMouseMove = (ev) => {
                    if (this.action == EAction.NONE) {
                        if (this.$scope.showCursor()) {
                            this.map.setCursorVisibility(true);
                            const rect = this.canvas.getBoundingClientRect();
                            const x = ev.clientX - rect.left + this.projection.left;
                            const y = ev.clientY - rect.top + this.projection.top;
                            this.map.moveCursor(x, y);
                        }
                    }
                    else {
                        if (this.$scope.scrollable()) {
                            const rect = this.canvas.getBoundingClientRect();
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
                };
                this.onMouseUp = (ev) => {
                    if (this.action === EAction.CLICK && this.action !== EAction.SCROLL) {
                        if (angular.isFunction(this.$scope.onHexClicked)) {
                            this.onMouseClick(ev);
                        }
                    }
                    this.action = EAction.NONE;
                };
                this.onMouseDown = (ev) => {
                    if (this.action != EAction.NONE)
                        return;
                    this.action = EAction.CLICK;
                    const rect = this.canvas.getBoundingClientRect();
                    this.dragStartX = this.projection.left;
                    this.dragStartY = this.projection.top;
                    this.actionStartX = ev.clientX;
                    this.actionStartY = ev.clientY;
                };
                this.onMouseLeave = (ev) => {
                    this.map.setCursorVisibility(false);
                    this.action = EAction.NONE;
                };
                this.jQueryCanvas = element.find("canvas");
                this.canvas = this.jQueryCanvas[0];
                this.ctx = this.canvas.getContext("2d");
                WesnothTiles.init($config);
                WesnothTiles.createMap().then(this.init).then(() => { });
            }
            // Internal rebuild - tracks changes and orders a rebuild on underlying wesnoth-tiles library.
            rebuild() {
                if (this.$scope.model.version === 0)
                    return;
                // We need to find changes in the model.
                const builder = this.map.getBuilder(this.oldMap === undefined);
                //  iterate all the tiles, but set only those that has changed.
                this.$scope.model.iterate(hex => {
                    if (this.oldMap !== undefined) {
                        const oldHex = this.oldMap.get(hex.q, hex.r);
                        if (oldHex !== undefined
                            && oldHex.terrain === hex.terrain
                            && oldHex.overlay === hex.overlay
                            && oldHex.fog === hex.fog) {
                            return;
                        }
                    }
                    builder.setTile(hex.q, hex.r, hex.terrain, hex.overlay, hex.fog);
                });
                this.oldMap = this.$scope.model.clone();
                builder.promise().then(() => this.map.rebuild());
            }
        }
        Controller.$inject = ["$scope", "$element", "WesnothTiles.config"];
        Angular.Controller = Controller;
        // This enum is responsible for keeping track of current interaction status. 
        // It might be expanded in the future to acomodate more features.
        var EAction;
        (function (EAction) {
            EAction[EAction["NONE"] = 0] = "NONE";
            EAction[EAction["SCROLL"] = 1] = "SCROLL";
            EAction[EAction["CLICK"] = 2] = "CLICK"; // click might also be a scroll.
        })(EAction || (EAction = {}));
    })(Angular = WesnothTiles.Angular || (WesnothTiles.Angular = {}));
})(WesnothTiles || (WesnothTiles = {}));
