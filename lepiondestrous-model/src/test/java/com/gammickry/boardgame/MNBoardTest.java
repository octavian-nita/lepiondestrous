package com.gammickry.boardgame;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertTrue;

/**
 * @author Octavian Theodor NITA (http://github.com/octavian-nita)
 * @version 1.0, May 07, 2015
 */
public class MNBoardTest {

    private MNBoard board; // system under test

    @Before
    public void setUp() {
        board = new MNBoard(3, 3);
    }

    @After
    public void tearDown() {
        board = null;
    }

    @Test
    public void goodLocationIsOnTheBoard() {
        assertTrue(board.onTheBoard(0, 0));
        assertTrue(board.onTheBoard(2, 2));
    }

    @Test
    public void badLocationIsOffTheBoard() {
        assertFalse(board.onTheBoard(-1, 0));
        assertFalse(board.onTheBoard(3, 3));
    }

    @Test
    public void copyConstructorYieldsIdenticalBoard() {
        board.place(1, 1, 'x');
        MNBoard copy = new MNBoard(board);

        assertTrue(copy.equals(board));
        assertEquals(copy.hashCode(), board.hashCode());
    }

    @Test
    public void hashCodeTakesIntoAccountPieceLocation() {
        board.place(1, 1, 'x');
        MNBoard copy = new MNBoard(board);

        copy.move(1, 1, 0, 1);

        assertFalse(copy.equals(board));
        assertNotEquals(copy.hashCode(), board.hashCode());
    }

    @Test
    public void displaceEmptiesLocation() {
        board.place(1, 1, 'x');

        assertEquals('x', board.displace(1, 1));
        assertTrue(board.empty(1, 1));
    }
}
