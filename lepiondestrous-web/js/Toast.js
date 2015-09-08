define(
  ['gameConfig'],

  function (cfg) {
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

      Object.defineProperty(this, 'element', { enumerable: true, value: document.createElement('div') });
      if (className) { this.element.className = className + ''; }

      var style = this.element.style;

      style.position = 'absolute';
      style.zIndex = Number(zIndex) || 9999;

      style.top = '65%';
      style.left = '50%';
      style.transform = 'translateX(-50%)';

      style.borderRadius = '75px';
      style.padding = '0 25px';

      style.color = cfg.theme.foreground;
      style.background = 'rgba(0, 0, 0, 0.7)';
      style.textAlign = 'center';

      style.display = 'none';
      style.opacity = 0;
      style['pointer-events'] = 'none';
    }

    Toast.prototype.show = function (message, timeout) {
      var elem = this.element, style = elem.style;

      if (window.getComputedStyle(elem).display != 'none') {
        elem.innerHTML += '<p>' + message + '</p>';
      } else {
        elem.innerHTML = '<p>' + message + '</p>';

        style.display = 'block';
        style.opacity = 1;
        setTimeout(function () {

          style.transition =
          style['-o-transition'] =
          style['-moz-transition'] =
          style['-webkit-transition'] = 'opacity ' + (Number(cfg.toastEaseDuration) || 3000) + 'ms ease';

          style.opacity = 0;
          setTimeout(function () {
            style.display = 'none';
          }, Number(cfg.toastEaseDuration) || 3000);
        }, Number(timeout) || Number(cfg.toastTimeout) || 750);
      }
    };

    Toast.prototype.cancel = function () {

    };

    return Toast;
  });
