/* ═══ eslint.config.js — the linter (`npm run lint`) ═══
   Next's recommended rules (core-web-vitals) plus a few of our own below.
   "error" fails `npm run verify`; "warn" only prints. */
import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  /* .next and out are build output — linting them slows lint down and reports
     false errors from generated code. */
  { ignores: [".venv/**", ".next/**", "out/**", "node_modules/**"] },
  ...nextVitals,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      eqeqeq: ["error", "always"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-eval": "error",
      "no-unused-vars": "off",
      "@next/next/no-img-element": "warn",
      "react/no-unescaped-entities": "warn",
      "react-hooks/exhaustive-deps": "warn",
      /* React Compiler checks, on: browser-only values are read with
         useSyncExternalStore (lib/use-client.ts) or a lazy useState, never
         "mount, then setState" in an effect */
      "react-hooks/preserve-manual-memoization": "error",
      "react-hooks/immutability": "error",
      "react-hooks/set-state-in-effect": "error"
    }
  }
]);
