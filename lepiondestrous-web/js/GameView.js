define(['./gameConfig', './Game', './Gfx'], function (cfg, Game, Gfx) {
  'use strict';

  var g = new Gfx(), theme = cfg.theme;

  function shadow(context) {
    if (!context) { return; }

    var shadow = theme.shadow;
    context.shadowOffsetX = shadow.offsetX;
    context.shadowOffsetY = shadow.offsetY;
    context.shadowColor = shadow.color;
    context.shadowBlur = shadow.blur;
  }

  function createMessageLayer(zIndex, className) {
    var elem = document.createElement('div'), style = elem.style;

    style.position = 'absolute';
    style.zIndex = Number(zIndex) || 1000;

    style.top = '65%';
    style.left = '50%';
    style.transform = 'translateX(-50%)';

    style.borderRadius = '25px';
    style.padding = '0 25px';

    style.color = theme.foreground;
    style.background = 'rgba(0, 0, 0, 0.7)';
    style.textAlign = 'center';

    style.display = 'none';
    style.opacity = 0;
    style.transition =
    style['-o-transition'] =
    style['-moz-transition'] =
    style['-webkit-transition'] = 'opacity ' + (Number(cfg.toastEaseDelay) || 3000) + 'ms ease';

    if (className) { elem.className = className + ''; }
    return elem;
  }

  /**
   * Gameboard geometry (where within a parent container the gameboard is drawn, how large it is, etc.),
   * in terms of a container's dimensions. Currently the board is always laid out vertically.
   *
   * @constructor
   */
  function BoardGeometry(container) {
    if (!(this instanceof BoardGeometry)) { return new BoardGeometry(container); }
    if (!container) { return; }

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
    this.holeDelta = (this.width - this.holeDiameter * gameSize) / (gameSize + 1);

    /**
     * The space between two consecutive hole centers, stored for convenience.
     *
     * @type {number}
     */
    this.holeCenterDelta = this.holeDelta + this.holeDiameter;
  }

  BoardGeometry.prototype.relativePosition = function (event) {
    // TODO: encapsulate logic that analyzes the coordinates relative to the board geometry!

    var position = Gfx.relativePosition(event.target, event);
    if (!position) { return; }

    // Translate event coordinates to the beginning of the playable area:
    position.x -= this.x;
    position.y -= this.playAreaY;

    return position;
  };

  /** @constructor */
  function GameView(container) {
    if (!(this instanceof GameView)) { return new GameView(container); }
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
    this._board = new BoardGeometry(container);

    /**
     * A map of layer elements; since these have the z-index set already we
     * don't really care about the order in which they are stored in a map.
     *
     * @protected
     */
    this._layers = Object.create(null);
    this._layers.board = Gfx.createLayer(container, 100, 'board');
    this._layers.pawns = Gfx.createLayer(container, 101, 'pawns');
    this._layers.glass = Gfx.createLayer(container, 102, 'glass');
    this._layers.toast = createMessageLayer(200, 'toast');
    Object.freeze(this._layers);

    var i, keys, l, holeListener = new BoardEventListener(this);

    // Render the game view off-screen:
    this.render();

    // Set up event listeners:
    this._layers.glass.addEventListener('mousedown', holeListener);
    this._layers.glass.addEventListener('mousemove', holeListener);

    // Set up the parent container:
    container.innerHTML = ''; // we might have initial parent content in order to help with / force font loading, etc.
    for (i = 0, keys = Object.keys(this._layers), l = keys.length; i < l; i++) {
      container.appendChild(this._layers[keys[i]]);
    }
    container.appendChild(this._layers.toast);

    this.toast('Le ' + (this._game.currentPiece() === Game.PIECE_LIGHT ? 'blanc' : 'noir') + ' commence!', 1000);
  }

  GameView.prototype.render = function () {
    var boardContext = this._layers.board.getContext('2d');
    this._renderBoard(boardContext);
    this._renderHoles(boardContext);
    this._renderPawns(this._layers.pawns.getContext('2d'));
  };

  GameView.prototype._renderBoard = function (cx) {
    if (!cx || !this._board) { return; }
    cx.canvas.style.background = theme.boardLight;

    cx.save();

    shadow(cx);

    cx.fillStyle = theme.boardDark;
    cx.fillRect(this._board.x, this._board.y, this._board.width, this._board.height);

    cx.translate(this._board.x, this._board.y);    // move the origin to the board top left corner
    cx.scale(this._board.unit, this._board.unit);  // draw the board decorations in terms of units

    cx.strokeStyle = theme.foreground;
    cx.lineWidth = Gfx.canvasOversample / this._board.unit;  // the canvas is oversampled and the board is scaled

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

    cx.font = 0.8 + 'px ' + theme.fontFamily;
    cx.textAlign = 'center';
    cx.fillStyle = theme.foreground;
    cx.fillText('  ' + this._game.name + '  ', this._board.width / (this._board.unit * 2), 1);

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
    cx.fillStyle = theme.holeLight;

    cx.translate(this._board.x, this._board.y);
    renderScoreboardHoles();

    cx.translate(0, this._board.height - this._board.width);
    for (y = delta + r; y < w; y += delta + d) { for (x = delta + r; x < w; x += delta + d) { g.circle(x, y, r); } }

    // Hole inner shadows:
    shadow(cx);
    cx.strokeStyle = theme.holeDark;
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

    var game = this._game, size = game.size, r = this._board.holeRadius,
        centerDelta = this._board.holeCenterDelta, row, col, piece;
    g.use(cx);

    shadow(cx);
    cx.translate(this._board.x + this._board.holeDelta + r,
                 this._board.y + this._board.holeDelta + r + this._board.height - this._board.width);
    for (row = 0; row < size; row++) {
      for (col = 0; col < size; col++) {
        if (piece = game.pieceAt(col, row)) {
          cx.fillStyle = piece === Game.PIECE_LIGHT ? theme.pawnLight : theme.pawnDark;
          g.circle(col * centerDelta, row * centerDelta, r);
        }
      }
    }

    g.end();
  };

  GameView.prototype.toast = function (message, delay) {
    var elem = this._layers.toast, style = elem.style;

    if (window.getComputedStyle(elem).display != 'none') {
      elem.innerHTML += '<p>' + message + '</p>';
    } else {
      elem.innerHTML = '<p>' + message + '</p>';

      style.display = 'block';
      style.opacity = 1;
      setTimeout(function () {
        style.opacity = 0;
        setTimeout(function () {
          style.display = 'none';
        }, Number(cfg.toastEaseDelay) || 3000);
      }, Number(delay) || Number(cfg.toastDelay) || 750);
    }
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
  }

  BoardEventListener.prototype.handleEvent = function (event) {
    var board = this._gameView._board, currCol, currRow, currXY;

    // Obtain and translate event coordinates to the beginning of the playable area:
    currXY = Gfx.relativePosition(event.target, event);
    if (!currXY) { return; }
    currXY.x -= board.x;
    currXY.y -= board.playAreaY;

    // Handle the event only on the playable area (see also http://code.google.com/p/chromium/issues/detail?id=161464)
    if (currXY.x <= 0 || currXY.x >= board.width ||
        currXY.y <= 0 || currXY.y >= board.width) { return; }

    // Handle the event only on holes or pawns:
    if (currXY.x % board.holeCenterDelta < board.holeDelta ||
        currXY.y % board.holeCenterDelta < board.holeDelta) {
      typeof this._onHoleMiss === 'function' && this._onHoleMiss(event);
      this._prevCol = this._prevRow = -1;
      return;
    }

    // Handle anew the event only when moving to different holes / pawns:
    currCol = Math.floor(currXY.x / board.holeCenterDelta);
    currRow = Math.floor(currXY.y / board.holeCenterDelta);
    if (currCol === this._prevCol && currRow === this._prevRow && event.type === 'mousemove') { return; }

    if (this._gameView._game.emptyAt(currCol, currRow)) {
      typeof this._onHole === 'function' && this._onHole(currCol, currRow, event);
      this._prevCol = currCol;
      this._prevRow = currRow;
    }

    event.stopPropagation();
  };

  BoardEventListener.prototype._onHole = function (currCol, currRow, event) {
    var game = this._gameView._game, board = this._gameView._board, canvas = event && event.target, cx;
    if (!(canvas instanceof HTMLCanvasElement)) { return; }

    canvas.style.cursor = 'pointer';
    g.use(cx = canvas.getContext('2d'));

    if (event.type === 'mousedown') {

      game.play(currCol, currRow);

      cx.fillStyle = game.pieceAt(currCol, currRow) === Game.PIECE_LIGHT ? theme.pawnLight : theme.pawnDark;
      shadow(cx);

    } else {

      cx.fillStyle =
      game.currentPiece() === Game.PIECE_LIGHT ? theme.pawnLightTransparent : theme.pawnDarkTransparent;
      if (this._prevCol !== -1 && this._prevRow !== -1 && game.emptyAt(this._prevCol, this._prevRow)) {
        cx.clearRect(this._prevCol * board.holeCenterDelta + board.x + board.holeDelta - 1,
                     this._prevRow * board.holeCenterDelta + board.playAreaY + board.holeDelta - 1,
                     board.holeDiameter + 2, board.holeDiameter + 2);
      }

    }

    g.circle(currCol * board.holeCenterDelta + board.x + board.holeDelta + board.holeRadius,
             currRow * board.holeCenterDelta + board.playAreaY + board.holeDelta + board.holeRadius,
             board.holeRadius).end();
  };

  BoardEventListener.prototype._onHoleMiss = function (event) {
    var board = this._gameView._board, canvas = event && event.target;
    if (!(canvas instanceof HTMLCanvasElement)) { return; }

    canvas.style.cursor = 'default';
    if (this._prevCol !== -1 && this._prevRow !== -1 && this._gameView._game.emptyAt(this._prevCol, this._prevRow)) {
      canvas.getContext('2d').clearRect(this._prevCol * board.holeCenterDelta + board.x + board.holeDelta - 1,
                                        this._prevRow * board.holeCenterDelta + board.playAreaY + board.holeDelta - 1,
                                        board.holeDiameter + 2, board.holeDiameter + 2);
    }
  };

  return GameView;
});
