/**
 * @license Copyright (c) 2014 Polacks
 * For licensing, see LICENSE
 */

"use strict";

/**
 * @constructor
 * @param {*} value encapsulated result value
 * @param {Boolean} done true if iterator is done, false otherwise
 */
function IteratorResult(value, done) {
    this.done = done;
    this.value = value;
}

module.exports = IteratorResult;
