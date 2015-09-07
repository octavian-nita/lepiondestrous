define(
  ['gameConfig'],

  function (cfg) {
    'use strict';
    console.log('CFG:', cfg.id);
    /**
     * @author Octavian Theodor NITA (http://github.com/octavian-nita)
     * @version 1.0, August 24, 2015
     *
     * @constructor
     * @param {number|string} [zIndex=9999]
     * @param {string} [className]
     * @param {HTMLElement} [container]
     *
     * @see http://developer.android.com/guide/topics/ui/notifiers/toasts.html
     * @see http://developer.android.com/reference/android/widget/Toast.html
     */
    function Toast(zIndex, className, container) {
      if (!(this instanceof Toast)) { return new Toast(); }
    }

    Toast.prototype.show = function (message, timeout) {

    };

    Toast.prototype.cancel = function () {

    };

    return Toast;
  });
