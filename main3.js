var fs = require('fs');
var csv = require('fast-csv');
var _ = require('lodash')

function myData () {
  var stream = fs.createReadStream('test.csv');
  var streamListener = csv.fromStream(stream);
  var Arr = []
  streamListener.on('data', function (row) {
    Arr.push({id: row[0], year: row[1], value: row[2]});
  })
  streamListener.on('end', function () {
    var data = manipulateData(Arr)
    console.log('***************************')
    console.log('done', data);
  });
}
function manipulateData (array) {
  var idArr = _.groupBy(array, function (o) { return o.id })
  var idKeys = _.drop(_.keys(idArr));

  var sortedByYear = _.reduce(idKeys, function (result, id) {
    var idData = idArr[id];
    var idYear = _.sortBy(idData, function (o) { return o.year });
    var maxYear = idYear[idYear.length - 1].year;
    var minYear = idYear[0].year;
    return _.assign(result, {[id]: { year: minYear + '-' + maxYear }});
  }, {})

  var sortedByValue = _.reduce(idKeys, function (result, id) {
    var single = idArr[id]
    var sortedid = _.sortBy(single, [ function (o) { return o.value } ])
    var maxValue = sortedid[sortedid.length - 1].value;
    var minValue = sortedid[0].value;
    return _.assign(result, { [id]: { max: maxValue, min: minValue } });
  }, {});

  return _.map(idKeys, function (key) {
    return _.assign({id: key}, sortedByYear[key], sortedByValue[key]);
  });
}
myData()
