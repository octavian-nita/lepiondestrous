define(function () {
  'use strict';

  /** @constructor */
  function Board(cols, rows) {
    if (!(this instanceof Board)) { return new Board(cols, rows); }

    cols = cols === undefined ? 14 : Number(cols);
    if (cols <= 0) { throw new Error('the number of columns in a board cannot be less than or equal to 0'); }

    rows = rows === undefined ? cols : Number(rows);
    if (rows <= 0) { throw new Error('the number of rows in a board cannot be less than or equal to 0'); }

    /** @readonly */
    Object.defineProperty(this, 'cols', { enumerable: true, value: cols });

    /** @readonly */
    Object.defineProperty(this, 'rows', { enumerable: true, value: rows });

    /** @readonly */
    Object.defineProperty(this, 'grid', { enumerable: true, value: new Array(this.rows * this.cols) });
  }

  Board.prototype.at = function (col, row) {
    col = Number(col);
    if (isNaN(col) || col < 0 || col >= this.cols) { throw new Error('the specified column is off the board'); }
    row = Number(row);
    if (isNaN(row) || row < 0 || row >= this.rows) { throw new Error('the specified row is off the board'); }
    return this.grid[this.rows * row + col];
  };

  Board.prototype.empty = function (col, row) { return this.at(col, row) === undefined; };

  Board.prototype.place = function (col, row, piece) {
    if (piece === undefined) { throw new Error('cannot place an empty piece'); }
    var oldPiece = this.at(col, row);
    this.grid[this.rows * row + col] = piece;
    return oldPiece;
  };

  Board.prototype.displace = function (col, row) {
    var piece = this.at(col, row);
    if (piece === undefined) { throw new Error('cannot displace an empty location'); }
    this.grid[this.rows * row + col] = undefined;
    return piece;
  };

  Board.prototype.move = function (fromCol, fromRow, toCol, toRow) {
    this.place(toCol, toRow, this.displace(fromCol, fromRow));
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

    /** @readonly */
    Object.defineProperty(this, 'board', { enumerable: true, value: new Board(this.size) });

    /** @readonly */
    Object.defineProperty(this, 'players',
                          { enumerable: true, value: [new Player(Player.LIGHT), new Player(Player.DARK)] });

    /** @protected */
    this._currentPlayer = 0;
  }

  return Game;
});
