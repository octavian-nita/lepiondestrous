define(function () {
  'use strict';

  /**
   * @constructor
   * @author Octavian Theodor NITA (http://github.com/octavian-nita)
   * @version 1.0, June 26, 2015
   */
  function Player(piece, piecesLeft) {
    if (!(this instanceof Player)) { return new Player(piece); }

    if (piece === undefined) { throw new Error('a player\'s piece must be specified'); }
    if (isNaN(piecesLeft = piecesLeft === undefined ? 42 : Number(piecesLeft)) ||
        piecesLeft <= 0) { throw new Error('the number of pieces left should be a strictly positive number'); }

    /** @readonly */
    Object.defineProperty(this, 'piece', { enumerable: true, value: piece });

    /** @protected */
    this._piecesLeft = piecesLeft;
  }

  /**
   * @return {number} how many pieces <code>this</code> player has left
   */
  Player.prototype.piecesLeft = function () { return this._piecesLeft; };

  /**
   * @return {*} the piece <code>this</code> player has played
   */
  Player.prototype.play = function () {
    if (this._piecesLeft <= 0) {
      throw new Error('player ' + this.piece + ' has no more pieces left to play');
    }
    this._piecesLeft--;
    return this.piece;
  };

  return Player;
});
