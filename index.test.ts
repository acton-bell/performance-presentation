import { readFileSync } from "fs";
import { calculateAggs } from ".";
const { performance } = require("perf_hooks");

const testData = JSON.parse(readFileSync("testData.json", "utf8")); // 5K nodes, 12 props
const bigTestData = JSON.parse(readFileSync("bigTestData.json", "utf8")); // 20K nodes, 12 props

describe("calculateAggs", () => {
  it("works without crashing", () => {
    const x = performance.now();
    const results = calculateAggs(testData);
    console.log(performance.now() - x);

    // TODO: Write better tests here :)
    expect(results).toBeDefined();

    // Uncomment to generate/examine snapshots:
    // expect(results).toMatchSnapshot();
  });
});
