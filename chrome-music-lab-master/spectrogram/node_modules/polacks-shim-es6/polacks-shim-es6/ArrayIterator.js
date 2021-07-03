/**
 * @license Copyright (c) 2014 Polacks
 * For licensing, see LICENSE
 */

"use strict";

var path = require("path"),
    IteratorResult = require(path.join(__dirname, "/IteratorResult")),
    MySymbol = require(path.join(__dirname, "/Symbol")),
    iteratedObjectSymbol = MySymbol("[[IteratedObject]]"),
    nextIndexSymbol = MySymbol("[[ArrayIteratorNextIndex]]");

/**
 * @constructor
 * @param {Array} arr array object to be iterated over
 */
function ArrayIterator(arr) {
    this[iteratedObjectSymbol] = arr;
    this[nextIndexSymbol] = 0;
}

/**
 * @returns {es6/IteratorResult} summary of following array element
 */
ArrayIterator.prototype.next = function() {
    var ret;

    if (this[nextIndexSymbol] >= this[iteratedObjectSymbol].length) {
        return new IteratorResult(undefined, true);
    }

    ret = new IteratorResult(this[iteratedObjectSymbol][this[nextIndexSymbol]], false);
    this[nextIndexSymbol] += 1;

    return ret;
};

module.exports = ArrayIterator;
