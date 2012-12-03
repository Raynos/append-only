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

    var store = this._store = []
    this._hash = {}

    this.on("_remove", function (update, update2) {
        var index = store.indexOf(update)
        if (index !== -1) {
            store.splice(index, 1)
        }

        index = store.indexOf(update2)
        if (index !== -1) {
            store.splice(index, 1)
        }
    })
}

function push(item) {
    this.localUpdate({ push: item })
}

function remove(id) {
    this.localUpdate({ remove: id.__id ? id.__id : id })
}

function toId (update) {
    var ts = update[1]
        , source = update[2]

    return source + ":" + ts
}

function applyUpdate(update) {
    var value = update[0]

    this._store.push(update)

    if (value.push) {
        var item = value.push
            , id = toId(update)

        Object.defineProperty(item, "__id", {
            value: id
            , configurable: true
        })
        this._hash[id] = update
        this.emit("item", item)
    } else if (value.remove) {
        var id = value.remove
            , _update = this._hash[id]

        ;delete this._hash[id]

        this.emit("_remove", _update, update)
        this.emit("remove", _update[0].push)
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
    return this[key][0].push
}
