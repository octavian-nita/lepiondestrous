package com.gammickry.lpdt.fx;

import javafx.collections.ObservableList;
import javafx.scene.Group;
import javafx.scene.shape.ArcTo;
import javafx.scene.shape.HLineTo;
import javafx.scene.shape.MoveTo;
import javafx.scene.shape.Path;
import javafx.scene.shape.PathElement;
import javafx.scene.shape.Rectangle;

import static com.gammickry.lpdt.fx.Utils.BOARD_RATIO;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 08, 2015
 */
public class LePionDesTrousView extends Group {

    private Theme theme = Theme.DEFAULT;

    private final double height;

    private final double unit;

    public LePionDesTrousView(double height) {
        if (height < 0) {
            throw new IllegalArgumentException("cannot create a view with a negative height");
        }

        this.height = height;
        this.unit = height / 40;

        addBoard();
        addBridgeDecoration();
    }

    private void addBoard() {
        getChildren().add(new Rectangle(height * BOARD_RATIO, height, theme.getBoardPaint()));
    }

    private void addBridgeDecoration() {
        Path path = new Path();
        path.setStroke(theme.getTextPaint());
        path.setStrokeWidth(3);

        ObservableList<PathElement> elms = path.getElements();

        elms.add(new MoveTo(2, 11 * unit));
        elms.add(new HLineTo(5 * unit));
        elms.add(new ArcTo(8 * unit, 11 * unit, 0, 7.5 * unit, 7.5 * unit, false, true));

        getChildren().add(path);
    }
}
