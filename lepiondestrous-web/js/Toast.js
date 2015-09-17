define(
  ['gameConfig', 'util'],

  function (cfg, util) {
    'use strict';

    /**
     * @author Octavian Theodor NITA (http://github.com/octavian-nita)
     * @version 1.0, August 24, 2015
     *
     * @constructor
     * @param {string} [className]
     * @param {number|string} [zIndex=9999]
     *
     * @see http://developer.android.com/guide/topics/ui/notifiers/toasts.html
     * @see http://developer.android.com/reference/android/widget/Toast.html
     */
    function Toast(className, zIndex) {
      if (!(this instanceof Toast)) { return new Toast(className, zIndex); }

      Object.defineProperty(this, 'element', {enumerable: true, value: document.createElement('div')});
      if (className) { this.element.className = className; }

      var style = this.element.style;
      style.pointerEvents = 'none';

      style.zIndex = zIndex || 9999;
      style.position = 'absolute';
      style.top = '65%';
      style.left = '50%';
      util.pcss(style, 'transform', 'translateX(-50%)');

      style.maxHeight = '30%';
      style.padding = '0 25px';
      style.overflow = 'hidden';
      style.borderRadius = '75px';

      style.background = 'rgba(0, 0, 0, 0.7)';
      style.color = cfg.theme.foreground;
      style.textAlign = 'center';

      style.opacity = 0;
    }

    Toast.prototype.show = function (message, delay) {
      if (!message) { return; }

      var e = this.element, s = e.style;

      if (window.getComputedStyle(e).opacity > '0') {
        e.innerHTML += '<p>' + message + '</p>';
        return;
      }
      e.innerHTML = '<p>' + message + '</p>';

      util.pcss(s, 'transition', 'opacity ' +
                                 ((Number(cfg.toastEaseDuration) || 3000) / 2) + 'ms ease-in-out ' /*+
                                 (Number(cfg.toastEaseDelay) || 750) + 'ms'*/);
      s.opacity = 1;
    };

    Toast.prototype.cancel = function () {
      var e = this.element, s = e.style;
      e.innerHTML = '';
      s.opacity = 0;
    };

    return Toast;
  });
