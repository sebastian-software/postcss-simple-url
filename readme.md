<img src="assets/postcss.png" alt="PostCSS Logo" width="200" height="200"/>

# PostCSS Simple URL <br/>![Downloads][npm-version-img] ![Downloads][npm-downloads-img] [![Build Status Unix][travis-img]][travis] [![Build Status Windows][appveyor-img]][appveyor] ![Dependencies][deps-img]

[PostCSS] plugin for loading/including other files (transform `@import` rules by inlining content) and quering/referring assets (referred in `url()` functions).

[PostCSS]: https://github.com/postcss/postcss
[deps-img]: https://david-dm.org/sebastian-software/postcss-simple-url.svg
[npm]: https://www.npmjs.com/package/postcss-simple-url
[npm-downloads-img]: https://img.shields.io/npm/dm/postcss-simple-url.svg
[npm-version-img]: https://img.shields.io/npm/v/postcss-simple-url.svg
[travis-img]: https://img.shields.io/travis/sebastian-software/postcss-simple-url/master.svg?branch=master&label=unix%20build
[appveyor-img]: https://img.shields.io/appveyor/ci/swernerx/postcss-simple-url/master.svg?label=windows%20build
[travis]: https://travis-ci.org/sebastian-software/postcss-simple-url
[appveyor]: https://ci.appveyor.com/project/swernerx/postcss-simple-url/branch/master.svg?branch=master&label=unix%20build

## Installation

```console
$ npm install postcss-simple-url
```

## Usage

```js
// dependencies
var fs = require("fs")
var postcss = require("postcss")
var url = require("postcss-simple-url")

// css to be processed
var css = fs.readFileSync("input.css", "utf8")

// process css
var output = postcss()
  .use(url())
  .process(css, {
    from: "src/stylesheet/index.css",
    to: "dist/index.css"
  })
  .css
```

Checkout [tests](test) for examples.


## Contributing

Work on a branch, install dev-dependencies, respect coding style & run tests before submitting a bug fix or a feature.

```console
$ git clone https://github.com/postcss/postcss-simple-url.git
$ git checkout -b patch-1
$ npm install
$ npm test
```

## [License](LICENSE)
