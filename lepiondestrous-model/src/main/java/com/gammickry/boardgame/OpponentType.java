package com.gammickry.boardgame;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 20, 2015
 */
public enum OpponentType {

    NONE {
        @Override
        public int piece() { return MNBoard.EMPTY; }

        @Override
        public OpponentType opponent() { return NONE; }
    },

    LIGHT {
        @Override
        public int piece() { return 1; }

        @Override
        public OpponentType opponent() { return DARK; }
    },

    DARK {
        @Override
        public int piece() { return 2; }

        @Override
        public OpponentType opponent() { return LIGHT; }
    };

    public abstract int piece();

    public abstract OpponentType opponent();

    private static final OpponentType[] legend = {NONE, LIGHT, DARK};

    public static OpponentType fromPiece(int piece) { return legend[piece % legend.length]; }
}
