define(['./game', './gameTheme'], function (Game, T) {
  'use strict';

  var O = { // Game view default options
    board: {
      maxHeight: 695,
      maxWidth: 504
    }
  };

  /**
   * @return {HTMLCanvasElement} an oversampled (2x) canvas element sized to fill the <code>container</code> if provided
   *         or to fill 300px × 150px otherwise
   */
  function createLayer(container, zIndex) {
    if (!container) { container = { offsetWidth: 300, offsetHeight: 150 }; }

    var canvas = document.createElement('canvas'), style = canvas.style;

    style.position = 'absolute';
    style.zIndex = zIndex || 0;
    style.background = 'transparent';
    style.width = container.offsetWidth + 'px';
    style.height = container.offsetHeight + 'px';

    canvas.width = container.offsetWidth * 2;
    canvas.height = container.offsetHeight * 2;
    canvas.getContext('2d').scale(2, 2);

    return canvas;
  }

  /** @constructor */
  function GameView(container, options) {
    if (!(this instanceof GameView)) { return new GameView(container, options); }
    if (!container) { return; }

    Object.defineProperty(this, 'game', { value: new Game() });

    /**
     * Gameboard geometry (i.e. where the gameboard gets drawn, how large it is, etc.), in terms of container dimensions.
     *
     * @type {{x: number, y: number, width: number, height: number, unit: number, size: number}}
     */
    Object.defineProperty(this, 'board', { value: {} });

    var o = Object.create(O), i, keys, l, boardRatio, layers;
    if (options) {
      for (i = 0, keys = Object.keys(options), l = keys.length; i < l; i++) { o[keys[i]] = options[keys[i]]; }
    }

    // Set up the board geometry (always vertical, http://www.frontcoded.com/javascript-fit-rectange-into-bounds.html):
    boardRatio = this.game.size / (this.game.size + 5);
    if (boardRatio > container.offsetWidth / container.offsetHeight) {
      this.board.width = Math.min(container.offsetWidth, o.board.maxWidth);
      this.board.height = this.board.width / boardRatio;
    } else {
      this.board.height = Math.min(container.offsetHeight, o.board.maxHeight);
      this.board.width = this.board.height * boardRatio;
    }
    this.board.x = (container.offsetWidth - this.board.width ) / 2;
    this.board.y = (container.offsetHeight - this.board.height) / 2;
    this.board.unit = this.board.height * boardRatio / this.game.size;

    this.render(layers = [createLayer(container), createLayer(container, 1), createLayer(container, 2)]);

    container.innerHTML = ''; // empty container content
    for (i = 0, l = layers.length; i < l; i++) { container.appendChild(layers[i]); }
  }

  GameView.prototype.render = function (layers) {
    var cx0 = layers[0].getContext('2d');
    this._renderBoard(cx0);
    this._renderHoles(cx0);
    this._renderPawns(layers[1].getContext('2d'));
  };

  GameView.prototype._renderBoard = function (cx) {
    if (!cx || !this.board) { return; }
    cx.canvas.style.background = T.boardLight;

    var brd = this.board;
    cx.save();

    cx.shadowOffsetX = T.dropShadow.offsetX;
    cx.shadowOffsetY = T.dropShadow.offsetY;
    cx.shadowColor = T.dropShadow.color;
    cx.shadowBlur = T.dropShadow.blur;

    cx.fillStyle = T.boardDark;
    cx.fillRect(brd.x, brd.y, brd.width, brd.height);

    cx.translate(brd.x, brd.y);    // move the origin to the board top left corner
    cx.scale(brd.unit, brd.unit);  // draw the board decorations in terms of units

    cx.shadowBlur /= brd.unit / 5; // stronger shadow
    cx.strokeStyle = T.foreground;
    cx.lineWidth = 2 / brd.unit;   // the canvas is oversampled and the board is scaled

    // Arch Bridge:
    cx.beginPath();
    cx.moveTo(0, 5);
    cx.lineTo(2.5, 5);
    // First small arch:
    cx.arcTo(2.6, 3.4, 3.5, 3, 1.6);
    cx.arcTo(4.4, 3.4, 4.5, 5, 1.6);
    cx.lineTo(4.5, 5); // finish the arch
    cx.lineTo(5.5, 5);
    // Middle large arch:
    cx.arcTo(5.6, 2.95, 7, 2.5, 1.6 + 0.5);
    cx.arcTo(8.4, 2.95, 8.5, 5, 1.6 + 0.5);
    cx.lineTo(8.5, 5); // finish the arch
    cx.lineTo(9.5, 5);
    // Second small arch:
    cx.arcTo(9.6, 3.4, 10.5, 3, 1.6);
    cx.arcTo(11.4, 3.4, 11.5, 5, 1.6);
    cx.lineTo(11.5, 5); // finish the arch
    cx.lineTo(14, 5);
    cx.stroke();

    // Bridge top:
    cx.beginPath();
    cx.moveTo(3, 0);
    cx.lineTo(3, 1.5);
    cx.lineTo(11, 1.5);
    cx.lineTo(11, 0);
    cx.stroke();

    cx.font = 0.8 + 'px ' + T.fontFamily;
    cx.fillStyle = T.foreground;
    cx.fillText(this.game.name, brd.width / (brd.unit * 2) - cx.measureText(this.game.name).width / 2, 1);

    cx.restore();
  };

  GameView.prototype._renderHoles = function (cx) {
    if (!cx || !this.board) { return; }

    function hole(x, y, rd) {
      cx.beginPath();
      cx.arc(x, y, rd ? rd : r, 0, pi2);
      cx.fill();
    }

    function holeShadow(x, y, rd) {
      if (!rd) { rd = r; }

      cx.save();
      cx.beginPath();
      cx.arc(x, y, rd, 0, pi2);
      cx.clip();
      cx.beginPath();
      cx.arc(x, y + cx.lineWidth, rd + cx.lineWidth, 0, pi2);
      cx.stroke();
      cx.restore();
    }

    function renderScoreboardHoles(fn, rd) {
      if (!fn) { fn = hole; }
      if (typeof fn !== 'function') { return; }
      if (!rd) { rd = r; }

      var x0 = dt + rd, y0 = dt + rd / 2, dm = 2 * rd, ds = dt + dm;

      fn.call(null, x0, y0, rd);
      fn.call(null, x0 + ds, y0, rd);
      fn.call(null, x0, y0 + ds, rd);
      fn.call(null, x0 + ds, y0 + ds, rd);
      fn.call(null, x0 + ds / 2, y0 + 2 * ds, rd);
      fn.call(null, x0 + ds / 2, y0 + 3 * ds, rd);
      fn.call(null, x0 + ds / 2, y0 + 4 * ds, rd);

      fn.call(null, bw - x0, y0, rd);
      fn.call(null, bw - x0 - ds, y0, rd);
      fn.call(null, bw - x0, y0 + ds, rd);
      fn.call(null, bw - x0 - ds, y0 + ds, rd);
      fn.call(null, bw - x0 - ds / 2, y0 + 2 * ds, rd);
      fn.call(null, bw - x0 - ds / 2, y0 + 3 * ds, rd);
      fn.call(null, bw - x0 - ds / 2, y0 + 4 * ds, rd);
    }

    var x, y, pi2 = 2 * Math.PI, bw = this.board.width, dm = this.board.unit * 1.5 / 3, r = dm / 2,
        dt = (bw - dm * this.game.size) / (this.game.size + 1);
    cx.save();

    // Hole outlines:
    cx.fillStyle = T.holeLight;

    cx.translate(this.board.x, this.board.y);
    renderScoreboardHoles();

    cx.translate(0, this.board.height - this.board.width);
    for (y = dt + r; y < bw; y += dt + dm) { for (x = dt + r; x < bw; x += dt + dm) { hole(x, y); } }

    // Hole inner shadows:
    cx.shadowOffsetX = T.dropShadow.offsetX;
    cx.shadowOffsetY = T.dropShadow.offsetY;
    cx.shadowColor = T.dropShadow.color;
    cx.shadowBlur = T.dropShadow.blur;
    cx.strokeStyle = T.holeDark;
    cx.lineWidth = 4;

    for (y = dt + r; y < bw; y += dt + dm) { for (x = dt + r; x < bw; x += dt + dm) { holeShadow(x, y); } }

    cx.translate(0, -this.board.height + this.board.width);
    renderScoreboardHoles(holeShadow);

    cx.restore();
  };

  GameView.prototype._renderPawns = function (cx) {
    if (!cx || !this.board || !this.game) { return; }

    var i, j, game = this.game, size = game.size;
    cx.save();

    cx.shadowOffsetX = T.dropShadow.offsetX;
    cx.shadowOffsetY = T.dropShadow.offsetY;
    cx.shadowColor = T.dropShadow.color;
    //cx.shadowBlur = T.dropShadow.blur;
    cx.shadowBlur /= this.board.unit / 5; // stronger shadow

    cx.translate(this.board.x, this.board.y);
    // TODO: maintain delta computation in the board

    for (i = 0; i < size; i++) {
      for (j = 0; j < size; j++) {
        if (!game.board.empty(i, j)) {
          // TODO: draw pawn
        }
      }
    }

    cx.restore();
  };

  return GameView;
});
