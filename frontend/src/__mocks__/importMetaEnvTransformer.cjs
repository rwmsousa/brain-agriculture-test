// Custom Jest transformer that handles import.meta.env
const { TsJestTransformer } = require('ts-jest');

const tsJestOptions = {
  tsconfig: {
    jsx: 'react-jsx',
    strictPropertyInitialization: false,
  },
  diagnostics: false,
};

const tsJestTransformer = new TsJestTransformer(tsJestOptions);

module.exports = {
  process(sourceText, sourcePath, options) {
    // Replace import.meta.env references before ts-jest processes them
    const transformed = sourceText
      .replace(/import\.meta\.env\.(\w+)/g, (_, key) => `(process.env['${key}'] || '')`)
      .replace(/import\.meta\.env/g, 'process.env');
    return tsJestTransformer.process(transformed, sourcePath, options);
  },
  getCacheKey(fileData, filePath, options) {
    return tsJestTransformer.getCacheKey ? tsJestTransformer.getCacheKey(fileData, filePath, options) : filePath;
  },
};
