define(function () {
  'use strict';

  /**
   * <p>An m×n board used in <a href="http://en.wikipedia.org/wiki/M,n,k-game">m,n,k-games</a> and other
   * <a href="http://en.wikipedia.org/wiki/Abstract_strategy_game">abstract strategy (board) games</a>.</p>
   * <p>An empty location on the board is represented by <code>undefined</code>.</p>
   *
   * @author Octavian Theodor NITA (http://github.com/octavian-nita)
   * @version 1.0, June 26, 2015
   *
   * @constructor
   * @param {number} [cols=14] the number of columns on the board
   * @param {number} [rows=cols] the number of rows on the board
   */
  function Board(cols, rows) {
    if (!(this instanceof Board)) { return new Board(cols, rows); }

    if (isNaN(cols = cols === undefined ? 14 : Number(cols)) ||
        cols <= 0) { throw new Error('the number of columns on a m×n board should be a strictly positive number'); }
    if (isNaN(rows = rows === undefined ? cols : Number(rows)) ||
        rows <= 0) { throw new Error('the number of rows on a m×n board should be a strictly positive number'); }

    this.cols = cols;

    this.rows = rows;

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

  Board.prototype.empty = function (col, row) { return this.at(col, row) === undefined; };

  Board.prototype.place = function (col, row, piece) {
    if (piece === undefined) { throw new Error('cannot place an empty piece'); }
    var oldPiece = this.at(col, row);
    this._grid[this.rows * row + col] = piece;
    return oldPiece;
  };

  Board.prototype.displace = function (col, row) {
    var piece = this.at(col, row);
    if (piece === undefined) { throw new Error('cannot displace from an empty location'); }
    this._grid[this.rows * row + col] = undefined;
    return piece;
  };

  return Board;
});
