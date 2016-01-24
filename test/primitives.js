define(function(require) {

var prim = require('modelling/primitives');
var vector = require('vector');

var abs = Math.abs;

var v2s = function (v) {
  return '(' + v.x.toFixed(3) + ',' + v.y.toFixed(3) + ','+v.z.toFixed(3) + ')';
};

var assert = function (surf, pred, m) {
  if (!pred(surf)) { console.log(m+' at ' + v2s(surf.pos) + ' cut: ' + v2s(surf.cutDir)); }
};

var testSuites = {};

var commonProperies = function (surf) {
  assert(surf, s => s.norm.perpTo(s.cutDir), 'norm _|_ cutDir');
  assert(surf, s => s.norm.isUnit(), 'norm is unit');
  assert(surf, s => s.cutDir.isUnit(), 'cutDir is unit');
};

testSuites.cube = function () {
  for (var i=0; i<100; i++) {
    var x = 1.1*(Math.random()-0.5);
    var y = 1.1*(Math.random()-0.5);
    var surf = prim.cube(1)(x,y);
    commonProperies(surf);
    assert(surf, s => s.norm.z === 1, 'normal always points up');
    assert(surf, s => s.cutCurvature === 0, 'curvature is zero');
    assert(surf, s => s.perpCurvature === 0, 'perp curvature is zero');
    assert(surf, s => abs(s.cutDir.x) === 0 || abs(s.cutDir.y) === 0, 'cutDir always on an axis');
    assert(surf, s => s.pos.z == 0 || s.cutDir.cross(s.pos).z > 0, 'cutDir is clockwise');
  }
};

testSuites.sphere = function () {
  for (var i=0; i<100; i++) {
    var x = 1.1*(Math.random()-0.5);
    var y = 1.1*(Math.random()-0.5);
    var surf = prim.sphere(1)(x,y);
    commonProperies(surf);
    assert(surf, s => s.cutDir.z === 0, 'cutDir always in plane');
    // norm _|_ cutDir
    // norm is direction to point
    // cutDir is always pointing around the sphere (z cpt is zero)
    // pos distance from ctr pt is always radius
    // curvature..?
  }
};

return function () {
  for (name in testSuites) {
    console.log(name);
    testSuites[name]();
  }
};

});
