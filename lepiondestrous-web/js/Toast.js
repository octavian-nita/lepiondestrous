/**
 * @module Toast
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, Aug 24, 2015
 */
define(
  ['config', 'util'],

  function (config, util) {
    'use strict';

    var DEFAULT_STYLE = [

      // Positioning (see http://codeguide.co/#css-declaration-order)
      'position: absolute',
      'top: 65%',
      'left: 50%',

      // Display & Box Model
      'max-height: 30%',
      'padding: 0 25px',
      'overflow: hidden',

      // Typography
      'text-align: center',

      // Visual
      'background: rgba(0, 0, 0, 0.8)',
      'border-radius: 75px',

      // Misc
      'pointer-events: none', // IE 11+!
      'opacity: 0'

    ].join(';');

    /**
     * @constructor
     * @param {string} [className]
     * @param {number|string} [zIndex=99999]
     *
     * @see http://developer.android.com/guide/topics/ui/notifiers/toasts.html
     * @see http://developer.android.com/reference/android/widget/Toast.html
     * @see http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/
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
      style.cssText = DEFAULT_STYLE;

      style.zIndex = zIndex || 99999;

      style.color = config.theme.foreground;
      style.boxShadow = shadow.offsetX + 'px ' + shadow.offsetY + 'px ' + shadow.blur + 'px ' + shadow.color;

      util.pcss(style, 'transform', 'translateX(-50%)');
      util.pcss(style, 'user-select', 'none');

      this.element.addEventListener('transitionend', Toast.prototype._run.bind(this));
    }

    /** @return {Toast} <code>this</code> */
    Toast.prototype.show = function (message, delay) {
      if (!message) {
        this._messages.clear(); // use a falsy first argument to cancel display
      } else {
        this._messages.push(delay ? {message: message, delay: delay} : message);
      }
      this._run();
      return this;
    };

    Toast.prototype._run = function () {

      var element = this.element, style = element.style, opacity = window.getComputedStyle(element).opacity,
          message, delay;

      // Hack to get the animation started:
      //element.offsetHeight; // jshint ignore:line

      if (this._messages.isEmpty()) { // nothing to display or canceling previous run...
        if (opacity > 0) {
          util.pcss(style, 'transition', this._fastTransition);
          style.opacity = 0;
        } else {
          util.pcss(style, 'transition', '');
          element.innerHTML = '';
        }
        return;
      }

      if (opacity < 0.01) {

        if (!this._animated) {     // the toast was invisible, the animation has just started
          this._animated = true;

          message = this._messages.peek();
          element.innerHTML = '<p>' + (typeof message === 'object' ? message.message : message) + '</p>';

          util.pcss(style, 'transition', this._fastTransition);
          style.opacity = 1;

        } else {                   // the toast has just been made invisible
          this._animated = false;
          this._messages.pop();
          this._run();             // is there any other message to display?
        }

      } else if (opacity > 0.99) { // the toast has just been made fully visible, begin

        message = this._messages.peek();
        delay = typeof message === 'object' ? message.delay : this._delay;

        alert("BEFORE: " + style.transition);
        if (this._messages.size() > 1) {
          util.pcss(this.element.style, 'transition', this._fastTransition + ' ' + (delay / 2));
        } else {
          util.pcss(this.element.style, 'transition', this._slowTransition + ' ' + 1000);
        }
        alert("AFTER: " + style.transition);
        style.opacity = 0;

      }
    };

    Toast.DEFAULT_CLASS = 'toast';
    Toast.DEFAULT_DELAY = 250;
    Toast.DEFAULT_DURATION = 2500;

    return Toast;
  });
