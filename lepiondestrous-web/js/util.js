/**
 * @module util
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, Nov 11, 2015
 */
define(function () {
  'use strict';

  /////////////////////////////////////////////
  //  Data Structures / Abstract Data Types  //
  /////////////////////////////////////////////

  /**
   * Slightly modified version of Stephen Morley's efficient
   * <a href="http://code.stephenmorley.org/javascript/queues/">queue</a> implementation.
   *
   * @constructor
   * @see http://code.stephenmorley.org/javascript/queues/
   */
  function Queue() {
    if (!(this instanceof Queue)) { return new Queue(); }
    this._queue = [];
    this._offset = 0;
  }

  Queue.prototype.isEmpty = function () { return this._queue.length === 0; };

  Queue.prototype.clear = function () { this._offset = this._queue.length = 0; };

  Queue.prototype.size = function () { return this._queue.length - this._offset; };

  Queue.prototype.push = function (item) { this._queue.push(item); };

  Queue.prototype.peek = function () {
    if (this._queue.length === 0) { throw new Error('cannot peek at an empty queue'); }
    return this._queue[this._offset];
  };

  Queue.prototype.pop = function () {
    if (this._queue.length === 0) { throw new Error('cannot pop from an empty queue'); }

    var item = this._queue[this._offset];
    if (++this._offset * 2 >= this._queue.length) { // increment the offset and remove the free space if necessary
      this._queue = this._queue.slice(this._offset);
      this._offset = 0;
    }
    return item;
  };

  //////////////
  //  Events  //
  //////////////

  /**
   * @param {HTMLElement} element
   * @param {Object|number} clientXYOrX
   * @param {number} [clientY]
   */
  function positionInElement(element, clientXYOrX, clientY) {
    if (!element) { return; }
    var bounds = element.getBoundingClientRect();

    return typeof clientXYOrX === 'object' ? {
      x: (clientXYOrX.clientX - bounds.left),
      y: (clientXYOrX.clientY - bounds.top)
    } : {
      x: (clientXYOrX - bounds.left),
      y: (clientY - bounds.top)
    };
  }

  ////////////////////////
  //  CSS Manipulation  //
  ////////////////////////

  function pcss(elementOrStyle, propertyName, value) {
    if (!elementOrStyle) { return; }

    var style = elementOrStyle.style ? elementOrStyle.style : elementOrStyle;
    style[propertyName] =
      style['-o-' + propertyName] =
        style['-ms-' + propertyName] =
          style['-moz-' + propertyName] =
            style['-webkit-' + propertyName] = value;
  }

  return {
    Queue: Queue,

    positionInElement: positionInElement,

    pcss: pcss
  };
});
