'use strict';

/**
 * @module util
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, Sep 10, 2015
 */
define({
  pcss: function (elementOrStyle, propertyName, value) {
    if (!elementOrStyle) { return; }

    var style = elementOrStyle.style ? elementOrStyle.style : elementOrStyle;
    style[propertyName] =
      style['-o-' + propertyName] =
        style['-ms-' + propertyName] =
          style['-moz-' + propertyName] =
            style['-webkit-' + propertyName] = value;
  }
});
