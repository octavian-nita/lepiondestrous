/*jshint browser: true, devel: true, indent: 2, maxerr: 50, maxlen: 120 */
/*global define: true, module: true, exports: true */

//
// 01. Define the game play (gameplay)
// 02. Define the game view / graphics
// 03. Instantiate the game view and render it
//

window.addEventListener('load', function (event) {
  'use strict';

  var
    T = { // http://www.materialui.co/colors
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

    var boardRatio = 11 / 19, boundsRatio = parent.offsetWidth / parent.offsetHeight, longEdge;
    if (boardRatio < boundsRatio) { // http://www.frontcoded.com/javascript-fit-rectange-into-bounds.html
      return; // currently, we do not support 'landscape' layout
    }

    longEdge = Math.min(parent.offsetWidth.width / boardRatio, 695);
    this.board = {
      orientation: 'portrait',
      width: longEdge * boardRatio,
      height: longEdge
    };
    this.board.x = (parent.offsetWidth - this.board.width ) / 2;
    this.board.y = (parent.offsetHeight - this.board.height ) / 2;
    this.board.unit = this.board.height / 40;

    this.canvas = document.createElement('canvas');
    this.canvas.width = parent.offsetWidth;
    this.canvas.height = parent.offsetHeight;
    this.render();
    parent.appendChild(this.canvas);
  }

  /** Consider http://www.mobtowers.com/html5-canvas-crisp-lines-every-time/ when drawing. */
  GameView.prototype.render = function () {
    if (!this.canvas || !this.board) { return; }
    var
      ctx = this.canvas.getContext('2d'),
      brd = this.board, u = brd.unit,
      sr = 4 * u,
      y0 = 11 * u,
      y1 = 6.5 * u,
      cy = 7.5 * u;
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
    ctx.translate(0, brd.y);

    // Board decoration:
    ctx.beginPath();
    ctx.moveTo(brd.x, y0);
    ctx.lineTo(5 * u, y0);
    // First small arch:
    ctx.arcTo(5.5 * u, cy, 7.5 * u, y1, sr);
    ctx.arcTo(9.5 * u, cy, 10 * u, y0, sr);
    ctx.lineTo(10 * u, y0); // finish the arch
    ctx.lineTo(11 * u, y0);
    // Middle large arch:
    ctx.arcTo(11.5 * u, y1, 14.5 * u, 5.5 * u, 24 * u / 5);
    ctx.arcTo(17.5 * u, y1, 18 * u, y0, 24 * u / 5);
    ctx.lineTo(18 * u, y0); // finish the arch
    ctx.lineTo(19 * u, y0);
    // Second small arch:
    ctx.arcTo(19.5 * u, cy, 21.5 * u, y1, sr);
    ctx.arcTo(23.5 * u, cy, 24 * u, y0, sr);
    ctx.lineTo(24 * u, y0); // finish the arch
    ctx.lineTo(29 * u, y0);
    ctx.stroke();           // finish the bridge lower outline

    // Bridge top:
    ctx.beginPath();
    ctx.moveTo(5.5 * u, 0);
    ctx.lineTo(5.5 * u, 3 * u);
    ctx.lineTo(23.5 * u, 3 * u);
    ctx.lineTo(23.5 * u, 0);
    ctx.stroke();

    /*ctx.lineWidth = 1;
     ctx.font = '20px \'Chantelli Antiqua\'';
     ctx.fillStyle = T.text;
     ctx.fillText("Le pion des trous", 7.5 * u, 2 * u);*/

    ctx.restore();
  };

  // Create and display the game view:
  GameView(document.getElementsByClassName('lepiondestrous')[0]);
}, false);
