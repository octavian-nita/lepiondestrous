define(['./gfx', './game', './gameTheme'], function (Gfx, Game, T) {
  'use strict';

  var O = Object.freeze({ // Game view default options
                          board: {
                            maxHeight: 695,
                            maxWidth: 504
                          }
                        }),

      g = new Gfx();

  function shadow(cx) {
    if (!cx) { return; }
    cx.shadowOffsetX = T.dropShadow.offsetX;
    cx.shadowOffsetY = T.dropShadow.offsetY;
    cx.shadowColor = T.dropShadow.color;
    cx.shadowBlur = T.dropShadow.blur;
  }

  /** @constructor */
  function GameView(container, options) {
    if (!(this instanceof GameView)) { return new GameView(container, options); }
    if (!container) { return; }

    var opts = Object.create(O), i, keys, l, boardRatio, layers;
    if (options) { // compute view options
      for (i = 0, keys = Object.keys(options), l = keys.length; i < l; i++) { opts[keys[i]] = options[keys[i]]; }
    }

    /**
     * Game model.
     *
     * @protected
     */
    this._game = new Game();

    /**
     * Gameboard geometry (where the gameboard gets drawn, how large it is, etc.), in terms of container dimensions.
     *
     * @type {{x: number, y: number, width: number, height: number, unit: number,
     *         holeDiameter: number, holeDelta: number}}
     * @protected
     */
    this._board = {};

    // Set up the board geometry (always vertical, http://www.frontcoded.com/javascript-fit-rectange-into-bounds.html):
    boardRatio = this._game.size / (this._game.size + 5);
    if (boardRatio > container.offsetWidth / container.offsetHeight) {
      this._board.width = Math.min(container.offsetWidth, opts.board.maxWidth);
      this._board.height = this._board.width / boardRatio;
    } else {
      this._board.height = Math.min(container.offsetHeight, opts.board.maxHeight);
      this._board.width = this._board.height * boardRatio;
    }
    this._board.x = (container.offsetWidth - this._board.width ) / 2;
    this._board.y = (container.offsetHeight - this._board.height) / 2;
    this._board.unit = this._board.height * boardRatio / this._game.size;
    this._board.holeDiameter = this._board.unit * 1.5 / 3;
    this._board.holeDelta = (this._board.width - this._board.holeDiameter * this._game.size) / (this._game.size + 1);

    // Render the game view, off-screen:
    this.render(layers = [Gfx.createLayer(container), Gfx.createLayer(container, 1), Gfx.createLayer(container, 2)]);

    // Set up the parent / container element
    container.innerHTML = ''; // we might have initial parent content in order to help with / force font loading, etc.
    for (i = 0, l = layers.length; i < l; i++) { container.appendChild(layers[i]); }
  }

  GameView.prototype.render = function (layers) {
    var cx0 = layers[0].getContext('2d');
    this._renderBoard(cx0);
    this._renderHoles(cx0);
    this._renderPawns(layers[1].getContext('2d'));
    this._renderGlass(layers[2].getContext('2d'));
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
    cx.lineWidth = 2 / brd.unit;   // the canvas is oversampled and the board is scaled

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

    cx.font = 0.8 + 'px ' + T.fontFamily;
    cx.fillStyle = T.foreground;
    cx.fillText(this._game.name, brd.width / (brd.unit * 2) - cx.measureText(this._game.name).width / 2, 1);

    cx.restore();
  };

  GameView.prototype._renderHoles = function (cx) {
    if (!cx || !this._board) { return; }

    function renderScoreboardHoles(asShadows) {
      var fn = asShadows ? g.innerShadowCircle : g.circle, x0 = dt + r, y0 = dt + r / 2, ds = dt + r * 2;

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

    var w = this._board.width, d = this._board.holeDiameter, r = d / 2, dt = this._board.holeDelta, x, y;
    g.use(cx);

    // Hole outlines:
    cx.fillStyle = T.holeLight;

    cx.translate(this._board.x, this._board.y);
    renderScoreboardHoles();

    cx.translate(0, this._board.height - this._board.width);
    for (y = dt + r; y < w; y += dt + d) { for (x = dt + r; x < w; x += dt + d) { g.circle(x, y, r); } }

    // Hole inner shadows:
    shadow(cx);
    cx.strokeStyle = T.holeDark;
    cx.lineWidth = 4;

    for (y = dt + r; y < w; y += dt + d) { for (x = dt + r; x < w; x += dt + d) { g.innerShadowCircle(x, y, r); } }

    cx.translate(0, -this._board.height + this._board.width);
    renderScoreboardHoles(true);

    g.end();
  };

  GameView.prototype._renderPawns = function (cx) {
    if (!cx || !this._board || !this._game) { return; }

    var row, col, game = this._game, size = game.size, piece,
        rad = this._board.holeDiameter / 2, dta = this._board.holeDiameter + this._board.holeDelta;
    g.use(cx);

    shadow(cx);
    cx.translate(this._board.x + dta - rad, this._board.y + this._board.height - this._board.width + dta - rad);
    for (row = 0; row < size; row++) {
      for (col = 0; col < size; col++) {
        piece = game.pieceAt(col, row);
        if (piece) {
          cx.fillStyle = piece === Game.PIECE_LIGHT ? T.pawnLight : T.pawnDark;
          g.circle((col - 1) * dta, (row - 1) * dta, rad);
        }
      }
    }

    g.end();
  };

  GameView.prototype._renderGlass = function (cx) {
    if (!cx || !this._board || !this._game) { return; }

    g.use(cx);

    // TODO: clear all previously attached events
    cx.canvas.addEventListener('mousemove', new HoleEventListener(), true);

    g.end();
  };

  function HoleEventListener() {
    if (!(this instanceof HoleEventListener)) { return new HoleEventListener(); }

    /* @protected */
    this._lastCol = -1;

    /* @protected */
    this._lastRow = -1;
  }

  HoleEventListener.prototype.handleEvent = function (event) {
    if (!(event instanceof MouseEvent)) { return; }

    console.log('Mouse event!');
  };

  return GameView;
});
