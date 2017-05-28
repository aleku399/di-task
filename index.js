// assignment: write data from year 2000 to 2010 for code AG & AI to a csv file called results.csv
var fs = require('fs');
var csv = require('fast-csv');
var _ = require('lodash')

function myDataArray () {
  var stream = fs.createReadStream('climate-vulnerability.csv');
  var myArr = []
  var streamListener = csv.fromStream(stream);
  streamListener.on('data', function (row) {
    if (row[1] <= 2010 && row[0] === 'AG' || row[0] === 'AI') {
      if (row[2] === undefined) {
        row[2] = 0
      }
      var myObj = {
        id: row[0],
        year: row[1],
        value: row[2]
      }
      myArr.push(myObj)
      console.log(myArr);
    }
  })

  streamListener.on('end', function () {
    writeData(myArr);
    console.log('done');
  });
}

var writeData = function (data) {
  var ws = fs.createWriteStream('result.csv');
  csv
      .write(data, {headers: true})
      .pipe(ws);
}

myDataArray()
// id rangeyear totalvalue
