const fs = require("fs");

function fileExists(fileName) {
  return fs.existsSync(fileName);
}

function validNumber(value) {
  // returns a boolean
}

function dataDimensions(dataframe) {
  // returns an array [ number, number ]
}

function calculateMean(dataset) {
  // returns a number
}

function findTotal(dataset) {
  // returns float or false
}

function convertToNumber(dataframe, col) {
  // returns a number, which is the number that were  converted to datatype number.
}

function flatten(dataframe) {
  // returns a dataset (a flattened dataframe)
}

function loadCSV(csvFile, ignorerows, ignorecols) {
  // returns a list comprising of [dataframe, rows (integer), cols (integer)]
}

function calculateMedian(dataset) {
  // return float or false
}

function createSlice(dataframe, colindex, colpattern, exportcols = []) {
  // returns a dataframe
}

module.exports = {
  fileExists,
  validNumber,
  dataDimensions,
  calculateMean,
  findTotal,
  convertToNumber,
  flatten,
  loadCSV,
  calculateMedian,
  createSlice,
};
