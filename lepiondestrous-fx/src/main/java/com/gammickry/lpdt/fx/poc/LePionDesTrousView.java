package com.gammickry.lpdt.fx.poc;

import javafx.collections.ObservableList;
import javafx.event.EventHandler;
import javafx.scene.Group;
import javafx.scene.Node;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.input.MouseEvent;

import static java.lang.Math.ceil;
import static javafx.scene.Cursor.DEFAULT;
import static javafx.scene.Cursor.HAND;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 08, 2015
 */
public class LePionDesTrousView extends Group {

    private LePionDesTrous game;

    // Simple theme system:
    private LePionDesTrousTheme theme = LePionDesTrousTheme.DEFAULT;

    // In a resizable / responsive / fluid version, this could be a JavaFX property:
    private double boardUnit;

    private Canvas pawns;

    private Canvas glass;

    public LePionDesTrousView(double boardUnit) { this(boardUnit, null); }

    public LePionDesTrousView(double boardUnit, LePionDesTrous game) {
        if (boardUnit <= 0) {
            throw new IllegalArgumentException("cannot use a board unit less than or equal to 0");
        }

        this.game = game == null ? new LePionDesTrous() : game;

        int boardSize = this.game.getBoardSize();
        double sidePx = (boardSize * 2 + 1) * boardUnit;

        this.boardUnit = boardUnit;
        this.pawns = new Canvas(sidePx, sidePx);
        this.glass = new Canvas(sidePx, sidePx);

        // Poor man's layer system:
        ObservableList<Node> layers = getChildren();
        layers.add(initBoard(new Canvas(sidePx, (boardSize * 2 + 12) * boardUnit)));
        layers.add(initHoles(new Canvas(sidePx, (boardSize * 2 + 12) * boardUnit)));
        layers.add(initPawns(pawns));
        layers.add(initGlass(glass));
    }

    private Canvas initBoard(Canvas board) {
        double sr = boardUnit * 4.;  // small arch (circle) radius
        double y0 = boardUnit * 11.; // water level y
        double y1 = boardUnit * 6.5; // small arch top level y
        double cy = boardUnit * 7.5; // small arch control point y

        GraphicsContext gc = board.getGraphicsContext2D();
        gc.setEffect(theme.getRaisedEffect());

        // Board background:
        gc.setFill(theme.getBoardPaint());
        gc.fillRect(0, 0, board.getWidth(), board.getHeight());

        // Board decoration:
        gc.setLineWidth(2.5);
        gc.setStroke(theme.getTextPaint());

        gc.beginPath();
        gc.moveTo(0, y0);
        gc.lineTo(boardUnit * 5., y0);
        // First small arch:
        gc.arcTo(boardUnit * 5.5, cy, boardUnit * 7.5, y1, sr);
        gc.arcTo(boardUnit * 9.5, cy, boardUnit * 10., y0, sr);
        gc.lineTo(boardUnit * 10., y0); // finish the arch
        gc.lineTo(boardUnit * 11., y0);
        // Middle large arch:
        gc.arcTo(boardUnit * 11.5, y1, boardUnit * 14.5, boardUnit * 5.5, boardUnit * 24. / 5.);
        gc.arcTo(boardUnit * 17.5, y1, boardUnit * 18., y0, boardUnit * 24. / 5.);
        gc.lineTo(boardUnit * 18., y0); // finish the arch
        gc.lineTo(boardUnit * 19., y0);
        // Second small arch:
        gc.arcTo(boardUnit * 19.5, cy, boardUnit * 21.5, y1, sr);
        gc.arcTo(boardUnit * 23.5, cy, boardUnit * 24., y0, sr);
        gc.lineTo(boardUnit * 24., y0); // finish the arch
        gc.lineTo(boardUnit * 29., y0);
        gc.stroke();                    // finish the bridge lower outline
        // Bridge top:
        gc.beginPath();
        gc.moveTo(boardUnit * 5.5, 0);
        gc.lineTo(boardUnit * 5.5, boardUnit * 3);
        gc.lineTo(boardUnit * 23.5, boardUnit * 3);
        gc.lineTo(boardUnit * 23.5, 0);
        gc.stroke();

        // Board title:
        gc.setFont(theme.getFont());
        gc.setFill(theme.getTextPaint());
        gc.fillText("Le pion des trous", boardUnit * 8.4, boardUnit * 2.);

        return board;
    }

    private Canvas initHoles(Canvas holes) {
        double du = boardUnit * 2.;
        double fu = boardUnit * 5.;
        double dx = boardUnit * 25.;
        double dy = boardUnit * 12.;

        GraphicsContext gc = holes.getGraphicsContext2D();
        gc.setEffect(theme.getLoweredEffect());
        gc.setFill(theme.getHolePaint());

        int boardSize = game.getBoardSize();
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                gc.fillOval(boardUnit + j * du, dy + i * du, boardUnit, boardUnit);
            }
        }

        // Scoreboard on the left:
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

        // Scoreboard on the right:
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

        return holes;
    }

    private Canvas initPawns(Canvas pawns) {
        pawns.setLayoutY(boardUnit * 11.); // push the pawns 'layer' below the scoreboard and decoration

        double du = boardUnit * 2.;

        GraphicsContext gc = pawns.getGraphicsContext2D();
        gc.setEffect(theme.getRaisedEffect());

        int boardSize = game.getBoardSize();
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                if (!game.isEmpty(j, i)) {
                    gc.setFill(theme.getPaint(game.getOpponentAt(j, i)));
                    gc.fillOval(boardUnit + j * du, boardUnit + i * du, boardUnit, boardUnit);
                }
            }
        }

        return pawns;
    }

    private Canvas initGlass(Canvas glass) {
        glass.setLayoutY(boardUnit * 11.); // push the glass 'layer' below the score board and decoration
        glass.setOnMouseMoved(new HoverHandler());
        glass.setOnMouseClicked(new ClickHandler());
        return glass;
    }

    /** Assumes the event's source is a rectangle with the edge a multiple of boardUnit. */
    private abstract class MouseEventHandler implements EventHandler<MouseEvent> {

        protected int lastCol = -1;

        protected int lastRow = -1;

        @Override
        public void handle(MouseEvent event) {

            int currCol = (int) ceil(event.getX() / boardUnit);
            int currRow = (int) ceil(event.getY() / boardUnit);
            if (currRow == 0 || currRow % 2 != 0 || currCol == 0 || currCol % 2 != 0) {
                onHoleMiss(currCol, currRow, event);
                lastCol = lastRow = -1;
                return;
            }

            currCol = currCol / 2 - 1;
            currRow = currRow / 2 - 1;
            if (!game.isEmpty(currCol, currRow)) {
                onPawn(currCol, currRow, event);
                lastCol = lastRow = -1;
                return;
            }

            if (currCol != lastCol || currRow != lastRow) {
                onHole(currCol, currRow, event);
                lastCol = currCol;
                lastRow = currRow;
            }
        }

        protected void onHoleMiss(int currCol, int currRow, MouseEvent event) {}

        protected abstract void onHole(int currCol, int currRow, MouseEvent event);

        protected void onPawn(int currCol, int currRow, MouseEvent event) { onHoleMiss(currCol, currRow, event); }
    }

    private class HoverHandler extends MouseEventHandler {

        @Override
        protected void onHoleMiss(int currCol, int currRow, MouseEvent event) {
            glass.setCursor(DEFAULT);
            glass.getGraphicsContext2D()
                 .clearRect(boardUnit * (1 + lastCol * 2.), boardUnit * (1 + lastRow * 2.), boardUnit, boardUnit);
        }

        @Override
        protected void onHole(int currCol, int currRow, MouseEvent event) {
            onHoleMiss(currCol, currRow, event); // clear last hovered hole

            glass.setCursor(HAND);
            GraphicsContext gc = glass.getGraphicsContext2D();
            gc.setFill(theme.getTransparentPaint(game.getCurrentOpponent()));
            gc.fillOval(boardUnit * (1 + currCol * 2.), boardUnit * (1 + currRow * 2.), boardUnit, boardUnit);
        }
    }

    private class ClickHandler extends MouseEventHandler {

        @Override
        protected void onHole(int currCol, int currRow, MouseEvent event) {
            game.play(currCol, currRow);

            GraphicsContext gc = pawns.getGraphicsContext2D();
            gc.setFill(theme.getPaint(game.getOpponentAt(currCol, currRow)));
            gc.fillOval(boardUnit * (1 + currCol * 2.), boardUnit * (1 + currRow * 2.), boardUnit, boardUnit);
        }
    }
}