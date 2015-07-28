define(function () {
  'use strict';

  function Gfx() {
    if (!(this instanceof Gfx)) { return new Gfx(); }

    /** @protected */
    this._contexts = [];        // intended to be used as a stack of 2D rendering contexts
  }

  Gfx.prototype.use = function (ctx) {
    if (ctx) {
      this._contexts.push(ctx); // becomes the current 2D rendering context this instance will draw on
      ctx.save();               // many times, one temporarily sets attributes on the context one uses
    }
    return this;
  };

  Gfx.prototype.end = function () {
    var ctx = this._contexts.pop();
    ctx && ctx.restore();       // upon 'un-using' a context, restore its previous state
    return this;
  };

  Gfx.prototype.ctx = function () { return this._contexts[this._contexts.length - 1]; };

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

  Gfx.prototype.innerShadowCircle = function (x, y, r) { // a bit harder to generalize an 'inner-shadow' routine...
    var ctx = this._contexts[this._contexts.length - 1];
    if (!ctx) { return this; }

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
   * @return {HTMLCanvasElement} an eventually oversampled canvas element, sized to fill the provided
   *         <code>container</code> or to 300px × 150px if no container is provided and pre-styled to be used as a
   *         {@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#Use_multiple_layered_canvases_for_complex_scenes. layer}
   */
  Gfx.createLayer = function (container, zIndex, className) {
    var width = container && container.offsetWidth || 300,
        height = container && container.offsetHeight || 150,
        canvas = document.createElement('canvas'), style = canvas.style, oversample = Gfx.canvasOversample || 1;

    style.position = 'absolute';
    style.zIndex = zIndex || 0;
    style.background = 'transparent';
    style.width = width + 'px';
    style.height = height + 'px';

    canvas.width = width * oversample;
    canvas.height = height * oversample;
    canvas.getContext('2d').scale(oversample, oversample);

    className && (canvas.className = className + '');
    return canvas;
  };

  /** @static */
  Gfx.windowToElement = function (element, clientXOrEvent, clientY, isOversampled) {
    var bounds = element && element.getBoundingClientRect(),
        oversample = isOversampled && Gfx.canvasOversample || 1;
    if (!bounds || !clientXOrEvent) { return; }

    return typeof clientXOrEvent === 'object' ? {
      x: (clientXOrEvent.clientX - bounds.left) * oversample,
      y: (clientXOrEvent.clientY - bounds.top) * oversample
    } : {
      x: (clientXOrEvent - bounds.left) * oversample,
      y: (clientY - bounds.top) * oversample
    };
  };

  /**
   * @static
   * @type {number}
   */
  Gfx.canvasOversample = 2;

  /**
   * @static
   * @const
   * @type {number}
   */
  Gfx.TWO_PI = 2 * Math.PI;

  return Gfx;
});
