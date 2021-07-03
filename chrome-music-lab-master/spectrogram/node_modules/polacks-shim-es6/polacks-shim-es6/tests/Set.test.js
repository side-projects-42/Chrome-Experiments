/**
 * @license Copyright (c) 2013 Cheng Lou (github.com/chenglou)
 * @license Copyright (c) 2014 Polacks
 * For licensing, see LICENSE
 */

"use strict";

/* global describe: false, it: false */

var assert = require("chai").assert,
    MySet = require(global.paths.root + "/polacks-shim-es6/Set");
// sinon = require("sinon");

describe("polacks-shim-es6/Set", function() {
    it("creates set with initial collection", function() {
        var item1 = "test1",
            item2 = "test2",
            item3 = "test3",
            set = new MySet([item1, item2, item3]);

        assert.equal(1, set.length);
        assert.equal(3, set.size);

        assert.ok(set.has(item1));
        assert.ok(set.has(item2));
        assert.ok(set.has(item3));
    });

    describe("#add", function() {
        it("adds item", function() {
            var item = "test item",
                set = new MySet();

            assert.equal(1, set.length);
            assert.equal(0, set.size);

            set.add(item);

            assert.equal(1, set.length);
            assert.equal(1, set.size);
        });

        it("does not add same item more than once", function() {
            var set = new MySet();

            set.add(5);
            set.add(5);

            assert.strictEqual(1, set.length);
            assert.strictEqual(1, set.size);
        });
    });

    describe("#clear", function() {
        it("removes all set items", function() {
            var set = new MySet();

            set.add(1);
            set.add(2);
            set.add(3);

            assert.equal(1, set.length);
            assert.equal(3, set.size);

            set.clear();

            assert.equal(1, set.length);
            assert.equal(0, set.size);

            assert.ok(!set.has(1));
            assert.ok(!set.has(2));
            assert.ok(!set.has(3));
        });
    });

    // describe("#flush", function() {
    //     it("removes every item from set and calls callback everytime", function() {
    //         var set = new MySet([1, 2, 3, 4]),
    //             spy = sinon.spy();

    //         assert.strictEqual(4, set.size);

    //         set.flush(spy);

    //         assert.strictEqual(4, spy.callCount);

    //         assert.deepEqual([1], spy.firstCall.args);
    //         assert.deepEqual([2], spy.secondCall.args);
    //         assert.deepEqual([3], spy.thirdCall.args);
    //         assert.deepEqual([4], spy.lastCall.args);

    //         assert.strictEqual(0, set.size);
    //     });
    // });

    describe("#delete", function() {
        it("does not delete item that is not a part of set", function() {
            var item = "test item",
                set = new MySet();

            assert.strictEqual(false, set.delete(item));
        });

        it("removes item", function() {
            var item = "test item",
                set = new MySet();

            assert.equal(1, set.length);
            assert.equal(0, set.size);

            set.add(item);

            assert.equal(1, set.length);
            assert.equal(1, set.size);

            set.delete(item);

            assert.equal(1, set.length);
            assert.equal(0, set.size);
        });
    });

    describe("#entries", function() {
        it("returns set entries iterator", function() {
            var entries,
                entry,
                set = new MySet([1, 2, 3]);

            entries = set.entries();

            entry = entries.next();
            assert.ok(!entry.done);
            assert.deepEqual([1, 1], entry.value);

            entry = entries.next();
            assert.ok(!entry.done);
            assert.deepEqual([2, 2], entry.value);

            entry = entries.next();
            assert.ok(!entry.done);
            assert.deepEqual([3, 3], entry.value);

            entry = entries.next();
            assert.ok(entry.done);
        });
    });

    describe("#forEach", function() {
        it("iterates over every map element", function() {
            var input = [1, 2, 3, 4],
                result = [],
                set = new MySet(input);

            set.forEach(function(value, repeatedValue, container) {
                assert.strictEqual(value, repeatedValue);
                assert.strictEqual(container, set);

                result.push(value);
            });

            assert.deepEqual(input, result);
        });
    });

    describe("#keys", function() {
        it("is an alias for #values method", function() {
            var set = new MySet();

            assert.strictEqual(set.keys, set.values);
        });
    });

    describe("#values", function() {
        it("iterates over set values", function() {
            var value,
                values,
                set = new MySet([1, 2, 3]);

            values = set.values();

            value = values.next();
            assert.ok(!value.done);
            assert.strictEqual(1, value.value);

            value = values.next();
            assert.ok(!value.done);
            assert.strictEqual(2, value.value);

            value = values.next();
            assert.ok(!value.done);
            assert.strictEqual(3, value.value);

            value = values.next();
            assert.ok(value.done);
            assert.strictEqual(undefined, value.value);
        });
    });
});
