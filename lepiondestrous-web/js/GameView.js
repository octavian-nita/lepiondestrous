define(
  ['Game',
   'GameError',
   'BoardGeometry',
   'Toast',
   'Gfx',
   'config',
   'util',
   'lib/require.i18n!nls/t'],

  function (Game, GameError, BoardGeometry, Toast, Gfx, config, util, t) {
    'use strict';

    var g = new Gfx(), theme = config.theme;

    function shadow(context) {
      if (!context) { return; }

      var sh = theme.shadow;
      context.shadowOffsetX = sh.offsetX;
      context.shadowOffsetY = sh.offsetY;
      context.shadowColor = sh.color;
      context.shadowBlur = sh.blur;
    }

    /** @constructor */
    function GameView(container) {
      if (!(this instanceof GameView)) { return new GameView(container); }

      this._container = container;

      this._game = new Game();                     // game model / logic

      this._board = new BoardGeometry(container);  // gameboard geometry

      this._layers = Object.create(null);          // map of layer elements
      this._layers.board = Gfx.createCanvas('board', 10, container);
      this._layers.pawns = Gfx.createCanvas('pawns', 20, container);
      this._layers.glass = Gfx.createCanvas('glass', 30, container);

      this._toast = new Toast();                   // toast notification

      // Render the game view off-screen:
      this.render();

      // Set up event listeners:
      var holeListener = new BoardEventListener(this);
      this._layers.glass.addEventListener('mousedown', holeListener);
      this._layers.glass.addEventListener('mousemove', holeListener);
    }

    GameView.prototype.show = function () {
      var container = this._container, layers = this._layers, layer;

      // Clear the parent container (we might have initial parent content in order to force font loading, etc.):
      container.innerHTML = '';

      // Add the various layers:
      for (layer in layers) { container.appendChild(layers[layer]); }
      container.appendChild(this._toast.element);

      var tt = this._toast;
      setTimeout(function () {
        tt.show("Test!");
      }, 300);

      /*setTimeout(function () {
        tt.show();
      }, 600);*/

      if (!this._game.started()) {
        this._toast.show(t[this._game.currentPiece() === Game.PLAYER_LIGHT ? 'LIGHT_PLAYS' : 'DARK_PLAYS']);
      }
    };

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
      cx.lineWidth = Gfx.canvasOversampling / this._board.unit;  // the canvas is oversampled and the board is scaled

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

      var game        = this._game, size = game.size, r = this._board.holeRadius,
          centerDelta = this._board.holeCenterDelta, row, col, piece;
      g.use(cx);

      shadow(cx);
      cx.translate(this._board.x + this._board.holeDelta + r,
                   this._board.y + this._board.holeDelta + r + this._board.height - this._board.width);
      for (row = 0; row < size; row++) {
        for (col = 0; col < size; col++) {
          if (piece = game.pieceAt(col, row)) {
            cx.fillStyle = piece === Game.PLAYER_LIGHT ? theme.pawnLight : theme.pawnDark;
            g.circle(col * centerDelta, row * centerDelta, r);
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
    }

    BoardEventListener.prototype.handleEvent = function (event) {
      var board = this._gameView._board, currCol, currRow, currXY;

      event.stopPropagation();

      // Obtain and translate event coordinates to the beginning of the playable area:
      currXY = util.positionInElement(event.target, event);
      if (!currXY) { return; }
      currXY.x -= board.x;
      currXY.y -= board.playAreaY;

      // Handle the event only on the playable area (see also http://code.google.com/p/chromium/issues/detail?id=161464)
      if (currXY.x <= 0 || currXY.x >= board.width ||
          currXY.y <= 0 || currXY.y >= board.width) { return; }

      // Handle the event only on holes or pawns:
      if (currXY.x % board.holeCenterDelta < board.holeDelta ||
          currXY.y % board.holeCenterDelta < board.holeDelta) {
        if (typeof this._onHoleMiss === 'function') {
          this._onHoleMiss(event);
        }
        this._prevCol = this._prevRow = -1;
        return;
      }

      // Handle anew the event only when moving to different holes / pawns:
      currCol = Math.floor(currXY.x / board.holeCenterDelta);
      currRow = Math.floor(currXY.y / board.holeCenterDelta);
      if (currCol === this._prevCol && currRow === this._prevRow && event.type === 'mousemove') { return; }

      if (this._gameView._game.emptyAt(currCol, currRow)) {
        if (typeof this._onHole === 'function') {
          this._onHole(currCol, currRow, event);
        }
        this._prevCol = currCol;
        this._prevRow = currRow;
      }
    };

    BoardEventListener.prototype._onHole = function (currCol, currRow, event) {
      var game = this._gameView._game, board = this._gameView._board, canvas = event && event.target, cx;
      if (!(canvas instanceof HTMLCanvasElement)) { return; }

      canvas.style.cursor = 'pointer';
      g.use(cx = canvas.getContext('2d'));

      if (event.type === 'mousedown') {

        try {
          game.play(currCol, currRow);
        } catch (error) {

          if (error instanceof GameError) {
            this._gameView._toast.show(t[error.message]);
            return;
          }

          throw error;
        }

        cx.fillStyle = game.pieceAt(currCol, currRow) === Game.PLAYER_LIGHT ? theme.pawnLight : theme.pawnDark;
        shadow(cx);

      } else {

        cx.fillStyle =
          game.currentPiece() === Game.PLAYER_LIGHT ? theme.pawnLightTransparent : theme.pawnDarkTransparent;
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
      if (this._prevCol !== -1 && this._prevRow !== -1 &&
          this._gameView._game.emptyAt(this._prevCol, this._prevRow)) {
        canvas.getContext('2d').clearRect(this._prevCol * board.holeCenterDelta + board.x + board.holeDelta - 1,
                                          this._prevRow * board.holeCenterDelta + board.playAreaY + board.holeDelta -
                                          1,
                                          board.holeDiameter + 2, board.holeDiameter + 2);
      }
    };

    return GameView;
  });
