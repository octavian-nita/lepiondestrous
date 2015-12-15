/**
 * @module Toast
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, Dec 8, 2015
 */
define(
  ['config', 'util'],

  function (config, util) {
    'use strict';

    var DEFAULT_STYLE = [ // see http://codeguide.co/#css-declaration-order
      'position: absolute',
      'left: 50%',
      'top: 70%',
      'max-height: 30%',
      'padding: 0 25px',
      'overflow: hidden',
      'background: rgba(0, 0, 0, 0.8)',
      'border-radius: 75px',
      'pointer-events: none', // IE 11+!
      'opacity: 0'
    ].join('; ');

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

      /** @protected */ this._delay = (Number(config.toast.delay) || Toast.DEFAULT_DELAY);

      /** @protected */ this._fastTransition = 'opacity ' + (duration / 5) + 'ms ease-in-out';

      /** @protected */ this._slowTransition = 'opacity ' + duration + 'ms ease-in-out';

      /** @public */ this.element = document.createElement('div');

      this.element.className = className || Toast.DEFAULT_CLASS;

      // Style the backing HTML element:
      style = this.element.style;

      style.cssText = DEFAULT_STYLE;
      style.zIndex = zIndex || 99998;
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

      if (this._messages.isEmpty()) { // no message to display or cancel the current run...

        if (opacity > 0) {
          util.pcss(style, 'transition', this._fastTransition);
          style.opacity = 0;
        } else {
          util.pcss(style, 'transition', '');
          element.innerHTML = '';
        }

      } else if (opacity > 0.99) {    // messages queued and the toast has just been made fully visible

        message = this._messages.peek();
        delay = typeof message === 'object' ? message.delay : this._delay;

        if (this._messages.size() > 1) {
          util.pcss(style, 'transition', this._fastTransition + ' ' + (delay / 2) + 'ms');
        } else {
          util.pcss(style, 'transition', this._slowTransition + ' ' + delay + 'ms');
        }
        style.opacity = 0;

      } else if (opacity < 0.01) {    // messages queued but not displayed

        if (!this._animated) {        // -- the toast was invisible, the animation has just started
          this._animated = true;

          message = this._messages.peek();
          element.innerHTML = '<p>' + (typeof message === 'object' ? message.message : message) + '</p>';

          util.pcss(style, 'transition', this._fastTransition);
          style.opacity = 1;

        } else {                      // -- the toast has just been made invisible
          this._animated = false;
          this._messages.pop();
          if (this._messages.isEmpty()) { // is there any other message to display?
            util.pcss(style, 'transition', '');
            element.innerHTML = '';
          } else {
            this._run();
          }
        }

      }
    };

    Toast.DEFAULT_CLASS = 'toast';
    Toast.DEFAULT_DELAY = 250;
    Toast.DEFAULT_DURATION = 2500;

    return Toast;
  });
