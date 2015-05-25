package com.gammickry.lpdt;

import com.gammickry.boardgame.OpponentType;

public class Player {

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
