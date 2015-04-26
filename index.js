
var fs = require('fs'),
  path = require('path'),
  zlib = require('zlib'),
  fson = module.exports = function (path) {
    var object = path

    if (typeof path === 'string') {
      object = toObject(path)
    }

    object.__proto__ = fson

    return object
  }

fson.gzip = function (to, replacer, space) {
  var streamOut = fs.createWriteStream(to)
  zlib.gzip(this.toString(replacer, space), function (_, result) {
    streamOut.end(result)
  })
  return this
}

fson.remove = function (properties) {
  remove(this, properties)
  return this
}

fson.save = function (to, replacer, space) {
  var file = fs.createWriteStream(to)
  file.write(this.toString(replacer, space))
  file.end()
  return this
}

fson.toString = function (replacer, space) {
  return JSON.stringify(this, replacer, space)
}

function remove(data, properties) {

  properties.replace(/\w+/g, function (property) {
    if (property in data) {
      delete data[property]
    }
  })

  if (data.children) {
    data.children.forEach(function (child) {
      remove(child, properties)
    })
  }

}

function toObject(dir) {

  var walk = function (dir) {

    var info = {
      name: path.basename(dir)
    }

    var stats = fs.statSync(dir)

    if (stats.isDirectory()) {

      info.children = []
      var files = []

      fs.readdirSync(dir).forEach(function (child) {
        var childPath = path.join(dir, child)
        if (fs.statSync(childPath).isDirectory()) {
          info.children.push(walk(childPath))
        }
        else {
          files.push(childPath)
        }
      })

      files.forEach(function (childPath) {
        info.children.push(walk(childPath))
      })

    }

    else {

      info.date = stats.mtime
      info.size = stats.size

    }

    return info

  }

  return walk(dir)

}

