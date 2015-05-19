package com.gammickry.lpdt.fx.model;

import static com.gammickry.lpdt.fx.model.Opponent.LIGHT;

/**
 * Game model.
 *
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 19, 2015
 */
public class LePionDesTrous {

    private int size = 14;

    private Opponent[] board = new Opponent[size * size];

    private Opponent opponent = LIGHT;
}
