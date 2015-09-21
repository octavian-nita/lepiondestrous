define(
  ['gameConfig', 'util'],

  function (cfg, util) {
    'use strict';

    /**
     * @constructor
     * @implements {EventListener}
     */
    function ToastListener() {
      if (!(this instanceof ToastListener)) { return new ToastListener(); }
    }

    ToastListener.prototype.handleEvent = function (event) {

    };

    /**
     * @author Octavian Theodor NITA (http://github.com/octavian-nita)
     * @version 1.0, August 24, 2015
     *
     * @constructor
     * @param {string} [className]
     * @param {number|string} [zIndex=99999]
     *
     * @see http://developer.android.com/guide/topics/ui/notifiers/toasts.html
     * @see http://developer.android.com/reference/android/widget/Toast.html
     */
    function Toast(className, zIndex) {
      if (!(this instanceof Toast)) { return new Toast(className, zIndex); }

      this._easeInTransition = 'opacity ' +
                               ((Number(cfg.toastEaseDuration) || 3000) / 3) + 'ms ease-in-out';

      this._easeOutTransition = 'opacity ' +
                                (Number(cfg.toastEaseDuration) || 3000) + 'ms ease-in-out ' +
                                (Number(cfg.toastEaseDelay) || 750) + 'ms';

      Object.defineProperty(this, 'element', {enumerable: true, value: document.createElement('div')});
      if (className) { this.element.className = className; }

      this.element.addEventListener("transitionend", new ToastListener(), false);

      var style = this.element.style, shadow = cfg.theme.shadow;

      // Positioning (see http://codeguide.co/#css-declaration-order)
      style.position = 'absolute';
      style.top = '65%';
      style.left = '50%';
      style.zIndex = zIndex || 99999;
      util.pcss(style, 'transform', 'translateX(-50%)');

      // Display & Box Model
      style.maxHeight = '30%';
      style.padding = '0 25px';
      style.overflow = 'hidden';

      // Typography
      style.color = cfg.theme.foreground;
      style.textAlign = 'center';

      // Visual
      style.background = 'rgba(0, 0, 0, 0.8)';
      style.borderRadius = '75px';
      style.boxShadow = shadow.offsetX + 'px ' + shadow.offsetY + 'px ' + shadow.blur + 'px ' + shadow.color;

      // Other
      style.pointerEvents = 'none'; // IE 11+
      style.opacity = 1;
    }

    Toast.prototype.show = function (message, delay) {
      if (!message) { return; }

      var e = this.element, s = e.style;

      if (window.getComputedStyle(e).opacity > '0') {
        e.innerHTML += '<p>' + message + '</p>';
        return;
      }
      e.innerHTML = '<p>' + message + '</p>';
      s.opacity = 1;
      //e.offsetHeight; // jshint ignore:line
    };

    Toast.prototype.hide = function () {
      var e = this.element, s = e.style;

      if (window.getComputedStyle(e).opacity === '0') {
        return;
      }
      e.innerHTML = '';
      s.opacity = 0;
    };

    return Toast;
  });
