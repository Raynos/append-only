# append-only

Append only scuttlebutt structure

## Example

Represent an append only data structure through scuttlebutt.

You push new pieces of data onto the list. You can also remove
a item from the list (which is actually an append only message).

`append-only` generates a unique `__id` on your item for you.

```js
var AppendOnly = require("append-only")
    , list1 = AppendOnly()
    , list2 = AppendOnly()

list1.on("item", function (item) {
    if (item.more) {
        list1.remove(item.__id)
    }
})

list1.push({ some: "data" })
list1.push({ more: "data" })

list2.on("item", function (item) {
    console.log("items", item)
})

list2.on("purged", function (item) {
    console.log("item removed", item)
})

setTimeout(function () {
    var array = list2.createArray()
    console.log("array", array)
}, 500)

var stream1 = list1.createStream()
    , stream2 = list2.createStream()

stream1.pipe(stream2).pipe(stream1)
```

## Installation

`npm install append-only`

## Contributors

 - Raynos

## MIT Licenced
