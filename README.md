# my-fson

Quickly capture a File System path in the most efficient manner.
The results can then be used in any application that accepts JSON.

Running
```

var fson = require('my-fson')

fson('tv')
  .save('tv.json', 0, 2)
  .gzip('tv.json.gz')

.remove('size')
  .save('tv-name+date.json')

.remove('date')
  .save('tv-name-only.json')


```
on the following folders/files:
```
TV
  Archer
    Season 1
      01 Mole Hunt.jpg
  Arrow
    Season 1
      01 Pilot.jpg
  Firefly
    Season 1
      01 Serenity Part 1 & 2.jpg
  Game of Thrones
    Season 1
      01 Winter Is Coming.jpg
```
would create the following tv.json:
```js
{
  "name": "TV",
  "children": [
    {
      "name": "Archer",
      "children": [
        {
          "name": "Season 1",
          "children": [
            {
              "name": "01 Mole Hunt.jpg",
              "date": "2015-04-26T13:46:14.000Z",
              "size": 0
            }
          ]
        }
      ]
    },
    {
      "name": "Arrow",
      "children": [
        {
          "name": "Season 1",
          "children": [
            {
              "name": "01 Pilot.jpg",
              "date": "2015-04-26T13:46:14.000Z",
              "size": 0
            }
          ]
        }
      ]
    },
    {
      "name": "Firefly",
      "children": [
        {
          "name": "Season 1",
          "children": [
            {
              "name": "01 Serenity Part 1 & 2.jpg",
              "date": "2015-04-26T13:46:14.000Z",
              "size": 0
            }
          ]
        }
      ]
    },
    {
      "name": "Game of Thrones",
      "children": [
        {
          "name": "Season 1",
          "children": [
            {
              "name": "01 Winter Is Coming.jpg",
              "date": "2015-04-26T13:46:14.000Z",
              "size": 0
            }
          ]
        }
      ]
    }
  ]
}
```

