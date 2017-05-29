var fs = require('fs');
var csv = require('fast-csv');
var _ = require('lodash')

function schoolData () {
  var stream = fs.createReadStream('class.csv');
  var streamListener = csv.fromStream(stream);
  var myArrdata = []
  streamListener.on('data', function (row) {
    var total = Number(row[1]) + Number(row[2])
    myArrdata.push({name: row[0], math: row[1], english: row[2], total: total});
  })

  streamListener.on('end', function () {
    dataSchoolManipulation(myArrdata);
    console.log('done');
  });
}
function dataSchoolManipulation (array) {
  var pos = [4, 3, 2, 1]
  var sortedByTotal = _.sortBy(array, function (o) { return o.total })
  var arrTotal = _.dropRight(sortedByTotal)
  var posArr = _.map(arrTotal, function (std, index) {
    std.position = pos[index]
    return std
  })
//  console.log(posArr);
  var mathArr = _.map(arrTotal, function (o) {
    return _.pick(o, ['name', 'math'])
  })
//  console.log(mathArr);
  var gradedMath = _.map(mathArr, function (o) {
    var mathgrades = {math: grade(o.math)}
    return _.assign(o, mathgrades)
  })
  var engArr = _.map(arrTotal, function (o) {
    return _.pick(o, ['name', 'english'])
  })
  var gradedEng = _.map(engArr, function (o) {
    var engGrades = {english: grade(o.english)}
    return _.assign(o, engGrades)
  })
  var GradedByBoth = _.each(gradedMath, function (o) {
    var y = _.find(gradedEng, function (y) {
      return y.name === o.name
    })
    _.assign(o, y)
  })
  var groupedByName = _.groupBy(GradedByBoth, function (obj) {
    return obj.name
  })
  var groupedByNameKeys = _.keys(groupedByName)
  var gradedArray = _.map(groupedByNameKeys, function (key) {
    var objArr = groupedByName[key];
    var obj = objArr[0];
    return {name: key, grades: {math: obj.math, english: obj.english}}
  })
  var myFinalData = _.each(gradedArray, function (o) {
    var posObj = _.find(posArr, function (i) {
      return i.name === o.name
    })
    _.assign(o, posObj)
  })
  console.log(myFinalData);
}
// grading system
function grade (x) {
  if (x <= 30) {
    return 'E'
  } else if (x <= 50 && x > 30) {
    return 'D'
  } else if (x <= 70 && x > 50) {
    return 'c'
  } else if (x < 90 && x > 70) {
    return 'B'
  } else if (x >= 90) {
    return 'A'
  }
}
schoolData()
