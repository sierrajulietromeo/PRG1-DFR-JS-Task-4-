const {
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
} = require("./dfr.js");

describe("Dataframe function tests", () => {
  // Helper function to test valid and invalid numbers
  const testValidNumbers = (validNumbers, invalidNumbers) => {
    validNumbers.forEach((n) => expect(validNumber(n)).toBe(true));
    invalidNumbers.forEach((n) => expect(validNumber(n)).toBe(false));
  };

  // Helper function to test data dimensions
  const testDataDimensions = (data, expectedDimensions) => {
    expect(dataDimensions(data)).toMatchObject(expectedDimensions);
  };

  test("T01_fileExists: Checks if a file exists", () => {
    expect(fileExists("./assets/testing/datatrafficdataset_10.csv")).toBe(true);
    expect(fileExists("./assets/testing/invalidfile.csv")).toBe(false);
    expect(fileExists("")).toBe(false);
  });

  test("T02_validNumber: Correctly identifies valid and invalid numbers", () => {
    const validNumbers = [
      0, 1, 100, 1000, 10000, -1, -100, 0.1, 1.1, 100.1, -1000, -1.1,
    ];
    const invalidNumbers = [
      "10+", "1_0", "1A", "A1", "+100", "", "A", "-1-", "0.1.", "+-1.1", ".",
      "5.", "1-", "1-.", "-", "+",
    ];
    testValidNumbers(validNumbers, invalidNumbers);
  });

  test("T03_dataDimensions: Returns correct dimensions for dataframes and datasets", () => {
    testDataDimensions(
      [
        ["tcp", 1, 2, 3],
        ["icmp", 4, 5, 6],
        ["tcp", 7, 8, 9],
      ],
      [3, 4]
    );
    testDataDimensions(
      [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      [3, 3]
    );
    testDataDimensions([13, 14, 15], [3, -1]);
    testDataDimensions(["aaaaa", "bbbbb", "ccccc"], [3, -1]);
    testDataDimensions("", [-1, -1]);
    testDataDimensions(undefined, [-1, -1]);
  });

  test("T04_convertToNumber: Converts specified column to numbers", () => {
    const _df1 = [
      ["tcp", 1, "2", 3],
      ["1.2", 4, "5", 6],
      ["tcp", 7, 8, "9"],
    ];

    expect(convertToNumber(_df1, 0)).toBe(1);
    expect(typeof _df1[0][0]).toBe("string");
    expect(typeof _df1[1][0]).toBe("number");
    expect(typeof _df1[2][0]).toBe("string");
    expect(_df1[0][0]).toBe("tcp");
    expect(_df1[1][0]).toBe(1.2);
    expect(_df1[2][0]).toBe("tcp");

    expect(convertToNumber(_df1, 2)).toBe(2);
    expect(typeof _df1[0][2]).toBe("number");
    expect(typeof _df1[1][2]).toBe("number");
    expect(_df1[0][2]).toBe(2);
    expect(_df1[1][2]).toBe(5);
    expect(_df1[2][2]).toBe(8);

    expect(convertToNumber(_df1, 3)).toBe(1);
    expect(typeof _df1[2][3]).toBe("number");
    expect(_df1[0][3]).toBe(3);
    expect(_df1[1][3]).toBe(6);
    expect(_df1[2][3]).toBe(9);
  });

  test("T05_calculateMean: Calculates the mean of a dataset", () => {
    expect(calculateMean([10, 20, -5.5, 0.5, "AA", 10, 25])).toBe(10.0);
    expect(calculateMean([-5.5])).toBe(-5.5);
    expect(calculateMean(["-5.5"])).toBe(-5.5);
    expect(calculateMean([[10, 20, -5.5, 0.5, "AA", 10, 25]])).toBe(false);
    expect(calculateMean([])).toBe(false);
    expect(calculateMean([1.5, 1.9, 10.0, 50, -10, "3", "1"])).toBe(8.2);

    let _mean = calculateMean([-5.5]);
    expect(typeof _mean).toBe("number");
  });

  test("T06_findTotal: Calculates the sum of a dataset", () => {
    expect(findTotal([1.5, 1.9, "AA", 10.0, 44.02, 50, -10, "3", "1"])).toBe(
      101.42
    );
    expect(findTotal([[0]])).toBe(false);
    expect(findTotal("")).toBe(false);
    expect(
      typeof findTotal([1.5, 1.9, "AA", 10.0, 44.02, 50, -10, "3", "1"])
    ).toBe("number");
    expect(findTotal([1])).toBe(1.0);
    expect(typeof findTotal([1])).toBe("number");
  });

  test("T07_calculateMedian: Calculates the median of a dataset", () => {
    expect(calculateMedian([1.5, 1.9, 10.0, 50, -10, 3, 1, 3, 55, 20])).toBe(
      3.0
    );
    expect(calculateMedian([33, 3.4, 33.4, 55, 4, 43, 56])).toBe(33.4);
    expect(calculateMedian([17, 10, 15, 17])).toBe(16.0);
    expect(calculateMedian([17, 10, 18, 15, 17])).toBe(17.0);
    expect(calculateMedian([17, 10, "18", 15, "", 17, "AA"])).toBe(17.0);
    expect(calculateMedian(["19"])).toBe(19.0);
    expect(typeof calculateMedian(["19"])).toBe("number");
    expect(calculateMedian([])).toBe(false);
  });

  test("T08_flatten: Flattens a dataframe into a single array", () => {
    const _df1 = [["99"], [10], [20], [2.3], [0.7]];
    const _df2 = ["99", 10, 20, 2.3, 0.7];
    expect(flatten(_df1)).toMatchObject(_df2);
    expect(flatten(_df2)).toMatchObject([]);
  });

  test("T09_createSlice: Creates a slice of a dataframe based on criteria", () => {
    const _df1 = [
      ["head0", "head1", "head2", "head3"],
      ["tcp", 1, 2, 3],
      ["icmp", 4, 5, 6],
      ["tcp", 7, 8, 9],
    ];

    expect(createSlice(_df1, 0, "icmp", [0, 2])).toMatchObject([["icmp", 5]]);
    expect(createSlice(_df1, 0, "tcp", [0, 2])).toMatchObject([
      ["tcp", 2],
      ["tcp", 8],
    ]);
    expect(createSlice(_df1, 0, "tcp")).toMatchObject([
      ["tcp", 1, 2, 3],
      ["tcp", 7, 8, 9],
    ]);
    expect(createSlice(_df1, 1, "*")).toMatchObject([
      ["head0", "head1", "head2", "head3"],
      ["tcp", 1, 2, 3],
      ["icmp", 4, 5, 6],
      ["tcp", 7, 8, 9],
    ]);
    expect(createSlice(_df1, 2, 8, [2, 3])).toMatchObject([[8, 9]]);
  });

  test("T10_loadCSV: Loads CSV data with specified rows and columns ignored", async function () {
    let _ignorerows = [0]; // no headers
    let _ignorecols = [
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    ]; // only cols 0, 1, & 20 should be loaded
    let _sourcefile = "./assets/testing/datatrafficdataset_10.csv"; // 11 rows, 21 columns

    let [dataframe, rows, cols] = loadCSV(
      _sourcefile,
      _ignorerows,
      _ignorecols
    );
    expect(rows).toBe(11); // check source file rows
    expect(cols).toBe(21); // check source file cols

    // Add assertions to check the content of the dataframe
    expect(dataframe.length).toBe(10); // 11 rows - 1 header row = 10 data rows
    expect(dataframe[0].length).toBe(3); // 3 columns should be loaded
    expect(dataframe[0]).toEqual(["tcp", "0", "neptune"]);
  });

  test("T11_loadCSV: Loads, slices, flattens, and calculates data from CSV", async function () {
    let _ignorerows = [0]; // no headers
    let _ignorecols = [
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    ]; // only cols 0, 1, & 20 should be loaded
    let _sourcefile = "./assets/testing/datatrafficdataset_10.csv"; // 11 rows, 21 columns

    let [dataframe, rows, cols] = loadCSV(
      _sourcefile,
      _ignorerows,
      _ignorecols
    );
    expect(rows).toBe(11); // check source file rows
    expect(cols).toBe(21); // check source file cols

    expect(dataframe[0]).toMatchObject(["tcp", "0", "neptune"]); // sample the expected loaded data
    expect(dataframe[2]).toMatchObject(["icmp", "1032", "smurf"]);
    expect(dataframe[5]).toMatchObject(["icmp", "520", "smurf"]);
    expect(dataframe[9]).toMatchObject(["tcp", "325", "normal"]);

    expect(dataDimensions(dataframe)).toMatchObject([10, 3]); // check loaded dimensions based on the ignore

    // create a slice with only 'icmp' values and only col 1 (base 0) 'source bytes'
    let _df1 = createSlice(dataframe, 0, "icmp", [1]); // --> [['1032'], ['520'], ['1032']]
    expect(_df1).toMatchObject([["1032"], ["520"], ["1032"]]); // confirm slice

    let _df1_flat = flatten(_df1); // --> ['1032', '520', '1032']
    expect(_df1_flat).toMatchObject(["1032", "520", "1032"]); // confirm flat values

    let _sourcebytes_icmp = findTotal(_df1_flat); // --> 2584.0
    expect(_sourcebytes_icmp).toBe(2584.0); // check final value
  });
});
