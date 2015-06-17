define(function () {
  'use strict';

  function extend(target /*, ...sources */) {
    if (arguments.length <= 1) { return target; }
    if (!target) { target = {}; }

    var i, l = arguments.length, source, j, kl, ks;
    for (i = 1; i < l; i++) {
      if (typeof (source = arguments[i]) === 'object') {
        for (j = 0, ks = Object.keys(source), kl = ks.length; j < kl; j++) { target[ks[j]] = source[ks[j]]; }
      }
    }

    return target;
  }

  return { extend: extend }
});
