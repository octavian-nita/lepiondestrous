define(function () {
  'use strict';

  /**
   * @author Octavian Theodor NITA (http://github.com/octavian-nita)
   * @version 1.0, August 24, 2015
   *
   * @constructor
   * @augments Error
   * @param {string} [message]
   * @see http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
   * @see http://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
   * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.11.1
   * @see http://www.2ality.com/2011/12/subtyping-builtins.html
   */
  function GameStateError(message) {
    if (!(this instanceof GameStateError)) { return new GameStateError(message); }

    var error = new Error(message); // capture a stack trace
    error.name = 'GameStateError';  // might get used in the stack trace computation

    /** @override */
    Object.defineProperty(this, 'stack', {
      configurable: true,
      writable: true,
      value: error.stack
    });

    /** @override */
    Object.defineProperty(this, 'message', {
      configurable: true,
      writable: true,
      value: message
    });
  }

  Object.defineProperty(GameStateError, 'prototype', {
    value: Object.create(Error.prototype)
  });

  Object.defineProperty(GameStateError.prototype, 'constructor', {
    configurable: true,
    value: GameStateError,
    writable: true
  });

  Object.defineProperty(GameStateError.prototype, 'name', {
    configurable: true,
    value: 'GameStateError',
    writable: true
  });

  return GameStateError;
});
