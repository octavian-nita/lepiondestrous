package com.gammickry.lpdt.fx;

import javafx.collections.ObservableList;
import javafx.scene.Group;
import javafx.scene.Node;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;

import static java.lang.Math.ceil;
import static java.lang.Math.floor;
import static javafx.scene.input.MouseEvent.MOUSE_MOVED;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 08, 2015
 */
public class LePionDesTrousView extends Group {

    // In a resizable / responsive / fluid version, this could be a property:
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
        layers.add(initDecoration(new Canvas(boardWidth, boardHeight)));
        layers.add(initHoles(new Canvas(boardWidth, boardHeight)));
        layers.add(initPawns(new Canvas(boardWidth, boardHeight)));
    }

    private Canvas initBoard(Canvas board) {
        GraphicsContext gc = board.getGraphicsContext2D();
        gc.setFill(theme.getBoardPaint());
        gc.fillRect(0, 0, board.getWidth(), board.getHeight());
        return board;
    }

    private Canvas initDecoration(Canvas decoration) {

        double r1 = boardUnit * 4.;   // small arch (circle) radius
        double y0 = boardUnit * 11.;  // water level y
        double y1 = boardUnit * 6.5;  // small arch top level y
        double cy1 = boardUnit * 7.5; // small arch control point y

        GraphicsContext gc = decoration.getGraphicsContext2D();
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
        gc.lineTo(boardUnit * 23.5, boardUnit * 3);
        gc.lineTo(boardUnit * 23.5, 0);
        gc.stroke();

        gc.fillText("Le pion des trous", boardUnit * 8.4, boardUnit * 2.);
        gc.applyEffect(theme.getDropShadow());

        return decoration;
    }

    private Canvas initHoles(Canvas holes) {

        double du = boardUnit * 2.;
        double fu = boardUnit * 5.;
        double dx = boardUnit * 25.;
        double dy = boardUnit * 12.;

        GraphicsContext gc = holes.getGraphicsContext2D();
        gc.setFill(theme.getHolePaint());

        for (int i = 0; i < 14; i++) {
            for (int j = 0; j < 14; j++) {
                gc.fillOval(boardUnit + i * du, dy + j * du, boardUnit, boardUnit);
            }
        }

        gc.fillOval(boardUnit, boardUnit, boardUnit, boardUnit);
        gc.fillOval(boardUnit + du, boardUnit, boardUnit, boardUnit);
        gc.fillOval(boardUnit, boardUnit + du, boardUnit, boardUnit);
        gc.fillOval(boardUnit + du, boardUnit + du, boardUnit, boardUnit);

        gc.fillOval(du, boardUnit * 5., boardUnit, boardUnit);
        gc.fillOval(du, boardUnit * 7., boardUnit, boardUnit);
        gc.fillOval(du, boardUnit * 9., boardUnit, boardUnit);

        gc.fillOval(boardUnit * 6., fu, boardUnit, boardUnit);
        gc.fillOval(boardUnit * 8.5, fu, boardUnit, boardUnit);
        gc.fillOval(boardUnit * 11., fu, boardUnit, boardUnit);

        gc.fillOval(dx, boardUnit, boardUnit, boardUnit);
        gc.fillOval(dx + du, boardUnit, boardUnit, boardUnit);
        gc.fillOval(dx, boardUnit + du, boardUnit, boardUnit);
        gc.fillOval(dx + du, boardUnit + du, boardUnit, boardUnit);

        gc.fillOval(dx + boardUnit, boardUnit * 5., boardUnit, boardUnit);
        gc.fillOval(dx + boardUnit, boardUnit * 7., boardUnit, boardUnit);
        gc.fillOval(dx + boardUnit, boardUnit * 9., boardUnit, boardUnit);

        gc.fillOval(boardUnit * 17., fu, boardUnit, boardUnit);
        gc.fillOval(boardUnit * 19.5, fu, boardUnit, boardUnit);
        gc.fillOval(boardUnit * 22., fu, boardUnit, boardUnit);

        gc.applyEffect(theme.getInnerShadow());

        return holes;
    }

    private Canvas initPawns(Canvas pawns) {

        double du = boardUnit * 2.;
        double dy = boardUnit * 12.;

        GraphicsContext gc = pawns.getGraphicsContext2D();

        gc.setFill(theme.getDarkPawnPaint());
        gc.fillOval(boardUnit + 2 * du, dy + 2 * du, boardUnit, boardUnit);
        gc.setFill(theme.getLightPawnPaint());
        gc.fillOval(boardUnit + 3 * du, dy + 3 * du, boardUnit, boardUnit);

        gc.applyEffect(theme.getDropShadow());

        addEventHandler(MOUSE_MOVED, e -> {
            double x = e.getX(), y = e.getY();

            if (y < dy) {
                return;
            }

            System.out.println(ceil(x / boardUnit / 2));
        });

        return pawns;
    }
}
