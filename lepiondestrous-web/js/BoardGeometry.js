define(
  ['gameConfig'],

  function (cfg) {
    'use strict';

    /**
     * Gameboard geometry (where within a parent container the gameboard is drawn, how large it is, etc.),
     * in terms of a container's dimensions. Currently the board is always laid out vertically.
     *
     * @author Octavian Theodor NITA (http://github.com/octavian-nita)
     * @version 1.0, September 7, 2015
     *
     * @constructor
     * @param {HTMLElement} container
     */
    function BoardGeometry(container) {
      if (!(this instanceof BoardGeometry)) { return new BoardGeometry(container); }
      if (!container) { throw new Error('ERR_CONTAINER_ELEMENT_REQUIRED'); }

      var gameSize = cfg.gameSize, boardRatio = gameSize / (gameSize + 5);

      // http://www.frontcoded.com/javascript-fit-rectange-into-bounds.html
      if (boardRatio > container.offsetWidth / container.offsetHeight) {

        /**
         * The width of the board, in pixels.
         *
         * @type {number}
         */
        this.width = Math.min(container.offsetWidth, cfg.board.maxWidth);

        /**
         * The height of the board, in pixels.
         *
         * @type {number}
         */
        this.height = this.width / boardRatio;

      } else {
        this.height = Math.min(container.offsetHeight, cfg.board.maxHeight);
        this.width = this.height * boardRatio;
      }

      /**
       * The leftmost coordinate of the board, within its parent container.
       *
       * @type {number}
       */
      this.x = (container.offsetWidth - this.width) / 2;

      /**
       * The topmost coordinate of the board, within its parent container.
       *
       * @type {number}
       */
      this.y = (container.offsetHeight - this.height) / 2;

      /**
       * The topmost coordinate of the board's playable area, within its parent container.
       *
       * @type {number}
       */
      this.playAreaY = this.y + this.height - this.width;

      /**
       * The board is drawn based on square units.
       *
       * @type {number}
       */
      this.unit = this.height * boardRatio / gameSize;

      /**
       * The board has <code>gameSize</code> × <code>gameSize</code> play holes of a certain diameter,
       * less than or equal to the board unit.
       *
       * @type {number}
       */
      this.holeDiameter = this.unit * 1.5 / 2.5;

      /**
       * A hole's radius, stored for convenience.
       *
       * @type {number}
       */
      this.holeRadius = this.holeDiameter / 2;

      /**
       * The space between two consecutive holes.
       *
       * @type {number}
       */
      this.holeDelta = (this.width - this.holeDiameter * gameSize) / (gameSize + 1);

      /**
       * The space between two consecutive hole centers, stored for convenience.
       *
       * @type {number}
       */
      this.holeCenterDelta = this.holeDelta + this.holeDiameter;
    }

    BoardGeometry.prototype.relativePosition = function (position) {
      // TODO: encapsulate logic that analyzes the coordinates relative to the board geometry!

      if (!position) { return; }

      // Translate event coordinates to the beginning of the playable area:
      position.x -= this.x;
      position.y -= this.playAreaY;

      return position;
    };

    return BoardGeometry;
  });
