define(function () {
  'use strict';

  /**
   * @author Octavian Theodor NITA (http://github.com/octavian-nita)
   * @version 1.0, August 24, 2015
   *
   * @constructor
   * @augments Error
   * @param {string} [message]
   * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.11.1
   * @see http://www.2ality.com/2011/12/subtyping-builtins.html A bit more general approach
   */
  function GameStateError(message) {
    if (!(this instanceof GameStateError)) { return new GameStateError(message); }

    var error = new Error(message);

    this.name = error.name = 'GameStateError';
    this.stack = error.stack;
    this.message = message;
  }

  GameStateError.prototype = Object.create(Error.prototype);
  GameStateError.prototype.constructor = GameStateError;

  return GameStateError;
});
