/**
 * @license Copyright (c) 2014, Cruks
 * For licensing, see LICENSE
 */

"use strict";

var cached = require("gulp-cached"),
    esformatter = require("gulp-esformatter"),
    eslint = require("gulp-eslint"),
    fs = require("fs"),
    gulp = require("gulp"),
    istanbul = require("gulp-istanbul"),
    mocha = require("gulp-mocha");

/*eslint no-sync: 0 */

global.configs = {
    get "esformatter"() {
        return JSON.parse(fs.readFileSync(global.paths.configs.esformatter));
    },

    get "eslintrc"() {
        return JSON.parse(fs.readFileSync(global.paths.configs.eslintrc));
    }
};

global.paths = {
    get "all"() {
        return [
            this.libs.files,
            this.tests.files,
            this.gulpfile
        ];
    },
    "configs": {
        "esformatter": ".esformatter",
        "eslintrc": ".eslintrc"
    },
    "coverage": {
        "root": "/node_coverage"
    },
    "gulpfile": __filename,
    "libs": {
        "files": "polacks-*/**/*.js"
    },
    "tests": {
        "files": "polacks-*/**/*.test.js"
    },
    "root": __dirname
};

gulp.task("beautify", function() {
    gulp.src(global.paths.all)
        .pipe(cached("beautifying"))
        .pipe(esformatter(global.configs.esformatter))
        .pipe(gulp.dest(global.paths.root));
});

gulp.task("cover", function(done) {
    function onEnd() {
        gulp.src(global.paths.tests.files)
            .pipe(mocha())
            .pipe(istanbul.writeReports(global.paths.coverage.root))
            .on("end", done);
    }

    gulp.src(global.paths.libs.files)
        .pipe(istanbul())
        .on("end", onEnd);
});

gulp.task("lint", ["beautify"], function() {
    gulp.src(global.paths.all)
        .pipe(eslint(global.configs.eslintrc))
        .pipe(eslint.format());
});

gulp.task("test", ["lint"], function() {
    gulp.src(global.paths.tests.files)
        .pipe(mocha({
        "reporter": "tap"
    }));
});

gulp.task("watch", function() {
    gulp.src(global.paths.all).pipe(cached("beautifying"));
    gulp.watch(global.paths.all, ["default"]);
});

gulp.task("default", ["beautify", "lint", "test"]);
