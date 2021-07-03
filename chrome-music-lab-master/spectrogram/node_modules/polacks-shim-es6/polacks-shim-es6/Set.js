/**
 * @license Copyright (c) 2013 Cheng Lou (github.com/chenglou)
 * @license Copyright (c) 2014 Polacks
 * For licensing, see LICENSE
 */

"use strict";

var path = require("path"),
    ArrayIterator = require(path.join(__dirname, "/ArrayIterator")),
    MySymbol = require(path.join(__dirname, "/Symbol")),
    valuesSymbol = MySymbol("values"),
    ZipArrayIterator = require(path.join(__dirname, "/ZipArrayIterator"));

/**
 * @constructor
 * @param {Array} [arr] initial key-value set
 */
function MySet(arr) {
    if (!(this instanceof MySet)) {
        throw new TypeError("Set is a constructor.");
    }

    this[valuesSymbol] = [];

    if (!arr) {
        return;
    }

    arr.forEach(function(item) {
        this.add(item);
    }, this);
}

MySet.prototype = {
    /**
     * @returns {Number} map length is always "1" (by spec)
     */
    get "length"() {
        return 1;
    },

    /**
     * @returns {Number} number of set elements
     */
    get "size"() {
        return this[valuesSymbol].length;
    }
};

/**
 * @param {*} item element to be inserted into set
 * @returns {es6/Set} chained object
 */
MySet.prototype.add = function(item) {
    if (!this.has(item)) {
        this[valuesSymbol].push(item);
    }

    return this;
};

/**
 * Removes all set elements.
 *
 * @returns {void}
 */
MySet.prototype.clear = function() {
    this[valuesSymbol] = [];
};

/**
 * @param {*} item set element to be removed
 * @returns {Boolean} true if element was successfuly removed, false otherwise
 */
MySet.prototype.delete = function(item) {
    var index = this[valuesSymbol].indexOf(item);

    if (-1 === index) {
        return false;
    }

    this[valuesSymbol].splice(index, 1);

    return true;
};

/**
 * @returns {es6/ZipArrayIterator} iterator combining set values
 * @see {es6/Map#entries}
 */
MySet.prototype.entries = function() {
    return new ZipArrayIterator(this[valuesSymbol], this[valuesSymbol]);
};

/**
 * @param {Function} cb function to be called at each set element
 * @param {*} [thisArg] optional "this" argument for cb
 * @returns {void}
 */
MySet.prototype.forEach = function(cb, thisArg) {
    this[valuesSymbol].forEach(function(item) {
        cb.call(thisArg, item, item, this);
    }, this);
};

/**
 * @param {*} item element to be checked against this set
 * @returns {Boolean} true if set has given item, false otherwise
 */
MySet.prototype.has = function(item) {
    return -1 !== this[valuesSymbol].indexOf(item);
};

/**
 * @returns {es6/ArrayIterator} object iterating over set items
 * @see {es6/Map#values}
 */
MySet.prototype.values = function() {
    return new ArrayIterator(this[valuesSymbol]);
};

/**
 * Alias for es6/Set#values
 *
 * @type {Function}
 */
MySet.prototype.keys = MySet.prototype.values;

module.exports = MySet;
