# my-fson

Quickly capture a File System path in the most efficient manner.
The results can then be used in any application that accepts JSON.

Running
```

var fson = require('my-fson')

fson('folder')
  .save('test.json', 0, 2)
  .gzip('test.json.gz')

.remove('size')
  .save('test-name+date.json')

.remove('date')
  .save('test-name-only.json')


```
would create the following test.json:
```js
{
  "name": "folder",
  "children": [
    {
      "name": "file1.txt",
      "date": "2015-04-26T16:05:06.000Z",
      "size": 0
    },
    {
      "name": "file2.txt",
      "date": "2015-04-26T16:05:06.000Z",
      "size": 0
    }
  ]
}
```

