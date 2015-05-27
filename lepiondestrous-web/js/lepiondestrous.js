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
  function GameView(parent, options) {
    var width, height;

    if (!(this instanceof GameView)) { return new GameView(parent, options); }

    if (!parent) { return; }
    if (!options) { options = {}; }

    width = parent.offsetWidth || 435;
    height = parent.offsetHeight || 600;

    // display vertical board and ignore orientation for the moment
  }

  GameView.prototype.draw = function () {};

  GameView(document.getElementsByClassName('lepiondestrous')[0]).draw();
}, false);
