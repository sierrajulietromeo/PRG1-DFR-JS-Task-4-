const fs = require("fs");
const dfd = require("danfojs-node");
const math = require("mathjs");

function fileExists(filename) {
  return fs.existsSync(filename);
}

function validNumber(value) {
  
}

function dataDimensions(dataframe) {

}

function calculateMean(dataset) {

}

function findTotal(dataset) {

}

function convertToNumber(dataframe, col) {

}

function flatten(dataframe) {

}

function csvToDf(csvFilePath) {

}

function loadCSV(csvFile, ignorerows, ignorecols) {

}

function calculateMedian(dataset) {

}

function createSlice(dataframe, colindex, colpattern, exportcols = []) {

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