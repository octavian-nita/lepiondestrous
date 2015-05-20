package com.gammickry.lpdt.fx;

import com.gammickry.boardgame.MNBoard;
import com.gammickry.boardgame.Opponent;

import static com.gammickry.boardgame.Opponent.LIGHT;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 19, 2015
 */
public class LePionDesTrous {

    private int boardSize;

    private MNBoard board;

    private Opponent opponent = LIGHT;

    public LePionDesTrous() { this(14); }

    public LePionDesTrous(int boardSize) {
        if (boardSize <= 0) {
            throw new IllegalArgumentException("cannot use a board size less than or equal to 0");
        }
        this.boardSize = boardSize;
        this.board = new MNBoard(boardSize);
    }

    public int getBoardSize() { return boardSize; }

    public Opponent getOpponent() { return opponent; }

    public void nextOpponent() { opponent = opponent.opponent(); }

    public boolean isEmpty(int col, int row) { return board.empty(col, row); }
}
