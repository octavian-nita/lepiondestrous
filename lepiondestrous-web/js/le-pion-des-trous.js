/*jshint browser: true, devel: true, indent: 2, maxerr: 50, maxlen: 120 */
/*global define: true, module: true, exports: true */

/**
 * <i>Le pion des trous</i> game model and abstract UI definitions wrapped as an
 * {@link http://github.com/umdjs/umd UMD pattern}.
 *
 * @see {@link http://github.com/umdjs/umd UMD (Universal Module Definition)}
 */
(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) { // AMD, register as an anonymous module
    define([], factory);
  } else if (typeof exports === 'object') {         // Node and CommonJS-like environments, supporting module.exports
    module.exports = factory();
  } else {                                          // Browser globals, root is window
    root.lepiondestrous = factory();
  }

}(this, function () {
  'use strict';

  /** @constructor */
  function Board(cols, rows) {
    this._cols = cols;
    this._rows = rows;
    this._grid = new Array(this._cols * this._rows);
  }

  Board.prototype.isValidMove = function (col, row) {
    return 0 <= col && col < this._cols &&
           0 <= row && row < this._rows && !this._grid[col + row * this._rows];
  };

  Board.prototype.move = function (col, row, player) {
    if (this.isValidMove(col, row)) {
      this._grid[col + row * this._rows] = player;
    }
  };

  /** @constructor */
  function LePionDesTrous(opts) {
    this._board = new Board(opts.board.cols || 14, opts.board.rows || 14);
  }

  LePionDesTrous.prototype.start = function () {

  };

  // Module exports:
  return {
    LePionDesTrous: LePionDesTrous
  };
}));
