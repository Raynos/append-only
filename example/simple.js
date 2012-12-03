var AppendOnly = require("..")
    , assert = require("assert")

    , list1 = AppendOnly()
    , list2 = AppendOnly()
    , counter = 0

list1.type = "list1"
list2.type = "list2"

list1.on("item", function (item) {
    if (item.more) {
        list1.remove(item.__id)
    }
})

list1.push({ some: "data" })
list1.push({ more: "data" })

list2.on("item", function (item) {
    counter++
    console.log("items", item)

    if (item.some === "data") {
        var obj = { "hello": "world" }
        list1.push(obj)
        list1.remove(obj)
    }
})

list2.on("remove", function (item) {
    counter++
    console.log("item removed", item)
})

setTimeout(function () {
    var array = list2.createArray()
    console.log("array", array)
    assert.equal(array[0].some, "data")
    assert.equal(array.length, 1)
    assert.equal(counter, 3)
}, 500)

var stream1 = list1.createStream()
    , stream2 = list2.createStream()

stream1.pipe(stream2).pipe(stream1)
