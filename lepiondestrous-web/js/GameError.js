define(function () {
  'use strict';

  /**
   * @author Octavian Theodor NITA (http://github.com/octavian-nita)
   * @version 1.0, Aug 24, 2015
   *
   * @constructor
   * @augments Error
   * @param {string} [message]
   *
   * @see http://www.2ality.com/2011/07/js-properties.html
   * @see http://www.2ality.com/2011/12/subtyping-builtins.html
   * @see http://www.2ality.com/2012/10/javascript-properties.html
   * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.11.1
   * @see http://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
   * @see http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
   */
  function GameError(message) {
    if (!(this instanceof GameError)) { return new GameError(message); }

    var error = new Error(message); // capture a stack trace
    error.name = 'GameError';       // might get used in the stack trace computation

    /** @override */
    this.stack = error.stack;       // save the stack trace as a property

    /** @override */
    this.message = message;
  }

  GameError.prototype = Object.create(Error.prototype);

  GameError.prototype.constructor = GameError;

  GameError.prototype.name = 'GameError';

  return GameError;
});
