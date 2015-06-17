define(function () {
  'use strict';

  /** @constructor */
  function Game() {}

  // Some read-only properties:
  Object.defineProperty(Game.prototype, 'name', { enumerable: true, value: 'Le pion des trous' });
  Object.defineProperty(Game.prototype, 'size', { enumerable: true, value: 14 });

  return Game;
});
