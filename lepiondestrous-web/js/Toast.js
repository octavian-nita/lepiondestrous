define(
  ['gameConfig', 'etc'],

  function (cfg, etc) {
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
      if (className) { this.element.className = className + ''; }

      var style = this.element.style;
      style.zIndex = Number(zIndex) || 9999;
      style.position = 'absolute';
      style.top = '65%';
      style.left = '50%';

      etc.pcss(style, 'transform', 'translateX(-50%)');
      etc.pcss(style, 'transition', 'opacity ' +
                                    (Number(cfg.toastEaseDuration) || 3000) + 'ms ease-in-out ' +
                                    (Number(cfg.toastEaseDelay) || 750) + 'ms');

      style.opacity = 0;

      style.padding = '0 25px';
      style.overflow = 'hidden';
      style.maxHeight = '30%';
      style.borderRadius = '75px';

      style.background = 'rgba(0, 0, 0, 0.7)';
      style.color = cfg.theme.foreground;
      style.textAlign = 'center';

      style.pointerEvents = 'none';
    }

    Toast.prototype.show = function (message, delay) {
      var e = this.element, s = e.style;

      if (window.getComputedStyle(e).opacity > '0') {
        e.innerHTML += '<p>' + message + '</p>';
        return;
      }

      e.innerHTML = '<p>' + message + '</p>';

      s.opacity = 1;
      e.offsetHeight;
      s.opacity = 0;
    };

    Toast.prototype.cancel = function () {
      var e = this.element, s = e.style;
      e.innerHTML = '';
      s.opacity = 0;
    };

    return Toast;
  });
