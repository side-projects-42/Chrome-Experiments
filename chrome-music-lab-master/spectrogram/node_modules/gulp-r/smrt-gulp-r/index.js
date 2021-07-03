/**
 * @license Copyright (c) 2014 Nicholas Kostelnik
 * @license Copyright (c) 2014 smrtlabs
 * For licensing, see LICENSE
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    gutil = require("gulp-util"),
    OptimizerSettings = require(path.join(__dirname, "/OptimizerSettings")),
    PLUGIN_NAME = "gulp-r",
    Q = require("q"),
    requirejs = require("requirejs"),
    through = require("through2");

/**
 * @param {*} stream through2 stream object
 * @param {*} file through2 file stream
 * @param {String} encoding file encoding
 * @param {smrt-gulp-r/OptimizerSettings} options valid optimizer options
 * @returns {Promise} resolved if handled successfully, rejected otherwise
 */
function handleFileStream(stream, file, encoding, options) {
    var doOptimizeFile = _.curry(optimizeFile)(stream, file, encoding, options);

    return normalizeFileOptions(file, encoding, options).then(doOptimizeFile);
}

/**
 * @param {*} stream through2 stream object
 * @param {*} file through2 file stream
 * @param {String} encoding file encoding
 * @param {smrt-gulp-r/OptimizerSettings} options valid optimizer options
 * @returns {Promise} resolved if handled successfully, rejected otherwise
 */
function handleNullStream(stream, file) {
    var handleNullStreamDeferred = Q.defer();

    handleNullStreamDeferred.resolve(file);

    return handleNullStreamDeferred.promise;
}

/**
 * @param {*} file through2 file stream
 * @param {String} encoding file encoding
 * @param {Object} options user input configuration
 * @returns {Promise} resolved if options are valid, rejected otherwise
 */
function normalizeFileOptions(file, encoding, options) {
    var fileOptions = _.clone(options),
        include = path.basename(file.path).replace(path.extname(file.path), ""),
        normalizeFileOptionsDeferred = Q.defer(),
        normalizeFileOptionsPromise = normalizeFileOptionsDeferred.promise;

    if (fileOptions.name) {
        fileOptions.name = path.relative(fileOptions.baseUrl, fileOptions.name);
        fileOptions.include = include;
    } else {
        fileOptions.name = include;
    }

    normalizeFileOptionsDeferred.resolve(fileOptions);

    return normalizeFileOptionsPromise;
}

/**
 * @param {Object} options user input configuration
 * @returns {Promise} resolved if options are valid, rejected otherwise
 */
function normalizeStreamOptions(options) {
    var normalizeStreamOptionsDeferred = Q.defer(),
        normalizeStreamOptionsPromise = normalizeStreamOptionsDeferred.promise;

    try {
        normalizeStreamOptionsDeferred.resolve(new OptimizerSettings(options));
    } catch (err) {
        normalizeStreamOptionsDeferred.reject(err);
    }

    return normalizeStreamOptionsPromise;
}

/**
 * @param {*} stream through2 stream object
 * @param {*} file through2 file stream
 * @param {String} encoding file encoding
 * @param {smrt-gulp-r/OptimizerSettings} options valid optimizer options
 * @param {smrt-gulp-r/OptimizerSettings} fileOptions valid file options
 * @returns {Promise} resolved if optimized successfully, rejected otherwise
 */
function optimizeFile(stream, file, encoding, options, fileOptions) {
    var fileOptionsDeferred = Q.defer(),
        fileOptionsPromise = fileOptionsDeferred.promise,
        requirejsDeferred = Q.defer(),
        requirejsPromise = requirejsDeferred.promise;

    function fileOptionsErrback(err) {
        fileOptionsDeferred.reject(err);
    }

    function requirejsErrback(err) {
        requirejsDeferred.reject(err);
    }

    try {
        // r.js goes nuts sometimes without changing CWD
        // this prevents some edge case failures
        process.chdir(options.baseUrl);
    } catch (err) {
        requirejsErrback(err);

        return requirejsPromise;
    }

    fileOptions.out = function (text, sourceMapText) {
        fileOptionsPromise = fileOptionsPromise.then(function (formattedText) {
            file.contents = new Buffer(formattedText, encoding);

            return file;
        });

        if (!sourceMapText) {
            fileOptionsDeferred.resolve(text);

            return;
        }

        storeSourceMap(stream, file, encoding, options, sourceMapText).then(function (sourceMapFile) {
            text += "\n//# sourceMappingURL=" + path.basename(sourceMapFile.path);

            stream.push(sourceMapFile);
            fileOptionsDeferred.resolve(text);
        }, fileOptionsErrback);
    };

    requirejs.optimize(fileOptions, function () {
        requirejsDeferred.resolve();
    }, requirejsErrback);

    return Q.all([fileOptionsPromise, requirejsPromise]).then(function () {
        return file;
    });
}

/**
 * @param {*} stream through2 stream object
 * @param {*} file through2 file stream
 * @param {String} encoding file encoding
 * @param {smrt-gulp-r/OptimizerSettings} options valid optimizer options
 * @param {String} sourceMapText contents of generated source map
 * @returns {Promise} resolved if optimized successfully, rejected otherwise
 */
function storeSourceMap(stream, file, encoding, options, sourceMapText) {
    var storeSourceMapDeferred = Q.defer(),
        storeSourceMapPromise = storeSourceMapDeferred.promise;

    storeSourceMapDeferred.resolve(new gutil.File({
        "base": path.dirname(file.path),
        "contents": new Buffer(sourceMapText, encoding),
        "cwd": process.cwd(),
        "path": file.path + ".map"
    }));

    return storeSourceMapPromise;
}

module.exports = function (options) {
    var normalizeStreamOptionsPromise = normalizeStreamOptions(options);

    return through.obj(function (file, encoding, callback) {
        var that = this;

        function onError(err) {
            var pluginError = new gutil.PluginError(PLUGIN_NAME, err);

            gutil.log(gutil.colors.cyan(PLUGIN_NAME), gutil.colors.white(err.message));

            callback(pluginError, file);
        }

        function onSuccess(optimized) {
            callback(null, optimized);
        }

        normalizeStreamOptionsPromise
            .then(function (validatedOptions) {
                if (file.isNull()) {
                    return handleNullStream(that, file, encoding, validatedOptions);
                }

                return handleFileStream(that, file, encoding, validatedOptions);
            })
            .then(onSuccess, onError);
    });
};
