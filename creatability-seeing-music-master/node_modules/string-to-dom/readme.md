# string-to-dom

[![Travis CI build status](https://img.shields.io/travis/danawoodman/string-to-dom.svg)](https://travis-ci.org/danawoodman/string-to-dom)
[![Dependency Status](https://img.shields.io/david/danawoodman/string-to-dom.svg)](https://david-dm.org/danawoodman/string-to-dom)
[![View on npm](https://img.shields.io/npm/dm/string-to-dom.svg)](https://www.npmjs.com/package/string-to-dom)
[![View on npm](https://img.shields.io/npm/v/string-to-dom.svg)](https://www.npmjs.com/package/string-to-dom)

> Add a string of HTML to the DOM and return the new HTML element.

Uses `insertAdjacentHTML` to add a given string to the DOM in an efficient manner and return the newly created HTML element.

Useful in test suites for setting up HTML to assert against.

## Install

```
npm install --save string-to-dom
```


## Usage

```js
var stringToDom = require('string-to-dom');

// Add the <p> tag to the page (right after the <body> tag).
// `message` is the newly created HTML element.
var message = stringToDom('<p>Hello, World!</p>');

// Optionally add to a particular node on the page:
var target = document.getElementById('my-form')
var button = stringToDom('<button class="btn">Click me!</button>', target)
```


## API

See [the API docs](api.md) for full documentation.


## License

[MIT](license) &copy; [Dana Woodman][author]


[author]: https://github.com/danawoodman/string-to-dom
