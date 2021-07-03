/**
 * @license Copyright (c) 2013 Cheng Lou (github.com/chenglou)
 * @license Copyright (c) 2014 Polacks
 * For licensing, see LICENSE
 */

"use strict";

/* global describe: false, it: false */

var assert = require("chai").assert,
    MySymbol = require(global.paths.root + "/polacks-shim-es6/Symbol");

describe("polacks-shim-es6/Symbol", function() {
    it("creates symbol shim", function() {
        var o = {},
            symbol = MySymbol();

        o[symbol] = 5;

        assert.lengthOf(Object.keys(o), 0);
        assert.strictEqual(o[symbol], 5);
    });

    describe(".isSymbol", function() {
        it("is able to check symbol type", function() {
            assert.ok(MySymbol.isSymbol(MySymbol()));
        });
    });

    if (global.Symbol) {
        it("uses global symbol when available", function() {
            assert.strictEqual(global.Symbol, MySymbol);
        });
    }
});
