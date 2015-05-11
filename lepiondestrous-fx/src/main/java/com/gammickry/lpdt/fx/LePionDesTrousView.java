package com.gammickry.lpdt.fx;

import javafx.beans.property.DoubleProperty;
import javafx.beans.property.ReadOnlyDoubleWrapper;
import javafx.beans.property.SimpleDoubleProperty;
import javafx.collections.ObservableList;
import javafx.scene.Group;
import javafx.scene.shape.HLineTo;
import javafx.scene.shape.MoveTo;
import javafx.scene.shape.Path;
import javafx.scene.shape.PathElement;

import static com.gammickry.lpdt.fx.Utils.BOARD_RATIO;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 08, 2015
 */
public class LePionDesTrousView extends Group {

    private Theme theme = Theme.DEFAULT;

    // Height property:

    private final DoubleProperty height;

    public final DoubleProperty heightProperty() { return height; }

    public final double getHeight() { return height.get(); }

    public final void setHeight(double w) { height.set(w); }

    // Width property:

    private final ReadOnlyDoubleWrapper width;

    public final ReadOnlyDoubleWrapper widthProperty() { return width; }

    public final double getWidth() { return width.get(); }

    public LePionDesTrousView(double height) {
        if (height < 0) {
            throw new IllegalArgumentException("cannot create a view with a negative height");
        }

        this.height = new SimpleDoubleProperty(height);
        this.width = new ReadOnlyDoubleWrapper(height * BOARD_RATIO);

        addBridgeDecoration();
    }

    protected void addBridgeDecoration() {
        Path path = new Path();
        path.setStrokeWidth(0.5);

        ObservableList<PathElement> elms = path.getElements();

        elms.add(new MoveTo(0, 0));
        elms.add(new HLineTo(100));

        getChildren().add(path);
    }
}
