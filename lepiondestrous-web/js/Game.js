define(
  ['Board', 'Player', 'GameStateError'],

  function (Board, Player, GameStateError) {
    'use strict';

    /** @constructor */
    function Game() {
      if (!(this instanceof Game)) { return new Game(); }

      /** @readonly */
      Object.defineProperty(this, 'name', { enumerable: true, value: 'Le pion des trous' });

      /** @readonly */
      Object.defineProperty(this, 'size', { enumerable: true, value: 14 });

      /** @protected */
      this._board = new Board(this.size);

      /** @protected */
      this._players = Object.create(null);
      this._players[Game.PLAYER_LIGHT] = new Player(Game.PLAYER_LIGHT);
      this._players[Game.PLAYER_DARK] = new Player(Game.PLAYER_DARK);
      Object.freeze(this._players);

      /** @protected */
      this._current = Game.PLAYER_LIGHT;
    }

    /**
     * @const {1}
     * @readonly
     * @static
     */
    Object.defineProperty(Game, 'PLAYER_LIGHT', { enumerable: true, value: 1 });

    /**
     * @const {2}
     * @readonly
     * @static
     */
    Object.defineProperty(Game, 'PLAYER_DARK', { enumerable: true, value: 2 });

    Game.prototype.emptyAt = function (col, row) { return this._board.empty(col, row); };

    Game.prototype.pieceAt = function (col, row) { return this._board.at(col, row); };

    Game.prototype.currentPiece = function () { return this._players[this._current].piece; };

    Game.prototype.currentPlayer = function () { return this._players[this._current]; };

    Game.prototype.play = function (col, row) {
      var player = this._players[this._current];
      if (player.pieceCount() === 0) { throw new GameStateError('NO_MORE_PIECES'); }

      if (!this._board.empty(col, row)) { throw new GameStateError('LOCATION_OCCUPIED'); }

      this._board.place(col, row, player.play());
      this._current = this._current === Game.PLAYER_LIGHT ? Game.PLAYER_DARK : Game.PLAYER_LIGHT;
    };

    return Game;
  });
