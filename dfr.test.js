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
  describe("fileExists", () => {
    test("should identify existing files", () => {
      expect(fileExists("./sales_data.csv")).toBe(true);
    });

    test("handles nonexistent and empty file paths", () => {
      expect(fileExists("./assets/testing/nonexistent.csv")).toBe(false);
      expect(fileExists("")).toBe(false);
    });
  });

  describe("validNumber", () => {
    test("should identify valid numbers", () => {
      const validCases = [
        0,
        1.5,
        -1.12,
        100,
        -100,
        "1.5",
        "-1.12",
        "100",
      ];
      validCases.forEach((number) => expect(validNumber(number)).toBe(true));
    });

    test("handles invalid number formats and special characters", () => {
      const invalidCases = [
        "+1.5",
        "5.",
        "1.2.3",
        "ABC",
        "12ABC",
        "",
        ".",
        "-",
        "+-1.1",
      ];
      invalidCases.forEach((number) => expect(validNumber(number)).toBe(false));
    });
  });

  describe("dataDimensions", () => {
    test("should return correct dimensions for 2D array", () => {
      const salesData = [
        ["date", "region", "sales"],
        ["2024-01", "North", 1000],
        ["2024-01", "South", 1500],
      ];
      expect(dataDimensions(salesData)).toEqual([3, 3]);
    });

    test("should return correct dimensions for 1D array", () => {
      const monthlySales = [1000, 1500, 2000];
      expect(dataDimensions(monthlySales)).toEqual([3, -1]);
    });

    test("handles empty and undefined inputs", () => {
      expect(dataDimensions("")).toEqual([-1, -1]);
      expect(dataDimensions(undefined)).toEqual([-1, -1]);
    });
  });

  describe("findTotal", () => {
    test("should calculate correct sum for valid datasets", () => {
      const salesFigures = [1500.5, 1900.25, "2000.00", 1750.75];
      expect(findTotal(salesFigures)).toBe(7151.5);
      
      const singleSale = [1500.0];
      expect(findTotal(singleSale)).toBe(1500.0);
    });

    test("handles invalid inputs and 2D arrays", () => {
      expect(findTotal([[1500.5]])).toBe(0); // 2D array not allowed
      expect(findTotal("")).toBe(0);
      const mixedData = [1500.5, 1900.25, "invalid", 1750.75];
      expect(findTotal(mixedData)).toBe(5151.5); // Should skip invalid value
    });
  });

  describe("calculateMean", () => {
    test("should calculate correct average for valid datasets", () => {
      const temperatures = [20.5, 21.0, "22.5", 19.8, 20.2];
      expect(calculateMean(temperatures)).toBe(20.8);
      
      const singleValue = ["-5.5"];
      expect(calculateMean(singleValue)).toBe(-5.5);
    });

    test("handles empty arrays and invalid data types", () => {
      expect(calculateMean([])).toBe(0);
      expect(calculateMean([[20.5, 21.0]])).toBe(0);
      const mixedData = [20.5, 21.0, "invalid", 19.8, 20.2];
      expect(calculateMean(mixedData)).toBe(20.375); // Should skip invalid value
    });
  });

  describe("calculateMedian", () => {
    test("should find correct middle value for valid datasets", () => {
      const oddDataset = [10, 20, 30, 40, 50];
      expect(calculateMedian(oddDataset)).toBe(30.0);
      
      const evenDataset = [10, 20, 30, 40];
      expect(calculateMedian(evenDataset)).toBe(25.0);
      
      const singleValue = ["19"];
      expect(calculateMedian(singleValue)).toBe(19.0);
    });

    test("handles empty arrays and invalid values", () => {
      expect(calculateMedian([])).toBe(0);
      const mixedDataset = [10, 20, "30", "invalid", 40, 50];
      expect(calculateMedian(mixedDataset)).toBe(30.0);
    });
  });

  describe("convertToNumber", () => {
    test("should convert string numbers to actual numbers", () => {
      const salesData = [
        ["region", "sales", "units"],
        ["North", "1000", "50"],
        ["South", "1500", "75"],
      ];
      
      expect(convertToNumber(salesData, 1)).toBe(2);
      expect(typeof salesData[1][1]).toBe("number");
      expect(salesData[1][1]).toBe(1000);
      expect(salesData[2][1]).toBe(1500);
    });

    test("handles non-numeric strings in conversion", () => {
      const mixedData = [
        ["region", "sales"],
        ["North", "invalid"],
        ["South", "1500"],
      ];
      expect(convertToNumber(mixedData, 1)).toBe(1); // Should only convert valid numbers
    });
  });

  describe("flatten", () => {
    test("should convert single-column DataFrame to Dataset", () => {
      const monthlyTemperatures = [[20.5], [21.0], [22.5], [19.8], [20.2]];
      expect(flatten(monthlyTemperatures)).toEqual([
        20.5, 21.0, 22.5, 19.8, 20.2,
      ]);
    });

    test("handles invalid data structures", () => {
      const multiColumnData = [20.5, 21.0, 22.5];
      expect(flatten(multiColumnData)).toEqual([]);
    });
  });

  describe("createSlice", () => {
    test("should create correct DataFrame slices", () => {
      const salesData = [
        ["date", "region", "product", "sales"],
        ["2024-01", "North", "Laptop", 1000],
        ["2024-01", "South", "Phone", 1500],
        ["2024-01", "North", "Tablet", 2000],
      ];

      expect(createSlice(salesData, 1, "North", [1, 3])).toEqual([
        ["North", 1000],
        ["North", 2000],
      ]);
    });

    test("should handle wildcard selections", () => {
      const salesData = [
        ["date", "region", "product", "sales"],
        ["2024-01", "North", "Laptop", 1000],
        ["2024-01", "South", "Phone", 1500],
      ];

      expect(createSlice(salesData, 0, "*", [1, 3])).toEqual([
        ["region", "sales"],
        ["North", 1000],
        ["South", 1500],
      ]);
    });
  });

  describe("loadCSV", () => {
    test("should correctly load and process CSV files", () => {
      const [salesData, totalRows, totalColumns] = loadCSV(
        "./sales_data.csv",
        [0],
        []
      );

      expect(totalRows).toBe(7);
      expect(totalColumns).toBe(7);
      expect(salesData[0]).toEqual([
        "2024-01-15",
        "North",
        "Laptop",
        "5",
        "999.99",
        "4999.95",
        "completed",
      ]);
    });

    test("handles nonexistent file paths", () => {
      const [emptyData, rows, cols] = loadCSV("./nonexistent.csv");
      expect(emptyData).toEqual([]);
      expect(rows).toBe(-1);
      expect(cols).toBe(-1);
    });
  });

  describe("Integration", () => {
    test("should load CSV, slice data, and calculate totals", () => {
      const [salesData, totalRows, totalColumns] = loadCSV(
        "./sales_data.csv",
        [0],
        []
      );

      convertToNumber(salesData, 3);
      const northSales = createSlice(salesData, 1, "North", [5]);
      const northSalesData = flatten(northSales);
      const totalNorthSales = findTotal(northSalesData);
      
      expect(totalNorthSales).toBe(7099.92);
    });
  });
});