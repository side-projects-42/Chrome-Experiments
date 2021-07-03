/**
 * @license Copyright (c) 2014 Polacks
 * For licensing, see LICENSE
 */

"use strict";

module.exports = global.Symbol || require("symbol");
module.exports.isSymbol = function(sym) {
    if (global.Symbol) {
        return "symbol" === typeof sym;
    }

    return sym instanceof module.exports;
};
