define(['./gfx', './game', './gameTheme'], function (Gfx, Game, T) {
  'use strict';

  var
    O = { // Game view default options
      board: {
        maxHeight: 695,
        maxWidth: 504
      }
    },

    g = new Gfx();

  /** @constructor */
  function GameView(container, options) {
    if (!(this instanceof GameView)) { return new GameView(container, options); }
    if (!container) { return; }

    Object.defineProperty(this, 'game', { value: new Game() });

    /**
     * Gameboard geometry (i.e. where the gameboard gets drawn, how large it is, etc.), in terms of container dimensions.
     *
     * @type {{x: number, y: number, width: number, height: number, unit: number,
     *         holeDiameter: number, holeDelta: number}}
     */
    Object.defineProperty(this, 'board', { value: {} });

    var o = Object.create(O), i, keys, l, boardRatio, layers;
    if (options) {
      for (i = 0, keys = Object.keys(options), l = keys.length; i < l; i++) { o[keys[i]] = options[keys[i]]; }
    }

    // Set up the board geometry (always vertical, http://www.frontcoded.com/javascript-fit-rectange-into-bounds.html):
    boardRatio = this.game.size / (this.game.size + 5);
    if (boardRatio > container.offsetWidth / container.offsetHeight) {
      this.board.width = Math.min(container.offsetWidth, o.board.maxWidth);
      this.board.height = this.board.width / boardRatio;
    } else {
      this.board.height = Math.min(container.offsetHeight, o.board.maxHeight);
      this.board.width = this.board.height * boardRatio;
    }
    this.board.x = (container.offsetWidth - this.board.width ) / 2;
    this.board.y = (container.offsetHeight - this.board.height) / 2;
    this.board.unit = this.board.height * boardRatio / this.game.size;
    this.board.holeDiameter = this.board.unit * 1.5 / 3;
    this.board.holeDelta = (this.board.width - this.board.holeDiameter * this.game.size) / (this.game.size + 1);

    this.render(layers = [Gfx.createLayer(container), Gfx.createLayer(container, 1), Gfx.createLayer(container, 2)]);

    container.innerHTML = ''; // empty container content
    for (i = 0, l = layers.length; i < l; i++) { container.appendChild(layers[i]); }
  }

  GameView.prototype.render = function (layers) {
    var cx0 = layers[0].getContext('2d');
    this._renderBoard(cx0);
    this._renderHoles(cx0);
    this._renderPawns(layers[1].getContext('2d'));
  };

  GameView.prototype._renderBoard = function (cx) {
    if (!cx || !this.board) { return; }
    cx.canvas.style.background = T.boardLight;

    var brd = this.board;
    cx.save();

    cx.shadowOffsetX = T.dropShadow.offsetX;
    cx.shadowOffsetY = T.dropShadow.offsetY;
    cx.shadowColor = T.dropShadow.color;
    cx.shadowBlur = T.dropShadow.blur;

    cx.fillStyle = T.boardDark;
    cx.fillRect(brd.x, brd.y, brd.width, brd.height);

    cx.translate(brd.x, brd.y);    // move the origin to the board top left corner
    cx.scale(brd.unit, brd.unit);  // draw the board decorations in terms of units

    cx.shadowBlur /= brd.unit / 5; // stronger shadow
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
    cx.fillText(this.game.name, brd.width / (brd.unit * 2) - cx.measureText(this.game.name).width / 2, 1);

    cx.restore();
  };

  GameView.prototype._renderHoles = function (cx) {
    if (!cx || !this.board) { return; }

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

    var w = this.board.width, d = this.board.holeDiameter, r = d / 2, dt = this.board.holeDelta, x, y;
    g.use(cx);

    // Hole outlines:
    cx.fillStyle = T.holeLight;

    cx.translate(this.board.x, this.board.y);
    renderScoreboardHoles();

    cx.translate(0, this.board.height - this.board.width);
    for (y = dt + r; y < w; y += dt + d) { for (x = dt + r; x < w; x += dt + d) { g.circle(x, y, r); } }

    // Hole inner shadows:
    cx.shadowOffsetX = T.dropShadow.offsetX;
    cx.shadowOffsetY = T.dropShadow.offsetY;
    cx.shadowColor = T.dropShadow.color;
    cx.shadowBlur = T.dropShadow.blur;
    cx.strokeStyle = T.holeDark;
    cx.lineWidth = 4;

    for (y = dt + r; y < w; y += dt + d) { for (x = dt + r; x < w; x += dt + d) { g.innerShadowCircle(x, y, r); } }

    cx.translate(0, -this.board.height + this.board.width);
    renderScoreboardHoles(true);

    g.end();
  };

  GameView.prototype._renderPawns = function (cx) {
    if (!cx || !this.board || !this.game) { return; }

    this.game.play(3, 3);
    /*this.game.play(3, 4);
     this.game.play(4, 4);
     this.game.play(5, 5);*/

    var i, j, brd = this.board, r = brd.holeDiameter / 2, game = this.game, size = game.size;
    g.use(cx);

    /*cx.shadowOffsetX = T.dropShadow.offsetX;
     cx.shadowOffsetY = T.dropShadow.offsetY;
     cx.shadowColor = T.dropShadow.color;
     //cx.shadowBlur = T.dropShadow.blur;
     cx.shadowBlur /= this.board.unit / 5; // stronger shadow*/

    cx.translate(brd.x + brd.holeDelta, brd.y + brd.height - brd.width + brd.holeDelta);

    for (i = 0; i < size; i++) {
      for (j = 0; j < size; j++) {
        if (!game.board.empty(i, j)) {
          g.circle(i, j, r);
        }
      }
    }

    g.end();
  };

  return GameView;
});
