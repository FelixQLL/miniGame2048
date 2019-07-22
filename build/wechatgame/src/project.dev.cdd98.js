window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Block: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3ee47exdHVOqKYo3TO02LWt", "Block");
    "use strict";
    var _Colors = require("Colors");
    var _Colors2 = _interopRequireDefault(_Colors);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        numberLabel: cc.Label
      },
      start: function start() {},
      setNumber: function setNumber(number) {
        0 == number && (this.numberLabel.node.active = false);
        this.numberLabel.string = number;
        number in _Colors2.default && (this.node.color = _Colors2.default[number]);
      }
    });
    cc._RF.pop();
  }, {
    Colors: "Colors"
  } ],
  Colors: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0b6d3D/G19Lm6YDEAuwiiKe", "Colors");
    "use strict";
    var colors = [];
    colors[0] = cc.color(198, 184, 172, 255);
    colors[2] = cc.color(235, 224, 213, 255);
    colors[4] = cc.color(234, 219, 193, 255);
    colors[8] = cc.color(240, 167, 110, 255);
    colors[16] = cc.color(244, 138, 89, 255);
    colors[32] = cc.color(245, 112, 85, 255);
    colors[64] = cc.color(245, 83, 52, 255);
    colors[128] = cc.color(234, 200, 103, 255);
    colors[256] = cc.color(234, 197, 87, 255);
    colors[512] = cc.color(234, 192, 71, 255);
    colors[1024] = cc.color(146, 208, 80, 255);
    colors[2048] = cc.color(0, 176, 240, 255);
    module.exports = colors;
    cc._RF.pop();
  }, {} ],
  Game3: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b1b9c9Q8NNMmJLfVkgQtcdJ", "Game3");
    "use strict";
    var ROWS = 3;
    var COLS = 3;
    var NUMBERS = [ 2, 4 ];
    var MIN_LENGTH = 50;
    var MOVE_DURATION = .1;
    cc.Class({
      extends: cc.Component,
      properties: {
        scoreLabel: cc.Label,
        score: 0,
        blockPrefab: cc.Prefab,
        containerPrefab: cc.Prefab,
        gap: 20,
        paddingGap: 19,
        bg: cc.Node,
        hitAudio: {
          default: null,
          type: cc.AudioClip
        },
        failedAudio: {
          default: null,
          type: cc.AudioClip
        },
        succeededAudio: {
          default: null,
          type: cc.AudioClip
        }
      },
      start: function start() {
        this.drawBgBlocks();
        this.init();
        this.addEventHandler();
      },
      onBtnBack: function onBtnBack() {
        cc.director.loadScene("Menu");
      },
      drawBgBlocks: function drawBgBlocks() {
        this.containerSize = cc.winSize.width - 2 * this.paddingGap;
        var cx = this.paddingGap + this.containerSize / 2;
        var cy = 5 * this.paddingGap;
        var container = cc.instantiate(this.containerPrefab);
        container.width = this.containerSize;
        container.height = this.containerSize;
        this.bg.addChild(container);
        container.setPosition(cc.v2(cx, cy));
        this.blockSize = (container.width - this.gap * (ROWS + 1)) / ROWS;
        var x = this.paddingGap + this.gap + this.blockSize / 2;
        var y = this.gap + this.blockSize;
        this.positions = [];
        for (var i = 0; i < ROWS; ++i) {
          this.positions.push([ 0, 0, 0 ]);
          for (var j = 0; j < COLS; ++j) {
            var block = cc.instantiate(this.blockPrefab);
            block.width = this.blockSize;
            block.height = this.blockSize;
            this.bg.addChild(block);
            block.setPosition(cc.v2(x, y));
            this.positions[i][j] = cc.v2(x, y);
            x += this.gap + this.blockSize;
            block.getComponent("Block").setNumber(0);
          }
          y += this.gap + this.blockSize;
          x = this.paddingGap + this.gap + this.blockSize / 2;
        }
      },
      init: function init() {
        this.updateScore(0);
        if (this.blocks) for (var i = 0; i < this.blocks.length; ++i) for (var j = 0; j < this.blocks[i].length; ++j) null != this.blocks[i][j] && this.blocks[i][j].destroy();
        this.data = [];
        this.blocks = [];
        for (var _i = 0; _i < ROWS; ++_i) {
          this.blocks.push([ null, null, null ]);
          this.data.push([ 0, 0, 0 ]);
        }
        this.addBlock();
        this.addBlock();
        this.addBlock();
      },
      updateScore: function updateScore(number) {
        this.score = number;
        this.scoreLabel.string = "Score:" + number;
      },
      getEmptyLocations: function getEmptyLocations() {
        var locations = [];
        for (var i = 0; i < this.blocks.length; ++i) for (var j = 0; j < this.blocks[i].length; ++j) null == this.blocks[i][j] && locations.push({
          x: i,
          y: j
        });
        return locations;
      },
      addBlock: function addBlock() {
        var locations = this.getEmptyLocations();
        if (0 == locations.length) return false;
        var location = locations[Math.floor(Math.random() * locations.length)];
        var x = location.x;
        var y = location.y;
        var position = this.positions[x][y];
        var block = cc.instantiate(this.blockPrefab);
        block.width = this.blockSize;
        block.height = this.blockSize;
        this.bg.addChild(block);
        block.setPosition(position);
        var number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
        block.getComponent("Block").setNumber(number);
        this.blocks[x][y] = block;
        this.data[x][y] = number;
        return true;
      },
      addEventHandler: function addEventHandler() {
        var _this = this;
        this.bg.on("touchstart", function(event) {
          _this.startPoint = event.getLocation();
        });
        this.bg.on("touchend", function(event) {
          _this.touchEnd(event);
        });
        this.bg.on("touchcancel", function(event) {
          _this.touchEnd(event);
        });
      },
      touchEnd: function touchEnd(event) {
        this.endPoint = event.getLocation();
        var vec = this.endPoint.sub(this.startPoint);
        vec.mag() > MIN_LENGTH && (Math.abs(vec.x) > Math.abs(vec.y) ? vec.x > 0 ? this.moveRight() : this.moveLeft() : vec.y > 0 ? this.moveUp() : this.moveDown());
      },
      checkFail: function checkFail() {
        for (var i = 0; i < ROWS; ++i) for (var j = 0; j < ROWS; ++j) {
          var n = this.data[i][j];
          if (0 == n) return false;
          if (j > 0 && this.data[i][j - 1] == n) return false;
          if (j < ROWS - 1 && this.data[i][j + 1] == n) return false;
          if (i > 0 && this.data[i - 1][j] == n) return false;
          if (i > ROWS - 1 && this.data[i + 1][j] == n) return false;
        }
        return true;
      },
      checkScceeded: function checkScceeded() {
        for (var i = 0; i < ROWS; ++i) for (var j = 0; j < ROWS; ++j) if (2048 == this.data[i][j]) return true;
        return false;
      },
      gameOver: function gameOver() {
        cc.director.loadScene("gameOver");
        cc.audioEngine.playEffect(this.failedAudio, false);
        cc.audioEngine.setEffectsVolume(.5);
      },
      succeeded: function succeeded() {
        cc.director.loadScene("Succeeded");
        cc.audioEngine.playEffect(this.succeededAudio, false);
        cc.audioEngine.setEffectsVolume(.5);
      },
      afterMove: function afterMove(hasMoved) {
        if (hasMoved) {
          this.updateScore(this.score + 1);
          this.addBlock();
        }
        this.checkFail() && this.gameOver();
        this.checkScceeded() && this.succeeded();
      },
      doMove: function doMove(block, position, callback) {
        var action = cc.moveTo(MOVE_DURATION, position);
        var finish = cc.callFunc(function() {
          callback && callback();
        });
        block.runAction(cc.sequence(action, finish));
      },
      moveLeft: function moveLeft() {
        var _this2 = this;
        var hasMoved = false;
        var move = function move(x, y, callback) {
          if (0 == y || 0 == _this2.data[x][y]) {
            callback && callback();
            return;
          }
          if (0 == _this2.data[x][y - 1]) {
            var block = _this2.blocks[x][y];
            var position = _this2.positions[x][y - 1];
            _this2.blocks[x][y - 1] = block;
            _this2.data[x][y - 1] = _this2.data[x][y];
            _this2.data[x][y] = 0;
            _this2.blocks[x][y] = null;
            _this2.doMove(block, position, function() {
              move(x, y - 1, callback);
            });
            hasMoved = true;
          } else {
            if (_this2.data[x][y - 1] != _this2.data[x][y]) {
              callback && callback();
              return;
            }
            var _block = _this2.blocks[x][y];
            var _position = _this2.positions[x][y - 1];
            _this2.data[x][y - 1] *= 2;
            _this2.data[x][y] = 0;
            _this2.blocks[x][y] = null;
            _this2.blocks[x][y - 1].getComponent("Block").setNumber(_this2.data[x][y - 1]);
            _this2.doMove(_block, _position, function() {
              _block.destroy();
              callback && callback();
            });
            cc.audioEngine.playEffect(_this2.hitAudio, false);
            cc.audioEngine.setEffectsVolume(.1);
            hasMoved = true;
          }
        };
        var toMove = [];
        for (var i = 0; i < ROWS; ++i) for (var j = 0; j < ROWS; ++j) 0 != this.data[i][j] && toMove.push({
          x: i,
          y: j
        });
        var counter = 0;
        for (var _i2 = 0; _i2 < toMove.length; ++_i2) move(toMove[_i2].x, toMove[_i2].y, function() {
          counter++;
          counter == toMove.length && _this2.afterMove(hasMoved);
        });
      },
      moveRight: function moveRight() {
        var _this3 = this;
        var hasMoved = false;
        var move = function move(x, y, callback) {
          if (y == ROWS - 1 || 0 == _this3.data[x][y]) {
            callback && callback();
            return;
          }
          if (0 == _this3.data[x][y + 1]) {
            var block = _this3.blocks[x][y];
            var position = _this3.positions[x][y + 1];
            _this3.blocks[x][y + 1] = block;
            _this3.data[x][y + 1] = _this3.data[x][y];
            _this3.data[x][y] = 0;
            _this3.blocks[x][y] = null;
            _this3.doMove(block, position, function() {
              move(x, y + 1, callback);
            });
            hasMoved = true;
          } else {
            if (_this3.data[x][y + 1] != _this3.data[x][y]) {
              callback && callback();
              return;
            }
            var _block2 = _this3.blocks[x][y];
            var _position2 = _this3.positions[x][y + 1];
            _this3.data[x][y + 1] *= 2;
            _this3.data[x][y] = 0;
            _this3.blocks[x][y] = null;
            _this3.blocks[x][y + 1].getComponent("Block").setNumber(_this3.data[x][y + 1]);
            _this3.doMove(_block2, _position2, function() {
              _block2.destroy();
              callback && callback();
            });
            cc.audioEngine.playEffect(_this3.hitAudio, false);
            cc.audioEngine.setEffectsVolume(.1);
            hasMoved = true;
          }
        };
        var toMove = [];
        for (var i = 0; i < ROWS; ++i) for (var j = ROWS - 1; j >= 0; --j) 0 != this.data[i][j] && toMove.push({
          x: i,
          y: j
        });
        var counter = 0;
        for (var _i3 = 0; _i3 < toMove.length; ++_i3) move(toMove[_i3].x, toMove[_i3].y, function() {
          counter++;
          counter == toMove.length && _this3.afterMove(hasMoved);
        });
      },
      moveUp: function moveUp() {
        var _this4 = this;
        var hasMoved = false;
        var move = function move(x, y, callback) {
          if (x == ROWS - 1 || 0 == _this4.data[x][y]) {
            callback && callback();
            return;
          }
          if (0 == _this4.data[x + 1][y]) {
            var block = _this4.blocks[x][y];
            var position = _this4.positions[x + 1][y];
            _this4.blocks[x + 1][y] = block;
            _this4.data[x + 1][y] = _this4.data[x][y];
            _this4.data[x][y] = 0;
            _this4.blocks[x][y] = null;
            _this4.doMove(block, position, function() {
              move(x + 1, y, callback);
            });
            hasMoved = true;
          } else {
            if (_this4.data[x + 1][y] != _this4.data[x][y]) {
              callback && callback();
              return;
            }
            var _block3 = _this4.blocks[x][y];
            var _position3 = _this4.positions[x + 1][y];
            _this4.data[x + 1][y] *= 2;
            _this4.data[x][y] = 0;
            _this4.blocks[x][y] = null;
            _this4.blocks[x + 1][y].getComponent("Block").setNumber(_this4.data[x + 1][y]);
            _this4.doMove(_block3, _position3, function() {
              _block3.destroy();
              callback && callback();
            });
            cc.audioEngine.playEffect(_this4.hitAudio, false);
            cc.audioEngine.setEffectsVolume(.1);
            hasMoved = true;
          }
        };
        var toMove = [];
        for (var i = ROWS - 1; i >= 0; --i) for (var j = 0; j < ROWS; ++j) 0 != this.data[i][j] && toMove.push({
          x: i,
          y: j
        });
        var counter = 0;
        for (var _i4 = 0; _i4 < toMove.length; ++_i4) move(toMove[_i4].x, toMove[_i4].y, function() {
          counter++;
          counter == toMove.length && _this4.afterMove(hasMoved);
        });
      },
      moveDown: function moveDown() {
        var _this5 = this;
        var hasMoved = false;
        var move = function move(x, y, callback) {
          if (0 == x || 0 == _this5.data[x][y]) {
            callback && callback();
            return;
          }
          if (0 == _this5.data[x - 1][y]) {
            var block = _this5.blocks[x][y];
            var position = _this5.positions[x - 1][y];
            _this5.blocks[x - 1][y] = block;
            _this5.data[x - 1][y] = _this5.data[x][y];
            _this5.data[x][y] = 0;
            _this5.blocks[x][y] = null;
            _this5.doMove(block, position, function() {
              move(x - 1, y, callback);
            });
            hasMoved = true;
          } else {
            if (_this5.data[x - 1][y] != _this5.data[x][y]) {
              callback && callback();
              return;
            }
            var _block4 = _this5.blocks[x][y];
            var _position4 = _this5.positions[x - 1][y];
            _this5.data[x - 1][y] *= 2;
            _this5.data[x][y] = 0;
            _this5.blocks[x][y] = null;
            _this5.blocks[x - 1][y].getComponent("Block").setNumber(_this5.data[x - 1][y]);
            _this5.doMove(_block4, _position4, function() {
              _block4.destroy();
              callback && callback();
            });
            cc.audioEngine.playEffect(_this5.hitAudio, false);
            cc.audioEngine.setEffectsVolume(.1);
            hasMoved = true;
          }
        };
        var toMove = [];
        for (var i = 0; i < ROWS; ++i) for (var j = 0; j < ROWS; ++j) 0 != this.data[i][j] && toMove.push({
          x: i,
          y: j
        });
        var counter = 0;
        for (var _i5 = 0; _i5 < toMove.length; ++_i5) move(toMove[_i5].x, toMove[_i5].y, function() {
          counter++;
          counter == toMove.length && _this5.afterMove(hasMoved);
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  Game4: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b907abIOSFOnoXqrLD3RiJ4", "Game4");
    "use strict";
    var ROWS = 4;
    var COLS = 4;
    var NUMBERS = [ 2, 4 ];
    var MIN_LENGTH = 50;
    var MOVE_DURATION = .1;
    cc.Class({
      extends: cc.Component,
      properties: {
        scoreLabel: cc.Label,
        score: 0,
        blockPrefab: cc.Prefab,
        containerPrefab: cc.Prefab,
        gap: 16,
        paddingGap: 19,
        bg: cc.Node,
        hitAudio: {
          default: null,
          type: cc.AudioClip
        },
        failedAudio: {
          default: null,
          type: cc.AudioClip
        },
        succeededAudio: {
          default: null,
          type: cc.AudioClip
        }
      },
      start: function start() {
        this.drawBgBlocks();
        this.init();
        this.addEventHandler();
      },
      onBtnBack: function onBtnBack() {
        cc.director.loadScene("Menu");
      },
      drawBgBlocks: function drawBgBlocks() {
        this.containerSize = cc.winSize.width - 2 * this.paddingGap;
        var cx = this.paddingGap + this.containerSize / 2;
        var cy = 5 * this.paddingGap;
        var container = cc.instantiate(this.containerPrefab);
        container.width = this.containerSize;
        container.height = this.containerSize;
        this.bg.addChild(container);
        container.setPosition(cc.v2(cx, cy));
        this.blockSize = (container.width - this.gap * (ROWS + 1)) / ROWS;
        var x = this.paddingGap + this.gap + this.blockSize / 2;
        var y = this.paddingGap + this.gap + this.blockSize;
        this.positions = [];
        for (var i = 0; i < ROWS; ++i) {
          this.positions.push([ 0, 0, 0, 0 ]);
          for (var j = 0; j < COLS; ++j) {
            var block = cc.instantiate(this.blockPrefab);
            block.width = this.blockSize;
            block.height = this.blockSize;
            this.bg.addChild(block);
            block.setPosition(cc.v2(x, y));
            this.positions[i][j] = cc.v2(x, y);
            x += this.gap + this.blockSize;
            block.getComponent("Block").setNumber(0);
          }
          y += this.gap + this.blockSize;
          x = this.paddingGap + this.gap + this.blockSize / 2;
        }
      },
      init: function init() {
        this.updateScore(0);
        if (this.blocks) for (var i = 0; i < this.blocks.length; ++i) for (var j = 0; j < this.blocks[i].length; ++j) null != this.blocks[i][j] && this.blocks[i][j].destroy();
        this.data = [];
        this.blocks = [];
        for (var _i = 0; _i < ROWS; ++_i) {
          this.blocks.push([ null, null, null, null ]);
          this.data.push([ 0, 0, 0, 0 ]);
        }
        this.addBlock();
        this.addBlock();
        this.addBlock();
      },
      updateScore: function updateScore(number) {
        this.score = number;
        this.scoreLabel.string = "Score:" + number;
      },
      getEmptyLocations: function getEmptyLocations() {
        var locations = [];
        for (var i = 0; i < this.blocks.length; ++i) for (var j = 0; j < this.blocks[i].length; ++j) null == this.blocks[i][j] && locations.push({
          x: i,
          y: j
        });
        return locations;
      },
      addBlock: function addBlock() {
        var locations = this.getEmptyLocations();
        if (0 == locations.length) return false;
        var location = locations[Math.floor(Math.random() * locations.length)];
        var x = location.x;
        var y = location.y;
        var position = this.positions[x][y];
        var block = cc.instantiate(this.blockPrefab);
        block.width = this.blockSize;
        block.height = this.blockSize;
        this.bg.addChild(block);
        block.setPosition(position);
        var number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
        block.getComponent("Block").setNumber(number);
        this.blocks[x][y] = block;
        this.data[x][y] = number;
        return true;
      },
      addEventHandler: function addEventHandler() {
        var _this = this;
        this.bg.on("touchstart", function(event) {
          _this.startPoint = event.getLocation();
        });
        this.bg.on("touchend", function(event) {
          _this.touchEnd(event);
        });
        this.bg.on("touchcancel", function(event) {
          _this.touchEnd(event);
        });
      },
      touchEnd: function touchEnd(event) {
        this.endPoint = event.getLocation();
        var vec = this.endPoint.sub(this.startPoint);
        vec.mag() > MIN_LENGTH && (Math.abs(vec.x) > Math.abs(vec.y) ? vec.x > 0 ? this.moveRight() : this.moveLeft() : vec.y > 0 ? this.moveUp() : this.moveDown());
      },
      checkFail: function checkFail() {
        for (var i = 0; i < ROWS; ++i) for (var j = 0; j < ROWS; ++j) {
          var n = this.data[i][j];
          if (0 == n) return false;
          if (j > 0 && this.data[i][j - 1] == n) return false;
          if (j < ROWS - 1 && this.data[i][j + 1] == n) return false;
          if (i > 0 && this.data[i - 1][j] == n) return false;
          if (i > ROWS - 1 && this.data[i + 1][j] == n) return false;
        }
        return true;
      },
      checkScceeded: function checkScceeded() {
        for (var i = 0; i < ROWS; ++i) for (var j = 0; j < ROWS; ++j) if (2048 == this.data[i][j]) return true;
        return false;
      },
      gameOver: function gameOver() {
        cc.director.loadScene("gameOver");
        cc.audioEngine.playEffect(this.failedAudio, false);
        cc.audioEngine.setEffectsVolume(.5);
      },
      succeeded: function succeeded() {
        cc.director.loadScene("Succeeded");
        cc.audioEngine.playEffect(this.succeededAudio, false);
        cc.audioEngine.setEffectsVolume(.5);
      },
      afterMove: function afterMove(hasMoved) {
        if (hasMoved) {
          this.updateScore(this.score + 1);
          this.addBlock();
        }
        this.checkFail() && this.gameOver();
        this.checkScceeded() && this.succeeded();
      },
      doMove: function doMove(block, position, callback) {
        var action = cc.moveTo(MOVE_DURATION, position);
        var finish = cc.callFunc(function() {
          callback && callback();
        });
        block.runAction(cc.sequence(action, finish));
      },
      moveLeft: function moveLeft() {
        var _this2 = this;
        var hasMoved = false;
        var move = function move(x, y, callback) {
          if (0 == y || 0 == _this2.data[x][y]) {
            callback && callback();
            return;
          }
          if (0 == _this2.data[x][y - 1]) {
            var block = _this2.blocks[x][y];
            var position = _this2.positions[x][y - 1];
            _this2.blocks[x][y - 1] = block;
            _this2.data[x][y - 1] = _this2.data[x][y];
            _this2.data[x][y] = 0;
            _this2.blocks[x][y] = null;
            _this2.doMove(block, position, function() {
              move(x, y - 1, callback);
            });
            hasMoved = true;
          } else {
            if (_this2.data[x][y - 1] != _this2.data[x][y]) {
              callback && callback();
              return;
            }
            var _block = _this2.blocks[x][y];
            var _position = _this2.positions[x][y - 1];
            _this2.data[x][y - 1] *= 2;
            _this2.data[x][y] = 0;
            _this2.blocks[x][y] = null;
            _this2.blocks[x][y - 1].getComponent("Block").setNumber(_this2.data[x][y - 1]);
            _this2.doMove(_block, _position, function() {
              _block.destroy();
              callback && callback();
            });
            cc.audioEngine.playEffect(_this2.hitAudio, false);
            cc.audioEngine.setEffectsVolume(.1);
            hasMoved = true;
          }
        };
        var toMove = [];
        for (var i = 0; i < ROWS; ++i) for (var j = 0; j < ROWS; ++j) 0 != this.data[i][j] && toMove.push({
          x: i,
          y: j
        });
        var counter = 0;
        for (var _i2 = 0; _i2 < toMove.length; ++_i2) move(toMove[_i2].x, toMove[_i2].y, function() {
          counter++;
          counter == toMove.length && _this2.afterMove(hasMoved);
        });
      },
      moveRight: function moveRight() {
        var _this3 = this;
        var hasMoved = false;
        var move = function move(x, y, callback) {
          if (y == ROWS - 1 || 0 == _this3.data[x][y]) {
            callback && callback();
            return;
          }
          if (0 == _this3.data[x][y + 1]) {
            var block = _this3.blocks[x][y];
            var position = _this3.positions[x][y + 1];
            _this3.blocks[x][y + 1] = block;
            _this3.data[x][y + 1] = _this3.data[x][y];
            _this3.data[x][y] = 0;
            _this3.blocks[x][y] = null;
            _this3.doMove(block, position, function() {
              move(x, y + 1, callback);
            });
            hasMoved = true;
          } else {
            if (_this3.data[x][y + 1] != _this3.data[x][y]) {
              callback && callback();
              return;
            }
            var _block2 = _this3.blocks[x][y];
            var _position2 = _this3.positions[x][y + 1];
            _this3.data[x][y + 1] *= 2;
            _this3.data[x][y] = 0;
            _this3.blocks[x][y] = null;
            _this3.blocks[x][y + 1].getComponent("Block").setNumber(_this3.data[x][y + 1]);
            _this3.doMove(_block2, _position2, function() {
              _block2.destroy();
              callback && callback();
            });
            cc.audioEngine.playEffect(_this3.hitAudio, false);
            cc.audioEngine.setEffectsVolume(.1);
            hasMoved = true;
          }
        };
        var toMove = [];
        for (var i = 0; i < ROWS; ++i) for (var j = ROWS - 1; j >= 0; --j) 0 != this.data[i][j] && toMove.push({
          x: i,
          y: j
        });
        var counter = 0;
        for (var _i3 = 0; _i3 < toMove.length; ++_i3) move(toMove[_i3].x, toMove[_i3].y, function() {
          counter++;
          counter == toMove.length && _this3.afterMove(hasMoved);
        });
      },
      moveUp: function moveUp() {
        var _this4 = this;
        var hasMoved = false;
        var move = function move(x, y, callback) {
          if (x == ROWS - 1 || 0 == _this4.data[x][y]) {
            callback && callback();
            return;
          }
          if (0 == _this4.data[x + 1][y]) {
            var block = _this4.blocks[x][y];
            var position = _this4.positions[x + 1][y];
            _this4.blocks[x + 1][y] = block;
            _this4.data[x + 1][y] = _this4.data[x][y];
            _this4.data[x][y] = 0;
            _this4.blocks[x][y] = null;
            _this4.doMove(block, position, function() {
              move(x + 1, y, callback);
            });
            hasMoved = true;
          } else {
            if (_this4.data[x + 1][y] != _this4.data[x][y]) {
              callback && callback();
              return;
            }
            var _block3 = _this4.blocks[x][y];
            var _position3 = _this4.positions[x + 1][y];
            _this4.data[x + 1][y] *= 2;
            _this4.data[x][y] = 0;
            _this4.blocks[x][y] = null;
            _this4.blocks[x + 1][y].getComponent("Block").setNumber(_this4.data[x + 1][y]);
            _this4.doMove(_block3, _position3, function() {
              _block3.destroy();
              callback && callback();
            });
            cc.audioEngine.playEffect(_this4.hitAudio, false);
            cc.audioEngine.setEffectsVolume(.1);
            hasMoved = true;
          }
        };
        var toMove = [];
        for (var i = ROWS - 1; i >= 0; --i) for (var j = 0; j < ROWS; ++j) 0 != this.data[i][j] && toMove.push({
          x: i,
          y: j
        });
        var counter = 0;
        for (var _i4 = 0; _i4 < toMove.length; ++_i4) move(toMove[_i4].x, toMove[_i4].y, function() {
          counter++;
          counter == toMove.length && _this4.afterMove(hasMoved);
        });
      },
      moveDown: function moveDown() {
        var _this5 = this;
        var hasMoved = false;
        var move = function move(x, y, callback) {
          if (0 == x || 0 == _this5.data[x][y]) {
            callback && callback();
            return;
          }
          if (0 == _this5.data[x - 1][y]) {
            var block = _this5.blocks[x][y];
            var position = _this5.positions[x - 1][y];
            _this5.blocks[x - 1][y] = block;
            _this5.data[x - 1][y] = _this5.data[x][y];
            _this5.data[x][y] = 0;
            _this5.blocks[x][y] = null;
            _this5.doMove(block, position, function() {
              move(x - 1, y, callback);
            });
            hasMoved = true;
          } else {
            if (_this5.data[x - 1][y] != _this5.data[x][y]) {
              callback && callback();
              return;
            }
            var _block4 = _this5.blocks[x][y];
            var _position4 = _this5.positions[x - 1][y];
            _this5.data[x - 1][y] *= 2;
            _this5.data[x][y] = 0;
            _this5.blocks[x][y] = null;
            _this5.blocks[x - 1][y].getComponent("Block").setNumber(_this5.data[x - 1][y]);
            _this5.doMove(_block4, _position4, function() {
              _block4.destroy();
              callback && callback();
            });
            cc.audioEngine.playEffect(_this5.hitAudio, false);
            cc.audioEngine.setEffectsVolume(.1);
            hasMoved = true;
          }
        };
        var toMove = [];
        for (var i = 0; i < ROWS; ++i) for (var j = 0; j < ROWS; ++j) 0 != this.data[i][j] && toMove.push({
          x: i,
          y: j
        });
        var counter = 0;
        for (var _i5 = 0; _i5 < toMove.length; ++_i5) move(toMove[_i5].x, toMove[_i5].y, function() {
          counter++;
          counter == toMove.length && _this5.afterMove(hasMoved);
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  Game8: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e7443JllC5C06aS/ltX9kF6", "Game8");
    "use strict";
    var ROWS = 8;
    var COLS = 8;
    var NUMBERS = [ 2, 4 ];
    var MIN_LENGTH = 50;
    var MOVE_DURATION = .02;
    cc.Class({
      extends: cc.Component,
      properties: {
        scoreLabel: cc.Label,
        score: 0,
        blockPrefab: cc.Prefab,
        containerPrefab: cc.Prefab,
        gap: 16,
        paddingGap: 20,
        bg: cc.Node,
        hitAudio: {
          default: null,
          type: cc.AudioClip
        },
        failedAudio: {
          default: null,
          type: cc.AudioClip
        },
        succeededAudio: {
          default: null,
          type: cc.AudioClip
        }
      },
      start: function start() {
        this.drawBgBlocks();
        this.init();
        this.addEventHandler();
      },
      onBtnBack: function onBtnBack() {
        cc.director.loadScene("Menu");
      },
      drawBgBlocks: function drawBgBlocks() {
        this.containerSize = cc.winSize.width - 2 * this.paddingGap;
        var cx = this.paddingGap + this.containerSize / 2;
        var cy = 5 * this.paddingGap;
        var container = cc.instantiate(this.containerPrefab);
        container.width = this.containerSize;
        container.height = this.containerSize;
        this.bg.addChild(container);
        container.setPosition(cc.v2(cx, cy));
        this.blockSize = (container.width - this.gap * (ROWS + 1)) / ROWS;
        var x = this.paddingGap + this.gap + this.blockSize / 2;
        var y = this.paddingGap + 4 * this.gap + this.blockSize;
        this.positions = [];
        for (var i = 0; i < ROWS; ++i) {
          this.positions.push([ 0, 0, 0, 0, 0, 0, 0, 0 ]);
          for (var j = 0; j < COLS; ++j) {
            var block = cc.instantiate(this.blockPrefab);
            block.width = this.blockSize;
            block.height = this.blockSize;
            this.bg.addChild(block);
            block.setPosition(cc.v2(x, y));
            this.positions[i][j] = cc.v2(x, y);
            x += this.gap + this.blockSize;
            block.getComponent("Block").setNumber(0);
          }
          y += this.gap + this.blockSize;
          x = this.paddingGap + this.gap + this.blockSize / 2;
        }
      },
      init: function init() {
        this.updateScore(0);
        if (this.blocks) for (var i = 0; i < this.blocks.length; ++i) for (var j = 0; j < this.blocks[i].length; ++j) null != this.blocks[i][j] && this.blocks[i][j].destroy();
        this.data = [];
        this.blocks = [];
        for (var _i = 0; _i < ROWS; ++_i) {
          this.blocks.push([ null, null, null, null, null, null, null, null ]);
          this.data.push([ 0, 0, 0, 0, 0, 0, 0, 0 ]);
        }
        this.addBlock();
        this.addBlock();
        this.addBlock();
      },
      updateScore: function updateScore(number) {
        this.score = number;
        this.scoreLabel.string = "Score:" + number;
      },
      getEmptyLocations: function getEmptyLocations() {
        var locations = [];
        for (var i = 0; i < this.blocks.length; ++i) for (var j = 0; j < this.blocks[i].length; ++j) null == this.blocks[i][j] && locations.push({
          x: i,
          y: j
        });
        return locations;
      },
      addBlock: function addBlock() {
        var locations = this.getEmptyLocations();
        if (0 == locations.length) return false;
        var location = locations[Math.floor(Math.random() * locations.length)];
        var x = location.x;
        var y = location.y;
        var position = this.positions[x][y];
        var block = cc.instantiate(this.blockPrefab);
        block.width = this.blockSize;
        block.height = this.blockSize;
        this.bg.addChild(block);
        block.setPosition(position);
        var number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
        block.getComponent("Block").setNumber(number);
        this.blocks[x][y] = block;
        this.data[x][y] = number;
        return true;
      },
      addEventHandler: function addEventHandler() {
        var _this = this;
        this.bg.on("touchstart", function(event) {
          _this.startPoint = event.getLocation();
        });
        this.bg.on("touchend", function(event) {
          _this.touchEnd(event);
        });
        this.bg.on("touchcancel", function(event) {
          _this.touchEnd(event);
        });
      },
      touchEnd: function touchEnd(event) {
        this.endPoint = event.getLocation();
        var vec = this.endPoint.sub(this.startPoint);
        vec.mag() > MIN_LENGTH && (Math.abs(vec.x) > Math.abs(vec.y) ? vec.x > 0 ? this.moveRight() : this.moveLeft() : vec.y > 0 ? this.moveUp() : this.moveDown());
      },
      checkFail: function checkFail() {
        for (var i = 0; i < ROWS; ++i) for (var j = 0; j < ROWS; ++j) {
          var n = this.data[i][j];
          if (0 == n) return false;
          if (j > 0 && this.data[i][j - 1] == n) return false;
          if (j < ROWS - 1 && this.data[i][j + 1] == n) return false;
          if (i > 0 && this.data[i - 1][j] == n) return false;
          if (i > ROWS - 1 && this.data[i + 1][j] == n) return false;
        }
        return true;
      },
      checkScceeded: function checkScceeded() {
        for (var i = 0; i < ROWS; ++i) for (var j = 0; j < ROWS; ++j) if (2048 == this.data[i][j]) return true;
        return false;
      },
      gameOver: function gameOver() {
        cc.director.loadScene("gameOver");
        cc.audioEngine.playEffect(this.failedAudio, false);
        cc.audioEngine.setEffectsVolume(.5);
      },
      succeeded: function succeeded() {
        cc.director.loadScene("Succeeded");
        cc.audioEngine.playEffect(this.succeededAudio, false);
        cc.audioEngine.setEffectsVolume(.5);
      },
      afterMove: function afterMove(hasMoved) {
        if (hasMoved) {
          this.updateScore(this.score + 1);
          this.addBlock();
        }
        this.checkFail() && this.gameOver();
        this.checkScceeded() && this.succeeded();
      },
      doMove: function doMove(block, position, callback) {
        var action = cc.moveTo(MOVE_DURATION, position);
        var finish = cc.callFunc(function() {
          callback && callback();
        });
        block.runAction(cc.sequence(action, finish));
      },
      moveLeft: function moveLeft() {
        var _this2 = this;
        var hasMoved = false;
        var move = function move(x, y, callback) {
          if (0 == y || 0 == _this2.data[x][y]) {
            callback && callback();
            return;
          }
          if (0 == _this2.data[x][y - 1]) {
            var block = _this2.blocks[x][y];
            var position = _this2.positions[x][y - 1];
            _this2.blocks[x][y - 1] = block;
            _this2.data[x][y - 1] = _this2.data[x][y];
            _this2.data[x][y] = 0;
            _this2.blocks[x][y] = null;
            _this2.doMove(block, position, function() {
              move(x, y - 1, callback);
            });
            hasMoved = true;
          } else {
            if (_this2.data[x][y - 1] != _this2.data[x][y]) {
              callback && callback();
              return;
            }
            var _block = _this2.blocks[x][y];
            var _position = _this2.positions[x][y - 1];
            _this2.data[x][y - 1] *= 2;
            _this2.data[x][y] = 0;
            _this2.blocks[x][y] = null;
            _this2.blocks[x][y - 1].getComponent("Block").setNumber(_this2.data[x][y - 1]);
            _this2.doMove(_block, _position, function() {
              _block.destroy();
              callback && callback();
            });
            cc.audioEngine.playEffect(_this2.hitAudio, false);
            cc.audioEngine.setEffectsVolume(.1);
            hasMoved = true;
          }
        };
        var toMove = [];
        for (var i = 0; i < ROWS; ++i) for (var j = 0; j < ROWS; ++j) 0 != this.data[i][j] && toMove.push({
          x: i,
          y: j
        });
        var counter = 0;
        for (var _i2 = 0; _i2 < toMove.length; ++_i2) move(toMove[_i2].x, toMove[_i2].y, function() {
          counter++;
          counter == toMove.length && _this2.afterMove(hasMoved);
        });
      },
      moveRight: function moveRight() {
        var _this3 = this;
        var hasMoved = false;
        var move = function move(x, y, callback) {
          if (y == ROWS - 1 || 0 == _this3.data[x][y]) {
            callback && callback();
            return;
          }
          if (0 == _this3.data[x][y + 1]) {
            var block = _this3.blocks[x][y];
            var position = _this3.positions[x][y + 1];
            _this3.blocks[x][y + 1] = block;
            _this3.data[x][y + 1] = _this3.data[x][y];
            _this3.data[x][y] = 0;
            _this3.blocks[x][y] = null;
            _this3.doMove(block, position, function() {
              move(x, y + 1, callback);
            });
            hasMoved = true;
          } else {
            if (_this3.data[x][y + 1] != _this3.data[x][y]) {
              callback && callback();
              return;
            }
            var _block2 = _this3.blocks[x][y];
            var _position2 = _this3.positions[x][y + 1];
            _this3.data[x][y + 1] *= 2;
            _this3.data[x][y] = 0;
            _this3.blocks[x][y] = null;
            _this3.blocks[x][y + 1].getComponent("Block").setNumber(_this3.data[x][y + 1]);
            _this3.doMove(_block2, _position2, function() {
              _block2.destroy();
              callback && callback();
            });
            cc.audioEngine.playEffect(_this3.hitAudio, false);
            cc.audioEngine.setEffectsVolume(.1);
            hasMoved = true;
          }
        };
        var toMove = [];
        for (var i = 0; i < ROWS; ++i) for (var j = ROWS - 1; j >= 0; --j) 0 != this.data[i][j] && toMove.push({
          x: i,
          y: j
        });
        var counter = 0;
        for (var _i3 = 0; _i3 < toMove.length; ++_i3) move(toMove[_i3].x, toMove[_i3].y, function() {
          counter++;
          counter == toMove.length && _this3.afterMove(hasMoved);
        });
      },
      moveUp: function moveUp() {
        var _this4 = this;
        var hasMoved = false;
        var move = function move(x, y, callback) {
          if (x == ROWS - 1 || 0 == _this4.data[x][y]) {
            callback && callback();
            return;
          }
          if (0 == _this4.data[x + 1][y]) {
            var block = _this4.blocks[x][y];
            var position = _this4.positions[x + 1][y];
            _this4.blocks[x + 1][y] = block;
            _this4.data[x + 1][y] = _this4.data[x][y];
            _this4.data[x][y] = 0;
            _this4.blocks[x][y] = null;
            _this4.doMove(block, position, function() {
              move(x + 1, y, callback);
            });
            hasMoved = true;
          } else {
            if (_this4.data[x + 1][y] != _this4.data[x][y]) {
              callback && callback();
              return;
            }
            var _block3 = _this4.blocks[x][y];
            var _position3 = _this4.positions[x + 1][y];
            _this4.data[x + 1][y] *= 2;
            _this4.data[x][y] = 0;
            _this4.blocks[x][y] = null;
            _this4.blocks[x + 1][y].getComponent("Block").setNumber(_this4.data[x + 1][y]);
            _this4.doMove(_block3, _position3, function() {
              _block3.destroy();
              callback && callback();
            });
            cc.audioEngine.playEffect(_this4.hitAudio, false);
            cc.audioEngine.setEffectsVolume(.1);
            hasMoved = true;
          }
        };
        var toMove = [];
        for (var i = ROWS - 1; i >= 0; --i) for (var j = 0; j < ROWS; ++j) 0 != this.data[i][j] && toMove.push({
          x: i,
          y: j
        });
        var counter = 0;
        for (var _i4 = 0; _i4 < toMove.length; ++_i4) move(toMove[_i4].x, toMove[_i4].y, function() {
          counter++;
          counter == toMove.length && _this4.afterMove(hasMoved);
        });
      },
      moveDown: function moveDown() {
        var _this5 = this;
        var hasMoved = false;
        var move = function move(x, y, callback) {
          if (0 == x || 0 == _this5.data[x][y]) {
            callback && callback();
            return;
          }
          if (0 == _this5.data[x - 1][y]) {
            var block = _this5.blocks[x][y];
            var position = _this5.positions[x - 1][y];
            _this5.blocks[x - 1][y] = block;
            _this5.data[x - 1][y] = _this5.data[x][y];
            _this5.data[x][y] = 0;
            _this5.blocks[x][y] = null;
            _this5.doMove(block, position, function() {
              move(x - 1, y, callback);
            });
            hasMoved = true;
          } else {
            if (_this5.data[x - 1][y] != _this5.data[x][y]) {
              callback && callback();
              return;
            }
            var _block4 = _this5.blocks[x][y];
            var _position4 = _this5.positions[x - 1][y];
            _this5.data[x - 1][y] *= 2;
            _this5.data[x][y] = 0;
            _this5.blocks[x][y] = null;
            _this5.blocks[x - 1][y].getComponent("Block").setNumber(_this5.data[x - 1][y]);
            _this5.doMove(_block4, _position4, function() {
              _block4.destroy();
              callback && callback();
            });
            cc.audioEngine.playEffect(_this5.hitAudio, false);
            cc.audioEngine.setEffectsVolume(.1);
            hasMoved = true;
          }
        };
        var toMove = [];
        for (var i = 0; i < ROWS; ++i) for (var j = 0; j < ROWS; ++j) 0 != this.data[i][j] && toMove.push({
          x: i,
          y: j
        });
        var counter = 0;
        for (var _i5 = 0; _i5 < toMove.length; ++_i5) move(toMove[_i5].x, toMove[_i5].y, function() {
          counter++;
          counter == toMove.length && _this5.afterMove(hasMoved);
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  Index: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "eea74p8pfZLtL15dIsTDQa5", "Index");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {},
      onBtnStart: function onBtnStart() {
        cc.director.loadScene("Menu");
      }
    });
    cc._RF.pop();
  }, {} ],
  Menu: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c4a5cZ9FBlDYLpyxOJQZgBn", "Menu");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {},
      onBtnBack: function onBtnBack() {
        cc.director.loadScene("Index");
      },
      onBtnStartGame3: function onBtnStartGame3() {
        cc.director.loadScene("Game3");
      },
      onBtnStartGame4: function onBtnStartGame4() {
        cc.director.loadScene("Game4");
      },
      onBtnStartGame8: function onBtnStartGame8() {
        cc.director.loadScene("Game8");
      }
    });
    cc._RF.pop();
  }, {} ],
  Restart: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "63549UNHRxDophOWYdLGQbq", "Restart");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {},
      onBtnRestart: function onBtnRestart() {
        cc.director.loadScene("Menu");
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "Block", "Colors", "Game3", "Game4", "Game8", "Index", "Menu", "Restart" ]);