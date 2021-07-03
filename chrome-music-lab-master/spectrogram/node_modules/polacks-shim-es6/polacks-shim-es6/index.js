/**
 * @license Copyright (c) 2014 Polacks
 * For licensing, see LICENSE
 */

"use strict";

var path = require("path");

module.exports = {
    "ArrayIterator": require(path.join(__dirname, "ArrayIterator")),
    "IteratorResult": require(path.join(__dirname, "IteratorResult")),
    "Map": require(path.join(__dirname, "Map")),
    "Set": require(path.join(__dirname, "Set")),
    "Symbol": require(path.join(__dirname, "Symbol"))
};
