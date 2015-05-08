package com.gammickry.lpdt.fx;

import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.paint.Color;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 08, 2015
 */
public class LePionDesTrousView extends Canvas {

    public LePionDesTrousView() {
        super();
        widthProperty().addListener(evt -> draw());
        heightProperty().addListener(evt -> draw());
        draw();
    }

    protected void draw() {
        double width = getWidth();
        double height = getHeight();

        GraphicsContext gc = getGraphicsContext2D();
        gc.setFill(Color.GREEN);
        gc.fillRect(0, 0, width, height);
    }

    // background-color: #795548;
    // border-color: #5d4037;

    @Override
    public boolean isResizable() {
        return true;
    }

    @Override
    public double prefWidth(double height) {
        return getWidth();
    }

    @Override
    public double prefHeight(double width) {
        return getHeight();
    }
}
