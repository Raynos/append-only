var Scuttlebutt = require("scuttlebutt")
    , filter = Scuttlebutt.filter
    , inherits = require("util").inherits

inherits(AppendOnly, Scuttlebutt)

var proto = AppendOnly.prototype

proto.push = push
proto.remove = remove
proto.applyUpdate = applyUpdate
proto.history = history
proto.toJSON = proto.createArray = createArray

module.exports = AppendOnly

function AppendOnly(options) {
    if (! (this instanceof AppendOnly)) {
        return new AppendOnly(options)
    }

    Scuttlebutt.call(this, options)

    this._store = []
    this._hash = {}
}

function push(item) {
    this.localUpdate({ push: item })
}

function remove(id) {
    this.localUpdate({ remove: id })
}

function applyUpdate(update) {
    var value = update[0]
        , ts = update[1]
        , source = update[2]

    // console.log("applyUpdate", update)

    this._store.push(update)

    if (value.push) {
        var item = value.push
            , id = source + ":" + ts

        Object.defineProperty(item, "__id", {
            value: id
            , configurable: true
        })
        this._hash[id] = item
        this.emit("item", item)
    } else if (value.remove) {
        var id = value.remove
            , item = this._hash[id]

        ;delete this._hash[id]
        this.emit("remove", item)
    }
    return true
}

function history(sources) {
    return this._store.filter(function (update) {
        return filter(update, sources)
    })
}

function createArray() {
    var hash = this._hash

    return Object.keys(hash).map(findKey, hash)
}

function findKey(key) {
    return this[key]
}
