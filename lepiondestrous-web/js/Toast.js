define(
  ['gameConfig', 'util'],

  function (cfg, util) {
    'use strict';

    /**
     * @author Octavian Theodor NITA (http://github.com/octavian-nita)
     * @version 1.0, Aug 24, 2015
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
      this._delay = (Number(cfg.toast.delay) || 250) + 'ms';

      /** @protected */
      this._inTransition = 'opacity ' + ((Number(cfg.toast.duration) || 2500) / 3) + 'ms ease-in-out';

      /** @protected */
      this._outTransition = 'opacity ' + (Number(cfg.toast.duration) || 2500) + 'ms ease-in-out';

      /** @public */
      this.element = document.createElement('div');
      if (className) { this.element.className = className; }

      var style = this.element.style, shadow = cfg.theme.shadow;

      // http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/
      util.pcss(style, 'transform', 'translateZ(0)');
      util.pcss(style, 'user-select', 'none');

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

      this.element.addEventListener('transitionend', function (event) {
        var element = event && event.target, style, delay, opacity;
        if (!element) { return; }

        style = element.style;
        delay = element.getAttribute('data-delay');
        opacity = window.getComputedStyle(element).opacity;

        if (opacity > 0.99) { // toast just shown
          util.pcss(style, 'transition', this._outTransition + ' ' + (delay || this._delay));
          style.opacity = 0;
        } else if (opacity < 0.01) { // toast just hidden
          util.pcss(style, 'transition', '');
          element.setAttribute('data-delay', '');
          element.innerHTML = '';
        }
      }.bind(this));
    }

    /** @return {Toast} <code>this</code> */
    Toast.prototype.show = function (messageOrFalsy, delay) {
      var element = this.element, style = element.style;

      // Hack to get the animation started:
      element.offsetHeight; // jshint ignore:line
      util.pcss(style, 'transition', this._inTransition);

      if (messageOrFalsy) {
        element.innerHTML = '<p>' + messageOrFalsy + '</p>';
        if (delay) { element.setAttribute('data-delay', delay + 'ms'); }

        style.opacity = 1;
      } else {
        style.opacity = 0;
      }

      return this;
    };

    return Toast;
  });
