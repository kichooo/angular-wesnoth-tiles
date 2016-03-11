/// <reference path="typings/tsd.d.ts"/>
/// <reference path="bower_components/wesnoth-tiles/bin/wesnoth-tiles.d.ts"/>
const wesnothTiles = angular.module("WesnothTiles", []).constant("WesnothTiles.config", {
    path: ""
}).directive("wesnothTiles", function () {
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
var WesnothTiles;
(function (WesnothTiles) {
    var Angular;
    (function (Angular) {
        // Class - model of the map. It contains functions to ease
        var HexMap = (function () {
            function HexMap() {
                this.$version = 0;
                this.rows = new Map();
            }
            HexMap.prototype.get = function (q, r) {
                const row = this.rows.get(q);
                return row ? row.get(r) : undefined;
            };
            HexMap.prototype.set = function (hex) {
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
            };
            HexMap.prototype.setToVoidIfEmpty = function (q, r) {
                if (this.get(q, r) === undefined) {
                    let row = this.rows.get(q);
                    if (row === undefined) {
                        row = new Map();
                        this.rows.set(q, row);
                    }
                    row.set(r, { q: q, r: r, terrain: 21 /* VOID */, overlay: 62 /* NONE */, fog: false });
                }
            };
            HexMap.prototype.iterate = function (callback) {
                this.rows.forEach(function (row) { return row.forEach(callback); });
            };
            Object.defineProperty(HexMap.prototype, "version", {
                // This property helps change tracking - whenever hex is changed it gets bumped. 
                // Thanks to it directive knows when to redraw.
                get: function () {
                    return this.$version;
                },
                enumerable: true,
                configurable: true
            });
            return HexMap;
        })();
        Angular.HexMap = HexMap;
        var Controller = (function () {
            function Controller($scope, element, $config) {
                var _this = this;
                this.$scope = $scope;
                this.action = 0 /* NONE */;
                this.init = function (map) {
                    _this.map = map;
                    _this.canvas.width = _this.canvas.parentElement.clientWidth;
                    _this.canvas.height = _this.canvas.parentElement.clientHeight;
                    _this.projection = {
                        left: Math.floor(-_this.canvas.width / 2),
                        right: Math.floor(_this.canvas.width / 2),
                        top: Math.floor(-_this.canvas.height / 2),
                        bottom: Math.floor(_this.canvas.height / 2),
                        x: 0,
                        y: 0,
                    };
                    _this.anim();
                    // this.jQueryCanvas.on("click", this.onMouseClick);
                    _this.$scope.$watch("model.version", function () { return _this.rebuild(); });
                    _this.jQueryCanvas.on("mouseup", _this.onMouseUp);
                    _this.jQueryCanvas.on("mousemove", _this.onMouseMove);
                    _this.jQueryCanvas.on("mousedown", _this.onMouseDown);
                    _this.jQueryCanvas.on("mouseleave", _this.onMouseLeave);
                    _this.rebuild();
                };
                // Animation frame - must be on repeat as there are animations.
                this.anim = function () {
                    requestAnimationFrame(function (timestamp) {
                        _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
                        _this.map.redraw(_this.ctx, _this.projection, timestamp);
                        _this.anim();
                    });
                };
                this.onMouseClick = function (ev) {
                    const rect = _this.canvas.getBoundingClientRect();
                    const x = ev.clientX - rect.left;
                    const y = ev.clientY - rect.top;
                    const pos = WesnothTiles.pointToHexPos(x + _this.projection.left, y + _this.projection.top);
                    ev.preventDefault();
                    const hex = _this.$scope.model.get(pos.q, pos.r);
                    if (hex !== undefined) {
                        _this.$scope.$apply(function () {
                            _this.$scope.onHexClicked({ hex: hex });
                        });
                    }
                };
                this.onMouseMove = function (ev) {
                    if (_this.action == 0 /* NONE */) {
                        if (_this.$scope.showCursor()) {
                            _this.map.setCursorVisibility(true);
                            const rect = _this.canvas.getBoundingClientRect();
                            const x = ev.clientX - rect.left + _this.projection.left;
                            const y = ev.clientY - rect.top + _this.projection.top;
                            _this.map.moveCursor(x, y);
                        }
                    }
                    else {
                        if (_this.$scope.scrollable()) {
                            const rect = _this.canvas.getBoundingClientRect();
                            _this.projection.left = _this.actionStartX + _this.dragStartX - ev.clientX;
                            _this.projection.top = _this.actionStartY + _this.dragStartY - ev.clientY;
                            _this.projection.right = _this.projection.left + _this.canvas.width;
                            _this.projection.bottom = _this.projection.top + _this.canvas.height;
                            // check if still a click...
                            if ((_this.actionStartX - ev.clientX) * (_this.actionStartX - ev.clientX) + (_this.actionStartY - ev.clientY) * (_this.actionStartY - ev.clientY) > 100)
                                _this.action = 1 /* SCROLL */;
                        }
                    }
                };
                this.onMouseUp = function (ev) {
                    if (_this.action === 2 /* CLICK */ && _this.action !== 1 /* SCROLL */) {
                        if (angular.isFunction(_this.$scope.onHexClicked)) {
                            _this.onMouseClick(ev);
                        }
                    }
                    _this.action = 0 /* NONE */;
                };
                this.onMouseDown = function (ev) {
                    if (_this.action != 0 /* NONE */)
                        return;
                    _this.action = 2 /* CLICK */;
                    const rect = _this.canvas.getBoundingClientRect();
                    _this.dragStartX = _this.projection.left;
                    _this.dragStartY = _this.projection.top;
                    _this.actionStartX = ev.clientX;
                    _this.actionStartY = ev.clientY;
                };
                this.onMouseLeave = function (ev) {
                    _this.map.setCursorVisibility(false);
                    _this.action = 0 /* NONE */;
                };
                this.jQueryCanvas = element.find("canvas");
                this.canvas = this.jQueryCanvas[0];
                this.ctx = this.canvas.getContext("2d");
                WesnothTiles.init($config);
                WesnothTiles.createMap().then(this.init);
            }
            // Internal rebuild - tracks changes and orders a rebuild on underlying wesnoth-tiles library.
            Controller.prototype.rebuild = function () {
                var _this = this;
                if (this.$scope.model.version === 0)
                    return;
                // We need to find changes in the model.
                const builder = this.map.getBuilder(this.oldMap === undefined);
                // This map will become the this.oldMap after this redraw.
                const nextOldMap = new HexMap();
                //  iterate all the tiles, but set only those that has changed.
                this.$scope.model.iterate(function (hex) {
                    if (_this.oldMap !== undefined) {
                        const oldHex = _this.oldMap.get(hex.q, hex.r);
                        if (oldHex !== undefined && oldHex === hex && oldHex.terrain === hex.terrain && oldHex.overlay === hex.overlay && oldHex.fog === hex.fog) {
                            return;
                        }
                    }
                    builder.setTile(hex.q, hex.r, hex.terrain, hex.overlay, hex.fog);
                });
                builder.promise().then(function () { return _this.map.rebuild(); });
            };
            Controller.$controllerId = "WesnothAngularController";
            Controller.$inject = ["$scope", "$element", "WesnothTiles.config"];
            return Controller;
        })();
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
wesnothTiles.controller(WesnothTiles.Angular.Controller.$controllerId, WesnothTiles.Angular.Controller);
