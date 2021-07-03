/**
 * @license Copyright (c) 2014, Cruks
 * For licensing, see LICENSE
 */

"use strict";

/*eslint no-mixed-requires: 0 */

var config = {},
    esformatter = require("gulp-esformatter"),
    eslint = require("gulp-eslint"),
    fs = require("fs"),
    gulp = require("gulp"),
    mocha = require("gulp-mocha"),
    path = require("path"),
    pckg = require(path.join(__dirname, "package.json"));

gulp.task("beautify", ["beautify." + pckg.main, "beautify.gulpfile"]);

gulp.task("beautify." + pckg.main, ["config.esformatter"], function (done) {
    gulp.src([
        "!" + path.join(__dirname, pckg.main, "fixtures/*/out/*.js"),
        path.join(__dirname, pckg.main, "**/*.js")
    ])
        .pipe(esformatter(config.esformatter))
        .pipe(gulp.dest(path.join(__dirname, pckg.main)))
        .on("finish", done);
});

gulp.task("beautify.gulpfile", ["config.esformatter"], function (done) {
    gulp.src(__filename)
        .pipe(esformatter(config.esformatter))
        .pipe(gulp.dest(__dirname))
        .on("finish", done);
});

gulp.task("config.esformatter", function (done) {
    fs.readFile(path.join(__dirname, ".esformatter"), function (err, config) {
        if (err) {
            done(err);
        } else {
            config.esformatter = JSON.parse(config.toString("utf8"));
            done();
        }
    });
});

gulp.task("config.eslintrc", function (done) {
    fs.readFile(path.join(__dirname, ".eslintrc"), function (err, config) {
        if (err) {
            done(err);
        } else {
            config.eslintrc = JSON.parse(config.toString("utf8"));
            done();
        }
    });
});

gulp.task("default", ["beautify", "lint", "test"]);

gulp.task("lint", ["beautify", "config.eslintrc"], function (done) {
    gulp.src([
        "!" + path.join(__dirname, pckg.main, "fixtures/*/out/*.js"),
        __filename,
        path.join(__dirname, pckg.main, "**/*.js")
    ])
        .pipe(eslint(config.eslintrc))
        .pipe(eslint.format())
        .on("end", done);
});

gulp.task("test", ["lint"], function (done) {
    if (!process.env.PACKAGE_ROOT) {
        process.env.PACKAGE_ROOT = __dirname;
    }

    gulp.src(path.join(__dirname, pckg.main, "**/*.test.js"))
        .pipe(mocha({
            "bail": true,
            "reporter": "dot"
        }))
        .on("finish", done);
});

gulp.task("watch", function () {
    gulp.watch(path.join(__dirname, pckg.main, "**/*.js"), ["default"]);
});
