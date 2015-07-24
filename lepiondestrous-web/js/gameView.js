define(['./gfx', './game', './gameTheme'], function (Gfx, Game, T) {
  'use strict';

  var O = Object.freeze({ // Game view default options
                          board: {
                            maxHeight: 695,
                            maxWidth: 504
                          },
                          gameSize: 14
                        }),
      g = new Gfx();

  function shadow(context) {
    if (!context) { return; }
    context.shadowOffsetX = T.dropShadow.offsetX;
    context.shadowOffsetY = T.dropShadow.offsetY;
    context.shadowColor = T.dropShadow.color;
    context.shadowBlur = T.dropShadow.blur;
  }

  /**
   * Gameboard geometry (where the gameboard gets drawn, how large it is, etc.), in terms of a container's dimensions.
   *
   * @constructor
   */
  function BoardGeometry(container, options) {
    if (!(this instanceof BoardGeometry)) { return new BoardGeometry(container, options); }
    if (!container) { return; }

    var opts = Object.create(O), i, keys, l, boardRatio;
    if (options) { // compute view options
      for (i = 0, keys = Object.keys(options), l = keys.length; i < l; i++) { opts[keys[i]] = options[keys[i]]; }
    }

    // Set up the board geometry (always vertical, http://www.frontcoded.com/javascript-fit-rectange-into-bounds.html):
    boardRatio = opts.gameSize / (opts.gameSize + 5);
    if (boardRatio > container.offsetWidth / container.offsetHeight) {

      /**
       * The width of the board, in pixels.
       *
       * @type {number}
       */
      this.width = Math.min(container.offsetWidth, opts.board.maxWidth);

      /**
       * The height of the board, in pixels.
       *
       * @type {number}
       */
      this.height = this.width / boardRatio;

    } else {
      this.height = Math.min(container.offsetHeight, opts.board.maxHeight);
      this.width = this.height * boardRatio;
    }

    /**
     * The leftmost coordinate of the board, within its parent container.
     *
     * @type {number}
     */
    this.x = (container.offsetWidth - this.width ) / 2;

    /**
     * The topmost coordinate of the board, within its parent container.
     *
     * @type {number}
     */
    this.y = (container.offsetHeight - this.height) / 2;

    /**
     * The board is drawn based on a unit.
     *
     * @type {number}
     */
    this.unit = this.height * boardRatio / opts.gameSize;

    /**
     * The board has <code>opts.gameSize</code> × <code>opts.gameSize</code> play holes of a certain diameter,
     * less than or equal to the board unit.
     *
     * @type {number}
     */
    this.holeDiameter = this.unit * 1.5 / 3;

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
    this.holeDelta = (this.width - this.holeDiameter * opts.gameSize) / (opts.gameSize + 1);

    Object.freeze(this);
  }

  /** @constructor */
  function GameView(container, options) {
    if (!(this instanceof GameView)) { return new GameView(container, options); }
    if (!container) { return; }

    /**
     * Game model.
     *
     * @protected
     */
    this._game = new Game();

    /**
     * Gameboard geometry.
     *
     * @protected
     */
    this._board = new BoardGeometry(container, options);

    var i, keys, l, layers;

    // Build a map of layers; since these have the z-index set already,
    // we don't care about the order in which they are stored in a map:
    layers = Object.create(null);
    layers.board = Gfx.createLayer(container, 0, 'board');
    layers.pawns = Gfx.createLayer(container, 1, 'pawns');
    layers.glass = Gfx.createLayer(container, 2, 'glass');
    Object.freeze(layers);

    // Render the game view off-screen:
    this.render(layers);

    layers.glass.addEventListener('mousemove', new HoleHoverListener(this));

    // Set up the parent / container element:
    container.innerHTML = ''; // we might have initial parent content in order to help with / force font loading, etc.
    for (i = 0, keys = Object.keys(layers), l = keys.length; i < l; i++) { container.appendChild(layers[keys[i]]); }
  }

  GameView.prototype.render = function (layers) {
    var boardContext = layers.board.getContext('2d');
    this._renderBoard(boardContext);
    this._renderHoles(boardContext);
    this._renderPawns(layers.pawns.getContext('2d'));
  };

  GameView.prototype._renderBoard = function (cx) {
    if (!cx || !this._board) { return; }
    cx.canvas.style.background = T.boardLight;

    var brd = this._board;
    cx.save();

    shadow(cx);

    cx.fillStyle = T.boardDark;
    cx.fillRect(brd.x, brd.y, brd.width, brd.height);

    cx.translate(brd.x, brd.y);    // move the origin to the board top left corner
    cx.scale(brd.unit, brd.unit);  // draw the board decorations in terms of units

    cx.strokeStyle = T.foreground;
    cx.lineWidth = Gfx.canvasOversample / brd.unit;   // the canvas is oversampled and the board is scaled

    // Arch Bridge:
    cx.beginPath();
    cx.moveTo(0, 5);
    cx.lineTo(2.5, 5);
    // First small arch:
    cx.arcTo(2.6, 3.4, 3.5, 3, 1.6);
    cx.arcTo(4.4, 3.4, 4.5, 5, 1.6);
    cx.lineTo(4.5, 5); // finish the arch
    cx.lineTo(5.5, 5);
    // Middle large arch:
    cx.arcTo(5.6, 2.95, 7, 2.5, 1.6 + 0.5);
    cx.arcTo(8.4, 2.95, 8.5, 5, 1.6 + 0.5);
    cx.lineTo(8.5, 5); // finish the arch
    cx.lineTo(9.5, 5);
    // Second small arch:
    cx.arcTo(9.6, 3.4, 10.5, 3, 1.6);
    cx.arcTo(11.4, 3.4, 11.5, 5, 1.6);
    cx.lineTo(11.5, 5); // finish the arch
    cx.lineTo(14, 5);
    cx.stroke();

    // Bridge top:
    cx.beginPath();
    cx.moveTo(3, 0);
    cx.lineTo(3, 1.5);
    cx.lineTo(11, 1.5);
    cx.lineTo(11, 0);
    cx.stroke();

    cx.font = 0.7 + 'px ' + T.fontFamily;
    cx.fillStyle = T.foreground;
    cx.fillText(this._game.name, brd.width / (brd.unit * 2) - cx.measureText(this._game.name).width / 2, 1);

    cx.restore();
  };

  GameView.prototype._renderHoles = function (cx) {
    if (!cx || !this._board) { return; }

    function renderScoreboardHoles(asShadows) {
      var fn = asShadows ? g.innerShadowCircle : g.circle, x0 = delta + r, y0 = delta + r / 2, ds = delta + r * 2;

      fn.call(g, x0, y0, r);
      fn.call(g, x0 + ds, y0, r);
      fn.call(g, x0, y0 + ds, r);
      fn.call(g, x0 + ds, y0 + ds, r);
      fn.call(g, x0 + ds / 2, y0 + 2 * ds, r);
      fn.call(g, x0 + ds / 2, y0 + 3 * ds, r);
      fn.call(g, x0 + ds / 2, y0 + 4 * ds, r);

      fn.call(g, w - x0, y0, r);
      fn.call(g, w - x0 - ds, y0, r);
      fn.call(g, w - x0, y0 + ds, r);
      fn.call(g, w - x0 - ds, y0 + ds, r);
      fn.call(g, w - x0 - ds / 2, y0 + 2 * ds, r);
      fn.call(g, w - x0 - ds / 2, y0 + 3 * ds, r);
      fn.call(g, w - x0 - ds / 2, y0 + 4 * ds, r);
    }

    var w = this._board.width, d = this._board.holeDiameter, r = d / 2, delta = this._board.holeDelta, x, y;
    g.use(cx);

    // Hole outlines:
    cx.fillStyle = T.holeLight;

    cx.translate(this._board.x, this._board.y);
    renderScoreboardHoles();

    cx.translate(0, this._board.height - this._board.width);
    for (y = delta + r; y < w; y += delta + d) { for (x = delta + r; x < w; x += delta + d) { g.circle(x, y, r); } }

    // Hole inner shadows:
    shadow(cx);
    cx.strokeStyle = T.holeDark;
    cx.lineWidth = 4;

    for (y = delta + r; y < w; y += delta + d) {
      for (x = delta + r; x < w; x += delta + d) {
        g.innerShadowCircle(x, y, r);
      }
    }

    cx.translate(0, -this._board.height + this._board.width);
    renderScoreboardHoles(true);

    g.end();
  };

  GameView.prototype._renderPawns = function (cx) {
    if (!cx || !this._board || !this._game) { return; }

    var row, col, game = this._game, size = game.size, piece,
        r = this._board.holeRadius, unit = this._board.holeDelta + this._board.holeDiameter;
    g.use(cx);

    shadow(cx);
    cx.translate(this._board.x + unit - r, this._board.y + this._board.height - this._board.width + unit - r);
    for (row = 0; row < size; row++) {
      for (col = 0; col < size; col++) {
        if (piece = game.pieceAt(col, row)) {
          cx.fillStyle = piece === Game.PIECE_LIGHT ? T.pawnLight : T.pawnDark;
          g.circle(col * unit, row * unit, r);
        }
      }
    }

    g.end();
  };

  /**
   * @constructor
   * @implements {EventListener}
   */
  function BoardEventListener(gameView) {
    if (!(this instanceof BoardEventListener)) { return new BoardEventListener(gameView); }

    /* @protected */
    this._gameView = gameView;

    /* @protected */
    this._prevCol = -1;

    /* @protected */
    this._prevRow = -1;

    /* @protected */
    this._x = -1;

    /* @protected */
    this._y = -1;
  }

  BoardEventListener.prototype.handleEvent = function (event) {
    var
      canvas = event && event.target,
      delta = this._gameView._board.holeDelta,
      unit = delta + this._gameView._board.holeDiameter,
      side = delta + this._gameView._game.size * unit,
      coords, currCol, currRow;
    if (!(canvas instanceof HTMLCanvasElement)) { return; }

    // Obtain and translate mouse coordinates to the beginning of the playable area:
    coords = Gfx.windowToElement(canvas, event);
    coords.x -= this._gameView._board.x;
    coords.y -= this._gameView._board.y + this._gameView._board.height - this._gameView._board.width;

    // Handle event only when on holes or pawns (see also http://code.google.com/p/chromium/issues/detail?id=161464):
    if (coords.x <= 0 || coords.x >= side || coords.y <= 0 || coords.y >= side || // coords off the board
        coords.x === this._x && coords.y === this._y) { return; }                 // coords haven't changed

    this._x = coords.x;
    this._y = coords.y;
    if (this._x % unit < delta || this._y % unit < delta) {                       // coords out of any hole
      typeof this._onHoleMiss === 'function' && this._onHoleMiss(event);
      this._prevCol = this._prevRow = -1;
      return;
    }

    currCol = Math.floor(coords.x / unit);
    currRow = Math.floor(coords.y / unit);
    if (currCol === this._prevCol && currRow === this._prevRow) { return; }       // same hole or pawn

    if (this._gameView._game.emptyAt(currCol, currRow)) {
      typeof this._onHole === 'function' && this._onHole(currCol, currRow, event);
    } else {
      typeof this._onPawn === 'function' && this._onPawn(currCol, currRow, event);
    }

    this._prevCol = currCol;
    this._prevRow = currRow;
  };

  /**
   * @constructor
   * @extends {BoardEventListener}
   */
  function HoleHoverListener(gameView) {
    if (!(this instanceof HoleHoverListener)) { return new HoleHoverListener(gameView); }
    BoardEventListener.call(this, gameView);
  }

  HoleHoverListener.prototype = Object.create(BoardEventListener.prototype);
  HoleHoverListener.prototype.constructor = HoleHoverListener;

  HoleHoverListener.prototype._onHole = function (currCol, currRow, event) {
    var canvas = event && event.target, cx = canvas && canvas.getContext('2d'),
        board = this._gameView._board, unit = board.holeDelta + board.holeDiameter;
    if (!(canvas instanceof HTMLCanvasElement)) { return; }

    canvas.style.cursor = 'pointer';
    console.log('ON-HOLE');

    g.use(cx);
    cx.fillStyle = this._gameView._game.currentPiece() === Game.PIECE_LIGHT ?
      T.pawnLightTransparent : T.pawnDarkTransparent;
    g.circle(currCol * unit + board.x + unit - board.holeRadius,
             currRow * unit + board.y + board.height - board.width + unit - board.holeRadius, board.holeRadius);
    g.end();
  };

  HoleHoverListener.prototype._onHoleMiss = function (event) {
    var canvas = event && event.target, cx = canvas && canvas.getContext('2d'),
        board = this._gameView._board, unit = board.holeDelta + board.holeDiameter;
    if (!(canvas instanceof HTMLCanvasElement) || (this._prevCol === -1 && this._prevRow === -1)) { return; }

    canvas.style.cursor = 'default';
    console.log('ON-HOLE-MISS');

    cx.clearRect(this._prevCol * unit + board.x + unit - board.holeDiameter - 1,
                 this._prevRow * unit + board.y + board.height - board.width + unit - board.holeDiameter - 1,
                 board.holeDiameter + 2, board.holeDiameter + 2);
  };

  return GameView;
});
