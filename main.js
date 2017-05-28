var fs = require('fs');
var csv = require('fast-csv');
var _ = require('lodash')

function getData () {
  var stream = fs.createReadStream('test.csv');
  var streamListener = csv.fromStream(stream);
  var myArrdata = []
  streamListener.on('data', function (row) {
    // accumulate into an array;
    myArrdata.push({id: row[0], year: row[1], value: row[2]});
  })

  streamListener.on('end', function () {
    groupData(myArrdata);
  });
}
function groupData (array) {
//      var arr2 = []
  var groupedById = _.groupBy(array, function (item) {
    return item.id;
  });
  var ids = _.drop(_.keys(groupedById));
  var groupOrgSums = _.map(ids, function (id) {
    // group by year for each organisation
    var yearGroups = _.groupBy(groupedById[id], function (item) {
      return item.year;
    });
    // get year sums for each year group
    var years = _.keys(yearGroups);
    var yearSums = _.map(years, function (year) {
      var yearGroup = yearGroups[year];
      var sum = yearGroupSum(yearGroup);
      return {id: id, year: year, sum: sum};
    });
    return yearSums;
  });
  console.log(_.flatten(groupOrgSums));
}

function yearGroupSum (array) {
  var sum = 0;
  _.forEach(array, function (obj) {
    sum = sum + Number(obj.value);
  });
  return sum;
}

getData();
