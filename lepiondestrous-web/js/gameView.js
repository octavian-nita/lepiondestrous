define(['./game', './gameTheme', './util'], function (Game, T, util) {
  'use strict';

  var O = { // Game view default options
    board: {
      maxHeight: 695,
      maxWidth: 504
    }
  };

  /** @constructor */
  function GameView(parent, options) {
    if (!(this instanceof GameView)) { return new GameView(parent, options); }
    if (!parent) { return; }

    Object.defineProperty(this, 'game', { value: new Game() });

    /**
     * Gameboard geometry (i.e. where the gameboard gets drawn, how large it is, etc.), in terms of parent dimensions.
     *
     * @type {{x: number, y: number, width: number, height: number, unit: number, size: number}}
     */
    Object.defineProperty(this, 'board', { value: {} });

    var o = util.extend({}, O, options), boardRatio;

    // Set up the board geometry (always vertical, http://www.frontcoded.com/javascript-fit-rectange-into-bounds.html):
    boardRatio = this.game.size / (this.game.size + 5);
    if (boardRatio > parent.offsetWidth / parent.offsetHeight) {
      this.board.width = Math.min(parent.offsetWidth, o.board.maxWidth);
      this.board.height = this.board.width / boardRatio;
    } else {
      this.board.height = Math.min(parent.offsetHeight, o.board.maxHeight);
      this.board.width = this.board.height * boardRatio;
    }
    this.board.x = (parent.offsetWidth - this.board.width ) / 2;
    this.board.y = (parent.offsetHeight - this.board.height) / 2;
    this.board.unit = this.board.height * boardRatio / this.game.size;

    /**
     * The canvas on which the game is drawn is oversampled (2x) and fills its parent.
     *
     * @type {HTMLCanvasElement}
     */
    Object.defineProperty(this, 'canvas', { value: document.createElement('canvas') });

    // Set up an oversampled (2x) canvas:
    this.canvas.width = parent.offsetWidth * 2;
    this.canvas.height = parent.offsetHeight * 2;
    this.canvas.style.width = parent.offsetWidth + 'px';
    this.canvas.style.height = parent.offsetHeight + 'px';
    this.canvas.getContext('2d').scale(2, 2);

    this.render();
    parent.innerHTML = ''; // empty parent content
    parent.appendChild(this.canvas);
  }

  GameView.prototype.render = function () {
    this._renderBoard();
    this._renderHoles();
  };

  GameView.prototype._renderBoard = function () {
    if (!this.canvas || !this.board) { return; }

    var ctx = this.canvas.getContext('2d'), brd = this.board;
    ctx.save();

    ctx.fillStyle = T.boardLight;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.shadowOffsetX = T.dropShadow.offsetX;
    ctx.shadowOffsetY = T.dropShadow.offsetY;
    ctx.shadowColor = T.dropShadow.color;
    ctx.shadowBlur = T.dropShadow.blur;

    ctx.fillStyle = T.boardDark;
    ctx.fillRect(brd.x, brd.y, brd.width, brd.height);

    ctx.translate(brd.x, brd.y);    // move the origin to the board top left corner
    ctx.scale(brd.unit, brd.unit);  // draw the board decorations in terms of units

    ctx.shadowBlur /= brd.unit / 5; // stronger shadow
    ctx.strokeStyle = T.foreground;
    ctx.lineWidth = 2 / brd.unit;   // the canvas is oversampled and the board is scaled

    // Arch Bridge:
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.lineTo(2.5, 5);
    // First small arch:
    ctx.arcTo(2.6, 3.4, 3.5, 3, 1.6);
    ctx.arcTo(4.4, 3.4, 4.5, 5, 1.6);
    ctx.lineTo(4.5, 5); // finish the arch
    ctx.lineTo(5.5, 5);
    // Middle large arch:
    ctx.arcTo(5.6, 2.95, 7, 2.5, 1.6 + 0.5);
    ctx.arcTo(8.4, 2.95, 8.5, 5, 1.6 + 0.5);
    ctx.lineTo(8.5, 5); // finish the arch
    ctx.lineTo(9.5, 5);
    // Second small arch:
    ctx.arcTo(9.6, 3.4, 10.5, 3, 1.6);
    ctx.arcTo(11.4, 3.4, 11.5, 5, 1.6);
    ctx.lineTo(11.5, 5); // finish the arch
    ctx.lineTo(14, 5);
    ctx.stroke();

    // Bridge top:
    ctx.beginPath();
    ctx.moveTo(3, 0);
    ctx.lineTo(3, 1.5);
    ctx.lineTo(11, 1.5);
    ctx.lineTo(11, 0);
    ctx.stroke();

    ctx.font = 0.8 + 'px ' + T.fontFamily;
    ctx.fillStyle = T.foreground;
    ctx.fillText(this.game.name, brd.width / (brd.unit * 2) - ctx.measureText(this.game.name).width / 2, 1);

    ctx.restore();
  };

  GameView.prototype._renderHoles = function () {
    if (!this.canvas || !this.board) { return; }

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

    var
      cx = this.canvas.getContext('2d'), bd = this.board, bw = bd.width, pi2 = 2 * Math.PI, x, y,
      dm = bd.unit * 1.5 / 3, r = dm / 2, dt = (bd.width - dm * this.game.size) / (this.game.size + 1);
    cx.save();

    // Hole outlines:
    cx.fillStyle = T.holeLight;

    cx.translate(bd.x, bd.y);
    renderScoreboardHoles();

    cx.translate(0, bd.height - bd.width);
    for (y = dt + r; y < bw; y += dt + dm) { for (x = dt + r; x < bw; x += dt + dm) { hole(x, y); } }

    // Hole inner shadows:
    cx.shadowOffsetX = T.dropShadow.offsetX;
    cx.shadowOffsetY = T.dropShadow.offsetY;
    cx.shadowColor = T.dropShadow.color;
    cx.shadowBlur = T.dropShadow.blur;
    cx.strokeStyle = T.holeDark;
    cx.lineWidth = 4;

    for (y = dt + r; y < bw; y += dt + dm) { for (x = dt + r; x < bw; x += dt + dm) { holeShadow(x, y); } }

    cx.translate(0, -bd.height + bd.width);
    renderScoreboardHoles(holeShadow);

    cx.restore();
  };

  return GameView;
});
