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
    THEME = {
      boardDark: '#795548',
      boardLight: '#d7ccc8'
    },
    BOARD_RATIO = 29 / 40;

  /** @constructor */
  function GameView(parent, options) {
    var cnv, ctx, boundsRatio, edge;

    if (!(this instanceof GameView)) { return new GameView(parent, options); }

    if (!parent) { return; }
    if (!options) { options = {}; }

    boundsRatio = parent.offsetWidth / parent.offsetHeight;

    cnv = document.createElement('canvas');
    cnv.width = parent.offsetWidth;
    cnv.height = parent.offsetHeight;

    ctx = cnv.getContext('2d');
    //ctx.translate(0.5, 0.5);

    ctx.fillStyle = THEME.boardLight;
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';

    /*ctx.fillStyle = THEME.boardDark;
    ctx.fillRect(0, 20, cnv.width, 120);
    ctx.restore();*/

    ctx.fillStyle = THEME.boardDark;
    ctx.fillRect(50, 190, 150, 120);

    parent.appendChild(cnv);
  }

  GameView.prototype.draw = function () {};

  GameView(document.getElementsByClassName('lepiondestrous')[0]).draw();
}, false);
