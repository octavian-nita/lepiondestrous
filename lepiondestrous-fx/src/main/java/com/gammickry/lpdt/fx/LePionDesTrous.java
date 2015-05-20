package com.gammickry.lpdt.fx;

import com.gammickry.boardgame.MNBoard;
import com.gammickry.boardgame.Opponent;

import static com.gammickry.boardgame.Opponent.LIGHT;
import static com.gammickry.boardgame.Opponent.opponent;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 19, 2015
 */
public class LePionDesTrous {

    private int boardSize;

    private MNBoard board;

    private Opponent currentOpponent = LIGHT;

    public LePionDesTrous() { this(14); }

    public LePionDesTrous(int boardSize) {
        if (boardSize <= 0) {
            throw new IllegalArgumentException("cannot use a board size less than or equal to 0");
        }
        this.boardSize = boardSize;
        this.board = new MNBoard(boardSize);
    }

    public int getBoardSize() { return boardSize; }

    public boolean isEmpty(int col, int row) { return board.empty(col, row); }

    public Opponent getCurrentOpponent() { return currentOpponent; }

    public Opponent getOpponentAt(int col, int row) { return opponent(board.at(col, row)); }

    public void play(int col, int row) {
        board.place(col, row, currentOpponent.value());
        currentOpponent = currentOpponent.opponent();
    }
}
