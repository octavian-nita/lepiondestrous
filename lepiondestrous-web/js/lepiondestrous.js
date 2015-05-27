/*jshint browser: true, devel: true, indent: 2, maxerr: 50, maxlen: 120 */
/*global define: true, module: true, exports: true */

//
// 01. Define the game play (gameplay)
// 02. Define the game view / graphics
// 03. Instantiate the game view and draw it
//

window.addEventListener('load', function (event) {
  'use strict';

  /** @constructor */
  function GameView(gameOptions) {}

  GameView.prototype.draw = function () {}

  new GameView().draw();
}, false);
