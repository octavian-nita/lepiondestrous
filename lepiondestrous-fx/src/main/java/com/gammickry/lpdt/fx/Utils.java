package com.gammickry.lpdt.fx;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 11, 2015
 */
public class Utils {

    public static double snap(double value) {
        return (int) value + .5;
    }

    public static double[] snap(double... values) {
        if (values != null) {
            for (int i = 0; i < values.length; i++) {
                values[i] = (int) values[i] + .5;
            }
        }
        return values;
    }

    public static double[] times(double multiplier, double... values) {
        if (values != null) {
            for (int i = 0; i < values.length; i++) {
                values[i] *= multiplier;
            }
        }
        return values;
    }

    public static double[] timesAndSnap(double multiplier, double... values) {
        if (values != null) {
            for (int i = 0; i < values.length; i++) {
                values[i] = (int) (multiplier * values[i]) + .5;
            }
        }
        return values;
    }
}
