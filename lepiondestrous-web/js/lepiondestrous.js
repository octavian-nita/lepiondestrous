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
      boardLight: '#8d6e63'
    },
    BOARD_GEOMETRY = {
      w: 29,
      h: 40,
      r: 20 / 40
    };

  /** @constructor */
  function GameView(parent, options) {
    var cnv, ctx, boundsRatio, gameArea, scoreAreas;

    if (!(this instanceof GameView)) { return new GameView(parent, options); }

    if (!parent) { return; }
    if (!options) { options = {}; }

    cnv = document.createElement('canvas');
    cnv.width = parent.offsetWidth;
    cnv.height = parent.offsetHeight;

    gameArea = {};
    scoreAreas = [];

    boundsRatio = cnv.width / cnv.height;

    if (BOARD_GEOMETRY.r > boundsRatio) { // http://www.frontcoded.com/javascript-fit-rectange-into-bounds.html
      gameArea.w = cnv.width;
      gameArea.h = 40 * (cnv.width / 29);
    } else {
      gameArea.w = 29 * (cnv.height / 40);
      gameArea.h = cnv.height - 10;
    }

    ctx = cnv.getContext('2d'); // consider http://www.mobtowers.com/html5-canvas-crisp-lines-every-time/

    ctx.fillStyle = THEME.boardLight;
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    ctx.fillStyle = THEME.boardDark;
    ctx.shadowOffsetX = 0;

    ctx.save();
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, 0, gameArea.w, gameArea.h);
    ctx.restore();

    ctx.save();
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, 0, gameArea.w, gameArea.h);
    ctx.restore();

    parent.appendChild(cnv);
  }

  GameView.prototype.draw = function () {};

  // Display the main game view:
  GameView(document.getElementsByClassName('lepiondestrous')[0]).draw();
}, false);
