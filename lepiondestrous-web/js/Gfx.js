/**
 * @module Gfx
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, Aug 12, 2015
 */
define(function () {
  'use strict';

  /**
   * Fluent (more or less) API for commonly used 2D rendering context drawing operations.
   *
   * @constructor
   */
  function Gfx() {
    if (!(this instanceof Gfx)) { return new Gfx(); }

    /**
     * Intended to be (internally) used as a stack of 2D rendering contexts, to allow reusing the same Gfx instance.
     *
     * @protected
     */
    this._contexts = [];
  }

  /**
   * @param {CanvasRenderingContext2D} ctx its state is saved and it becomes the current rendering context
   *                                       <code>this</code> instance draws on
   * @return {Gfx}
   */
  Gfx.prototype.use = function (ctx) {
    if (ctx) {
      this._contexts.push(ctx);
      ctx.save();
    }
    return this;
  };

  /**
   * If available, the last used rendering context is discarded and its state restored.
   *
   * @return {Gfx}
   */
  Gfx.prototype.end = function () {
    var ctx = this._contexts.pop();
    if (ctx) { ctx.restore(); }
    return this;
  };

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} r
   * @param {function} [fn='fill'] rendering context function to draw/end the arc path used to define the circle
   *                               (e.g. <code>'clip'</code>)
   * @return {Gfx}
   */
  Gfx.prototype.circle = function (x, y, r, fn) {
    var ctx = this._contexts[this._contexts.length - 1], args, i, l;
    if (!ctx) { return this; }

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Gfx.TWO_PI);

    // Finishing context method call; optionally, one can use 'fill' (the default), 'clip', etc.:
    if (fn && typeof ctx[fn] === 'function') {
      // (see https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments)
      args = new Array(arguments.length - 4);
      for (i = 0, l = args.length; i < l; ++i) { args[i] = arguments[i + 4]; }
      ctx[fn].apply(ctx, args);
    } else {
      ctx.fill();
    }

    return this;
  };

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} r
   * @return {Gfx}
   */
  Gfx.prototype.innerShadowCircle = function (x, y, r) { // a bit harder to generalize an 'inner-shadow' routine...
    var ctx = this._contexts[this._contexts.length - 1];
    if (!ctx) { return this; }

    // Alternative inner shadow technique: http://www.quora.com/How-can-I-draw-inset-shadow-on-HTML-canvas
    ctx.save(); // in order to restore the clipping region since the technique is based on manipulating it
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Gfx.TWO_PI);
    ctx.clip();
    ctx.beginPath();
    ctx.arc(x, y + ctx.lineWidth, r + ctx.lineWidth, 0, Gfx.TWO_PI);
    ctx.stroke();
    ctx.restore();

    return this;
  };

  /**
   * @static
   * @param {string} [className]
   * @param {number|string} [zIndex=0]
   * @param {HTMLElement} [container]
   * @return {HTMLCanvasElement} an eventually oversampled canvas element, sized to fill the provided
   *         <code>container</code> or to 300px × 150px if no container is provided and pre-styled to
   *         be used as a {@link http://goo.gl/LgEbvt layer}
   */
  Gfx.createCanvas = function (className, zIndex, container) {
    var width  = container && container.offsetWidth || 300,
        height = container && container.offsetHeight || 150,
        canvas = document.createElement('canvas'), style = canvas.style, oversample = Gfx.canvasOversampling || 1;

    style.position = 'absolute';
    style.zIndex = zIndex || 0;
    style.width = width + 'px';
    style.height = height + 'px';

    if (className) { canvas.className = className + ''; }
    canvas.width = width * oversample;
    canvas.height = height * oversample;
    canvas.getContext('2d').scale(oversample, oversample);

    return canvas;
  };

  /**
   * @static
   * @type {number}
   * @default 2
   */
  Gfx.canvasOversampling = 2;

  /**
   * @static
   * @const {number}
   * @default 2 * Math.PI
   */
  Gfx.TWO_PI = 2 * Math.PI;

  return Gfx;
});
