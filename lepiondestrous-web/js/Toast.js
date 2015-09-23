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
     * @param {number|string} [zIndex=99999]
     *
     * @see http://developer.android.com/guide/topics/ui/notifiers/toasts.html
     * @see http://developer.android.com/reference/android/widget/Toast.html
     */
    function Toast(className, zIndex) {
      if (!(this instanceof Toast)) { return new Toast(className, zIndex); }

      /** @protected */
      this._easeDelay = (Number(cfg.toastEaseDelay) || 750) + 'ms';

      /** @protected */
      this._easeInTransition = 'opacity ' + ((Number(cfg.toastEaseDuration) || 3000) / 3) + 'ms ease-in-out';

      /** @protected */
      this._easeOutTransition = 'opacity ' + (Number(cfg.toastEaseDuration) || 3000) + 'ms ease-in-out';

      this.element = document.createElement('div');

      var style = this.element.style, shadow = cfg.theme.shadow, toast = this;

      if (className) { this.element.className = className; }

      this.element.addEventListener("transitionend", function (event) {
        var element = event && event.target, style, opacity;
        if (!element) { return; }

        style = element.style;
        opacity = window.getComputedStyle(element);

        console.trace('event:');

        if (opacity > 0.9) {
          console.trace(' >>> toast visible!');

          util.pcss(style, 'transition', toast._easeOutTransition + ' ' + toast._easeDelay);
          style.opacity = 0;

          return;
        }

        if (opacity < 0.1) {
          console.trace(' >>> toast invisible!');

          util.pcss(style, 'transition', '');
          element.innerHTML = '';

        }
      }, false);

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
      style.opacity = 0;
    }

    Toast.prototype.show = function (message, delay) {
      if (!message) { return; }

      var e = this.element, s = e.style;

      util.pcss(s, 'transition', this._easeInTransition);
      e.innerHTML = '<p>' + message + '</p>';
      s.opacity = 1;
    };

    return Toast;
  });
