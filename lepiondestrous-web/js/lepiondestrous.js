/*jshint browser: true, devel: true, indent: 2, maxerr: 50, maxlen: 120 */
/*global define: true, module: true, exports: true */

window.addEventListener('load', function (event) {
  'use strict';

  var
    T = { // http://www.materialui.co/colors
      label: 'Le pion des trous',
      text: '#ffc107',
      boardDark: '#795548',
      boardLight: '#8d6e63',
      raisedEffect: {offsetX: 0, offsetY: 2, blur: 10, color: 'rgba(0, 0, 0, 0.9)'},
      loweredEffect: {}
    };

  /** @constructor */
  function GameView(parent, options) {
    if (!(this instanceof GameView)) { return new GameView(parent, options); }

    if (!parent) { return; }
    if (!options) { options = {}; }

    this.board = {};

    var boardRatio = 14 / 19, boundsRatio = parent.offsetWidth / parent.offsetHeight;
    if (boardRatio > boundsRatio) { // http://www.frontcoded.com/javascript-fit-rectange-into-bounds.html
      this.board.width = Math.min(parent.offsetWidth, 504);
      this.board.height = this.board.width / boardRatio;
    } else {
      this.board.height = Math.min(parent.offsetWidth, 695);
      this.board.width = this.board.height * boardRatio;
    }

    this.board.x = (parent.offsetWidth - this.board.width ) / 2;
    this.board.y = (parent.offsetHeight - this.board.height ) / 2;
    this.board.unit = this.board.height / 19;

    this.canvas = document.createElement('canvas');
    this.canvas.width = parent.offsetWidth;   // the canvas fills
    this.canvas.height = parent.offsetHeight; // ... its parent

    this.render();
    parent.innerHTML = '';
    parent.appendChild(this.canvas);
  }

  /** Consider http://www.mobtowers.com/html5-canvas-crisp-lines-every-time/ when drawing. */
  GameView.prototype.render = function () {
    if (!this.canvas || !this.board) { return; }
    var
      ctx = this.canvas.getContext('2d'),
      brd = this.board, u = brd.unit,
      y0 = 5 * u, cr = 1.6 * u, cy = 3.4 * u,
      tm;
    ctx.save();

    ctx.fillStyle = T.boardLight;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.lineWidth = 2;
    ctx.fillStyle = T.boardDark;
    ctx.strokeStyle = T.text;
    ctx.shadowOffsetX = T.raisedEffect.offsetX;
    ctx.shadowOffsetY = T.raisedEffect.offsetY;
    ctx.shadowBlur = T.raisedEffect.blur;
    ctx.shadowColor = T.raisedEffect.color;

    ctx.fillRect(brd.x, brd.y, brd.width, brd.height);
    ctx.translate(brd.x, brd.y); // move the origin to the board top left corner
    ctx.shadowBlur /= (brd.unit / 10);

    // [DEBUG grid]
    /*ctx.save();
     ctx.strokeStyle = '#646464';
     ctx.beginPath();
     for (var i = 0; i < 13; i++) {
     ctx.moveTo((i + 1) * u, 0);
     ctx.lineTo((i + 1) * u, brd.height);
     }
     for (i = 0; i < 18; i++) {
     ctx.moveTo(0, (i + 1) * u);
     ctx.lineTo(brd.width, (i + 1) * u);
     }
     ctx.stroke();
     ctx.restore();*/
    // [/DEBUG]

    // Board decoration:
    ctx.beginPath();
    ctx.moveTo(0, y0);
    ctx.lineTo(2.5 * u, y0);

    // First small arch:
    ctx.arcTo(2.6 * u, cy, 3.5 * u, 3 * u, cr);
    ctx.arcTo(4.4 * u, cy, 4.5 * u, y0, cr);
    ctx.lineTo(4.5 * u, y0); // finish the arch
    ctx.lineTo(5.5 * u, y0);
    // Middle large arch:
    ctx.arcTo(5.6 * u, 2.95 * u, 7 * u, 2.5 * u, cr + 0.5 * u);
    ctx.arcTo(8.4 * u, 2.95 * u, 8.5 * u, y0, cr + 0.5 * u);
    ctx.lineTo(8.5 * u, y0); // finish the arch
    ctx.lineTo(9.5 * u, y0);

    // Second small arch:
    ctx.arcTo(9.6 * u, cy, 10.5 * u, 3 * u, cr);
    ctx.arcTo(11.4 * u, cy, 11.5 * u, y0, cr);
    ctx.lineTo(11.5 * u, y0); // finish the arch
    ctx.lineTo(14 * u, y0);
    ctx.stroke(); // finish the bridge lower outline

    // Bridge top:
    ctx.beginPath();
    ctx.moveTo(3 * u, 0);
    ctx.lineTo(3 * u, 2 * u);
    ctx.lineTo(11 * u, 2 * u);
    ctx.lineTo(11 * u, 0);
    ctx.stroke();

    ctx.font = (brd.unit * 8 / 9) + 'px \'Chantelli Antiqua\'';
    ctx.fillStyle = T.text;
    ctx.fillText(T.label, (brd.width - ctx.measureText(T.label).width) / 2, 1.3 * u);

    ctx.restore();
  };

  // Create and display the game view:
  GameView(document.getElementsByClassName('lepiondestrous')[0]);
}, false);
