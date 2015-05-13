package com.gammickry.lpdt.fx;

import javafx.scene.effect.DropShadow;
import javafx.scene.paint.Paint;
import javafx.scene.text.Font;

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

    DropShadow getPrimaryDropShadow();

    DropShadow getSecondaryDropShadow();

    Paint getTextPaint();

    Font getFont();

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

        private final DropShadow primaryDropShadow = new DropShadow(10, 0, 2, web("#000", 0.26));

        public DropShadow getPrimaryDropShadow() { return primaryDropShadow; }

        private final DropShadow secondaryDropShadow = new DropShadow(5, 0, 2, web("#000", 0.36));

        public DropShadow getSecondaryDropShadow() { return secondaryDropShadow; }

        private final Paint textPaint = web("#FFEB3B");

        @Override
        public Paint getTextPaint() { return textPaint; }

        private final Font font = Font.loadFont("file:font/chantelli-antiqua.ttf", 30);

        @Override
        public Font getFont() { return font; }
    };
}
