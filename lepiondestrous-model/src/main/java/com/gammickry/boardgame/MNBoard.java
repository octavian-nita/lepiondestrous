package com.gammickry.boardgame;

import static java.lang.System.arraycopy;

/**
 * Representation of a m×n board used in <a href="http://en.wikipedia.org/wiki/M,n,k-game">m,n,k-games</a> and
 * other <a href="http://en.wikipedia.org/wiki/Abstract_strategy_game">abstract strategy (board) games</a>.
 *
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 06, 2015
 */
public class MNBoard {

    public static final int EMPTY = 0;

    protected final int cols;

    protected final int rows;

    protected final int[] grid;

    public MNBoard(int cols, int rows) {
        if (cols <= 0) {
            throw new IllegalArgumentException("the number of columns in a m×n board cannot be <= 0");
        }
        if (rows <= 0) {
            throw new IllegalArgumentException("the number of rows in a m×n board cannot be <= 0");
        }
        this.cols = cols;
        this.rows = rows;
        this.grid = new int[this.rows * this.cols];
    }

    public MNBoard(MNBoard board) {
        if (board == null) {
            throw new IllegalArgumentException("cannot clone a null board");
        }
        this.cols = board.cols;
        this.rows = board.rows;
        this.grid = new int[this.rows * this.cols];
        arraycopy(board.grid, 0, this.grid, 0, this.grid.length);
    }

    public boolean onTheBoard(int col, int row) {
        return 0 <= col && col < cols && 0 <= row && row < rows;
    }

    public boolean empty(int col, int row) {
        if (!onTheBoard(col, row)) {
            throw new IllegalArgumentException("the specified position is outside of the board");
        }
        return grid[rows * row + col] == EMPTY;
    }

    public MNBoard place(int col, int row, int piece) {
        if (piece == EMPTY) {
            throw new IllegalArgumentException("cannot place an 'empty' piece");
        }
        grid[rows * row + col] = piece;
        return this;
    }

    public int displace(int col, int row) {
        if (!onTheBoard(col, row)) {
            throw new IllegalArgumentException("the specified position is outside of the board");
        }
        int pos = rows * row + col;
        int piece = grid[pos];
        grid[pos] = EMPTY;
        return piece;
    }
}
