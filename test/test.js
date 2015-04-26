
var fson = require('..')

fson('folder')
  .save('test.json', 0, 2)
  .gzip('test.json.gz')

.remove('size')
  .save('test-name+date.json', 0, 2)

.remove('date')
  .save('test-name-only.json', 0, 2)

