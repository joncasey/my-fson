var assert = require('assert')
var fson = require('./index')
var fs = require('fs')

var testFile = 'test.json'
var testFolder = {
  name: 'folder',
  children: [
    {name:'file1.txt'},
    {name:'file2.txt'}
  ]
}

try {

  create(testFolder)

  testFolder.children.forEach(function (file) {
    var stats = fs.statSync(testFolder.name + '/' + file.name)
    file.date = stats.mtime
    file.size = stats.size
  })

  var test = fson(testFolder.name)

  assert.equal(
    test,
    JSON.stringify(testFolder),
    'Folder object is not equal'
  )

  test.saveSync(testFile, 0, 2)

  assert.equal(
    fs.readFileSync(testFile),
    JSON.stringify(testFolder, 0, 2),
    'save() failed to write file properly'
  )

  test.remove('date size')

  testFolder.children.forEach(function (file) {
    delete file.date
    delete file.size
  })

  assert.equal(
    test,
    JSON.stringify(testFolder),
    'remove() failed to remove properties'
  )

}

catch (e) {
  throw e
}

finally {
  remove(testFolder)
}

function create(folderObject) {
  var dir = __dirname + '/' + folderObject.name
  if (fs.existsSync(dir)) {
    throw new Error(dir + ' already exists')
  }
  fs.mkdirSync(dir)
  folderObject.children.forEach(function (file, fileIndex) {
    fs.writeFileSync(dir + '/' + file.name, ''+ fileIndex)
  })
}

function remove(folderObject) {
  var dir = __dirname + '/' + folderObject.name
  if (fs.existsSync(dir)) {
    folderObject.children.forEach(function (file) {
      fs.unlinkSync(dir + '/' + file.name)
    })
    fs.rmdirSync(dir)
  }
  if (fs.existsSync(testFile)) {
    fs.unlinkSync(testFile)
  }
}

