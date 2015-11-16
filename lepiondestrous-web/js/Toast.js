/**
 * @module Toast
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, Aug 24, 2015
 */
define(
  ['config', 'util'],

  function (config, util) {
    'use strict';

    /**
     * @constructor
     * @param {string} [className]
     * @param {number|string} [zIndex=99999]
     *
     * @see http://developer.android.com/guide/topics/ui/notifiers/toasts.html
     * @see http://developer.android.com/reference/android/widget/Toast.html
     */
    function Toast(className, zIndex) {
      if (!(this instanceof Toast)) { return new Toast(className, zIndex); }

      var duration = Number(config.toast.duration) || Toast.DEFAULT_DURATION, shadow = config.theme.shadow, style;

      /** @protected */ this._animated = false;

      /** @protected */ this._messages = new util.Queue();

      /** @protected */ this._delay = (Number(config.toast.delay) || Toast.DEFAULT_DELAY) + 'ms';

      /** @protected */ this._fastTransition = 'opacity ' + (duration / 4) + 'ms ease-in-out';

      /** @protected */ this._slowTransition = 'opacity ' + duration + 'ms ease-in-out';

      /** @public */ this.element = document.createElement('div');

      this.element.className = className || Toast.DEFAULT_CLASS;

      // Style the backing HTML element:
      style = this.element.style;

      // http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/
      util.pcss(style, 'transform', 'translateZ(0)'); // keep first!

      // Positioning (see http://codeguide.co/#css-declaration-order)
      style.position = 'absolute';
      style.top = '65%';
      style.left = '50%';
      style.zIndex = zIndex || 99999;
      util.pcss(style, 'transform', 'translateX(-50%)');

      // Display & Box Model
      style.display = 'none';
      style.maxHeight = '30%';
      style.padding = '0 25px';
      style.overflow = 'hidden';

      // Typography
      style.color = config.theme.foreground;
      style.textAlign = 'center';

      // Visual
      style.background = 'rgba(0, 0, 0, 0.8)';
      style.borderRadius = '75px';
      style.boxShadow = shadow.offsetX + 'px ' + shadow.offsetY + 'px ' + shadow.blur + 'px ' + shadow.color;

      // Misc
      util.pcss(style, 'user-select', 'none');
      style.pointerEvents = 'none'; // IE 11+!
      style.opacity = 0;

      this.element.addEventListener('transitionend', function (event) {
        var element = event && event.target, style, delay, opacity;
        if (!element) { return; }

        style = element.style;
        delay = element.getAttribute('data-delay');
        opacity = window.getComputedStyle(element).opacity;

        if (opacity > 0.99) { // toast just shown
          util.pcss(style, 'transition', this._slowTransition + ' ' + (delay || this._delay));
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
      var style = this.element.style;

      if (!messageOrFalsy) {
        // TODO: hide gracefully, clean up and return
        return;
      }

      this._messages.push(delay ? {message: messageOrFalsy, delay: delay} : messageOrFalsy);
      if (this._animated) { return; }

      this._run();
      return this;
    };

    Toast.prototype._end = function () {
      var element = this.element;
      element.style.display = 'none';
      element.removeChild(element.firstChild);
    };

    Toast.prototype._run = function () {
      var element = this.element, style = element.style, message, delay;

      if (this._animated || this._messages.isEmpty() || !this.element) { return; }
      this._animated = true;

      message = this._messages.pop();
      if (typeof message === 'object') {
        message = message.message;
        delay = message.delay;
      }

      // TODO: rewrite following...
      // Hack to get the animation started:
      element.offsetHeight; // jshint ignore:line
      util.pcss(style, 'transition', this._fastTransition);

      if (messageOrFalsy) {
        element.innerHTML = '<p>' + messageOrFalsy + '</p>';
        element.setAttribute('data-delay', delay + 'ms');

        style.opacity = 1;
      } else {
        style.opacity = 0;
      }
    };

    Toast.DEFAULT_CLASS = 'toast';
    Toast.DEFAULT_DELAY = 250;
    Toast.DEFAULT_DURATION = 2500;

    return Toast;
  });
