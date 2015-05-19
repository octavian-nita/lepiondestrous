package com.gammickry.lpdt.fx.model;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 19, 2015
 */
public enum Opponent {

    NONE,

    DARK {
        @Override
        public Opponent opponent() { return LIGHT; }
    },

    LIGHT {
        @Override
        public Opponent opponent() { return DARK; }
    };

    public Opponent opponent() { return NONE; }
}
