var path = require("path")
var postcss = require("postcss")

var UrlsPatterns = [
  /(url\(\s*['"]?)([^"')]+)(["']?\s*\))/g,
  /(AlphaImageLoader\(\s*src=['"]?)([^"')]+)(["'])/g,
]

/**
 * Fix url() according to source (`from`) or destination (`to`)
 */
module.exports = postcss.plugin(
  "postcss-url",
  function fixUrl(options) {
    options = options || {}

    return function(styles, result) {
      var from = result.opts.from
        ? path.dirname(result.opts.from)
        : "."
      var to = result.opts.to
        ? path.dirname(result.opts.to)
        : from

      var cb = getDeclProcessor(result, from, to, processRebase, options)
      styles.walkDecls(cb)
    }
  }
)

function getDeclProcessor(result, from, to, cb) {
  var valueCallback = function(decl, oldUrl) {
    var dirname = decl.source && decl.source.input && decl.source.input.file
      ? path.dirname(decl.source.input.file)
      : process.cwd()

    var newUrl

    if (!isUrlShouldBeIgnored(oldUrl)) {
      newUrl = cb(result, from, dirname, oldUrl, to)
    }

    return newUrl || oldUrl
  }

  return function(decl) {
    UrlsPatterns.some(function(pattern) {
      if (pattern.test(decl.value)) {
        decl.value = decl.value
          .replace(pattern, function(_, beforeUrl, oldUrl, afterUrl) {
            return beforeUrl + valueCallback(decl, oldUrl) + afterUrl
          })

        return true
      }
    })
  }
}

/**
 * Check if url is absolute, hash or data-uri
 */
function isUrlShouldBeIgnored(url) {
  return url[0] === "/" ||
    url[0] === "#" ||
    url.indexOf("data:") === 0 ||
    /^[a-z]+:\/\//.test(url)
}

/**
 * Fix url() according to source (`from`) or destination (`to`)
 */
function processRebase(result, from, dirname, oldUrl, to) {
  var newPath = oldUrl
  if (dirname !== from) {
    newPath = path.relative(from, dirname + path.sep + newPath)
  }
  newPath = path.resolve(from, newPath)
  newPath = path.relative(to, newPath)
  if (path.sep === "\\") {
    newPath = newPath.replace(/\\/g, "\/")
  }
  return newPath
}
