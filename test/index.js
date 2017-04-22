var test = require("ava")
var fs = require("fs")
var postcss = require("postcss")

var url = require("..")

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

test("cant-rebase", async function(check) {
  await compareFixtures(
    check,
    "cant-rebase",
    "shouldn't rebase url if not info available")
})

test("rebase-to-from", async function(check) {
  await compareFixtures(
    check,
    "rebase-to-from",
    "should rebase url to dirname(from)",
    null,
    { from: "test/fixtures/here" }
  )
})

test("rebase-to-to-without-from", async function(check) {
  await compareFixtures(
    check,
    "rebase-to-to-without-from",
    "should rebase url to dirname(to)",
    null,
    { to: "there" }
  )
})

test("rebase-to-to", async function(check) {
  await compareFixtures(
    check,
    "rebase-to-to",
    "should rebase url to dirname(to) even if from given",
    null,
    { from: "test/fixtures/here", to: "there" }
  )
})

test("rebase-all-url-syntax", async function(check) {
  await compareFixtures(
    check,
    "rebase-all-url-syntax",
    "should rebase url even if there is different types of quotes",
    null,
    { from: "test/fixtures/here", to: "there" }
  )
})

test("rebase-querystring-hash", async function(check) {
  await compareFixtures(
    check,
    "rebase-querystring-hash",
    "should rebase url that have query string or hash (or both)",
    null,
    { from: "test/fixtures/here", to: "there" }
  )
})

test("rebase-imported", async function(check) {
  await compareFixtures(
    check,
    "rebase-imported",
    "should rebase url of imported files",
    null,
    { from: "test/fixtures/transform.css" }, require("postcss-smart-import")
  )
})

test("alpha-image-loader", async function(check) {
  await compareFixtures(
    check,
    "alpha-image-loader",
    "should rebase in filter",
    null,
    { from: "test/fixtures/here", to: "there" }
  )
})

test("ignore absolute urls, data uris, or hashes", async function(check) {
  await compareFixtures(
    check,
    "absolute-urls",
    "shouldn't not transform absolute urls, hashes or data uris")
})
