var mac = require('macgyver')().autoValidate()

require('tape')('test', function (t) {

var Appender = require('..')

var a = new Appender()

console.log(a)


  a.on('item',    mac().times(2))
  a.on('remove',  mac().once())
  a.on('_remove', mac().once())
  a.on('_update', mac().times(3))

  var m = {message: 'hello'}

  a.once('item', mac(function (_m) {
    t.equal(_m, m)
  }).once())

  a.once('remove', mac(function (_m) {
    t.equal(_m, m)  
  }).once())

  a.push(m)
  a.push({message: 'hello2'})
  a.remove(m)

  console.log(a._store)
  t.end()
})
