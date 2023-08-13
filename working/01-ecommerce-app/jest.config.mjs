export default {
  clearMocks: true,
  // collectCoverage: true,
  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["text", "lcov"],
  coverageThreshold: {
    global: {
      branch: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
