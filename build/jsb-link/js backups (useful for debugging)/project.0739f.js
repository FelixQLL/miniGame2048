window.__require = function t(o, i, e) {
function c(n, s) {
if (!i[n]) {
if (!o[n]) {
var r = n.split("/");
r = r[r.length - 1];
if (!o[r]) {
var d = "function" == typeof __require && __require;
if (!s && d) return d(r, !0);
if (a) return a(r, !0);
throw new Error("Cannot find module '" + n + "'");
}
}
var l = i[n] = {
exports: {}
};
o[n][0].call(l.exports, function(t) {
return c(o[n][1][t] || t);
}, l, l.exports, t, o, i, e);
}
return i[n].exports;
}
for (var a = "function" == typeof __require && __require, n = 0; n < e.length; n++) c(e[n]);
return c;
}({
Block: [ function(t, o, i) {
"use strict";
cc._RF.push(o, "3ee47exdHVOqKYo3TO02LWt", "Block");
var e = function(t) {
return t && t.__esModule ? t : {
default: t
};
}(t("Colors"));
cc.Class({
extends: cc.Component,
properties: {
numberLabel: cc.Label
},
start: function() {},
setNumber: function(t) {
0 == t && (this.numberLabel.node.active = !1);
this.numberLabel.string = t;
t in e.default && (this.node.color = e.default[t]);
}
});
cc._RF.pop();
}, {
Colors: "Colors"
} ],
Colors: [ function(t, o, i) {
"use strict";
cc._RF.push(o, "0b6d3D/G19Lm6YDEAuwiiKe", "Colors");
var e = [];
e[0] = cc.color(198, 184, 172, 255);
e[2] = cc.color(235, 224, 213, 255);
e[4] = cc.color(234, 219, 193, 255);
e[8] = cc.color(240, 167, 110, 255);
e[16] = cc.color(244, 138, 89, 255);
e[32] = cc.color(245, 112, 85, 255);
e[64] = cc.color(245, 83, 52, 255);
e[128] = cc.color(234, 200, 103, 255);
e[256] = cc.color(234, 197, 87, 255);
e[512] = cc.color(234, 192, 71, 255);
e[1024] = cc.color(146, 208, 80, 255);
e[2048] = cc.color(0, 176, 240, 255);
o.exports = e;
cc._RF.pop();
}, {} ],
Game3: [ function(t, o, i) {
"use strict";
cc._RF.push(o, "b1b9c9Q8NNMmJLfVkgQtcdJ", "Game3");
var e = [ 2, 4 ];
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
start: function() {
this.drawBgBlocks();
this.init();
this.addEventHandler();
},
onBtnBack: function() {
cc.director.loadScene("Menu");
},
drawBgBlocks: function() {
this.containerSize = cc.winSize.width - 2 * this.paddingGap;
var t = this.paddingGap + this.containerSize / 2, o = 5 * this.paddingGap, i = cc.instantiate(this.containerPrefab);
i.width = this.containerSize;
i.height = this.containerSize;
this.bg.addChild(i);
i.setPosition(cc.v2(t, o));
this.blockSize = (i.width - 4 * this.gap) / 3;
var e = this.paddingGap + this.gap + this.blockSize / 2, c = this.gap + this.blockSize;
this.positions = [];
for (var a = 0; a < 3; ++a) {
this.positions.push([ 0, 0, 0 ]);
for (var n = 0; n < 3; ++n) {
var s = cc.instantiate(this.blockPrefab);
s.width = this.blockSize;
s.height = this.blockSize;
this.bg.addChild(s);
s.setPosition(cc.v2(e, c));
this.positions[a][n] = cc.v2(e, c);
e += this.gap + this.blockSize;
s.getComponent("Block").setNumber(0);
}
c += this.gap + this.blockSize;
e = this.paddingGap + this.gap + this.blockSize / 2;
}
},
init: function() {
this.updateScore(0);
if (this.blocks) for (var t = 0; t < this.blocks.length; ++t) for (var o = 0; o < this.blocks[t].length; ++o) null != this.blocks[t][o] && this.blocks[t][o].destroy();
this.data = [];
this.blocks = [];
for (var i = 0; i < 3; ++i) {
this.blocks.push([ null, null, null ]);
this.data.push([ 0, 0, 0 ]);
}
this.addBlock();
this.addBlock();
this.addBlock();
},
updateScore: function(t) {
this.score = t;
this.scoreLabel.string = "Score:" + t;
},
getEmptyLocations: function() {
for (var t = [], o = 0; o < this.blocks.length; ++o) for (var i = 0; i < this.blocks[o].length; ++i) null == this.blocks[o][i] && t.push({
x: o,
y: i
});
return t;
},
addBlock: function() {
var t = this.getEmptyLocations();
if (0 == t.length) return !1;
var o = t[Math.floor(Math.random() * t.length)], i = o.x, c = o.y, a = this.positions[i][c], n = cc.instantiate(this.blockPrefab);
n.width = this.blockSize;
n.height = this.blockSize;
this.bg.addChild(n);
n.setPosition(a);
var s = e[Math.floor(Math.random() * e.length)];
n.getComponent("Block").setNumber(s);
this.blocks[i][c] = n;
this.data[i][c] = s;
return !0;
},
addEventHandler: function() {
var t = this;
this.bg.on("touchstart", function(o) {
t.startPoint = o.getLocation();
});
this.bg.on("touchend", function(o) {
t.touchEnd(o);
});
this.bg.on("touchcancel", function(o) {
t.touchEnd(o);
});
},
touchEnd: function(t) {
this.endPoint = t.getLocation();
var o = this.endPoint.sub(this.startPoint);
o.mag() > 50 && (Math.abs(o.x) > Math.abs(o.y) ? o.x > 0 ? this.moveRight() : this.moveLeft() : o.y > 0 ? this.moveUp() : this.moveDown());
},
checkFail: function() {
for (var t = 0; t < 3; ++t) for (var o = 0; o < 3; ++o) {
var i = this.data[t][o];
if (0 == i) return !1;
if (o > 0 && this.data[t][o - 1] == i) return !1;
if (o < 2 && this.data[t][o + 1] == i) return !1;
if (t > 0 && this.data[t - 1][o] == i) return !1;
if (t > 2 && this.data[t + 1][o] == i) return !1;
}
return !0;
},
checkScceeded: function() {
for (var t = 0; t < 3; ++t) for (var o = 0; o < 3; ++o) if (2048 == this.data[t][o]) return !0;
return !1;
},
gameOver: function() {
cc.director.loadScene("gameOver");
cc.audioEngine.playEffect(this.failedAudio, !1);
cc.audioEngine.setEffectsVolume(.5);
},
succeeded: function() {
cc.director.loadScene("Succeeded");
cc.audioEngine.playEffect(this.succeededAudio, !1);
cc.audioEngine.setEffectsVolume(.5);
},
afterMove: function(t) {
if (t) {
this.updateScore(this.score + 1);
this.addBlock();
}
this.checkFail() && this.gameOver();
this.checkScceeded() && this.succeeded();
},
doMove: function(t, o, i) {
var e = cc.moveTo(.1, o), c = cc.callFunc(function() {
i && i();
});
t.runAction(cc.sequence(e, c));
},
moveLeft: function() {
for (var t = this, o = !1, i = function i(e, c, a) {
if (0 != c && 0 != t.data[e][c]) if (0 == t.data[e][c - 1]) {
var n = t.blocks[e][c], s = t.positions[e][c - 1];
t.blocks[e][c - 1] = n;
t.data[e][c - 1] = t.data[e][c];
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.doMove(n, s, function() {
i(e, c - 1, a);
});
o = !0;
} else {
if (t.data[e][c - 1] != t.data[e][c]) {
a && a();
return;
}
var r = t.blocks[e][c], d = t.positions[e][c - 1];
t.data[e][c - 1] *= 2;
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.blocks[e][c - 1].getComponent("Block").setNumber(t.data[e][c - 1]);
t.doMove(r, d, function() {
r.destroy();
a && a();
});
cc.audioEngine.playEffect(t.hitAudio, !1);
cc.audioEngine.setEffectsVolume(.1);
o = !0;
} else a && a();
}, e = [], c = 0; c < 3; ++c) for (var a = 0; a < 3; ++a) 0 != this.data[c][a] && e.push({
x: c,
y: a
});
for (var n = 0, s = 0; s < e.length; ++s) i(e[s].x, e[s].y, function() {
++n == e.length && t.afterMove(o);
});
},
moveRight: function() {
for (var t = this, o = !1, i = function i(e, c, a) {
if (2 != c && 0 != t.data[e][c]) if (0 == t.data[e][c + 1]) {
var n = t.blocks[e][c], s = t.positions[e][c + 1];
t.blocks[e][c + 1] = n;
t.data[e][c + 1] = t.data[e][c];
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.doMove(n, s, function() {
i(e, c + 1, a);
});
o = !0;
} else {
if (t.data[e][c + 1] != t.data[e][c]) {
a && a();
return;
}
var r = t.blocks[e][c], d = t.positions[e][c + 1];
t.data[e][c + 1] *= 2;
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.blocks[e][c + 1].getComponent("Block").setNumber(t.data[e][c + 1]);
t.doMove(r, d, function() {
r.destroy();
a && a();
});
cc.audioEngine.playEffect(t.hitAudio, !1);
cc.audioEngine.setEffectsVolume(.1);
o = !0;
} else a && a();
}, e = [], c = 0; c < 3; ++c) for (var a = 2; a >= 0; --a) 0 != this.data[c][a] && e.push({
x: c,
y: a
});
for (var n = 0, s = 0; s < e.length; ++s) i(e[s].x, e[s].y, function() {
++n == e.length && t.afterMove(o);
});
},
moveUp: function() {
for (var t = this, o = !1, i = function i(e, c, a) {
if (2 != e && 0 != t.data[e][c]) if (0 == t.data[e + 1][c]) {
var n = t.blocks[e][c], s = t.positions[e + 1][c];
t.blocks[e + 1][c] = n;
t.data[e + 1][c] = t.data[e][c];
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.doMove(n, s, function() {
i(e + 1, c, a);
});
o = !0;
} else {
if (t.data[e + 1][c] != t.data[e][c]) {
a && a();
return;
}
var r = t.blocks[e][c], d = t.positions[e + 1][c];
t.data[e + 1][c] *= 2;
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.blocks[e + 1][c].getComponent("Block").setNumber(t.data[e + 1][c]);
t.doMove(r, d, function() {
r.destroy();
a && a();
});
cc.audioEngine.playEffect(t.hitAudio, !1);
cc.audioEngine.setEffectsVolume(.1);
o = !0;
} else a && a();
}, e = [], c = 2; c >= 0; --c) for (var a = 0; a < 3; ++a) 0 != this.data[c][a] && e.push({
x: c,
y: a
});
for (var n = 0, s = 0; s < e.length; ++s) i(e[s].x, e[s].y, function() {
++n == e.length && t.afterMove(o);
});
},
moveDown: function() {
for (var t = this, o = !1, i = function i(e, c, a) {
if (0 != e && 0 != t.data[e][c]) if (0 == t.data[e - 1][c]) {
var n = t.blocks[e][c], s = t.positions[e - 1][c];
t.blocks[e - 1][c] = n;
t.data[e - 1][c] = t.data[e][c];
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.doMove(n, s, function() {
i(e - 1, c, a);
});
o = !0;
} else {
if (t.data[e - 1][c] != t.data[e][c]) {
a && a();
return;
}
var r = t.blocks[e][c], d = t.positions[e - 1][c];
t.data[e - 1][c] *= 2;
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.blocks[e - 1][c].getComponent("Block").setNumber(t.data[e - 1][c]);
t.doMove(r, d, function() {
r.destroy();
a && a();
});
cc.audioEngine.playEffect(t.hitAudio, !1);
cc.audioEngine.setEffectsVolume(.1);
o = !0;
} else a && a();
}, e = [], c = 0; c < 3; ++c) for (var a = 0; a < 3; ++a) 0 != this.data[c][a] && e.push({
x: c,
y: a
});
for (var n = 0, s = 0; s < e.length; ++s) i(e[s].x, e[s].y, function() {
++n == e.length && t.afterMove(o);
});
}
});
cc._RF.pop();
}, {} ],
Game4: [ function(t, o, i) {
"use strict";
cc._RF.push(o, "b907abIOSFOnoXqrLD3RiJ4", "Game4");
var e = [ 2, 4 ];
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
start: function() {
this.drawBgBlocks();
this.init();
this.addEventHandler();
},
onBtnBack: function() {
cc.director.loadScene("Menu");
},
drawBgBlocks: function() {
this.containerSize = cc.winSize.width - 2 * this.paddingGap;
var t = this.paddingGap + this.containerSize / 2, o = 5 * this.paddingGap, i = cc.instantiate(this.containerPrefab);
i.width = this.containerSize;
i.height = this.containerSize;
this.bg.addChild(i);
i.setPosition(cc.v2(t, o));
this.blockSize = (i.width - 5 * this.gap) / 4;
var e = this.paddingGap + this.gap + this.blockSize / 2, c = this.paddingGap + this.gap + this.blockSize;
this.positions = [];
for (var a = 0; a < 4; ++a) {
this.positions.push([ 0, 0, 0, 0 ]);
for (var n = 0; n < 4; ++n) {
var s = cc.instantiate(this.blockPrefab);
s.width = this.blockSize;
s.height = this.blockSize;
this.bg.addChild(s);
s.setPosition(cc.v2(e, c));
this.positions[a][n] = cc.v2(e, c);
e += this.gap + this.blockSize;
s.getComponent("Block").setNumber(0);
}
c += this.gap + this.blockSize;
e = this.paddingGap + this.gap + this.blockSize / 2;
}
},
init: function() {
this.updateScore(0);
if (this.blocks) for (var t = 0; t < this.blocks.length; ++t) for (var o = 0; o < this.blocks[t].length; ++o) null != this.blocks[t][o] && this.blocks[t][o].destroy();
this.data = [];
this.blocks = [];
for (var i = 0; i < 4; ++i) {
this.blocks.push([ null, null, null, null ]);
this.data.push([ 0, 0, 0, 0 ]);
}
this.addBlock();
this.addBlock();
this.addBlock();
},
updateScore: function(t) {
this.score = t;
this.scoreLabel.string = "Score:" + t;
},
getEmptyLocations: function() {
for (var t = [], o = 0; o < this.blocks.length; ++o) for (var i = 0; i < this.blocks[o].length; ++i) null == this.blocks[o][i] && t.push({
x: o,
y: i
});
return t;
},
addBlock: function() {
var t = this.getEmptyLocations();
if (0 == t.length) return !1;
var o = t[Math.floor(Math.random() * t.length)], i = o.x, c = o.y, a = this.positions[i][c], n = cc.instantiate(this.blockPrefab);
n.width = this.blockSize;
n.height = this.blockSize;
this.bg.addChild(n);
n.setPosition(a);
var s = e[Math.floor(Math.random() * e.length)];
n.getComponent("Block").setNumber(s);
this.blocks[i][c] = n;
this.data[i][c] = s;
return !0;
},
addEventHandler: function() {
var t = this;
this.bg.on("touchstart", function(o) {
t.startPoint = o.getLocation();
});
this.bg.on("touchend", function(o) {
t.touchEnd(o);
});
this.bg.on("touchcancel", function(o) {
t.touchEnd(o);
});
},
touchEnd: function(t) {
this.endPoint = t.getLocation();
var o = this.endPoint.sub(this.startPoint);
o.mag() > 50 && (Math.abs(o.x) > Math.abs(o.y) ? o.x > 0 ? this.moveRight() : this.moveLeft() : o.y > 0 ? this.moveUp() : this.moveDown());
},
checkFail: function() {
for (var t = 0; t < 4; ++t) for (var o = 0; o < 4; ++o) {
var i = this.data[t][o];
if (0 == i) return !1;
if (o > 0 && this.data[t][o - 1] == i) return !1;
if (o < 3 && this.data[t][o + 1] == i) return !1;
if (t > 0 && this.data[t - 1][o] == i) return !1;
if (t > 3 && this.data[t + 1][o] == i) return !1;
}
return !0;
},
checkScceeded: function() {
for (var t = 0; t < 4; ++t) for (var o = 0; o < 4; ++o) if (2048 == this.data[t][o]) return !0;
return !1;
},
gameOver: function() {
cc.director.loadScene("gameOver");
cc.audioEngine.playEffect(this.failedAudio, !1);
cc.audioEngine.setEffectsVolume(.5);
},
succeeded: function() {
cc.director.loadScene("Succeeded");
cc.audioEngine.playEffect(this.succeededAudio, !1);
cc.audioEngine.setEffectsVolume(.5);
},
afterMove: function(t) {
if (t) {
this.updateScore(this.score + 1);
this.addBlock();
}
this.checkFail() && this.gameOver();
this.checkScceeded() && this.succeeded();
},
doMove: function(t, o, i) {
var e = cc.moveTo(.1, o), c = cc.callFunc(function() {
i && i();
});
t.runAction(cc.sequence(e, c));
},
moveLeft: function() {
for (var t = this, o = !1, i = function i(e, c, a) {
if (0 != c && 0 != t.data[e][c]) if (0 == t.data[e][c - 1]) {
var n = t.blocks[e][c], s = t.positions[e][c - 1];
t.blocks[e][c - 1] = n;
t.data[e][c - 1] = t.data[e][c];
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.doMove(n, s, function() {
i(e, c - 1, a);
});
o = !0;
} else {
if (t.data[e][c - 1] != t.data[e][c]) {
a && a();
return;
}
var r = t.blocks[e][c], d = t.positions[e][c - 1];
t.data[e][c - 1] *= 2;
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.blocks[e][c - 1].getComponent("Block").setNumber(t.data[e][c - 1]);
t.doMove(r, d, function() {
r.destroy();
a && a();
});
cc.audioEngine.playEffect(t.hitAudio, !1);
cc.audioEngine.setEffectsVolume(.1);
o = !0;
} else a && a();
}, e = [], c = 0; c < 4; ++c) for (var a = 0; a < 4; ++a) 0 != this.data[c][a] && e.push({
x: c,
y: a
});
for (var n = 0, s = 0; s < e.length; ++s) i(e[s].x, e[s].y, function() {
++n == e.length && t.afterMove(o);
});
},
moveRight: function() {
for (var t = this, o = !1, i = function i(e, c, a) {
if (3 != c && 0 != t.data[e][c]) if (0 == t.data[e][c + 1]) {
var n = t.blocks[e][c], s = t.positions[e][c + 1];
t.blocks[e][c + 1] = n;
t.data[e][c + 1] = t.data[e][c];
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.doMove(n, s, function() {
i(e, c + 1, a);
});
o = !0;
} else {
if (t.data[e][c + 1] != t.data[e][c]) {
a && a();
return;
}
var r = t.blocks[e][c], d = t.positions[e][c + 1];
t.data[e][c + 1] *= 2;
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.blocks[e][c + 1].getComponent("Block").setNumber(t.data[e][c + 1]);
t.doMove(r, d, function() {
r.destroy();
a && a();
});
cc.audioEngine.playEffect(t.hitAudio, !1);
cc.audioEngine.setEffectsVolume(.1);
o = !0;
} else a && a();
}, e = [], c = 0; c < 4; ++c) for (var a = 3; a >= 0; --a) 0 != this.data[c][a] && e.push({
x: c,
y: a
});
for (var n = 0, s = 0; s < e.length; ++s) i(e[s].x, e[s].y, function() {
++n == e.length && t.afterMove(o);
});
},
moveUp: function() {
for (var t = this, o = !1, i = function i(e, c, a) {
if (3 != e && 0 != t.data[e][c]) if (0 == t.data[e + 1][c]) {
var n = t.blocks[e][c], s = t.positions[e + 1][c];
t.blocks[e + 1][c] = n;
t.data[e + 1][c] = t.data[e][c];
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.doMove(n, s, function() {
i(e + 1, c, a);
});
o = !0;
} else {
if (t.data[e + 1][c] != t.data[e][c]) {
a && a();
return;
}
var r = t.blocks[e][c], d = t.positions[e + 1][c];
t.data[e + 1][c] *= 2;
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.blocks[e + 1][c].getComponent("Block").setNumber(t.data[e + 1][c]);
t.doMove(r, d, function() {
r.destroy();
a && a();
});
cc.audioEngine.playEffect(t.hitAudio, !1);
cc.audioEngine.setEffectsVolume(.1);
o = !0;
} else a && a();
}, e = [], c = 3; c >= 0; --c) for (var a = 0; a < 4; ++a) 0 != this.data[c][a] && e.push({
x: c,
y: a
});
for (var n = 0, s = 0; s < e.length; ++s) i(e[s].x, e[s].y, function() {
++n == e.length && t.afterMove(o);
});
},
moveDown: function() {
for (var t = this, o = !1, i = function i(e, c, a) {
if (0 != e && 0 != t.data[e][c]) if (0 == t.data[e - 1][c]) {
var n = t.blocks[e][c], s = t.positions[e - 1][c];
t.blocks[e - 1][c] = n;
t.data[e - 1][c] = t.data[e][c];
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.doMove(n, s, function() {
i(e - 1, c, a);
});
o = !0;
} else {
if (t.data[e - 1][c] != t.data[e][c]) {
a && a();
return;
}
var r = t.blocks[e][c], d = t.positions[e - 1][c];
t.data[e - 1][c] *= 2;
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.blocks[e - 1][c].getComponent("Block").setNumber(t.data[e - 1][c]);
t.doMove(r, d, function() {
r.destroy();
a && a();
});
cc.audioEngine.playEffect(t.hitAudio, !1);
cc.audioEngine.setEffectsVolume(.1);
o = !0;
} else a && a();
}, e = [], c = 0; c < 4; ++c) for (var a = 0; a < 4; ++a) 0 != this.data[c][a] && e.push({
x: c,
y: a
});
for (var n = 0, s = 0; s < e.length; ++s) i(e[s].x, e[s].y, function() {
++n == e.length && t.afterMove(o);
});
}
});
cc._RF.pop();
}, {} ],
Game8: [ function(t, o, i) {
"use strict";
cc._RF.push(o, "e7443JllC5C06aS/ltX9kF6", "Game8");
var e = [ 2, 4 ];
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
start: function() {
this.drawBgBlocks();
this.init();
this.addEventHandler();
},
onBtnBack: function() {
cc.director.loadScene("Menu");
},
drawBgBlocks: function() {
this.containerSize = cc.winSize.width - 2 * this.paddingGap;
var t = this.paddingGap + this.containerSize / 2, o = 5 * this.paddingGap, i = cc.instantiate(this.containerPrefab);
i.width = this.containerSize;
i.height = this.containerSize;
this.bg.addChild(i);
i.setPosition(cc.v2(t, o));
this.blockSize = (i.width - 9 * this.gap) / 8;
var e = this.paddingGap + this.gap + this.blockSize / 2, c = this.paddingGap + 4 * this.gap + this.blockSize;
this.positions = [];
for (var a = 0; a < 8; ++a) {
this.positions.push([ 0, 0, 0, 0, 0, 0, 0, 0 ]);
for (var n = 0; n < 8; ++n) {
var s = cc.instantiate(this.blockPrefab);
s.width = this.blockSize;
s.height = this.blockSize;
this.bg.addChild(s);
s.setPosition(cc.v2(e, c));
this.positions[a][n] = cc.v2(e, c);
e += this.gap + this.blockSize;
s.getComponent("Block").setNumber(0);
}
c += this.gap + this.blockSize;
e = this.paddingGap + this.gap + this.blockSize / 2;
}
},
init: function() {
this.updateScore(0);
if (this.blocks) for (var t = 0; t < this.blocks.length; ++t) for (var o = 0; o < this.blocks[t].length; ++o) null != this.blocks[t][o] && this.blocks[t][o].destroy();
this.data = [];
this.blocks = [];
for (var i = 0; i < 8; ++i) {
this.blocks.push([ null, null, null, null, null, null, null, null ]);
this.data.push([ 0, 0, 0, 0, 0, 0, 0, 0 ]);
}
this.addBlock();
this.addBlock();
this.addBlock();
},
updateScore: function(t) {
this.score = t;
this.scoreLabel.string = "Score:" + t;
},
getEmptyLocations: function() {
for (var t = [], o = 0; o < this.blocks.length; ++o) for (var i = 0; i < this.blocks[o].length; ++i) null == this.blocks[o][i] && t.push({
x: o,
y: i
});
return t;
},
addBlock: function() {
var t = this.getEmptyLocations();
if (0 == t.length) return !1;
var o = t[Math.floor(Math.random() * t.length)], i = o.x, c = o.y, a = this.positions[i][c], n = cc.instantiate(this.blockPrefab);
n.width = this.blockSize;
n.height = this.blockSize;
this.bg.addChild(n);
n.setPosition(a);
var s = e[Math.floor(Math.random() * e.length)];
n.getComponent("Block").setNumber(s);
this.blocks[i][c] = n;
this.data[i][c] = s;
return !0;
},
addEventHandler: function() {
var t = this;
this.bg.on("touchstart", function(o) {
t.startPoint = o.getLocation();
});
this.bg.on("touchend", function(o) {
t.touchEnd(o);
});
this.bg.on("touchcancel", function(o) {
t.touchEnd(o);
});
},
touchEnd: function(t) {
this.endPoint = t.getLocation();
var o = this.endPoint.sub(this.startPoint);
o.mag() > 50 && (Math.abs(o.x) > Math.abs(o.y) ? o.x > 0 ? this.moveRight() : this.moveLeft() : o.y > 0 ? this.moveUp() : this.moveDown());
},
checkFail: function() {
for (var t = 0; t < 8; ++t) for (var o = 0; o < 8; ++o) {
var i = this.data[t][o];
if (0 == i) return !1;
if (o > 0 && this.data[t][o - 1] == i) return !1;
if (o < 7 && this.data[t][o + 1] == i) return !1;
if (t > 0 && this.data[t - 1][o] == i) return !1;
if (t > 7 && this.data[t + 1][o] == i) return !1;
}
return !0;
},
checkScceeded: function() {
for (var t = 0; t < 8; ++t) for (var o = 0; o < 8; ++o) if (2048 == this.data[t][o]) return !0;
return !1;
},
gameOver: function() {
cc.director.loadScene("gameOver");
cc.audioEngine.playEffect(this.failedAudio, !1);
cc.audioEngine.setEffectsVolume(.5);
},
succeeded: function() {
cc.director.loadScene("Succeeded");
cc.audioEngine.playEffect(this.succeededAudio, !1);
cc.audioEngine.setEffectsVolume(.5);
},
afterMove: function(t) {
if (t) {
this.updateScore(this.score + 1);
this.addBlock();
}
this.checkFail() && this.gameOver();
this.checkScceeded() && this.succeeded();
},
doMove: function(t, o, i) {
var e = cc.moveTo(.02, o), c = cc.callFunc(function() {
i && i();
});
t.runAction(cc.sequence(e, c));
},
moveLeft: function() {
for (var t = this, o = !1, i = function i(e, c, a) {
if (0 != c && 0 != t.data[e][c]) if (0 == t.data[e][c - 1]) {
var n = t.blocks[e][c], s = t.positions[e][c - 1];
t.blocks[e][c - 1] = n;
t.data[e][c - 1] = t.data[e][c];
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.doMove(n, s, function() {
i(e, c - 1, a);
});
o = !0;
} else {
if (t.data[e][c - 1] != t.data[e][c]) {
a && a();
return;
}
var r = t.blocks[e][c], d = t.positions[e][c - 1];
t.data[e][c - 1] *= 2;
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.blocks[e][c - 1].getComponent("Block").setNumber(t.data[e][c - 1]);
t.doMove(r, d, function() {
r.destroy();
a && a();
});
cc.audioEngine.playEffect(t.hitAudio, !1);
cc.audioEngine.setEffectsVolume(.1);
o = !0;
} else a && a();
}, e = [], c = 0; c < 8; ++c) for (var a = 0; a < 8; ++a) 0 != this.data[c][a] && e.push({
x: c,
y: a
});
for (var n = 0, s = 0; s < e.length; ++s) i(e[s].x, e[s].y, function() {
++n == e.length && t.afterMove(o);
});
},
moveRight: function() {
for (var t = this, o = !1, i = function i(e, c, a) {
if (7 != c && 0 != t.data[e][c]) if (0 == t.data[e][c + 1]) {
var n = t.blocks[e][c], s = t.positions[e][c + 1];
t.blocks[e][c + 1] = n;
t.data[e][c + 1] = t.data[e][c];
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.doMove(n, s, function() {
i(e, c + 1, a);
});
o = !0;
} else {
if (t.data[e][c + 1] != t.data[e][c]) {
a && a();
return;
}
var r = t.blocks[e][c], d = t.positions[e][c + 1];
t.data[e][c + 1] *= 2;
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.blocks[e][c + 1].getComponent("Block").setNumber(t.data[e][c + 1]);
t.doMove(r, d, function() {
r.destroy();
a && a();
});
cc.audioEngine.playEffect(t.hitAudio, !1);
cc.audioEngine.setEffectsVolume(.1);
o = !0;
} else a && a();
}, e = [], c = 0; c < 8; ++c) for (var a = 7; a >= 0; --a) 0 != this.data[c][a] && e.push({
x: c,
y: a
});
for (var n = 0, s = 0; s < e.length; ++s) i(e[s].x, e[s].y, function() {
++n == e.length && t.afterMove(o);
});
},
moveUp: function() {
for (var t = this, o = !1, i = function i(e, c, a) {
if (7 != e && 0 != t.data[e][c]) if (0 == t.data[e + 1][c]) {
var n = t.blocks[e][c], s = t.positions[e + 1][c];
t.blocks[e + 1][c] = n;
t.data[e + 1][c] = t.data[e][c];
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.doMove(n, s, function() {
i(e + 1, c, a);
});
o = !0;
} else {
if (t.data[e + 1][c] != t.data[e][c]) {
a && a();
return;
}
var r = t.blocks[e][c], d = t.positions[e + 1][c];
t.data[e + 1][c] *= 2;
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.blocks[e + 1][c].getComponent("Block").setNumber(t.data[e + 1][c]);
t.doMove(r, d, function() {
r.destroy();
a && a();
});
cc.audioEngine.playEffect(t.hitAudio, !1);
cc.audioEngine.setEffectsVolume(.1);
o = !0;
} else a && a();
}, e = [], c = 7; c >= 0; --c) for (var a = 0; a < 8; ++a) 0 != this.data[c][a] && e.push({
x: c,
y: a
});
for (var n = 0, s = 0; s < e.length; ++s) i(e[s].x, e[s].y, function() {
++n == e.length && t.afterMove(o);
});
},
moveDown: function() {
for (var t = this, o = !1, i = function i(e, c, a) {
if (0 != e && 0 != t.data[e][c]) if (0 == t.data[e - 1][c]) {
var n = t.blocks[e][c], s = t.positions[e - 1][c];
t.blocks[e - 1][c] = n;
t.data[e - 1][c] = t.data[e][c];
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.doMove(n, s, function() {
i(e - 1, c, a);
});
o = !0;
} else {
if (t.data[e - 1][c] != t.data[e][c]) {
a && a();
return;
}
var r = t.blocks[e][c], d = t.positions[e - 1][c];
t.data[e - 1][c] *= 2;
t.data[e][c] = 0;
t.blocks[e][c] = null;
t.blocks[e - 1][c].getComponent("Block").setNumber(t.data[e - 1][c]);
t.doMove(r, d, function() {
r.destroy();
a && a();
});
cc.audioEngine.playEffect(t.hitAudio, !1);
cc.audioEngine.setEffectsVolume(.1);
o = !0;
} else a && a();
}, e = [], c = 0; c < 8; ++c) for (var a = 0; a < 8; ++a) 0 != this.data[c][a] && e.push({
x: c,
y: a
});
for (var n = 0, s = 0; s < e.length; ++s) i(e[s].x, e[s].y, function() {
++n == e.length && t.afterMove(o);
});
}
});
cc._RF.pop();
}, {} ],
Index: [ function(t, o, i) {
"use strict";
cc._RF.push(o, "eea74p8pfZLtL15dIsTDQa5", "Index");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {},
onBtnStart: function() {
cc.director.loadScene("Menu");
}
});
cc._RF.pop();
}, {} ],
Menu: [ function(t, o, i) {
"use strict";
cc._RF.push(o, "c4a5cZ9FBlDYLpyxOJQZgBn", "Menu");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {},
onBtnBack: function() {
cc.director.loadScene("Index");
},
onBtnStartGame3: function() {
cc.director.loadScene("Game3");
},
onBtnStartGame4: function() {
cc.director.loadScene("Game4");
},
onBtnStartGame8: function() {
cc.director.loadScene("Game8");
}
});
cc._RF.pop();
}, {} ],
Restart: [ function(t, o, i) {
"use strict";
cc._RF.push(o, "63549UNHRxDophOWYdLGQbq", "Restart");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {},
onBtnRestart: function() {
cc.director.loadScene("Menu");
}
});
cc._RF.pop();
}, {} ]
}, {}, [ "Block", "Colors", "Game3", "Game4", "Game8", "Index", "Menu", "Restart" ]);