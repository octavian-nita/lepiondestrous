package com.gammickry.boardgame;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 22, 2015
 */
public class Move {

    public int toCol;

    public int toRow;

    public Move() {}

    public Move(int toCol, int toRow) {
        if (toCol < 0) {
            throw new IllegalArgumentException("cannot move to a negative column position");
        }
        if (toRow < 0) {
            throw new IllegalArgumentException("cannot move to a negative row position");
        }
        this.toCol = toCol;
        this.toRow = toRow;
    }

    public Move(Move move) {
        if (move == null) {
            throw new IllegalArgumentException("cannot copy a null move");
        }
        this.toCol = move.toCol;
        this.toRow = move.toRow;
    }
}
