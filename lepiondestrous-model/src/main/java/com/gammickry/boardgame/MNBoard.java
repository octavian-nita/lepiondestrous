package com.gammickry.boardgame;

import java.util.Arrays;

import static java.lang.System.arraycopy;

/**
 * Representation of a m×n board used in <a href="http://en.wikipedia.org/wiki/M,n,k-game">m,n,k-games</a> and
 * other <a href="http://en.wikipedia.org/wiki/Abstract_strategy_game">abstract strategy (board) games</a>. The
 * implementation is not thread-safe.
 *
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 06, 2015
 */
public class MNBoard {

    protected final int cols;

    protected final int rows;

    protected final int[] grid;

    protected final int emptyValue;

    public MNBoard(int cols, int rows, int emptyValue) {
        if (cols <= 0) {
            throw new IllegalArgumentException("the number of columns in a m×n board cannot be <= 0");
        }
        if (rows <= 0) {
            throw new IllegalArgumentException("the number of rows in a m×n board cannot be <= 0");
        }
        this.cols = cols;
        this.rows = rows;
        this.grid = new int[this.rows * this.cols];
        this.emptyValue = emptyValue;
    }

    public MNBoard(int cols, int rows) { this(cols, rows, 0); }

    public MNBoard(int size) { this(size, size, 0); }

    public MNBoard(MNBoard board) {
        if (board == null) {
            throw new IllegalArgumentException("cannot copy a null board");
        }
        cols = board.cols;
        rows = board.rows;
        grid = new int[rows * cols];
        emptyValue = board.emptyValue;
        arraycopy(board.grid, 0, grid, 0, grid.length);
    }

    public final boolean onTheBoard(int col, int row) { return 0 <= col && col < cols && 0 <= row && row < rows; }

    public int at(int col, int row) {
        if (!onTheBoard(col, row)) {
            throw new IllegalArgumentException("the specified location is off the board");
        }

        return grid[rows * row + col];
    }

    public boolean empty(int col, int row) {
        if (!onTheBoard(col, row)) {
            throw new IllegalArgumentException("the specified location is off the board");
        }
        return grid[rows * row + col] == emptyValue;
    }

    public MNBoard place(int col, int row, int piece) {
        if (!onTheBoard(col, row)) {
            throw new IllegalArgumentException("the specified location is off the board");
        }
        if (piece == emptyValue) {
            throw new IllegalArgumentException("cannot place an 'empty' piece");
        }

        grid[rows * row + col] = piece;

        return this;
    }

    public int displace(int col, int row) {
        if (!onTheBoard(col, row)) {
            throw new IllegalArgumentException("the specified location is off the board");
        }

        int loc = rows * row + col;
        if (grid[loc] == emptyValue) {
            throw new IllegalArgumentException("cannot displace an 'empty' location");
        }

        int piece = grid[loc];
        grid[loc] = emptyValue;

        return piece;
    }

    public MNBoard move(int fromCol, int fromRow, int toCol, int toRow) {
        return place(toCol, toRow, displace(fromCol, fromRow));
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }
        if (object == null || getClass() != object.getClass()) {
            return false;
        }

        MNBoard board = (MNBoard) object;

        return cols == board.cols && rows == board.rows && Arrays.equals(grid, board.grid);
    }

    @Override
    public int hashCode() {
        int result = cols;
        result = 31 * result + rows;
        result = 31 * result + Arrays.hashCode(grid);
        return result;
    }
}
