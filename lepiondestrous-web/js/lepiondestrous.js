/*jshint browser: true, devel: true, indent: 2, maxerr: 50, maxlen: 120 */
/*global define: true, module: true, exports: true */

window.addEventListener('load', function (event) {
  'use strict';

  var
    R = {
      gameTitle: 'Le pion des trous'
    },
    T = { // http://www.materialui.co/colors
      fontFamily: '"Chantelli Antiqua"',
      textColor: '#ffc107',
      boardDark: '#795548',
      boardLight: '#8d6e63',
      effectRaised: {offsetX: 0, offsetY: 2, blur: 15, color: 'rgba(0, 0, 0, 0.9)'},
      effectLowered: {}
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

    // The canvas is over-sampled and fills its parent:
    this.canvas = document.createElement('canvas');
    this.canvas.width = parent.offsetWidth * 2;
    this.canvas.height = parent.offsetHeight * 2;
    this.canvas.style.width = parent.offsetWidth + 'px';
    this.canvas.style.height = parent.offsetHeight + 'px';
    this.canvas.getContext('2d').scale(2, 2);

    this.render();
    parent.innerHTML = ''; // empty parent content
    parent.appendChild(this.canvas);
  }

  /** Consider http://www.mobtowers.com/html5-canvas-crisp-lines-every-time/ when drawing. */
  GameView.prototype.render = function () {
    if (!this.canvas || !this.board) { return; }
    var ctx = this.canvas.getContext('2d'), brd = this.board;
    ctx.save();

    ctx.fillStyle = T.boardLight;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.shadowOffsetX = T.effectRaised.offsetX;
    ctx.shadowOffsetY = T.effectRaised.offsetY;
    ctx.shadowColor = T.effectRaised.color;
    ctx.shadowBlur = T.effectRaised.blur;

    ctx.fillStyle = T.boardDark;
    ctx.fillRect(brd.x, brd.y, brd.width, brd.height);

    ctx.translate(brd.x, brd.y);   // move the origin to the board top left corner
    ctx.scale(brd.unit, brd.unit); // draw the board elements in terms of units

    ctx.lineWidth = 2 / brd.unit;
    ctx.strokeStyle = T.textColor;
    ctx.shadowBlur /= (brd.unit / 15); // stronger shadow

    // Board decoration:
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
    ctx.stroke(); // finish the bridge lower outline

    // Bridge top:
    ctx.beginPath();
    ctx.moveTo(3, 0);
    ctx.lineTo(3, 1.5);
    ctx.lineTo(11, 1.5);
    ctx.lineTo(11, 0);
    ctx.stroke();

    ctx.font = 0.8 + 'px ' + T.fontFamily;
    ctx.fillStyle = T.textColor;
    ctx.fillText(R.gameTitle, (brd.width - ctx.measureText(R.gameTitle).width) / 2, 1.3);

    ctx.restore();
  };

  // Create and display the game view:
  GameView(document.getElementsByClassName('lepiondestrous')[0]);
}, false);
