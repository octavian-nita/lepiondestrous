define(
  ['gameConfig'],

  function (cfg) {
    'use strict';

    function prefixCss(elementOrStyle, propertyName, value) {
      if (!elementOrStyle) { return; }

      var style = elementOrStyle instanceof HTMLElement ? elementOrStyle.style : elementOrStyle;
      style[propertyName] =
      style['-o-' + propertyName] =
      style['-ms-' + propertyName] =
      style['-moz-' + propertyName] =
      style['-webkit-' + propertyName] = value;
    }

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

      this._timeout = Number(cfg.toastTimeout) || 750;
      this._easeDuration = Number(cfg.toastEaseDuration) || 3000;
      this._transition = 'opacity ' + this._easeDuration + 'ms ease';

      Object.defineProperty(this, 'element', { enumerable: true, value: document.createElement('div') });
      if (className) { this.element.className = className + ''; }

      var style = this.element.style;
      style.zIndex = Number(zIndex) || 9999;
      style.pointerEvents = 'none';

      style.position = 'absolute';
      style.top = '65%';
      style.left = '50%';
      style.transform =
      style['-o-transform'] =
      style['-ms-transform'] =
      style['-moz-transform'] =
      style['-webkit-transform'] = 'translateX(-50%)';

      style.borderRadius = '75px';
      style.padding = '0 25px';
      style.maxHeight = '30%';

      style.overflow = 'hidden';

      style.color = cfg.theme.foreground;
      style.background = 'rgba(0, 0, 0, 0.7)';
      style.textAlign = 'center';

      style.display = 'none';
      style.opacity = 0;
    }

    Toast.prototype.show = function (message, timeout) {
      var element = this.element, style = element.style,
          transition = this._transition, timeout = Number(timeout) || this._timeout;

      if (window.getComputedStyle(element).display != 'none') {
        element.innerHTML += '<p>' + message + '</p>';
        return;
      }

      element.innerHTML = '<p>' + message + '</p>';

      style.display = 'block';
      style.opacity = 1;

      setTimeout(function () {

        style.transition =
        style['-o-transition'] =
        style['-ms-transition'] =
        style['-moz-transition'] =
        style['-webkit-transition'] = transition;

        style.opacity = 0;
        setTimeout(function () {
          style.display = 'none';
          style.transition =
          style['-o-transition'] =
          style['-ms-transition'] =
          style['-moz-transition'] =
          style['-webkit-transition'] = 'none';
        }, Number(cfg.toastEaseDuration) || 3000);
      }, timeout);
    };

    Toast.prototype.cancel = function () {
      var element = this.element, style = element.style;

      element.innerHTML = '';
      style.display = 'none';
      style.opacity = 0;
      style.transition =
      style['-o-transition'] =
      style['-ms-transition'] =
      style['-moz-transition'] =
      style['-webkit-transition'] = 'none';
    };

    return Toast;
  });
