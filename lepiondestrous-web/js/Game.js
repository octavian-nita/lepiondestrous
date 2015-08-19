define(
  ['MNBoard', 'Player'],

  function (MNBoard, Player) {
    'use strict';

    /** @constructor */
    function Game() {
      if (!(this instanceof Game)) { return new Game(); }

      /** @readonly */
      Object.defineProperty(this, 'name', { enumerable: true, value: 'Le pion des trous' });

      /** @readonly */
      Object.defineProperty(this, 'size', { enumerable: true, value: 14 });

      /** @protected */
      this._board = new MNBoard(this.size);

      /** @protected */
      this._players = Object.create(null);
      this._players[Game.PIECE_LIGHT] = new Player(Game.PIECE_LIGHT);
      this._players[Game.PIECE_DARK] = new Player(Game.PIECE_DARK);
      Object.freeze(this._players);

      /** @protected */
      this._current = Game.PIECE_LIGHT;
    }

    /**
     * @const {1}
     * @readonly
     * @static
     */
    Object.defineProperty(Game, 'PIECE_LIGHT', { enumerable: true, value: 1 });

    /**
     * @const {2}
     * @readonly
     * @static
     */
    Object.defineProperty(Game, 'PIECE_DARK', { enumerable: true, value: 2 });

    Game.prototype.emptyAt = function (col, row) { return this._board.empty(col, row); };

    Game.prototype.pieceAt = function (col, row) { return this._board.at(col, row); };

    Game.prototype.currentPiece = function () { return this._players[this._current].piece; };

    Game.prototype.currentPlayer = function () { return this._players[this._current]; };

    Game.prototype.play = function (col, row) {
      if (!this._board.empty(col, row)) { return 'LOCATION_OCCUPIED'; }

      var player = this._players[this._current];
      if (player) {
        if (player.piecesLeft() === 0) { return 'NO_MORE_PIECES'; }

        this._board.place(col, row, player.play());
        this._current = this._current === Game.PIECE_LIGHT ? Game.PIECE_DARK : Game.PIECE_LIGHT;
      }
    };

    return Game;
  });
