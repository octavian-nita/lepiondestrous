/*jshint browser: true, devel: true, indent: 2, maxerr: 50, maxlen: 120 */
/*global define: true, module: true, exports: true */

require(['require.domReady!', 'gameView'], function (doc, GameView) {
  'use strict';

  // Create and render the game view:
  GameView(doc.getElementsByClassName('lepiondestrous')[0]);
});
