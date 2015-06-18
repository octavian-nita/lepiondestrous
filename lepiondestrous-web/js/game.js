define(function () {
  'use strict';

  /** @constructor */
  function Player(piece) {
    if (!(this instanceof Player)) { return new Player(piece); }

    /** @readonly */
    Object.defineProperty(this, 'piece', { enumerable: true, value: piece });

    /** @protected */
    this._pawnsLeft = 42;
  }

  Player.prototype.play = function () {
    if (this._pawnsLeft <= 0) {
      throw new Error('player ' + this.piece + ' has no more pawns to play');
    }
    this._pawnsLeft--;
    return this.piece;
  };

  /**
   * @const {1}
   * @readonly
   * @static
   */
  Object.defineProperty(Player, 'LIGHT', { enumerable: true, value: 1 });

  /**
   * @const {2}
   * @readonly
   * @static
   */
  Object.defineProperty(Player, 'DARK', { enumerable: true, value: 2 });

  /** @constructor */
  function Game() {
    if (!(this instanceof Game)) { return new Game(); }

    /** @readonly */
    Object.defineProperty(this, 'name', { enumerable: true, value: 'Le pion des trous' });

    /** @readonly */
    Object.defineProperty(this, 'size', { enumerable: true, value: 14 });

    /** @protected */
    this._board = new Array(this.size * this.size);
  }

  return Game;
});
