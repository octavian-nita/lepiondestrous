/*jshint browser: true, devel: true, indent: 2, maxerr: 50, maxlen: 120 */
/*global define: true, module: true, exports: true */

//
// 01. Define the game play (gameplay)
// 02. Define the game view / graphics
// 03. Instantiate the game view and draw it
//

window.addEventListener('load', function (event) {
  'use strict';

  var
    THEME = { // http://www.materialui.co/colors
      boardDark: '#795548',
      boardLight: '#8d6e63',
      raisedEffect: [
        {offsetX: 0, offsetY: 2, blur: 10, color: 'rgba(0, 0, 0, 0.45)'},
        {offsetX: 0, offsetY: 2, blur: 15, color: 'rgba(0, 0, 0, 0.65)'}
      ],
      loweredEffect: [
        {},
        {}
      ]
    };

  /** @constructor */
  function GameView(parent, options) {
    if (!(this instanceof GameView)) { return new GameView(parent, options); }

    if (!parent) { return; }
    if (!options) { options = {}; }

    var canvas, boundsRatio, boardWU = 29, boardHU = 40, boardRatio = boardWU / boardHU;

    this.playArea = {};
    this.scoreAreas = [];

    canvas = document.createElement('canvas');
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
    boundsRatio = canvas.width / canvas.height;

    if (boardRatio > boundsRatio) { // http://www.frontcoded.com/javascript-fit-rectange-into-bounds.html
      this.playArea.edge = canvas.width;
      this.playArea.x = 0;
      //this.playArea.height = boardHU * (canvas.width / boardWU);
    } else {
      //this.playArea.width = boardWU * (canvas.height / boardHU);
      this.playArea.edge = canvas.height;
      this.playArea.y = 0;
    }

    this.draw(canvas);
    parent.appendChild(canvas);
  }

  /** Consider http://www.mobtowers.com/html5-canvas-crisp-lines-every-time/ when drawing. */
  GameView.prototype.draw = function (canvas) {
    if (!canvas) { return; }
    var ctx = canvas.getContext('2d'), i, len, eff;

    ctx.fillStyle = THEME.boardLight;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = THEME.boardDark;
    eff = THEME.raisedEffect;
    for (i = 0, len = eff.length; i < len; i++) {
      ctx.save();
      ctx.shadowOffsetX = eff[i].offsetX;
      ctx.shadowOffsetY = eff[i].offsetY;
      ctx.shadowBlur = eff[i].blur;
      ctx.shadowColor = eff[i].color;
      ctx.fillRect(0, 0, this.playArea.edge, this.playArea.edge);
      ctx.restore();
    }
  };

  // Display the main game view:
  GameView(document.getElementsByClassName('lepiondestrous')[0]).draw();
}, false);
