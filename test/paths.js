define(function(require) {

var line = require('modelling/path/line');

var v2s = function (v) {
  return '(' + v.x.toFixed(3) + ',' + v.y.toFixed(3) + ')';
};

var assert = function (res, x,y, pred, m) {
  if (!pred(res)) { console.log(m+' at ' + v2s({x:x, y:y})+' dist: '+res.perpDistance); }
};

var nearTo = function (v1, v2, eps) {
  return abs(v2-v1) < eps;
}

var test = function (path) {
  for (var i=0; i<100; i++) {
    var x = 1*(Math.random()-0.5);
    var y = 1*(Math.random()-0.5);
    var res = path(x,y);
    if (res === null) { continue; }
    assert(res, x,y, r => r.param >= 0 && r.param <= 1, "param in range");
    assert(res, x,y, r => r.perpDistance < 1, "perpDistance");
    assert(res, x,y, r => r.cutDir.isUnit(), "cutDir normalised");
    assert(res, x,y, r => r.perpDir.isUnit(), "cutDir normalised");
    assert(res, x,y, r => r.perpDir.perpTo(r.cutDir), 'perpDir _|_ cutDir');
    assert(res, x,y, r => r.curvature >= 0 && r.curvature <= 10, "curvature in range");
  }
};

var testSuites = {};

testSuites.line = function () {
  test(line(-0.1,-0.4, 0.1,0.4));
};

return function () {
  for (name in testSuites) {
    console.log(name);
    testSuites[name]();
  }
};

});
