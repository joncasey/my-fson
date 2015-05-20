
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

fson.end = function () {
  return this
}

fson.filter = function (re) {
  return filter(this, re)
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

fson.save = function (to, replacer, space, callback) {
  var a = Array.prototype.slice.call(arguments)
  if (typeof a[1] === 'function') a.splice(1, 0, undefined)
  if (typeof a[2] === 'function') a.splice(2, 0, undefined)
  fs.writeFile(a[0], this.toString(a[1], a[2]), a[3])
  return this
}

fson.saveSync = function (to, replacer, space) {
  fs.writeFileSync(to, this.toString(replacer, space))
  return this
}

fson.toString = function (replacer, space) {
  return JSON.stringify(this, replacer, space)
}

function filter(data, re) {

  var walk = function (o) {
    if (o.children) {
      o.children = o.children.filter(function (child) {
        return child.children || re.test(child.name)
      })
      o.children.forEach(function (child) {
        walk(child, re)
      })
    }
  }

  var s = JSON.stringify(data)
  var clone = JSON.parse(s)

  walk(clone)

  s = JSON.stringify(clone)

  var empty = /,?\{"name":"[^"]+","children":\[\]\}/g
  while (empty.test(s))
    s = s.replace(empty, '')
  s = s.replace(/\[,/g, '[')

  clone = JSON.parse(s)
  clone.__proto__ = fson
  clone.end = function () {
    return data
  }
  return clone

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

