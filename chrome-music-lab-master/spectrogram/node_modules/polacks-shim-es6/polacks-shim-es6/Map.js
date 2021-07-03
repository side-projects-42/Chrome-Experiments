/**
 * @license Copyright (c) 2013 Cheng Lou (github.com/chenglou)
 * @license Copyright (c) 2014 Polacks
 * For licensing, see LICENSE
 */

"use strict";

var path = require("path"),
    ArrayIterator = require(path.join(__dirname, "/ArrayIterator")),
    MySymbol = require(path.join(__dirname, "/Symbol")),
    keysSymbol = MySymbol("keys"),
    valuesSymbol = MySymbol("values"),
    ZipArrayIterator = require(path.join(__dirname, "/ZipArrayIterator"));

/**
 * @constructor
 * @param {Array} [arr] initial key-value set
 */
function MyMap(arr) {
    if (!(this instanceof MyMap)) {
        throw new TypeError("Map is a constructor.");
    }

    this[keysSymbol] = [];
    this[valuesSymbol] = [];

    if (!arr) {
        return;
    }

    arr.forEach(function(item) {
        this.set(item[0], item[1]);
    }, this);
}

MyMap.prototype = {
    /**
     * @returns {Number} map length is always "1" (by spec)
     */
    get "length"() {
        return 1;
    },

    /**
     * @returns {Number} number of map elements
     */
    get "size"() {
        return this[valuesSymbol].length;
    }
};

/**
 * Removes all map elements.
 *
 * @returns {void}
 */
MyMap.prototype.clear = function() {
    this[keysSymbol] = [];
    this[valuesSymbol] = [];
};

/**
 * @param {*} key map object key to be removed
 * @returns {Boolean} true if removal was successful, false otherwise
 */
MyMap.prototype.delete = function(key) {
    var index = this[keysSymbol].indexOf(key);

    if (-1 === index) {
        throw new Error("No such key: " + key);
    }

    this[keysSymbol].splice(index, 1);
    this[valuesSymbol].splice(index, 1);

    return true;
};

/**
 * @returns {es6/ZipArrayIterator} iterator combining keys and values
 */
MyMap.prototype.entries = function() {
    return new ZipArrayIterator(this[keysSymbol], this[valuesSymbol]);
};

/**
 * @param {Function} cb function to be called at each map element
 * @param {*} [thisArg] optional "this" argument for cb
 * @returns {void}
 */
MyMap.prototype.forEach = function(cb, thisArg) {
    this[valuesSymbol].forEach(function(item, index) {
        cb.call(thisArg, item, this[keysSymbol][index], this);
    }, this);
};

/**
 * @param {*} key map key can have any value
 * @returns {*} element under given key
 */
MyMap.prototype.get = function(key) {
    return this[valuesSymbol][this[keysSymbol].indexOf(key)];
};

/**
 * @param {*} key map key can have any value
 * @returns {Boolean} true if map has given key, false otherwise
 */
MyMap.prototype.has = function(key) {
    return -1 !== this[keysSymbol].indexOf(key);
};

/**
 * @returns {es6/ArrayIterator} object iterating over map keys
 */
MyMap.prototype.keys = function() {
    return new ArrayIterator(this[keysSymbol]);
};

/**
 * @param {*} key map key can have any value
 * @param {*} value any value assigned to given key
 * @returns {void}
 */
MyMap.prototype.set = function(key, value) {
    var index = this[keysSymbol].indexOf(key);

    if (-1 === index) {
        this[keysSymbol].push(key);
        this[valuesSymbol].push(value);
    } else {
        this[valuesSymbol][index] = value;
    }
};

/**
 * @returns {es6/ArrayIterator} object iterating over map values
 */
MyMap.prototype.values = function() {
    return new ArrayIterator(this[valuesSymbol]);
};

module.exports = MyMap;
