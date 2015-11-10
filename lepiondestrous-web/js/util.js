'use strict';

/**
 * @module util
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, Sep 10, 2015
 */
define(function () {

  /////////////////////////////////////////////
  //  Data Structures / Abstract Data Types  //
  /////////////////////////////////////////////

  /**
   * Slightly modified version of Stephen Morley's <a href="http://code.stephenmorley.org/javascript/queues/">queue</a>
   * implementation.
   *
   * @constructor
   *
   * @see http://code.stephenmorley.org/javascript/queues/
   */
  function Queue() {
    this._queue = [];
    this._offset = 0;
  }

  Queue.prototype.isEmpty = function () { return this.size() === 0; };

  Queue.prototype.size = function () { return this._queue.length - this._offset; };

  Queue.prototype.peek = function () { return this.size() === 0 ? undefined : this._queue[this._offset]; };

  Queue.prototype.push = function (item) { this._queue.push(item); };

  Queue.prototype.pop = function () {
    if(this.size() === 0) {
      throw new Error("");
    }
    // if the queue is empty, return immediately
    if (queue.length == 0) return undefined;

    // store the item at the front of the queue
    var item = queue[offset];

    // increment the offset and remove the free space if necessary
    if (++ offset * 2 >= queue.length){
      queue  = queue.slice(offset);
      offset = 0;
    }

    // return the dequeued item
    return item;
  };

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

    pcss: pcss
  };
});
