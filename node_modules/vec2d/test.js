var v = require('./');
var Vec2d = v.Vec2d;
var assert = require('assert');

var EPSILON = 0.000000000001;

var describe = global.describe;
var it = global.it;

describe("v()", function() {
  it("no args", function() {
    var v1 = v();
    assert.strictEqual(v1.x, 0);
    assert.strictEqual(v1.y, 0);
  });
  it("x, y", function() {
    var v1 = v(-1, 5);
    assert.strictEqual(v1.x, -1);
    assert.strictEqual(v1.y, 5);
  });
  it("array", function() {
    var v1 = v([4, 5]);
    assert.strictEqual(v1.x, 4);
    assert.strictEqual(v1.y, 5);
  });
  it("object", function() {
    var v1 = v({x: 9, y: 8});
    assert.strictEqual(v1.x, 9);
    assert.strictEqual(v1.y, 8);
  });
  it("string coords", function() {
    var v1 = v("1", "-1.5");
    assert.strictEqual(v1.x, 1);
    assert.strictEqual(v1.y, -1.5);
  });
  it("deserialize", function() {
    var v1 = v(v(1, -3.5).toString());
    assert.strictEqual(v1.x, 1);
    assert.strictEqual(v1.y, -3.5);
    var v2 = v(v(-111, 9876543210.123456789).toString());
    assert.strictEqual(v2.x, -111);
    assert.strictEqual(v2.y, 9876543210.123456789);
  });
  it("invalid deserialize", function() {
    assert.throws(function() {
      return v("lol hax");
    }, /cannot parse/);
  });
  it("unit", function() {
    var v1 = v.unit(Math.PI / 2);
    assertCloseEnough(0, v1.x);
    assertCloseEnough(1, v1.y);
  });
});
describe("Vec2d", function() {
  it("unit", function() {
    var v1 = Vec2d.unit(Math.PI);
    assertCloseEnough(-1, v1.x);
    assertCloseEnough(0, v1.y);
  });
  it("offset", function() {
    var v1 = new Vec2d(1, 2);
    var v2 = v1.offset(10, -10);
    v1.x = -100;
    assert.strictEqual(v2.x, 11);
    assert.strictEqual(v2.y, -8);
  });
  it("add", function() {
    var v1 = new Vec2d(1, 2);
    var v2 = new Vec2d(-1, -2);
    var v3 = v1.add(v2);
    assert.strictEqual(v3, v1);
    assert.strictEqual(v1.x, 0);
    assert.strictEqual(v1.y, 0);
  });
  it("sub", function() {
    var v1 = new Vec2d(1, 2);
    var v2 = new Vec2d(-1, -2);
    var v3 = v1.sub(v2);
    assert.strictEqual(v3, v1);
    assert.strictEqual(v1.x, 2);
    assert.strictEqual(v1.y, 4);
  });
  it("plus", function() {
    var v1 = new Vec2d(1, 2);
    var v2 = new Vec2d(-1, 0);
    var v3 = v1.plus(v2);
    assert.strictEqual(v1.x, 1);
    assert.strictEqual(v1.y, 2);
    assert.strictEqual(v2.x, -1);
    assert.strictEqual(v2.y, 0);
    assert.strictEqual(v3.x, 0);
    assert.strictEqual(v3.y, 2);
  });
  it("minus", function() {
    var v1 = new Vec2d(1, 2);
    var v2 = new Vec2d(-1, 0);
    var v3 = v1.minus(v2);
    assert.strictEqual(v1.x, 1);
    assert.strictEqual(v1.y, 2);
    assert.strictEqual(v2.x, -1);
    assert.strictEqual(v2.y, 0);
    assert.strictEqual(v3.x, 2);
    assert.strictEqual(v3.y, 2);
  });
  it("neg", function() {
    var v1 = new Vec2d(1, -2);
    var v2 = v1.neg();
    assert.strictEqual(v1, v2);
    assert.strictEqual(v1.x, -1);
    assert.strictEqual(v1.y, 2);
  });
  it("mult", function() {
    var v1 = new Vec2d(-1, 1);
    var v2 = new Vec2d(2, -3);
    var v3 = v1.mult(v2);
    assert.strictEqual(v1, v3);
    assert.strictEqual(v3.x, -2);
    assert.strictEqual(v3.y, -3);
  });
  it("times", function() {
    var v1 = new Vec2d(-1, 1);
    var v2 = new Vec2d(2, -3);
    var v3 = v1.times(v2);
    assert.notStrictEqual(v1, v3);
    assert.strictEqual(v3.x, -2);
    assert.strictEqual(v3.y, -3);
  });
  it("div", function() {
    var v1 = new Vec2d(6, 4);
    var v2 = new Vec2d(3, 2);
    var v3 = v1.div(v2);
    assert.strictEqual(v3, v1);
    assert.strictEqual(v1.x, 2);
    assert.strictEqual(v1.y, 2);
    assert.strictEqual(v2.x, 3);
    assert.strictEqual(v2.y, 2);
  });
  it("divBy", function() {
    var v1 = new Vec2d(6, 4);
    var v2 = new Vec2d(3, 2);
    var v3 = v1.divBy(v2);
    assert.strictEqual(v1.x, 6);
    assert.strictEqual(v1.y, 4);
    assert.strictEqual(v3.x, 2);
    assert.strictEqual(v3.y, 2);
    assert.strictEqual(v2.x, 3);
    assert.strictEqual(v2.y, 2);
  });
  it("scale", function() {
    var v1 = new Vec2d(3, 4);
    var v2 = v1.scale(2);
    assert.strictEqual(v1, v2);
    assert.strictEqual(v1.x, 6);
    assert.strictEqual(v1.y, 8);
  });
  it("scaled", function() {
    var v1 = new Vec2d(-3, 4);
    var v2 = v1.scaled(-2);
    assert.strictEqual(v1.x, -3);
    assert.strictEqual(v1.y, 4);
    assert.strictEqual(v2.x, 6);
    assert.strictEqual(v2.y, -8);
  });
  it("clone", function() {
    var v1 = new Vec2d(-1, 1);
    var v2 = v1.clone();
    v2.x += 1;
    v2.y += 1;
    assert.strictEqual(v1.x, -1);
    assert.strictEqual(v1.y, 1);
    assert.strictEqual(v2.x, 0);
    assert.strictEqual(v2.y, 2);
  });
  it("apply", function() {
    var v1 = new Vec2d(1.1, 2.2);
    var v2 = v1.apply(Math.ceil);
    assert.strictEqual(v1, v2);
    assert.strictEqual(v2.x, 2);
    assert.strictEqual(v2.y, 3);
  });
  it("applied", function() {
    var v1 = new Vec2d(1.1, 2.2);
    var v2 = v1.applied(Math.ceil);
    assert.strictEqual(v1.x, 1.1);
    assert.strictEqual(v1.y, 2.2);
    assert.strictEqual(v2.x, 2);
    assert.strictEqual(v2.y, 3);
  });
  it("equals", function() {
    var v1 = new Vec2d(-0.3, 100);
    var v2 = new Vec2d(-0.3, 100);
    assert.strictEqual(v1.equals(v2), true);
  });
  it("toString", function() {
    var v1 = new Vec2d(99, -1);
    assert.strictEqual(v1.toString(), "(99, -1)");
  });
  it("length", function() {
    var v1 = new Vec2d(3, 4);
    assert.strictEqual(v1.length(), 5);
  });
  it("lengthSqrd", function() {
    var v1 = new Vec2d(3, 4);
    assert.strictEqual(v1.lengthSqrd(), 25);
  });
  it("angle", function() {
    var v1 = new Vec2d(0, 1);
    assert.strictEqual(v1.angle(), Math.PI / 2);
  });
  it("normalize", function() {
    var v1 = new Vec2d(2, 2);
    var v2 = v1.normalize();
    assert.strictEqual(v1, v2);
    assertCloseEnough(v2.x, 0.7071067811865475);
    assertCloseEnough(v2.y, 0.7071067811865475);
  });
  it("normalized", function() {
    var v1 = new Vec2d(10, 0);
    var v2 = v1.normalized();
    assert.strictEqual(v1.x, 10);
    assert.strictEqual(v1.y, 0);
    assert.strictEqual(v2.x, 1);
    assert.strictEqual(v2.y, 0);
  });
  it("boundMin", function() {
    var v1 = new Vec2d(13, 99);
    var min = new Vec2d(20, 90);
    var v2 = v1.boundMin(min);
    assert.strictEqual(v1, v2);
    assert.strictEqual(v2.x, 20);
    assert.strictEqual(v2.y, 99);
  });
  it("boundMax", function() {
    var v1 = new Vec2d(13, 99);
    var max = new Vec2d(20, 90);
    var v2 = v1.boundMax(max);
    assert.strictEqual(v1, v2);
    assert.strictEqual(v2.x, 13);
    assert.strictEqual(v2.y, 90);
  });
  it("floor", function() {
    var v1 = new Vec2d(-3.3, 9.9);
    var v2 = v1.floor();
    assert.strictEqual(v1, v2);
    assert.strictEqual(v2.x, -4);
    assert.strictEqual(v2.y, 9);
  });
  it("floored", function() {
    var v1 = new Vec2d(-3.3, 9.9);
    var v2 = v1.floored();
    assert.strictEqual(v1.x, -3.3);
    assert.strictEqual(v1.y, 9.9);
    assert.strictEqual(v2.x, -4);
    assert.strictEqual(v2.y, 9);
  });
  it("ceil", function() {
    var v1 = new Vec2d(-3.3, 9.9);
    var v2 = v1.ceil();
    assert.strictEqual(v1, v2);
    assert.strictEqual(v2.x, -3);
    assert.strictEqual(v2.y, 10);
  });
  it("ceiled", function() {
    var v1 = new Vec2d(-3.3, 9.9);
    var v2 = v1.ceiled();
    assert.strictEqual(v1.x, -3.3);
    assert.strictEqual(v1.y, 9.9);
    assert.strictEqual(v2.x, -3);
    assert.strictEqual(v2.y, 10);
  });
  it("project");
  it("dot", function() {
    var v1 = v(0, 1);
    var v2 = v(1, 0);
    var v3 = v(0, -1);
    assert.strictEqual(v1.dot(v2), 0);
    assert.strictEqual(v1.dot(v3), -1);
  });
  it("rotate", function() {
    var v1 = v(0, 1);
    var v2 = v(1, 1);
    var v3 = v2.rotate(v1);
    assert.strictEqual(v3, v2);
    assert.strictEqual(v2.x, -1);
    assert.strictEqual(v2.y, 1);
  });
  it("rotated", function() {
    var v1 = v(0, 1);
    var v2 = v(1, 1);
    var v3 = v2.rotated(v1);
    assert.strictEqual(v1.x, 0);
    assert.strictEqual(v1.y, 1);
    assert.strictEqual(v2.x, 1);
    assert.strictEqual(v2.y, 1);
    assert.strictEqual(v3.x, -1);
    assert.strictEqual(v3.y, 1);
  });
  it("distance", function() {
    var v1 = v(-1, -1);
    var v2 = v(2, 3);
    assert.strictEqual(v1.distance(v2), 5);
  });
  it("distanceSqrd", function() {
    var v1 = v(-1, -1);
    var v2 = v(2, 3);
    assert.strictEqual(v1.distanceSqrd(v2), 25);
  });
  it("reflect", function() {
    var v1 = v(1, 0);
    var axis = v(0, 1);
    var v2 = v1.reflect(axis);
    assert.strictEqual(v1.x, -1);
    assert.strictEqual(v1.y, 0);
  });
  it("reflectAboutLine", function() {
    var v1 = v(1, -1);
    var linePt1 = v(1, 1);
    var linePt2 = v(-1, -1);
    var v2 = v1.reflectAboutLine(linePt1, linePt2);
    assert.strictEqual(v2, v1);
    assertCloseEnough(v1.x, -1);
    assertCloseEnough(v1.y, 1);
  });
  it("set", function() {
    var v1 = v(1, 2);
    v1.set(3, 4);
    assert.strictEqual(v1.x, 3);
    assert.strictEqual(v1.y, 4);
  });
});

function assertCloseEnough(a, b) {
  assert.ok(Math.abs(a - b) < EPSILON);
}
