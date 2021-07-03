/**
 * @license Copyright (c) 2013 Cheng Lou (github.com/chenglou)
 * @license Copyright (c) 2014 Polacks
 * For licensing, see LICENSE
 */

"use strict";

/* global describe: false, it: false */

var assert = require("chai").assert,
    MyMap = require(global.paths.root + "/polacks-shim-es6/Map");
// sinon = require("sinon");

describe("polacks-shim-es6/Map", function() {
    var fixtureObjectA,
        fixtureObjectB;

    /**
     * @access private
     * @returns {String} always returns the same string
     */
    function fixtureFunction() {
        return "hello";
    }

    fixtureObjectA = {
        "a": 10
    };

    fixtureObjectB = {
        "b": 10
    };

    it("can be constructed with initial map", function() {
        var map;

        map = new MyMap([
            ["a", "b"],
            ["c", "d"]
        ]);

        assert.ok(map.has("a"));
        assert.ok(map.has("c"));
    });

    describe("#clear", function() {
        it("removes all map keys and values", function() {
            var map = new MyMap();

            map.set(1, 2);
            map.set(3, 4);
            map.set(5, 6);

            assert.strictEqual(map.size, 3);

            map.clear();

            assert.strictEqual(map.size, 0);
            assert.ok(!map.has(1));
            assert.ok(!map.has(3));
            assert.ok(!map.has(5));
        });
    });

    describe("#delete", function() {
        var map = new MyMap();

        it("should throw error for deleting nonexistent keys", function() {
            assert.throws(function() {
                map.delete(5);
            });
        });

        it("shouldn't decrease the size count after fail deletes", function() {
            assert.strictEqual(map.length, 1);
            assert.strictEqual(map.size, 0);
        });

        it("should return true after deleting a valid key", function() {
            var regexp = /abc/;

            map.set(5, "number 6");
            map.set("5", "string 6");
            map.set(undefined, [3, 2]);
            map.set(null, fixtureObjectB);
            map.set(true, "okay");
            map.set(regexp, true);
            map.set(fixtureFunction, 10);
            map.delete(5);
            map.delete("5");
            map.delete(undefined);
            map.delete(null);
            map.delete(true);
            map.delete(regexp);
            map.delete(fixtureFunction);
        });
        it("should have updated the size", function() {
            assert.strictEqual(map.length, 1);
            assert.strictEqual(map.size, 0);
        });
        it("shouldn't find anything after emptying a map", function() {
            assert.ok(!map.has(5));
            assert.ok(!map.has("5"));
            assert.ok(!map.has(undefined));
            assert.ok(!map.has(null));
            assert.ok(!map.has(true));
            assert.ok(!map.has(/asd/));
            assert.ok(!map.has(fixtureFunction));
        });
        it("should keep the count correct after removing special keys", function() {
            assert.strictEqual(map.length, 1);
            assert.strictEqual(map.size, 0);
        });
    });

    describe("#entries", function() {
        it("returns map entries iterator", function() {
            var entries,
                entry,
                map = new MyMap([
                    [1, "a"],
                    [2, "b"],
                    [3, "c"]
                ]);

            entries = map.entries();

            entry = entries.next();
            assert.ok(!entry.done);
            assert.deepEqual([1, "a"], entry.value);

            entry = entries.next();
            assert.ok(!entry.done);
            assert.deepEqual([2, "b"], entry.value);

            entry = entries.next();
            assert.ok(!entry.done);
            assert.deepEqual([3, "c"], entry.value);

            entry = entries.next();
            assert.ok(entry.done);
        });
    });

    describe("#forEach", function() {
        it("iterates over every map element", function() {
            var map;

            map = new MyMap([
                [
                    "a",
                    {
                        "initialIndex": "a"
                    }
                ],
                [
                    "b",
                    {
                        "initialIndex": "b"
                    }
                ],
                [
                    "c",
                    {
                        "initialIndex": "c"
                    }
                ]
            ]);

            map.forEach(function(value, key, container) {
                assert.strictEqual(key, value.initialIndex);
                assert.strictEqual(container, map);
                value.visitedIndex = key;
            });

            assert.strictEqual(map.get("a").visitedIndex, "a");
            assert.strictEqual(map.get("b").visitedIndex, "b");
            assert.strictEqual(map.get("c").visitedIndex, "c");
        });
    });

    describe("#keys", function() {
        it("returns map keys iterator", function() {
            var keys,
                key,
                map = new MyMap([
                    [1, "a"],
                    [2, "b"],
                    [3, "c"]
                ]);

            keys = map.keys();

            key = keys.next();
            assert.ok(!key.done);
            assert.strictEqual(1, key.value);

            key = keys.next();
            assert.ok(!key.done);
            assert.strictEqual(2, key.value);

            key = keys.next();
            assert.ok(!key.done);
            assert.strictEqual(3, key.value);

            key = keys.next();
            assert.ok(key.done);
        });
    });

    describe("#set", function() {
        var arr,
            date1 = new Date(),
            date2 = new Date(),
            map = new MyMap(),
            map2 = new MyMap(),
            obj;

        arr = [
            1, 2, {
                "a": "hello"
            },
            [3, 4, 5]
        ];
        obj = {
            "a": "hi",
            "b": {},
            "c": [1, 2],
            "d": arr
        };

        it("should have an empty size initially", function() {
            assert.strictEqual(map.length, 1);
            assert.strictEqual(map.size, 0);
        });

        it("should have nothing when map's empty", function() {
            assert.ok(!map.has(5));
            assert.ok(!map.has(undefined));
            assert.ok(!map.has(null));
            assert.ok(!map.has(0));
            assert.ok(!map.has([]));
            assert.ok(!map.has(fixtureFunction));
            assert.ok(!map.has("5"));
        });

        it("should put the key and its value into the map", function() {
            map.set(5, "number 5");
            assert.ok(map.has(5));
            assert.strictEqual(map.get(5), "number 5");

            map.set("5", "string 5");
            assert.ok(map.has("5"));
            assert.strictEqual(map.get("5"), "string 5");

            map.set(undefined, [1, 2, 3]);
            assert.ok(map.has(undefined));
            assert.deepEqual(map.get(undefined), [1, 2, 3]);

            map.set(null, fixtureObjectA);
            assert.ok(map.has(null));
            assert.deepEqual(map.get(null), fixtureObjectA);

            map.set(true, "ok");
            assert.ok(map.has(true));
            assert.strictEqual(map.get(true), "ok");

            map.set(/asd/, false);
            assert.ok(!map.has(/asd/));
            assert.strictEqual(map.get(/asd/), undefined);

            map.set(fixtureFunction, 99);
            assert.ok(map.has(fixtureFunction));
            assert.strictEqual(map.get(fixtureFunction), 99);

            map.set(arr, "array");
            assert.ok(map.has(arr, "time"));
            assert.strictEqual(map.get(arr, "time"), "array");

            map.set(obj, "obj");
            assert.ok(map.has(obj, "time"));
            assert.strictEqual(map.get(obj, "time"), "obj");
        });

        it("should keep track of map size", function() {
            assert.strictEqual(map.length, 1);
            assert.strictEqual(map.size, 9);
        });

        it("should override previous value", function() {
            map.set(5, "number 6");
            map.set("5", "string 6");
            map.set(undefined, [3, 2]);
            map.set(null, fixtureObjectB);
            map.set(true, "okay");
            map.set(fixtureFunction, 10);
            assert.strictEqual(map.get(5), "number 6");
            assert.strictEqual(map.get("5"), "string 6");
            assert.deepEqual(map.get(undefined), [3, 2]);
            assert.deepEqual(map.get(null), fixtureObjectB);
            assert.strictEqual(map.get(true), "okay");
            assert.strictEqual(map.get(fixtureFunction), 10);
        });

        it("shouldn't have changed the map's size", function() {
            assert.strictEqual(map.length, 1);
            assert.strictEqual(map.size, 9);
        });

        it("should store two Date objects distinctively", function() {
            map.set(date1, "date 1");
            map.set(date2, "date 2");
            assert.strictEqual(map.get(date1), "date 1");
            assert.strictEqual(map.get(date2), "date 2");
            assert.ok(!map.has(new Date()));
            assert.ok(!map.has(new Date()));
        });

        it("should store an id on the key that's unique to each map", function() {
            assert.ok(!map2.has(date1));
            map2.set(date1, "date 1 on map 2");
            assert.strictEqual(map.get(date1), "date 1");
            assert.strictEqual(map2.get(date1), "date 1 on map 2");
        });
    });

    describe("#values", function() {
        it("returns map values iterator", function() {
            var values,
                value,
                map = new MyMap([
                    [1, "a"],
                    [2, "b"],
                    [3, "c"]
                ]);

            values = map.values();

            value = values.next();
            assert.ok(!value.done);
            assert.strictEqual("a", value.value);

            value = values.next();
            assert.ok(!value.done);
            assert.strictEqual("b", value.value);

            value = values.next();
            assert.ok(!value.done);
            assert.strictEqual("c", value.value);

            value = values.next();
            assert.ok(value.done);
        });
    });
});
