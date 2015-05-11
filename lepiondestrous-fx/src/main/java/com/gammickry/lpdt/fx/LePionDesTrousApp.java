package com.gammickry.lpdt.fx;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

import java.util.logging.ConsoleHandler;
import java.util.logging.FileHandler;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

import static com.gammickry.lpdt.fx.Utils.BOARD_RATIO;
import static java.lang.System.getenv;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 08, 2015
 */
public class LePionDesTrousApp extends Application {

    @Override
    public void start(Stage stage) throws Exception {
        double height = 600;

        LePionDesTrousView lePionDesTrousView = new LePionDesTrousView(height);

        stage.setMinHeight(height);
        stage.setMinWidth(height * BOARD_RATIO);
        stage.setTitle("Le Pion Des Trous :: FX, v. 0.0.1");

        stage.setScene(new Scene(new StackPane(lePionDesTrousView)));
        stage.show();
    }

    public static void main(String[] args) {

        // Set up logging to the console:
        Logger rootLogger = Logger.getLogger("");
        rootLogger.setLevel(getenv("DEBUG") != null ? Level.FINEST : Level.INFO);
        rootLogger.addHandler(new ConsoleHandler());

        // Set up logging to a file as well:
        Handler fileHandler;
        try {
            fileHandler = new FileHandler("lepiondestrous-fx.log"); // a file in the current working directory
            fileHandler.setFormatter(new SimpleFormatter());
            rootLogger.addHandler(fileHandler);
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }

        launch(args);
    }
}
