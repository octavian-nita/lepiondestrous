package com.gammickry.lpdt.fx;

import javafx.scene.paint.Paint;

import static javafx.scene.paint.Color.ANTIQUEWHITE;
import static javafx.scene.paint.Color.web;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 11, 2015
 */
public interface Theme {

    Paint getHolePaint();

    Paint getBoardPaint();

    Paint getDarkPawnPaint();

    Paint getLightPawnPaint();

    Paint getScorePawnPaint();

    Paint getTextPaint();

    public static final Theme DEFAULT = new Theme() {

        private final Paint holePaint = web("#5D4037");

        @Override
        public Paint getHolePaint() { return holePaint; }

        private final Paint boardPaint = web("#795548");

        @Override
        public Paint getBoardPaint() { return boardPaint; }

        private final Paint darkPawnPaint = web("#E91E63");

        @Override
        public Paint getDarkPawnPaint() { return darkPawnPaint; }

        private final Paint lightPawnPaint = web("#CFD8DC");

        @Override
        public Paint getLightPawnPaint() { return lightPawnPaint; }

        private final Paint scorePawnPaint = ANTIQUEWHITE;

        @Override
        public Paint getScorePawnPaint() { return scorePawnPaint; }

        private final Paint textPaint = web("#FFEB3B");

        @Override
        public Paint getTextPaint() { return textPaint; }
    };
}
