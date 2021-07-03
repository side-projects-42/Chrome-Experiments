# gulp-r

First, install `gulp-r` as a development dependency:

```shell
npm install --save-dev gulp-r
```

Then, use it in your `gulpfile.js`:

```javascript
var rjs = require("gulp-r");

gulp.src("app/scripts/*.js")
    .pipe(rjs({
        "baseUrl": "app/scripts"
    }))
    .pipe(gulp.dest("dist/scripts"));
```

## Renaming output files

If you want to rename output files use `gulp-rename` plugin.

```JavaScript
var rename = require("gulp-rename"),
    rjs = require("gulp-r");

gulp.src("app/scripts/*.js")
    .pipe(rjs({
        "baseUrl": "app/scripts"
    }))
    .pipe(rename({
        "extname": ".min.js"
    }))
    .pipe(gulp.dest("dist/scripts"));
```

## Using Almond loader

If you want to use Almond, add `almond` dependency to your package.json and then use `name` configuration option:

```JavaScript
var rjs = require("gulp-r");

gulp.src("app/scripts/*.js")
    .pipe(rjs({
        "baseUrl": "app/scripts",
        "name": require.resolve("almond")
    }))
    .pipe(gulp.dest("dist/scripts"));
```

## Generating source maps

Use following options simultaneously (`generateSourceMaps`, `optimize`,
`preserveLicenseComments`):

```JavaScript
var rjs = require("gulp-r");

gulp.src("app/scripts/*.js")
    .pipe(rjs({
        "baseUrl": "app/scripts",
        "generateSourceMaps": true,
        "optimize": "uglify2",
        "preserveLicenseComments": false
    }))
    .pipe(gulp.dest("dist/scripts"));
```

## Status

This fork is maintained independently from its origin.

---

[![Build Status](http://img.shields.io/travis/smrtlabs/smrt-gulp-r.svg?style=flat)](https://travis-ci.org/smrtlabs/smrt-gulp-r)
[![Code Climate](http://img.shields.io/codeclimate/github/smrtlabs/smrt-gulp-r.svg?style=flat)](https://codeclimate.com/github/smrtlabs/smrt-gulp-r)
[![Dependency Status](http://img.shields.io/david/smrtlabs/smrt-gulp-r.svg?style=flat)](https://david-dm.org/smrtlabs/smrt-gulp-r)
