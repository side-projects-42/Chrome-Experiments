/**
 * @license Copyright (c) 2014 Polacks
 * For licensing, see LICENSE
 */

"use strict";

/* global describe: false, it: false */

var assert = require("chai").assert,
    ArrayIterator = require(global.paths.root + "/polacks-shim-es6/ArrayIterator");

describe("polacks-shim-es6/ArrayIterator", function() {
    var arr = new ArrayIterator([1, 2, 3]),
        entry;

    it("iterates over array", function() {
        entry = arr.next();
        assert.strictEqual(false, entry.done);
        assert.strictEqual(1, entry.value);

        entry = arr.next();
        assert.strictEqual(false, entry.done);
        assert.strictEqual(2, entry.value);

        entry = arr.next();
        assert.strictEqual(false, entry.done);
        assert.strictEqual(3, entry.value);

        entry = arr.next();
        assert.strictEqual(true, entry.done);
        assert.strictEqual(undefined, entry.value);
    });

    it("after finishing it is always consequently done", function() {
        entry = arr.next();
        assert.strictEqual(true, entry.done);
        assert.strictEqual(undefined, entry.value);
    });
});
