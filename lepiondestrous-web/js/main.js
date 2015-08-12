require(['require.domReady!', 'gameView'], function (doc, GameView) {
  'use strict';

  // Create and render the game view:
  GameView(doc.getElementsByClassName('le-pion-des-trous')[0]);
});
