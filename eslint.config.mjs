import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Airbnb-style rules adapted for TypeScript + Next.js
  {
    rules: {
      // ============================================
      // TYPESCRIPT
      // ============================================
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-use-before-define": ["error", { functions: false }],
      "@typescript-eslint/no-redeclare": "error",

      // ============================================
      // BEST PRACTICES (Airbnb)
      // ============================================
      "array-callback-return": ["error", { allowImplicit: true }],
      "block-scoped-var": "error",
      "consistent-return": "error",
      curly: ["error", "all"],
      "default-case": ["error", { commentPattern: "^no default$" }],
      "default-case-last": "error",
      "default-param-last": "error",
      "dot-notation": ["error", { allowKeywords: true }],
      eqeqeq: ["error", "always", { null: "ignore" }],
      "grouped-accessor-pairs": "error",
      "guard-for-in": "error",
      "no-alert": "warn",
      "no-caller": "error",
      "no-case-declarations": "error",
      "no-constructor-return": "error",
      "no-else-return": ["error", { allowElseIf: false }],
      "no-empty-function": ["error", { allow: ["arrowFunctions", "functions", "methods"] }],
      "no-empty-pattern": "error",
      "no-eval": "error",
      "no-extend-native": "error",
      "no-extra-bind": "error",
      "no-extra-label": "error",
      "no-fallthrough": "error",
      "no-global-assign": "error",
      "no-implied-eval": "error",
      "no-iterator": "error",
      "no-labels": ["error", { allowLoop: false, allowSwitch: false }],
      "no-lone-blocks": "error",
      "no-loop-func": "error",
      "no-multi-str": "error",
      "no-new": "error",
      "no-new-func": "error",
      "no-new-wrappers": "error",
      "no-octal": "error",
      "no-octal-escape": "error",
      "no-param-reassign": ["error", {
        props: true,
        ignorePropertyModificationsFor: [
          "acc", "accumulator", "e", "ctx", "context", "req", "request", "res", "response",
          "$scope", "staticContext", "draft",
        ],
      }],
      "no-proto": "error",
      "no-restricted-properties": [
        "error",
        { object: "arguments", property: "callee", message: "arguments.callee is deprecated" },
        { object: "global", property: "isFinite", message: "Please use Number.isFinite instead" },
        { object: "self", property: "isFinite", message: "Please use Number.isFinite instead" },
        { object: "window", property: "isFinite", message: "Please use Number.isFinite instead" },
        { object: "global", property: "isNaN", message: "Please use Number.isNaN instead" },
        { object: "self", property: "isNaN", message: "Please use Number.isNaN instead" },
        { object: "window", property: "isNaN", message: "Please use Number.isNaN instead" },
        { property: "__defineGetter__", message: "Please use Object.defineProperty instead." },
        { property: "__defineSetter__", message: "Please use Object.defineProperty instead." },
        { object: "Math", property: "pow", message: "Use the exponentiation operator (**) instead." },
      ],
      "no-return-assign": ["error", "always"],
      "no-script-url": "error",
      "no-self-assign": ["error", { props: true }],
      "no-self-compare": "error",
      "no-sequences": "error",
      "no-throw-literal": "error",
      "no-unused-expressions": ["error", {
        allowShortCircuit: false,
        allowTernary: false,
        allowTaggedTemplates: false,
      }],
      "no-unused-labels": "error",
      "no-useless-catch": "error",
      "no-useless-concat": "error",
      "no-useless-escape": "error",
      "no-useless-return": "error",
      "no-void": "error",
      "no-with": "error",
      "prefer-promise-reject-errors": ["error", { allowEmptyReject: true }],
      "prefer-regex-literals": ["error", { disallowRedundantWrapping: true }],
      radix: "error",
      "vars-on-top": "error",
      yoda: "error",

      // ============================================
      // VARIABLES (Airbnb)
      // ============================================
      "no-delete-var": "error",
      "no-label-var": "error",
      "no-restricted-globals": [
        "error",
        { name: "isFinite", message: "Use Number.isFinite instead" },
        { name: "isNaN", message: "Use Number.isNaN instead" },
        "addEventListener", "blur", "close", "closed", "confirm", "defaultStatus",
        "defaultstatus", "event", "external", "find", "focus", "frameElement",
        "frames", "history", "innerHeight", "innerWidth", "length", "location",
        "locationbar", "menubar", "moveBy", "moveTo", "name", "onblur", "onerror",
        "onfocus", "onload", "onresize", "onunload", "open", "opener", "opera",
        "outerHeight", "outerWidth", "pageXOffset", "pageYOffset", "parent", "print",
        "removeEventListener", "resizeBy", "resizeTo", "screen", "screenLeft",
        "screenTop", "screenX", "screenY", "scroll", "scrollbars", "scrollBy",
        "scrollTo", "scrollX", "scrollY", "self", "status", "statusbar", "stop",
        "toolbar", "top",
      ],
      "no-undef-init": "error",

      // ============================================
      // ES6+ (Airbnb)
      // ============================================
      "arrow-body-style": ["error", "as-needed", { requireReturnForObjectLiteral: false }],
      "constructor-super": "error",
      "no-class-assign": "error",
      "no-const-assign": "error",
      "no-dupe-class-members": "error",
      "no-duplicate-imports": "error",
      "no-new-symbol": "error",
      "no-this-before-super": "error",
      "no-useless-computed-key": "error",
      "no-useless-constructor": "error",
      "no-useless-rename": ["error", { ignoreDestructuring: false, ignoreImport: false, ignoreExport: false }],
      "no-var": "error",
      "object-shorthand": ["error", "always", { ignoreConstructors: false, avoidQuotes: true }],
      "prefer-arrow-callback": ["error", { allowNamedFunctions: false, allowUnboundThis: true }],
      "prefer-const": ["error", { destructuring: "any", ignoreReadBeforeAssign: true }],
      "prefer-destructuring": ["error", {
        VariableDeclarator: { array: false, object: true },
        AssignmentExpression: { array: true, object: false },
      }, { enforceForRenamedProperties: false }],
      "prefer-numeric-literals": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      "prefer-template": "error",
      "require-yield": "error",
      "symbol-description": "error",

      // ============================================
      // REACT (Airbnb)
      // ============================================
      "react/button-has-type": ["error", { button: true, submit: true, reset: false }],
      "react/jsx-boolean-value": ["error", "never", { always: [] }],
      "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
      "react/jsx-no-duplicate-props": ["error", { ignoreCase: true }],
      "react/jsx-no-undef": "error",
      "react/jsx-pascal-case": ["error", { allowAllCaps: true, ignore: [] }],
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/no-danger": "warn",
      "react/no-deprecated": "error",
      "react/no-direct-mutation-state": "error",
      "react/no-is-mounted": "error",
      "react/no-string-refs": "error",
      "react/no-unescaped-entities": "error",
      "react/no-unknown-property": "error",
      "react/prefer-es6-class": ["error", "always"],
      "react/prefer-stateless-function": ["error", { ignorePureComponents: true }],
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      "react/require-render-return": "error",
      "react/self-closing-comp": "error",
      "react/style-prop-object": "error",
      "react/void-dom-elements-no-children": "error",

      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // ============================================
      // IMPORTS
      // ============================================
      "import/no-mutable-exports": "error",
      "import/first": "error",
      "import/no-duplicates": "error",
      "import/newline-after-import": "error",
      "import/order": ["error", {
        groups: ["builtin", "external", "internal", ["parent", "sibling"], "index", "type"],
        "newlines-between": "never",
        alphabetize: { order: "asc", caseInsensitive: true },
      }],

      // ============================================
      // GENERAL
      // ============================================
      "no-console": "warn",
      "no-debugger": "error",
      "no-empty": "error",
      "no-extra-boolean-cast": "error",
      "no-regex-spaces": "error",
      "no-unreachable": "error",
      "no-unsafe-finally": "error",
      "no-unsafe-negation": "error",
      "use-isnan": "error",
      "valid-typeof": ["error", { requireStringLiterals: true }],
    },
  },

  // Ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "node_modules/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
