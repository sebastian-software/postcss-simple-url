var test = require("ava")

var fs = require("fs")

var url = require("..")
var postcss = require("postcss")

function read(name) {
  return fs.readFileSync(name + ".css", "utf8").trim()
}

function compareFixtures(check, name, msg, opts, postcssOpts, plugin) {
  opts = opts || {}
  var pcss = postcss()
  if (plugin) {
    pcss.use(plugin())
  }
  pcss.use(url(opts))
  return pcss.process(read("test/fixtures/" + name), postcssOpts).then(function(actual) {
    var expected = read("test/fixtures/" + name + ".expected")

    // handy thing: checkout actual in the *.actual.css file
    fs.writeFileSync("test/fixtures/" + name + ".actual.css", actual)

    check.is(actual.css, expected, msg)
  })
}

test("rebase", async function(check) {
  var opts = {}
  await compareFixtures(
    check,
    "cant-rebase",
    "shouldn't rebase url if not info available")
  await compareFixtures(
    check,
    "rebase-to-from",
    "should rebase url to dirname(from)",
    opts,
    { from: "test/fixtures/here" }
  )
  await compareFixtures(
    check,
    "rebase-to-to-without-from",
    "should rebase url to dirname(to)",
    opts,
    { to: "there" }
  )
  await compareFixtures(
    check,
    "rebase-to-to",
    "should rebase url to dirname(to) even if from given",
    opts,
    { from: "test/fixtures/here", to: "there" }
  )
  await compareFixtures(
    check,
    "rebase-all-url-syntax",
    "should rebase url even if there is different types of quotes",
    opts,
    { from: "test/fixtures/here", to: "there" }
  )
  await compareFixtures(
    check,
    "rebase-querystring-hash",
    "should rebase url that have query string or hash (or both)",
    opts,
    { from: "test/fixtures/here", to: "there" }
  )
  await compareFixtures(
    check,
    "rebase-imported",
    "should rebase url of imported files",
    opts,
    { from: "test/fixtures/transform.css" }, require("postcss-smart-import")
  )
  await compareFixtures(
    check,
    "alpha-image-loader",
    "should rebase in filter",
    opts,
    { from: "test/fixtures/here", to: "there" }
  )
})

test("ignore absolute urls, data uris, or hashes", async function(check) {
  await compareFixtures(
    check,
    "absolute-urls",
    "shouldn't not transform absolute urls, hashes or data uris")
})
