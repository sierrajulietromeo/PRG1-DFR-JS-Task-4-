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

describe("DataFrame Project Tests", () => {
  test("fileExists: Should correctly identify existing and non-existing files", () => {
    expect(fileExists("./sales_data.csv")).toBe(true);
    expect(fileExists("./assets/testing/nonexistent.csv")).toBe(false);
    expect(fileExists("")).toBe(false);
  });

  test("validNumber: Should correctly identify valid and invalid numbers", () => {
    // Valid numbers
    const validCases = [
      0, // zero
      1.5, // positive decimal
      -1.12, // negative decimal
      100, // positive integer
      -100, // negative integer
      "1.5", // string decimal
      "-1.12", // string negative decimal
      "100", // string integer
    ];

    // Invalid numbers
    const invalidCases = [
      "+1.5", // explicit plus sign
      "5.", // trailing decimal
      "1.2.3", // multiple decimals
      "ABC", // letters
      "12ABC", // numbers with letters
      "", // empty string
      ".", // just decimal
      "-", // just minus
      "+-1.1", // invalid sign combination
    ];

    validCases.forEach((number) => expect(validNumber(number)).toBe(true));
    invalidCases.forEach((number) => expect(validNumber(number)).toBe(false));
  });

  test("dataDimensions: Should return correct dimensions for various data structures", () => {
    // 2D array (DataFrame)
    const salesData = [
      ["date", "region", "sales"],
      ["2024-01", "North", 1000],
      ["2024-01", "South", 1500],
    ];
    expect(dataDimensions(salesData)).toEqual([3, 3]);

    // 1D array (Dataset)
    const monthlySales = [1000, 1500, 2000];
    expect(dataDimensions(monthlySales)).toEqual([3, -1]);

    // Empty input
    expect(dataDimensions("")).toEqual([-1, -1]);
    expect(dataDimensions(undefined)).toEqual([-1, -1]);
  });

  test("findTotal: Should calculate correct sum for datasets", () => {
    const salesFigures = [1500.5, 1900.25, "2000.00", "invalid", 1750.75];
    expect(findTotal(salesFigures)).toBe(7151.5);

    const singleSale = [1500.0];
    expect(findTotal(singleSale)).toBe(1500.0);

    // Invalid inputs
    expect(findTotal([[1500.5]])).toBe(0); // 2D array not allowed
    expect(findTotal("")).toBe(0);
  });

  test("calculateMean: Should calculate correct average for datasets", () => {
    const temperatures = [20.5, 21.0, "22.5", 19.8, "invalid", 20.2];
    expect(calculateMean(temperatures)).toBe(20.8);

    const singleValue = ["-5.5"];
    expect(calculateMean(singleValue)).toBe(-5.5);

    // Invalid inputs
    expect(calculateMean([])).toBe(0);
    expect(calculateMean([[20.5, 21.0]])).toBe(0); // 2D array not allowed
  });

  test("calculateMedian: Should find correct middle value", () => {
    // Odd number of values
    const oddDataset = [10, 20, 30, 40, 50];
    expect(calculateMedian(oddDataset)).toBe(30.0);

    // Even number of values
    const evenDataset = [10, 20, 30, 40];
    expect(calculateMedian(evenDataset)).toBe(25.0);

    // Dataset with invalid values
    const mixedDataset = [10, 20, "30", "invalid", 40, 50];
    expect(calculateMedian(mixedDataset)).toBe(30.0);

    // Single value
    expect(calculateMedian(["19"])).toBe(19.0);

    // Invalid input
    expect(calculateMedian([])).toBe(0);
  });

  test("convertToNumber: Should convert string numbers to actual numbers in specified columns", () => {
    const salesData = [
      ["region", "sales", "units"],
      ["North", "1000", "50"],
      ["South", "1500", "75"],
      ["East", "2000", "100"],
    ];

    // Convert sales column (index 1)
    expect(convertToNumber(salesData, 1)).toBe(3);
    expect(typeof salesData[1][1]).toBe("number");
    expect(salesData[1][1]).toBe(1000);
    expect(salesData[2][1]).toBe(1500);
    expect(salesData[3][1]).toBe(2000);

    // Convert units column (index 2)
    expect(convertToNumber(salesData, 2)).toBe(3);
    expect(typeof salesData[1][2]).toBe("number");
    expect(salesData[1][2]).toBe(50);
    expect(salesData[2][2]).toBe(75);
    expect(salesData[3][2]).toBe(100);
  });

  test("flatten: Should convert single-column DataFrame to Dataset", () => {
    const monthlyTemperatures = [[20.5], [21.0], [22.5], [19.8], [20.2]];
    expect(flatten(monthlyTemperatures)).toEqual([
      20.5, 21.0, 22.5, 19.8, 20.2,
    ]);

    // Invalid input (not a single-column DataFrame)
    const multiColumnData = [20.5, 21.0, 22.5];
    expect(flatten(multiColumnData)).toEqual([]);
  });

  test("createSlice: Should create correct DataFrame slices", () => {
    const salesData = [
      ["date", "region", "product", "sales"],
      ["2024-01", "North", "Laptop", 1000],
      ["2024-01", "South", "Phone", 1500],
      ["2024-01", "North", "Tablet", 2000],
    ];

    // Get all North region sales
    expect(createSlice(salesData, 1, "North", [1, 3])).toEqual([
      ["North", 1000],
      ["North", 2000],
    ]);

    // Get all rows, only region and sales columns
    expect(createSlice(salesData, 0, "*", [1, 3])).toEqual([
      ["region", "sales"],
      ["North", 1000],
      ["South", 1500],
      ["North", 2000],
    ]);
  });

  test("loadCSV: Should correctly load and process CSV files", () => {
    const [salesData, totalRows, totalColumns] = loadCSV(
      "./sales_data.csv",
      [0], // Skip header row
      [] // Include all columns
    );

    expect(totalRows).toBe(7); // 6 data rows + 1 header
    expect(totalColumns).toBe(7); // date, region, product, quantity, unit_price, total_sales, status

    // Check first row of data
    expect(salesData[0]).toEqual([
      "2024-01-15",
      "North",
      "Laptop",
      "5",
      "999.99",
      "4999.95",
      "completed",
    ]);

    // Test with non-existent file
    const [emptyData, rows, cols] = loadCSV("./nonexistent.csv");
    expect(emptyData).toEqual([]);
    expect(rows).toBe(-1);
    expect(cols).toBe(-1);
  });

  test("Integration: Should load CSV, slice data, and calculate totals", () => {
    // Load sales data
    const [salesData, totalRows, totalColumns] = loadCSV(
      "./sales_data.csv",
      [0], // Skip header
      [] // Include all columns
    );

    // Convert sales column to numbers
    convertToNumber(salesData, 3);

    // Get North region sales
    // Go to column 1,
    // Identify all rows in column1 with string "North",
    // Then from those rows access everything in column 3
    const northSales = createSlice(salesData, 1, "North", [5]);

    // Flatten to get just sales figures
    const northSalesData = flatten(northSales);

    // Calculate total North region sales
    const totalNorthSales = findTotal(northSalesData);
    expect(totalNorthSales).toBe(7099.92); // Example expected total
  });
});
