# postcss-url

[![Travis Build Status](https://img.shields.io/travis/postcss/postcss-url/master.svg?label=unix%20build)](https://travis-ci.org/postcss/postcss-url)
[![AppVeyor Build Status](https://img.shields.io/appveyor/ci/MoOx/postcss-url/master.svg?label=windows%20build)](https://ci.appveyor.com/project/MoOx/postcss-url)

> [PostCSS](https://github.com/postcss/postcss) plugin to rebase, inline or copy on url().

## Installation

```console
$ npm install postcss-url
```

## Usage

```js
// dependencies
var fs = require("fs")
var postcss = require("postcss")
var url = require("postcss-url")

// css to be processed
var css = fs.readFileSync("input.css", "utf8")

// process css
var output = postcss()
  .use(url({
    url: "rebase" // or "inline" or "copy"
  }))
  .process(css, {
    // "rebase" mode need at least one of those options
    // "inline" mode might need `from` option only
    // "copy" mode need `from` and `to` option to work
    from: "src/stylesheet/index.css",
    to: "dist/index.css"
  })
  .css
```

Checkout [tests](test) for examples.

### Options

#### `basePath`

Specify the base path where to search images from

#### `assetsPath`

_(default: `false`)_

If you specify an `assetsPath`, the assets files will be copied in that
destination



## Contributing

Work on a branch, install dev-dependencies, respect coding style & run tests before submitting a bug fix or a feature.

```console
$ git clone https://github.com/postcss/postcss-url.git
$ git checkout -b patch-1
$ npm install
$ npm test
```

## [License](LICENSE)
