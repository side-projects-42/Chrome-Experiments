/**
 * @license Copyright (c) 2014 Polacks
 * For licensing, see LICENSE
 */

"use strict";

var path = require("path"),
    IteratorResult = require(path.join(__dirname, "/IteratorResult")),
    MySymbol = require(path.join(__dirname, "/Symbol")),
    firstIteratedObjectSymbol = MySymbol("[[FirstIteratedObject]]"),
    secondIteratedObjectSymbol = MySymbol("[[SecondIteratedObject]]"),
    nextIndexSymbol = MySymbol("[[ArrayIteratorNextIndex]]");

/**
 * @constructor
 * @param {Array} first array object to be iterated over
 * @param {Array} second array object to be iterated over
 */
function ZipArrayIterator(first, second) {
    this[firstIteratedObjectSymbol] = first;
    this[secondIteratedObjectSymbol] = second;
    this[nextIndexSymbol] = 0;
}

/**
 * @returns {es6/IteratorResult} summary of following array element
 */
ZipArrayIterator.prototype.next = function() {
    var firstValue,
        ret,
        secondValue;

    if (this[nextIndexSymbol] >= this[firstIteratedObjectSymbol].length) {
        return new IteratorResult([undefined, undefined], true);
    }

    firstValue = this[firstIteratedObjectSymbol][this[nextIndexSymbol]];
    secondValue = this[secondIteratedObjectSymbol][this[nextIndexSymbol]];

    ret = new IteratorResult([firstValue, secondValue], false);
    this[nextIndexSymbol] += 1;

    return ret;
};

module.exports = ZipArrayIterator;
