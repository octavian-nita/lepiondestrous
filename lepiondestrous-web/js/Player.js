define(
  ['GameStateError'],

  function () {
    'use strict';

    /**
     * Initializes a player with <code>pieceCount</code> pieces of the same <code>piece</code> type.
     *
     * @author Octavian Theodor NITA (http://github.com/octavian-nita)
     * @version 1.0, June 26, 2015
     *
     * @constructor
     * @param {*} piece the type of piece <code>this</code> player uses
     * @param {number} [pieceCount=42] the number of pieces (of the same type) <code>this</code> player initially has
     */
    function Player(piece, pieceCount) {
      if (!(this instanceof Player)) { return new Player(piece); }

      if (piece === undefined) { throw new Error('a player\'s piece type must be specified'); }
      if (isNaN(pieceCount = pieceCount === undefined ? 2 : Number(pieceCount)) ||
          pieceCount <= 0) { throw new Error('the number of pieces left should be a strictly positive number'); }

      /** @readonly */
      Object.defineProperty(this, 'piece', { enumerable: true, value: piece });

      /** @protected */
      this._pieceCount = pieceCount;
    }

    /**
     * @return {number} how many pieces <code>this</code> player has left
     */
    Player.prototype.pieceCount = function () { return this._pieceCount; };

    /**
     * @param {Board} board
     * @return {*} the piece <code>this</code> player plays
     */
    Player.prototype.play = function (board) {
      if (this._pieceCount <= 0) {
        throw new GameStateError('NO_MORE_PIECES');
      }
      this._pieceCount--;
      return this.piece;
    };

    return Player;
  });
