import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import prettierConfig from "eslint-config-prettier";
import jestDom from "eslint-plugin-jest-dom";
import testingLibrary from "eslint-plugin-testing-library";

export default [
  {
    ignores: ["dist/**", "functions/**"],
  },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  prettierConfig,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["**/*.test.{ts,tsx}"],
    plugins: {
      "jest-dom": jestDom,
      "testing-library": testingLibrary,
    },
    rules: {
      ...jestDom.configs.recommended.rules,
      ...testingLibrary.configs.react.rules,
    },
  },
];
