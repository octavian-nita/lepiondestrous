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

      this._easeDelay = Number(cfg.toastEaseDelay) || 750;

      this._easeDuration = Number(cfg.toastEaseDuration) || 3000;

      Object.defineProperty(this, 'element', {enumerable: true, value: document.createElement('div')});
      if (className) { this.element.className = className + ''; }

      var style = this.element.style;
      style.zIndex = Number(zIndex) || 9999;
      style.position = 'absolute';
      style.top = '65%';
      style.left = '50%';

      etc.pcss(style, 'transform', 'translateX(-50%)');
      etc.pcss(style, 'transition', 'opacity ' + this._easeDuration + 'ms ' + this._easeDelay + 'ms ease');

      style.display = 'none';
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
      var toast     = this, element = this.element, style = element.style,
          easeDelay = Number(delay) || this._easeDelay, easeDuration = this._easeDuration;

      if (window.getComputedStyle(element).display != 'none') {
        element.innerHTML += '<p>' + message + '</p>';
        return;
      }

      element.innerHTML = '<p>' + message + '</p>';

      style.display = 'block';
      style.opacity = 1;

      setTimeout(function () {

        toast.cancel();
      }, easeDuration);
    };

    Toast.prototype.cancel = function () {
      var e = this.element, s = e.style;
      s.opacity = 0;
      s.display = 'none';
      e.innerHTML = '';
    };

    return Toast;
  });
