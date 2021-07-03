/**
 * @license Copyright (c) 2014 Polacks
 * For licensing, see LICENSE
 */

"use strict";

/* global describe: false, it: false */

var assert = require("chai").assert,
    shim = require(global.paths.root + "/polacks-shim-es6");

describe("polacks-shim-es6", function() {
    it("exports modules correctly", function() {
        assert.isFunction(shim.ArrayIterator);
        assert.isFunction(shim.IteratorResult);
        assert.isFunction(shim.Map);
        assert.isFunction(shim.Set);
        assert.isFunction(shim.Symbol);
    });
});
