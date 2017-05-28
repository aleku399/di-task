var fs = require('fs');
var csv = require('fast-csv');
var _ = require('lodash')

function newData () {
  var stream = fs.createReadStream('test.csv');
  var streamListener = csv.fromStream(stream);
  var Arr = []
  streamListener.on('data', function (row) {
    Arr.push({id: row[0], year: row[1], value: row[2]});
  })

  streamListener.on('end', function () {
    InteractData(Arr)
    console.log('done');
  });
}
function InteractData (array) {
  var idArr = _.groupBy(array, function (a) {
    return a.id
  })
  var keys = _.drop(_.keys(idArr))
  var sorted = _.map(keys, function (id) {
    var single = idArr[id]
    var sortedid = _.sortBy(single, [ function (o) { return o.value } ])
    var maxValue = sortedid[sortedid.length - 1].value;
    var minValue = sortedid[0].value;
    return {id: id, max: maxValue, min: minValue};
  })
  var yearArr = _.groupBy(array, function (year) { return year.year })
  var yearKeys = _.dropRight(_.keys(yearArr))
  var objYear = {year: yearKeys[0] + ' - ' + yearKeys[yearKeys.length - 1]}
  var megaData = _.map(sorted, function (o) {
    return _.assign(o, objYear)
  })
  console.log(megaData);
}
newData()
