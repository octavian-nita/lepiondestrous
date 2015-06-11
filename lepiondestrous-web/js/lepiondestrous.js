/*jshint browser: true, devel: true, indent: 2, maxerr: 50, maxlen: 120 */
/*global define: true, module: true, exports: true */

window.addEventListener('load', function (/*event*/) {
  'use strict';

  var

    O = { // Game default options
      gameSize: 14,
      board: {
        ratio: 14 / 19,
        maxHeight: 695,
        maxWidth: 504
      }
    },

    R = { // Game resources
      gameTitle: 'Le pion des trous'
    },

    T = { // Game theme; http://www.materialui.co/colors
      fontFamily: '"Chantelli Antiqua"',
      textColor: '#ffc107',
      holeDark: '#3e2723',
      holeLight: '#5d4037',
      boardDark: '#795548',
      boardLight: '#8d6e63',
      dropShadow: {offsetX: 0, offsetY: 2, blur: 20, color: 'rgba(0, 0, 0, 0.9)'}
    };

  /** @constructor */
  function GameView(parent, options) {
    if (!(this instanceof GameView)) { return new GameView(parent, options); }
    if (!parent) { return; }

    var o = Object.create(O), i, keys, l;
    if (options) {
      for (i = 0, keys = Object.keys(options), l = keys.length; i < l; i++) {
        o[keys[i]] = options[keys[i]];
      }
    }

    /**
     * Gameboard geometry (i.e. where the gameboard gets drawn, how large it is, etc.), in terms of parent dimensions.
     *
     * @type {{x: number, y: number, width: number, height: number, unit: number, size: number}}
     */
    this._board = {};

    // Set up the board geometry (always vertical for the moment):
    if (o.board.ratio > parent.offsetWidth / parent.offsetHeight) { // http://www.frontcoded.com/javascript-fit-rectange-into-bounds.html
      this._board.width = Math.min(parent.offsetWidth, o.board.maxWidth);
      this._board.height = this._board.width / o.board.ratio;
    } else {
      this._board.height = Math.min(parent.offsetHeight, o.board.maxHeight);
      this._board.width = this._board.height * o.board.ratio;
    }
    this._board.x = (parent.offsetWidth - this._board.width ) / 2;
    this._board.y = (parent.offsetHeight - this._board.height) / 2;
    this._board.size = o.gameSize;
    this._board.unit = this._board.height * o.board.ratio / this._board.size;

    /**
     * The canvas on which the game is drawn is oversampled (2x) and fills its parent.
     *
     * @type {HTMLCanvasElement}
     */
    this._canvas = document.createElement('canvas');

    // Set up an oversampled (2x) canvas:
    this._canvas.width = parent.offsetWidth * 2;
    this._canvas.height = parent.offsetHeight * 2;
    this._canvas.style.width = parent.offsetWidth + 'px';
    this._canvas.style.height = parent.offsetHeight + 'px';
    this._canvas.getContext('2d').scale(2, 2);

    this.render();
    parent.innerHTML = ''; // empty parent content
    parent.appendChild(this._canvas);
  }

  GameView.prototype.render = function () {
    this._renderBoard();
    this._renderHoles();
  };

  GameView.prototype._renderBoard = function () {
    if (!this._canvas || !this._board) { return; }

    var ctx = this._canvas.getContext('2d'), brd = this._board;
    ctx.save();

    ctx.fillStyle = T.boardLight;
    ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

    ctx.shadowOffsetX = T.dropShadow.offsetX;
    ctx.shadowOffsetY = T.dropShadow.offsetY;
    ctx.shadowColor = T.dropShadow.color;
    ctx.shadowBlur = T.dropShadow.blur;

    ctx.fillStyle = T.boardDark;
    ctx.fillRect(brd.x, brd.y, brd.width, brd.height);

    ctx.translate(brd.x, brd.y);     // move the origin to the board top left corner
    ctx.scale(brd.unit, brd.unit);   // draw the board decorations in terms of units

    ctx.shadowBlur /= brd.unit / 5; // stronger shadow
    ctx.strokeStyle = T.textColor;
    ctx.lineWidth = 2 / brd.unit;    // remember the canvas is oversampled

    ctx.translate(0, -0.1);
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
    ctx.translate(0, 0.1);

    // Bridge top:
    ctx.beginPath();
    ctx.moveTo(3, 0);
    ctx.lineTo(3, 1.5);
    ctx.lineTo(11, 1.5);
    ctx.lineTo(11, 0);
    ctx.stroke();

    ctx.font = 0.8 + 'px ' + T.fontFamily;
    ctx.fillStyle = T.textColor;
    ctx.fillText(R.gameTitle, brd.width / (brd.unit * 2) - ctx.measureText(R.gameTitle).width / 2, 1);

    ctx.restore();
  };

  GameView.prototype._renderHoles = function () {
    if (!this._canvas || !this._board) { return; }

    var
      ctx = this._canvas.getContext('2d'), brd = this._board, brw = brd.width, pi2 = 2 * Math.PI,
      dia = brd.unit * 2 / 3, r = dia / 2, d = (brd.width - dia * brd.size) / (brd.size + 1), cx, cy;
    ctx.save();

    ctx.translate(brd.x, brd.y + brd.height - brd.width);
    for (cy = d + r; cy < brw; cy += d + dia) {
      for (cx = d + r; cx < brw; cx += d + dia) {
        ctx.fillStyle = ctx.createRadialGradient(cx, cy + r / 2, r - r / 4, cx, cy + r / 2, 0);
        ctx.fillStyle.addColorStop(0, T.holeDark);
        ctx.fillStyle.addColorStop(1, T.holeLight);

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, pi2);
        ctx.fill();
      }
    }

    ctx.restore();
  };

  // Create and display the game view:
  GameView(document.getElementsByClassName('lepiondestrous')[0]);
}, false);
