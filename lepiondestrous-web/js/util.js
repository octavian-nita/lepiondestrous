define(function () {
  'use strict';

  function extend(target /*, ...sources */) {
    if (arguments.length <= 1) { return target; }
    if (!target) { target = {}; }

    var i, sl, j, kl, source, keys;
    for (i = 1, sl = arguments.length; i < sl; i++) {
      if (typeof (source = arguments[i]) === 'object') {
        for (j = 0, kl = (keys = Object.keys(source)).length; j < kl; j++) { target[keys[j]] = source[keys[j]]; }
      }
    }

    return target;
  }

  return { extend: extend }
});
