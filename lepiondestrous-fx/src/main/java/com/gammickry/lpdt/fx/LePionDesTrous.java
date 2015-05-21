package com.gammickry.lpdt.fx;

import com.gammickry.boardgame.MNBoard;
import com.gammickry.boardgame.OpponentType;

import static com.gammickry.boardgame.OpponentType.DARK;
import static com.gammickry.boardgame.OpponentType.LIGHT;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 19, 2015
 */
public class LePionDesTrous {

    private static class Player {

        private int pawnsLeft = 42;

        public final OpponentType type;

        public Player(OpponentType type) {
            if (type == null) {
                throw new IllegalArgumentException("cannot use a null opponent type");
            }
            this.type = type;
        }

        public int pawnsLeft() { return pawnsLeft; }

        public int play() {
            if (pawnsLeft <= 0) {
                throw new IllegalStateException("player '" + type + "' has no more pawns to play");
            }
            pawnsLeft--;
            return type.piece();
        }
    }

    private MNBoard board;

    private int boardSize;

    private int currentPlayer = 0;

    private Player[] players = {new Player(LIGHT), new Player(DARK)};

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

    public OpponentType getCurrentOpponent() { return players[currentPlayer].type; }

    public OpponentType getOpponentAt(int col, int row) { return OpponentType.fromPiece(board.at(col, row)); }

    public void play(int col, int row) {
        board.place(col, row, players[currentPlayer].play());
        currentPlayer = (currentPlayer + 1) % players.length;
    }
}
