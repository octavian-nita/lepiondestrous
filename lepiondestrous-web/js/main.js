require(
  ['require.domReady!', 'GameView'],

  function (doc, GameView) {
    'use strict';

    // Create and render the game view:
    new GameView(doc.getElementsByClassName('le-pion-des-trous')[0]).show();
  });
