package com.gammickry.lpdt.fx;

import com.gammickry.boardgame.Opponent;
import javafx.scene.effect.DropShadow;
import javafx.scene.effect.InnerShadow;
import javafx.scene.paint.Paint;
import javafx.scene.text.Font;

import static com.gammickry.boardgame.Opponent.DARK;
import static com.gammickry.boardgame.Opponent.LIGHT;
import static javafx.scene.paint.Color.ANTIQUEWHITE;
import static javafx.scene.paint.Color.web;
import static javafx.scene.text.Font.loadFont;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 11, 2015
 */
public abstract class LePionDesTrousTheme {

    public abstract Font getFont();

    public abstract Paint getTextPaint();

    public abstract Paint getHolePaint();

    public abstract Paint getBoardPaint();

    public abstract Paint getDarkPawnPaint();

    public abstract Paint getDarkPawnTransparentPaint();

    public abstract Paint getDarkScorePaint();

    public abstract Paint getLightPawnPaint();

    public abstract Paint getLightPawnTransparentPaint();

    public abstract Paint getLightScorePaint();

    public abstract DropShadow getDropShadow();

    public abstract InnerShadow getInnerShadow();

    public Paint getOpponentPaint(Opponent opponent) {
        return opponent == DARK ? getDarkPawnPaint() : opponent == LIGHT ? getLightPawnPaint() : null;
    }

    public Paint getOpponentTransparentPaint(Opponent opponent) {
        return opponent == DARK ? getDarkPawnTransparentPaint()
                                : opponent == LIGHT ? getLightPawnTransparentPaint() : null;
    }

    public Paint getOpponentScorePaint(Opponent opponent) {
        return opponent == DARK ? getDarkScorePaint() : opponent == LIGHT ? getLightScorePaint() : null;
    }

    public static final LePionDesTrousTheme DEFAULT = new LePionDesTrousTheme() {

        private final Font font = loadFont("file:font/chantelli-antiqua.ttf", 24);

        @Override
        public Font getFont() { return font; }

        private final Paint textPaint = web("#FFEB3B");

        @Override
        public Paint getTextPaint() { return textPaint; }

        private final Paint holePaint = web("#5d4037");

        @Override
        public Paint getHolePaint() { return holePaint; }

        private final Paint boardPaint = web("#795548");

        @Override
        public Paint getBoardPaint() { return boardPaint; }

        private final Paint darkPawnPaint = web("#d32f2f");

        @Override
        public Paint getDarkPawnPaint() { return darkPawnPaint; }

        private final Paint darkPawnTransparentPaint = web("#d32f2f", 0.6);

        @Override
        public Paint getDarkPawnTransparentPaint() { return darkPawnTransparentPaint; }

        private final Paint darkScorePaint = ANTIQUEWHITE;

        @Override
        public Paint getDarkScorePaint() { return darkScorePaint; }

        private final Paint lightPawnPaint = web("#cfd8dc");

        @Override
        public Paint getLightPawnPaint() { return lightPawnPaint; }

        private final Paint lightPawnTransparentPaint = web("#cfd8dc", 0.6);

        @Override
        public Paint getLightPawnTransparentPaint() { return lightPawnTransparentPaint; }

        private final Paint lightScorePaint = ANTIQUEWHITE;

        @Override
        public Paint getLightScorePaint() { return lightScorePaint; }

        private final DropShadow dropShadow = new DropShadow(5, 0, 2, web("#000", 0.45));

        {
            dropShadow.setInput(new DropShadow(10, 0, 2, web("#000", 0.35)));
        }

        @Override
        public DropShadow getDropShadow() { return dropShadow; }

        private final InnerShadow innerShadow = new InnerShadow(5, 0, 2, web("#000", 0.45));

        {
            innerShadow.setInput(new InnerShadow(10, 0, 2, web("#000", 0.35)));
        }

        @Override
        public InnerShadow getInnerShadow() { return innerShadow; }
    };
}
