define(function () {
  'use strict';

  /** @constructor */
  function Board(cols, rows) {
    if (!(this instanceof Board)) { return new Board(cols, rows); }

    if (isNaN(cols = cols === undefined ? 14 : Number(cols)) ||
        cols <= 0) { throw new Error('the number of columns in a board should be a strictly positive number'); }
    if (isNaN(rows = rows === undefined ? cols : Number(rows)) ||
        rows <= 0) { throw new Error('the number of rows in a board should be a strictly positive number'); }

    /** @readonly */
    Object.defineProperty(this, 'cols', { enumerable: true, value: cols });

    /** @readonly */
    Object.defineProperty(this, 'rows', { enumerable: true, value: rows });

    /** @protected */
    this._grid = new Array(this.rows * this.cols);
  }

  Board.prototype.at = function (col, row) {
    if (isNaN(col = Number(col)) || col < 0 ||
        col >= this.cols) { throw new Error('the specified column is off the board'); }
    if (isNaN(row = Number(row)) || row < 0 ||
        row >= this.rows) { throw new Error('the specified row is off the board'); }
    return this._grid[this.rows * row + col];
  };

  Board.prototype.empty = function (col, row) { return !this.at(col, row); };

  Board.prototype.place = function (col, row, piece) {
    if (piece === undefined) { throw new Error('cannot place an empty piece'); }
    var oldPiece = this.at(col, row);
    this._grid[this.rows * row + col] = piece;
    return oldPiece;
  };

  Board.prototype.displace = function (col, row) {
    var piece = this.at(col, row);
    if (piece === undefined) { throw new Error('cannot displace an empty location'); }
    this._grid[this.rows * row + col] = undefined;
    return piece;
  };

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

  Game.prototype.play = function (col, row) {
    if (!this._board.empty(col, row)) { return 'LOCATION_OCCUPIED'; }

    var player = this._players[this._current];
    if (player) {
      if (player._pawnsLeft === 0) { return 'NO_MORE_PAWNS'; }

      this._board.place(col, row, player.play());
      this._current = this._current === Game.PIECE_LIGHT ? Game.PIECE_DARK : Game.PIECE_LIGHT;
    }
  };

  return Game;
});
