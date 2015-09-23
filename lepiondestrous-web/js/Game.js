define(
  ['Board', 'Player', 'GameError'],

  function (Board, Player, GameError) {
    'use strict';

    /** @constructor */
    function Game() {
      if (!(this instanceof Game)) { return new Game(); }

      this.name = 'Le pion des trous';

      this.size = 14;

      /** @protected */
      this._board = new Board(this.size);

      /** @protected */
      this._players = Object.create(null);
      this._players[Game.PLAYER_LIGHT] = new Player(Game.PLAYER_LIGHT);
      this._players[Game.PLAYER_DARK] = new Player(Game.PLAYER_DARK);
      Object.freeze(this._players);

      /** @protected */
      this._current = Game.PLAYER_LIGHT;

      /** @protected */
      this._started = false;
    }

    /**
     * @const {1}
     * @static
     */
    Game.PLAYER_LIGHT = 1;

    /**
     * @const {2}
     * @static
     */
    Game.PLAYER_DARK = 2;

    Game.prototype.emptyAt = function (col, row) { return this._board.empty(col, row); };

    Game.prototype.pieceAt = function (col, row) { return this._board.at(col, row); };

    Game.prototype.currentPiece = function () { return this._players[this._current].piece; };

    Game.prototype.currentPlayer = function () { return this._players[this._current]; };

    Game.prototype.play = function (col, row) {
      if (!this._started) { this._started = true; }

      var player = this._players[this._current];
      if (player.pieceCount() === 0) { throw new GameError('NO_MORE_PIECES'); }

      if (!this._board.empty(col, row)) { throw new GameError('LOCATION_OCCUPIED'); }

      this._board.place(col, row, player.play());
      this._current = this._current === Game.PLAYER_LIGHT ? Game.PLAYER_DARK : Game.PLAYER_LIGHT;
    };

    Game.prototype.started = function () { return this._started; };

    return Game;
  });
