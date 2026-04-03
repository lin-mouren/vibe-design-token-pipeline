/**
 * Style Dictionary v4 config — Arco Design token build
 *
 * usesDtcg: true  →  parse $type / $value / $description keys per DTCG 2025.10
 * outputReferences  →  emit var(--alias) chains in CSS, preserving semantic reference chain
 *
 * Platforms:
 *   css        → dist/css/arco.css              CSS custom properties, light mode (:root)
 *   css-dark   → dist/css/arco-dark.css         CSS custom properties, dark theme overrides
 *   scss       → dist/scss/_arco-tokens.scss     SCSS variables
 *   tailwind   → dist/tailwind/arco-preset.js   Tailwind theme extension preset
 *   js         → dist/ts/arco.tokens.js         ES module, resolved values for TS/JS consumers
 *   json       → dist/json/arco.resolved.json   Fully-resolved flat JSON for tooling/LLM context
 *   ios        → dist/ios/ArcoTokens.swift      Swift/SwiftUI token constants
 *   android    → dist/android/arco_tokens.xml   Android resources (XML)
 */
export default {
  usesDtcg: true,

  source: [
    'source/tokens/core/*.tokens.json',
    'source/tokens/semantic/*.tokens.json',
    'source/tokens/components/*.tokens.json',
    'source/tokens/themes/*.tokens.json',
  ],

  platforms: {
    // ── Web: CSS Custom Properties ─────────────────────────────────────────
    css: {
      transformGroup: 'css',
      prefix: '',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'arco.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            selector: ':root',
          },
          filter: (token) => !token.path.includes('dark'),
        },
      ],
    },

    'css-dark': {
      transformGroup: 'css',
      prefix: '',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'arco-dark.css',
          format: 'css/variables',
          options: {
            outputReferences: false,
            selector: '[data-theme="dark"], .arco-theme-dark',
          },
          filter: (token) => {
            const src = token.filePath ?? '';
            return src.includes('themes/dark');
          },
        },
      ],
    },

    // ── Web: SCSS Variables ────────────────────────────────────────────────
    scss: {
      transformGroup: 'scss',
      buildPath: 'dist/scss/',
      files: [
        {
          destination: '_arco-tokens.scss',
          format: 'scss/variables',
          options: { outputReferences: true },
          filter: (token) => !token.path.includes('dark'),
        },
      ],
    },

    // ── Web: Tailwind Preset ───────────────────────────────────────────────
    tailwind: {
      transformGroup: 'js',
      buildPath: 'dist/tailwind/',
      files: [
        {
          destination: 'arco-preset.js',
          format: 'javascript/es6',
          // Tailwind consumers wrap this in their tailwind.config.js theme.extend
          filter: (token) =>
            !token.path.includes('dark') &&
            ['color', 'dimension', 'fontFamily', 'fontWeight', 'number'].includes(token.$type ?? token.type),
        },
      ],
    },

    // ── Web: JavaScript/TypeScript Module ─────────────────────────────────
    js: {
      transformGroup: 'js',
      buildPath: 'dist/ts/',
      files: [
        {
          destination: 'arco.tokens.js',
          format: 'javascript/es6',
          filter: (token) => !token.path.includes('dark'),
        },
      ],
    },

    // ── Tooling: Resolved JSON ─────────────────────────────────────────────
    json: {
      transformGroup: 'js',
      buildPath: 'dist/json/',
      files: [
        {
          destination: 'arco.resolved.json',
          format: 'json/flat',
          options: { outputReferences: false },
        },
      ],
    },

    // ── iOS: Swift/SwiftUI ─────────────────────────────────────────────────
    ios: {
      transformGroup: 'ios-swift',
      buildPath: 'dist/ios/',
      files: [
        {
          destination: 'ArcoTokens.swift',
          format: 'ios-swift/class.swift',
          options: { className: 'ArcoTokens' },
          filter: (token) =>
            !token.path.includes('dark') &&
            ['color', 'dimension'].includes(token.$type ?? token.type),
        },
      ],
    },

    // ── Android: XML Resources ─────────────────────────────────────────────
    android: {
      transformGroup: 'android',
      buildPath: 'dist/android/',
      files: [
        {
          destination: 'arco_tokens.xml',
          format: 'android/resources',
          filter: (token) =>
            !token.path.includes('dark') &&
            ['color', 'dimension'].includes(token.$type ?? token.type),
        },
      ],
    },
  },
};
