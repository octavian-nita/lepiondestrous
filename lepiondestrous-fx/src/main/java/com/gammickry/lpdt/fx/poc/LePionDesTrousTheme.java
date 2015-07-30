package com.gammickry.lpdt.fx.poc;

import com.gammickry.boardgame.OpponentType;
import javafx.scene.effect.DropShadow;
import javafx.scene.effect.Effect;
import javafx.scene.effect.InnerShadow;
import javafx.scene.paint.Paint;
import javafx.scene.text.Font;

import static com.gammickry.boardgame.OpponentType.DARK;
import static com.gammickry.boardgame.OpponentType.LIGHT;
import static javafx.scene.paint.Color.ANTIQUEWHITE;
import static javafx.scene.paint.Color.WHITE;
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

    public abstract Effect getRaisedEffect();

    public abstract Effect getLoweredEffect();

    public Paint getPaint(OpponentType opponent) {
        return opponent == DARK ? getDarkPawnPaint() : opponent == LIGHT ? getLightPawnPaint() : null;
    }

    public Paint getTransparentPaint(OpponentType opponent) {
        return opponent == DARK ? getDarkPawnTransparentPaint()
                                : opponent == LIGHT ? getLightPawnTransparentPaint() : null;
    }

    public Paint getScorePaint(OpponentType opponent) {
        return opponent == DARK ? getDarkScorePaint() : opponent == LIGHT ? getLightScorePaint() : null;
    }

    public static final LePionDesTrousTheme DEFAULT = new LePionDesTrousTheme() {

        private final Font font = loadFont("file:font/chantelli-antiqua.ttf", 24);

        @Override
        public Font getFont() { return font; }

        private final Paint textPaint = web("#ffc107");

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

        private final Paint lightPawnPaint = WHITE;

        @Override
        public Paint getLightPawnPaint() { return lightPawnPaint; }

        private final Paint lightPawnTransparentPaint = web("#fff", 0.6);

        @Override
        public Paint getLightPawnTransparentPaint() { return lightPawnTransparentPaint; }

        private final Paint lightScorePaint = ANTIQUEWHITE;

        @Override
        public Paint getLightScorePaint() { return lightScorePaint; }

        private final Effect raisedEffect;

        @Override
        public Effect getRaisedEffect() { return raisedEffect; }

        private final Effect loweredEffect;

        @Override
        public Effect getLoweredEffect() { return loweredEffect; }

        {   // Initialization block:
            DropShadow ds1 = new DropShadow(10, 0, 2, web("#000", 0.65));
            DropShadow ds2 = new DropShadow(15, 0, 2, web("#000", 0.45));
            ds2.setInput(ds1);
            raisedEffect = ds2;

            InnerShadow is1 = new InnerShadow(10, 0, 2, web("#000", 0.65));
            InnerShadow is2 = new InnerShadow(15, 0, 2, web("#000", 0.45));
            is2.setInput(is1);
            loweredEffect = is2;
        }
    };
}
