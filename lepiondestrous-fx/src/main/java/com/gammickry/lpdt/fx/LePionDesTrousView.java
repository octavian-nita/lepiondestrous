package com.gammickry.lpdt.fx;

import javafx.collections.ObservableList;
import javafx.scene.Group;
import javafx.scene.Node;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 08, 2015
 */
public class LePionDesTrousView extends Group {

    // In a resizable / fluid / responsive version, these could be properties:

    private final double boardUnit;

    // Simple theme system:

    private Theme theme = Theme.DEFAULT;

    public LePionDesTrousView(double boardUnit) {
        if (boardUnit < 0) {
            throw new IllegalArgumentException("cannot use a negative board unit");
        }
        this.boardUnit = boardUnit;

        double boardWidth = 29 * boardUnit;
        double boardHeight = 40 * boardUnit;

        // Poor man's layer system:
        ObservableList<Node> layers = getChildren();
        layers.add(initBoard(new Canvas(boardWidth, boardHeight)));
        layers.add(initBackgroundDecoration(new Canvas(boardWidth, boardHeight)));
    }

    private Canvas initBoard(Canvas board) {
        GraphicsContext gc = board.getGraphicsContext2D();
        gc.setFill(theme.getBoardPaint());
        gc.fillRect(0, 0, board.getWidth(), board.getHeight());
        return board;
    }

    private Canvas initBackgroundDecoration(Canvas backgroundDecoration) {
        GraphicsContext gc = backgroundDecoration.getGraphicsContext2D();

        double r1 = boardUnit * 4.;   // small arch (circle) radius
        double y0 = boardUnit * 11.;  // water level y
        double y1 = boardUnit * 6.5;  // small arch top level y
        double cy1 = boardUnit * 7.5; // small arch control point y

        gc.setLineWidth(2.5);
        gc.setFont(theme.getFont());
        gc.setFill(theme.getTextPaint());
        gc.setStroke(theme.getTextPaint());

        gc.beginPath();
        gc.moveTo(0, y0);
        gc.lineTo(boardUnit * 5., y0);
        // First small arch:
        gc.arcTo(boardUnit * 5.5, cy1, boardUnit * 7.5, y1, r1);
        gc.arcTo(boardUnit * 9.5, cy1, boardUnit * 10., y0, r1);
        gc.lineTo(boardUnit * 10., y0); // finish the first small arch
        gc.lineTo(boardUnit * 11., y0);
        // Middle large arch:
        gc.arcTo(boardUnit * 11.5, y1, boardUnit * 14.5, boardUnit * 5.5, boardUnit * 24. / 5.);
        gc.arcTo(boardUnit * 17.5, y1, boardUnit * 18., y0, boardUnit * 24. / 5.);
        gc.lineTo(boardUnit * 18., y0); // finish the middle large arch
        gc.lineTo(boardUnit * 19., y0);
        // Second small arch:
        gc.arcTo(boardUnit * 19.5, cy1, boardUnit * 21.5, y1, r1);
        gc.arcTo(boardUnit * 23.5, cy1, boardUnit * 24., y0, r1);
        gc.lineTo(boardUnit * 24., y0); // finish the second small arch
        gc.lineTo(boardUnit * 29., y0);
        gc.stroke();                    // finish the bridge lower outline
        // Bridge top:
        gc.beginPath();
        gc.moveTo(boardUnit * 5.5, 0);
        gc.lineTo(boardUnit * 5.5, boardUnit * 3);
        gc.lineTo(boardUnit * 24., boardUnit * 3);
        gc.lineTo(boardUnit * 24., 0);
        gc.stroke();

        gc.fillText("Le pion des trous", boardUnit * 6.9, boardUnit * 2.2);

        gc.applyEffect(theme.getPrimaryDropShadow());
        gc.applyEffect(theme.getSecondaryDropShadow());

        return backgroundDecoration;
    }
}
