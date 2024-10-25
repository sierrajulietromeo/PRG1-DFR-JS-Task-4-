const fs = require("fs");
const dfd = require("danfojs-node");
const math = require("mathjs");

function fileExists(filename) {
  return fs.existsSync(filename);
}

function validNumber(value) {
  const regexAnyNumericValue = /^-?\d+(\.\d+)?$/;
  return regexAnyNumericValue.test(value);
}

function dataDimensions(dataframe) {
  if (Array.isArray(dataframe)) {
    if (Array.isArray(dataframe[0])) {
      return [dataframe.length, dataframe[0].length];

    } else {
      return [dataframe.length, -1];
    }
  }
  return [-1, -1];
}
function calculateMean(dataset) {
  let amountOfNumsCounter = 0;
  if (dataDimensions(dataset)[0] < 1 || dataDimensions(dataset)[1] !== -1) {
    return false;

  } else {
    for (const element of dataset) {
      if (!isNaN(Number(element))) {
        amountOfNumsCounter++;
      }
    }
    return findTotal(dataset) / amountOfNumsCounter;
  }
}

function findTotal(dataset) {
  let totalSumOfNums = 0;
  if (dataDimensions(dataset)[0] < 1 || dataDimensions(dataset)[1] !== -1) {
    return false;

  } else {
    for (const element of dataset) {
      if (!isNaN(Number(element))) {
        totalSumOfNums += Number(element);
      }
    }
    return totalSumOfNums;
  }
}

function convertToNumber(dataframe, col) {
  let convertedToFloatCounter = 0;
  let rowCounter = 0;

  for (const row of dataframe) {
    if (typeof row[col] === "string" && validNumber(row[col])) {
      dataframe[rowCounter][col] = Number(dataframe[rowCounter][col]);
      convertedToFloatCounter++;
    }
    rowCounter++;
  }
  return convertedToFloatCounter;
}

function flatten(dataframe) {
  const flattenedDataset = [];

  if (dataDimensions(dataframe)[0] >= 1 && dataDimensions(dataframe)[1] === 1) {
    for (const array of dataframe) {
      flattenedDataset.push(array[0]);
    }
    return flattenedDataset;
  }
  return flattenedDataset;
}

function csvToDf(csvFilePath) {
  // Function returns a Danfo Dataframe and not a classic 2D Array
  const csvData = fs.readFileSync(csvFilePath, "utf-8");
  const dataSplitIntoArray = csvData.split(/\r?\n|\r/);
  const dataRowsInArrays = dataSplitIntoArray.map((row) => row.split(","));
  return new dfd.DataFrame(dataRowsInArrays);
}

function loadCSV(csvFile, ignorerows, ignorecols) {
  // returns a dataframe with specified rows and columns ignored, also returns the dimensions of the CSV file
  if (!fileExists(csvFile)) {
    return [[], -1, -1];

  } else {
    let includedRows = [];
    let includedColumns = [];
    const df = csvToDf(csvFile);

    for (let i = 0; i < df.values.length; i++) {
      includedRows.push(i);
    }
    for (let i = 0; i < df.values[0].length; i++) {
      includedColumns.push(i);
    }

    includedRows = includedRows.filter((index) => !ignorerows.includes(index));
    includedColumns = includedColumns.filter(
      (index) => !ignorecols.includes(index)
    );

    const sub_df = df.iloc({ rows: includedRows, columns: includedColumns });
    const [rows, columns] = dataDimensions(df.values)
    return [sub_df.values, rows, columns];
  }
}

function calculateMedian(dataset) {
  if (dataDimensions(dataset)[0] < 1 || dataDimensions(dataset)[1] !== -1) {
    return false;

  } else if (Array.isArray(dataset)) {
    const ValidNumfilteredDs = dataset.filter((value) => validNumber(value));
    const numbersConvertedDs = ValidNumfilteredDs.map((value) => Number(value));
    return math.median(...numbersConvertedDs);
  }
}

function createSlice(dataframe, colindex, colpattern, exportcols = []) {
  let rowCounter = 0;
  let rowsIncluded = [];
  const df = new dfd.DataFrame(dataframe);

  for (const row of dataframe) {
    if (row[colindex] === colpattern) {
      rowsIncluded.push(rowCounter);
    }
    rowCounter++;
  }

  if (colpattern === "*" && exportcols.length === 0) {
    return dataframe;

  } else if (colpattern === "*") {
    const slicedDfAllRows = df.iloc({ columns: exportcols }).values;
    return slicedDfAllRows;

  } else if (exportcols.length === 0) {
    const slicedDfSelectedRows = df.iloc({ rows: rowsIncluded }).values;
    return slicedDfSelectedRows;

  } else {
    const slicedDfExportCols = df.iloc({
      rows: rowsIncluded,
      columns: exportcols,
    }).values;
    return slicedDfExportCols;
  }
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