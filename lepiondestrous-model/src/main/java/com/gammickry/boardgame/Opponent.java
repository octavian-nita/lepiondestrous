package com.gammickry.boardgame;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 20, 2015
 */
public enum Opponent {

    NONE,

    LIGHT {
        @Override
        public int value() { return 1; }

        @Override
        public Opponent opponent() { return DARK; }
    },

    DARK {
        @Override
        public int value() { return 2; }

        @Override
        public Opponent opponent() { return LIGHT; }
    };

    public int value() { return 0; }

    public Opponent opponent() { return NONE; }

    private static final Opponent[] legend = {NONE, LIGHT, DARK};

    public static Opponent opponent(int value) { return legend[value % legend.length]; }
}
