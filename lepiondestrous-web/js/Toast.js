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
      this._easeDelay = (Number(cfg.toastEaseDelay) || 250) + 'ms';

      /** @protected */
      this._easeInTransition = 'opacity ' + ((Number(cfg.toastEaseDuration) || 2500) / 3) + 'ms ease-in-out';

      /** @protected */
      this._easeOutTransition = 'opacity ' + (Number(cfg.toastEaseDuration) || 2500) + 'ms ease-in-out';

      this.element = document.createElement('div');
      if (className) { this.element.className = className; }

      var style = this.element.style, shadow = cfg.theme.shadow, toast = this;

      this.element.addEventListener("transitionend", function (event) {
        var e = event && event.target, s, delay, opacity;
        if (!e) { return; }

        console.trace('transitionend triggered');

        s = e.style;
        delay = e.getAttribute('data-delay');
        opacity = window.getComputedStyle(e).opacity;

        if (opacity > 0.99) {

          util.pcss(s, 'transition', toast._easeOutTransition + ' ' + (delay || toast._easeDelay));
          s.opacity = 0;

        } else if (opacity < 0.01) {

          e.innerHTML = '';
          e.setAttribute('data-delay', '');

          util.pcss(s, 'transition', '');

        }
      }, false);

      // http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/
      util.pcss(style, 'transform', 'translateZ(0)');

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

      // Hack to get animations started
      e.offsetHeight; // jshint ignore:line

      e.innerHTML = '<p>' + message + '</p>';
      if (delay) { e.setAttribute('data-delay', delay); }

      util.pcss(s, 'transition', this._easeInTransition);
      s.opacity = 1;
    };

    Toast.prototype.hide = function () {
      var e = this.element, s = e.style;

      // Hack to get animations started
      e.offsetHeight; // jshint ignore:line

      util.pcss(s, 'transition', ''); // the faster one...
      s.opacity = 0;
    };

    return Toast;
  });
