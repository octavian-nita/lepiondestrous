package com.gammickry.lpdt.fx;

import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.shape.ArcType;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 08, 2015
 */
public class LePionDesTrousView extends Canvas {

    public LePionDesTrousView(double unit) {
        super(unit * 29, unit * 40);
        this.unit = unit;

        draw();
    }

    private void draw() {
        double width = getWidth();
        double height = getHeight();

        GraphicsContext gc = getGraphicsContext2D();

        // The board:
        gc.setFill(theme.getBoardPaint());
        gc.fillRect(0, 0, width, height);

        // The bridge decoration:
        drawBridge(gc);
    }

    private void drawBridge(GraphicsContext gc) {

        double l0 = unit * 11.;
        double l1 = unit * 6.5;
        double l2 = unit * 5.5;

        gc.setStroke(theme.getTextPaint());
        gc.setLineWidth(2.5);

        gc.beginPath();
        gc.moveTo(0, l0);
        gc.lineTo(unit * 5., l0);
        gc.stroke();

        gc.strokeArc(unit * 5, l1, unit * 5, unit * 9, 90, 90, ArcType.OPEN);

        //gc.arcTo(unit * 5.5, unit * 8., unit * 7.5, l1, 100);
        //gc.arcTo(unit * 9.5, unit * 8., unit * 10., l0, 120);
    }

    private final double unit;

    private Theme theme = Theme.DEFAULT;
}
