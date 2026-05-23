"use strict";

function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.BasicContentApplication = f();
  }
})(function () {
  var define, module, exports;
  return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }
          var p = n[i] = {
            exports: {}
          };
          e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];
            return o(n || r);
          }, p, p.exports, r, e, n, t);
        }
        return n[i].exports;
      }
      for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
      return o;
    }
    return r;
  }()({
    1: [function (require, module, exports) {
      const libPictApplication = require('pict-application');
      const libPictSectionContent = require('../../source/Pict-Section-Content.js');
      class BasicContentApplication extends libPictApplication {
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);
          this.pict.addProvider('Content-Provider', libPictSectionContent.PictContentProvider.default_configuration, libPictSectionContent.PictContentProvider);
          this.pict.addView('BasicContent', libPictSectionContent.default_configuration, libPictSectionContent);
        }
        onAfterInitializeAsync(fCallback) {
          let tmpContentProvider = this.pict.providers['Content-Provider'];
          let tmpMarkdown = this.getExampleMarkdown();
          let tmpHTML = tmpContentProvider.parseMarkdown(tmpMarkdown);
          this.pict.views.BasicContent.render();
          this.pict.views.BasicContent.displayContent(tmpHTML);

          // Flush all registered view CSS into the PICT-CSS style element.
          // pict-view's addCSS only registers the CSS strings; they have to be
          // explicitly injected into the DOM.
          this.pict.CSSMap.injectCSS();
          return super.onAfterInitializeAsync(fCallback);
        }
        getExampleMarkdown() {
          return ['# Basic Content Example', '', 'This example demonstrates the **pict-section-content** module rendering markdown with KaTeX equations and Mermaid diagrams.', '', '## Inline Math', '', 'The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ and it solves any equation of the form $ax^2 + bx + c = 0$.', '', '## Display Math', '', 'Euler\'s identity is one of the most beautiful equations in mathematics:', '', '$$', 'e^{i\\pi} + 1 = 0', '$$', '', 'The integral of a Gaussian function:', '', '$$', '\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}', '$$', '', '## A Simple Flowchart', '', '```mermaid', 'graph TD', '    A[Markdown Input] --> B[Parse Markdown]', '    B --> C{Contains Math?}', '    C -->|Yes| D[Render KaTeX]', '    C -->|No| E[Skip KaTeX]', '    D --> F[Display Content]', '    E --> F', '    B --> G{Contains Diagrams?}', '    G -->|Yes| H[Render Mermaid]', '    G -->|No| I[Skip Mermaid]', '    H --> F', '    I --> F', '```', '', '## Code Example', '', 'Here is some JavaScript code demonstrating how to use the content provider:', '', '```javascript', 'const libPictSectionContent = require("pict-section-content");', '', '// Add the content provider to your pict application', 'this.pict.addProvider("Content-Provider",', '    libPictSectionContent.PictContentProvider.default_configuration,', '    libPictSectionContent.PictContentProvider);', '', '// Parse markdown into HTML', 'let tmpHTML = tmpContentProvider.parseMarkdown(markdownString);', '', '// Display in a content view', 'this.pict.views.BasicContent.displayContent(tmpHTML);', '```', '', '## A Table', '', '| Feature | Supported | Notes |', '| --- | --- | --- |', '| Headings | Yes | h1 through h6 |', '| Bold/Italic | Yes | `**bold**` and `*italic*` |', '| Code Blocks | Yes | Syntax highlighted |', '| Tables | Yes | GFM pipe syntax |', '| KaTeX | Yes | Inline and display math |', '| Mermaid | Yes | Flowcharts, sequences, etc. |', '| Blockquotes | Yes | Nested supported |', '', '> **Note:** The content provider supports all standard markdown features plus KaTeX math and Mermaid diagrams.', '', '## Sequence Diagram', '', '```mermaid', 'sequenceDiagram', '    participant User', '    participant App', '    participant Provider', '    participant View', '    User->>App: Load Page', '    App->>Provider: parseMarkdown(md)', '    Provider-->>App: HTML string', '    App->>View: displayContent(html)', '    View->>View: renderMermaidDiagrams()', '    View->>View: renderKaTeXEquations()', '    View-->>User: Rendered Content', '```'].join('\n');
        }
      }
      module.exports = BasicContentApplication;
      module.exports.default_configuration = {
        "Name": "Basic Content Example",
        "Hash": "BasicContentApplication",
        "pict_configuration": {
          "Product": "BasicContent"
        }
      };
    }, {
      "../../source/Pict-Section-Content.js": 14,
      "pict-application": 5
    }],
    2: [function (require, module, exports) {
      module.exports = {
        "name": "fable-serviceproviderbase",
        "version": "3.0.19",
        "description": "Simple base classes for fable services.",
        "main": "source/Fable-ServiceProviderBase.js",
        "scripts": {
          "start": "node source/Fable-ServiceProviderBase.js",
          "test": "npx quack test",
          "tests": "npx quack test -g",
          "coverage": "npx quack coverage",
          "build": "npx quack build",
          "types": "tsc -p ./tsconfig.build.json",
          "check": "tsc -p . --noEmit"
        },
        "types": "types/source/Fable-ServiceProviderBase.d.ts",
        "mocha": {
          "diff": true,
          "extension": ["js"],
          "package": "./package.json",
          "reporter": "spec",
          "slow": "75",
          "timeout": "5000",
          "ui": "tdd",
          "watch-files": ["source/**/*.js", "test/**/*.js"],
          "watch-ignore": ["lib/vendor"]
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/stevenvelozo/fable-serviceproviderbase.git"
        },
        "keywords": ["entity", "behavior"],
        "author": "Steven Velozo <steven@velozo.com> (http://velozo.com/)",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/stevenvelozo/fable-serviceproviderbase/issues"
        },
        "homepage": "https://github.com/stevenvelozo/fable-serviceproviderbase",
        "devDependencies": {
          "@types/mocha": "^10.0.10",
          "fable": "^3.1.62",
          "quackage": "^1.0.58",
          "typescript": "^5.9.3"
        }
      };
    }, {}],
    3: [function (require, module, exports) {
      /**
      * Fable Service Base
      * @author <steven@velozo.com>
      */

      const libPackage = require('../package.json');
      class FableServiceProviderBase {
        /**
         * The constructor can be used in two ways:
         * 1) With a fable, options object and service hash (the options object and service hash are optional)a
         * 2) With an object or nothing as the first parameter, where it will be treated as the options object
         *
         * @param {import('fable')|Record<string, any>} [pFable] - (optional) The fable instance, or the options object if there is no fable
         * @param {Record<string, any>|string} [pOptions] - (optional) The options object, or the service hash if there is no fable
         * @param {string} [pServiceHash] - (optional) The service hash to identify this service instance
         */
        constructor(pFable, pOptions, pServiceHash) {
          /** @type {import('fable')} */
          this.fable;
          /** @type {string} */
          this.UUID;
          /** @type {Record<string, any>} */
          this.options;
          /** @type {Record<string, any>} */
          this.services;
          /** @type {Record<string, any>} */
          this.servicesMap;

          // Check if a fable was passed in; connect it if so
          if (typeof pFable === 'object' && pFable.isFable) {
            this.connectFable(pFable);
          } else {
            this.fable = false;
          }

          // Initialize the services map if it wasn't passed in
          /** @type {Record<string, any>} */
          this._PackageFableServiceProvider = libPackage;

          // initialize options and UUID based on whether the fable was passed in or not.
          if (this.fable) {
            this.UUID = pFable.getUUID();
            this.options = typeof pOptions === 'object' ? pOptions : {};
          } else {
            // With no fable, check to see if there was an object passed into either of the first two
            // Parameters, and if so, treat it as the options object
            this.options = typeof pFable === 'object' && !pFable.isFable ? pFable : typeof pOptions === 'object' ? pOptions : {};
            this.UUID = "CORE-SVC-".concat(Math.floor(Math.random() * (99999 - 10000) + 10000));
          }

          // It's expected that the deriving class will set this
          this.serviceType = "Unknown-".concat(this.UUID);

          // The service hash is used to identify the specific instantiation of the service in the services map
          this.Hash = typeof pServiceHash === 'string' ? pServiceHash : !this.fable && typeof pOptions === 'string' ? pOptions : "".concat(this.UUID);
        }

        /**
         * @param {import('fable')} pFable
         */
        connectFable(pFable) {
          if (typeof pFable !== 'object' || !pFable.isFable) {
            let tmpErrorMessage = "Fable Service Provider Base: Cannot connect to Fable, invalid Fable object passed in.  The pFable parameter was a [".concat(typeof pFable, "].}");
            console.log(tmpErrorMessage);
            return new Error(tmpErrorMessage);
          }
          if (!this.fable) {
            this.fable = pFable;
          }
          if (!this.log) {
            this.log = this.fable.Logging;
          }
          if (!this.services) {
            this.services = this.fable.services;
          }
          if (!this.servicesMap) {
            this.servicesMap = this.fable.servicesMap;
          }
          return true;
        }
      }
      _defineProperty(FableServiceProviderBase, "isFableService", true);
      module.exports = FableServiceProviderBase;

      // This is left here in case we want to go back to having different code/base class for "core" services
      module.exports.CoreServiceProviderBase = FableServiceProviderBase;
    }, {
      "../package.json": 2
    }],
    4: [function (require, module, exports) {
      module.exports = {
        "name": "pict-application",
        "version": "1.0.34",
        "description": "Application base class for a pict view-based application",
        "main": "source/Pict-Application.js",
        "scripts": {
          "test": "npx quack test",
          "start": "node source/Pict-Application.js",
          "coverage": "npx quack coverage",
          "build": "npx quack build",
          "docker-dev-build": "docker build ./ -f Dockerfile_LUXURYCode -t pict-application-image:local",
          "docker-dev-run": "docker run -it -d --name pict-application-dev -p 30001:8080 -p 38086:8086 -v \"$PWD/.config:/home/coder/.config\"  -v \"$PWD:/home/coder/pict-application\" -u \"$(id -u):$(id -g)\" -e \"DOCKER_USER=$USER\" pict-application-image:local",
          "docker-dev-shell": "docker exec -it pict-application-dev /bin/bash",
          "tests": "npx quack test -g",
          "lint": "eslint source/**",
          "types": "tsc -p ."
        },
        "types": "types/source/Pict-Application.d.ts",
        "repository": {
          "type": "git",
          "url": "git+https://github.com/stevenvelozo/pict-application.git"
        },
        "author": "steven velozo <steven@velozo.com>",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/stevenvelozo/pict-application/issues"
        },
        "homepage": "https://github.com/stevenvelozo/pict-application#readme",
        "devDependencies": {
          "@eslint/js": "^9.28.0",
          "browser-env": "^3.3.0",
          "eslint": "^9.28.0",
          "pict": "^1.0.348",
          "pict-docuserve": "^0.1.5",
          "pict-provider": "^1.0.10",
          "pict-view": "^1.0.66",
          "quackage": "^1.1.0",
          "typescript": "^5.9.3"
        },
        "mocha": {
          "diff": true,
          "extension": ["js"],
          "package": "./package.json",
          "reporter": "spec",
          "slow": "75",
          "timeout": "5000",
          "ui": "tdd",
          "watch-files": ["source/**/*.js", "test/**/*.js"],
          "watch-ignore": ["lib/vendor"]
        },
        "dependencies": {
          "fable-serviceproviderbase": "^3.0.19"
        }
      };
    }, {}],
    5: [function (require, module, exports) {
      const libFableServiceBase = require('fable-serviceproviderbase');
      const libPackage = require('../package.json');
      const defaultPictSettings = {
        Name: 'DefaultPictApplication',
        // The main "viewport" is the view that is used to host our application
        MainViewportViewIdentifier: 'Default-View',
        MainViewportRenderableHash: false,
        MainViewportDestinationAddress: false,
        MainViewportDefaultDataAddress: false,
        // Whether or not we should automatically render the main viewport and other autorender views after we initialize the pict application
        AutoSolveAfterInitialize: true,
        AutoRenderMainViewportViewAfterInitialize: true,
        AutoRenderViewsAfterInitialize: false,
        AutoLoginAfterInitialize: false,
        AutoLoadDataAfterLogin: false,
        ConfigurationOnlyViews: [],
        Manifests: {},
        // The prefix to prepend on all template destination hashes
        IdentifierAddressPrefix: 'PICT-'
      };

      /**
       * Base class for pict applications.
       */
      class PictApplication extends libFableServiceBase {
        /**
         * @param {import('fable')} pFable
         * @param {Record<string, any>} [pOptions]
         * @param {string} [pServiceHash]
         */
        constructor(pFable, pOptions, pServiceHash) {
          let tmpCarryOverConfiguration = typeof pFable.settings.PictApplicationConfiguration === 'object' ? pFable.settings.PictApplicationConfiguration : {};
          let tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(defaultPictSettings)), tmpCarryOverConfiguration, pOptions);
          super(pFable, tmpOptions, pServiceHash);

          /** @type {any} */
          this.options;
          /** @type {any} */
          this.log;
          /** @type {import('pict') & import('fable')} */
          this.fable;
          /** @type {string} */
          this.UUID;
          /** @type {string} */
          this.Hash;
          /**
           * @type {{ [key: string]: any }}
           */
          this.servicesMap;
          this.serviceType = 'PictApplication';
          /** @type {Record<string, any>} */
          this._Package = libPackage;

          // Convenience and consistency naming
          this.pict = this.fable;
          // Wire in the essential Pict state
          /** @type {Record<string, any>} */
          this.AppData = this.fable.AppData;
          /** @type {Record<string, any>} */
          this.Bundle = this.fable.Bundle;

          /** @type {number} */
          this.initializeTimestamp;
          /** @type {number} */
          this.lastSolvedTimestamp;
          /** @type {number} */
          this.lastLoginTimestamp;
          /** @type {number} */
          this.lastMarshalFromViewsTimestamp;
          /** @type {number} */
          this.lastMarshalToViewsTimestamp;
          /** @type {number} */
          this.lastAutoRenderTimestamp;
          /** @type {number} */
          this.lastLoadDataTimestamp;

          // Load all the manifests for the application
          let tmpManifestKeys = Object.keys(this.options.Manifests);
          if (tmpManifestKeys.length > 0) {
            for (let i = 0; i < tmpManifestKeys.length; i++) {
              // Load each manifest
              let tmpManifestKey = tmpManifestKeys[i];
              this.fable.instantiateServiceProvider('Manifest', this.options.Manifests[tmpManifestKey], tmpManifestKey);
            }
          }
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Solve All Views                          */
        /* -------------------------------------------------------------------------- */
        /**
         * @return {boolean}
         */
        onPreSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onPreSolve:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onPreSolveAsync(fCallback) {
          this.onPreSolve();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        onBeforeSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onBeforeSolve:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onBeforeSolveAsync(fCallback) {
          this.onBeforeSolve();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        onSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onSolve:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onSolveAsync(fCallback) {
          this.onSolve();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        solve() {
          if (this.pict.LogNoisiness > 2) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " executing solve() function..."));
          }

          // Walk through any loaded providers and solve them as well.
          let tmpLoadedProviders = Object.keys(this.pict.providers);
          let tmpProvidersToSolve = [];
          for (let i = 0; i < tmpLoadedProviders.length; i++) {
            let tmpProvider = this.pict.providers[tmpLoadedProviders[i]];
            if (tmpProvider.options.AutoSolveWithApp) {
              tmpProvidersToSolve.push(tmpProvider);
            }
          }
          // Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
          tmpProvidersToSolve.sort((a, b) => {
            return a.options.AutoSolveOrdinal - b.options.AutoSolveOrdinal;
          });
          for (let i = 0; i < tmpProvidersToSolve.length; i++) {
            tmpProvidersToSolve[i].solve(tmpProvidersToSolve[i]);
          }
          this.onBeforeSolve();
          // Now walk through any loaded views and initialize them as well.
          let tmpLoadedViews = Object.keys(this.pict.views);
          let tmpViewsToSolve = [];
          for (let i = 0; i < tmpLoadedViews.length; i++) {
            let tmpView = this.pict.views[tmpLoadedViews[i]];
            if (tmpView.options.AutoInitialize) {
              tmpViewsToSolve.push(tmpView);
            }
          }
          // Sort the views by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
          tmpViewsToSolve.sort((a, b) => {
            return a.options.AutoInitializeOrdinal - b.options.AutoInitializeOrdinal;
          });
          for (let i = 0; i < tmpViewsToSolve.length; i++) {
            tmpViewsToSolve[i].solve();
          }
          this.onSolve();
          this.onAfterSolve();
          this.lastSolvedTimestamp = this.fable.log.getTimeStamp();
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        solveAsync(fCallback) {
          let tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');
          tmpAnticipate.anticipate(this.onBeforeSolveAsync.bind(this));

          // Allow the callback to be passed in as the last parameter no matter what
          let tmpCallback = typeof fCallback === 'function' ? fCallback : false;
          if (!tmpCallback) {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " solveAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " solveAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          // Walk through any loaded providers and solve them as well.
          let tmpLoadedProviders = Object.keys(this.pict.providers);
          let tmpProvidersToSolve = [];
          for (let i = 0; i < tmpLoadedProviders.length; i++) {
            let tmpProvider = this.pict.providers[tmpLoadedProviders[i]];
            if (tmpProvider.options.AutoSolveWithApp) {
              tmpProvidersToSolve.push(tmpProvider);
            }
          }
          // Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
          tmpProvidersToSolve.sort((a, b) => {
            return a.options.AutoSolveOrdinal - b.options.AutoSolveOrdinal;
          });
          for (let i = 0; i < tmpProvidersToSolve.length; i++) {
            tmpAnticipate.anticipate(tmpProvidersToSolve[i].solveAsync.bind(tmpProvidersToSolve[i]));
          }

          // Walk through any loaded views and solve them as well.
          let tmpLoadedViews = Object.keys(this.pict.views);
          let tmpViewsToSolve = [];
          for (let i = 0; i < tmpLoadedViews.length; i++) {
            let tmpView = this.pict.views[tmpLoadedViews[i]];
            if (tmpView.options.AutoSolveWithApp) {
              tmpViewsToSolve.push(tmpView);
            }
          }
          // Sort the views by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
          tmpViewsToSolve.sort((a, b) => {
            return a.options.AutoSolveOrdinal - b.options.AutoSolveOrdinal;
          });
          for (let i = 0; i < tmpViewsToSolve.length; i++) {
            tmpAnticipate.anticipate(tmpViewsToSolve[i].solveAsync.bind(tmpViewsToSolve[i]));
          }
          tmpAnticipate.anticipate(this.onSolveAsync.bind(this));
          tmpAnticipate.anticipate(this.onAfterSolveAsync.bind(this));
          tmpAnticipate.wait(pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " solveAsync() complete."));
            }
            this.lastSolvedTimestamp = this.fable.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * @return {boolean}
         */
        onAfterSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onAfterSolve:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onAfterSolveAsync(fCallback) {
          this.onAfterSolve();
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Application Login                        */
        /* -------------------------------------------------------------------------- */

        /**
         * @param {(error?: Error) => void} fCallback
         */
        onBeforeLoginAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onBeforeLoginAsync:"));
          }
          return fCallback();
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        onLoginAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onLoginAsync:"));
          }
          return fCallback();
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        loginAsync(fCallback) {
          const tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');
          let tmpCallback = fCallback;
          if (typeof tmpCallback !== 'function') {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " loginAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " loginAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeLoginAsync.bind(this));
          tmpAnticipate.anticipate(this.onLoginAsync.bind(this));
          tmpAnticipate.anticipate(this.onAfterLoginAsync.bind(this));

          // check and see if we should automatically trigger a data load
          if (this.options.AutoLoadDataAfterLogin) {
            tmpAnticipate.anticipate(fNext => {
              if (!this.isLoggedIn()) {
                return fNext();
              }
              if (this.pict.LogNoisiness > 1) {
                this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " auto loading data after login..."));
              }
              //TODO: should data load errors funnel here? this creates a weird coupling between login and data load callbacks
              this.loadDataAsync(pError => {
                fNext(pError);
              });
            });
          }
          tmpAnticipate.wait(pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " loginAsync() complete."));
            }
            this.lastLoginTimestamp = this.fable.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * Check if the application state is logged in. Defaults to true. Override this method in your application based on login requirements.
         *
         * @return {boolean}
         */
        isLoggedIn() {
          return true;
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        onAfterLoginAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onAfterLoginAsync:"));
          }
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Application LoadData                     */
        /* -------------------------------------------------------------------------- */

        /**
         * @param {(error?: Error) => void} fCallback
         */
        onBeforeLoadDataAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onBeforeLoadDataAsync:"));
          }
          return fCallback();
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        onLoadDataAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onLoadDataAsync:"));
          }
          return fCallback();
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        loadDataAsync(fCallback) {
          const tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');
          let tmpCallback = fCallback;
          if (typeof tmpCallback !== 'function') {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " loadDataAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " loadDataAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeLoadDataAsync.bind(this));

          // Walk through any loaded providers and load their data as well.
          let tmpLoadedProviders = Object.keys(this.pict.providers);
          let tmpProvidersToLoadData = [];
          for (let i = 0; i < tmpLoadedProviders.length; i++) {
            let tmpProvider = this.pict.providers[tmpLoadedProviders[i]];
            if (tmpProvider.options.AutoLoadDataWithApp) {
              tmpProvidersToLoadData.push(tmpProvider);
            }
          }
          // Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
          tmpProvidersToLoadData.sort((a, b) => {
            return a.options.AutoLoadDataOrdinal - b.options.AutoLoadDataOrdinal;
          });
          for (const tmpProvider of tmpProvidersToLoadData) {
            tmpAnticipate.anticipate(tmpProvider.onBeforeLoadDataAsync.bind(tmpProvider));
          }
          tmpAnticipate.anticipate(this.onLoadDataAsync.bind(this));

          //TODO: think about ways to parallelize these
          for (const tmpProvider of tmpProvidersToLoadData) {
            tmpAnticipate.anticipate(tmpProvider.onLoadDataAsync.bind(tmpProvider));
          }
          tmpAnticipate.anticipate(this.onAfterLoadDataAsync.bind(this));
          for (const tmpProvider of tmpProvidersToLoadData) {
            tmpAnticipate.anticipate(tmpProvider.onAfterLoadDataAsync.bind(tmpProvider));
          }
          tmpAnticipate.wait(/** @param {Error} [pError] */
          pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " loadDataAsync() complete."));
            }
            this.lastLoadDataTimestamp = this.fable.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        onAfterLoadDataAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onAfterLoadDataAsync:"));
          }
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Application SaveData                     */
        /* -------------------------------------------------------------------------- */

        /**
         * @param {(error?: Error) => void} fCallback
         */
        onBeforeSaveDataAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onBeforeSaveDataAsync:"));
          }
          return fCallback();
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        onSaveDataAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onSaveDataAsync:"));
          }
          return fCallback();
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        saveDataAsync(fCallback) {
          const tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');
          let tmpCallback = fCallback;
          if (typeof tmpCallback !== 'function') {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " saveDataAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " saveDataAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeSaveDataAsync.bind(this));

          // Walk through any loaded providers and load their data as well.
          let tmpLoadedProviders = Object.keys(this.pict.providers);
          let tmpProvidersToSaveData = [];
          for (let i = 0; i < tmpLoadedProviders.length; i++) {
            let tmpProvider = this.pict.providers[tmpLoadedProviders[i]];
            if (tmpProvider.options.AutoSaveDataWithApp) {
              tmpProvidersToSaveData.push(tmpProvider);
            }
          }
          // Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
          tmpProvidersToSaveData.sort((a, b) => {
            return a.options.AutoSaveDataOrdinal - b.options.AutoSaveDataOrdinal;
          });
          for (const tmpProvider of tmpProvidersToSaveData) {
            tmpAnticipate.anticipate(tmpProvider.onBeforeSaveDataAsync.bind(tmpProvider));
          }
          tmpAnticipate.anticipate(this.onSaveDataAsync.bind(this));

          //TODO: think about ways to parallelize these
          for (const tmpProvider of tmpProvidersToSaveData) {
            tmpAnticipate.anticipate(tmpProvider.onSaveDataAsync.bind(tmpProvider));
          }
          tmpAnticipate.anticipate(this.onAfterSaveDataAsync.bind(this));
          for (const tmpProvider of tmpProvidersToSaveData) {
            tmpAnticipate.anticipate(tmpProvider.onAfterSaveDataAsync.bind(tmpProvider));
          }
          tmpAnticipate.wait(/** @param {Error} [pError] */
          pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " saveDataAsync() complete."));
            }
            this.lastSaveDataTimestamp = this.fable.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        onAfterSaveDataAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onAfterSaveDataAsync:"));
          }
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Initialize Application                   */
        /* -------------------------------------------------------------------------- */
        /**
         * @return {boolean}
         */
        onBeforeInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onBeforeInitialize:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onBeforeInitializeAsync(fCallback) {
          this.onBeforeInitialize();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        onInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onInitialize:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onInitializeAsync(fCallback) {
          this.onInitialize();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        initialize() {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow APPLICATION [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " initialize:"));
          }
          if (!this.initializeTimestamp) {
            this.onBeforeInitialize();
            if ('ConfigurationOnlyViews' in this.options) {
              // Load all the configuration only views
              for (let i = 0; i < this.options.ConfigurationOnlyViews.length; i++) {
                let tmpViewIdentifier = typeof this.options.ConfigurationOnlyViews[i].ViewIdentifier === 'undefined' ? "AutoView-".concat(this.fable.getUUID()) : this.options.ConfigurationOnlyViews[i].ViewIdentifier;
                this.log.info("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " adding configuration only view: ").concat(tmpViewIdentifier));
                this.pict.addView(tmpViewIdentifier, this.options.ConfigurationOnlyViews[i]);
              }
            }
            this.onInitialize();

            // Walk through any loaded providers and initialize them as well.
            let tmpLoadedProviders = Object.keys(this.pict.providers);
            let tmpProvidersToInitialize = [];
            for (let i = 0; i < tmpLoadedProviders.length; i++) {
              let tmpProvider = this.pict.providers[tmpLoadedProviders[i]];
              if (tmpProvider.options.AutoInitialize) {
                tmpProvidersToInitialize.push(tmpProvider);
              }
            }
            // Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
            tmpProvidersToInitialize.sort((a, b) => {
              return a.options.AutoInitializeOrdinal - b.options.AutoInitializeOrdinal;
            });
            for (let i = 0; i < tmpProvidersToInitialize.length; i++) {
              tmpProvidersToInitialize[i].initialize();
            }

            // Now walk through any loaded views and initialize them as well.
            let tmpLoadedViews = Object.keys(this.pict.views);
            let tmpViewsToInitialize = [];
            for (let i = 0; i < tmpLoadedViews.length; i++) {
              let tmpView = this.pict.views[tmpLoadedViews[i]];
              if (tmpView.options.AutoInitialize) {
                tmpViewsToInitialize.push(tmpView);
              }
            }
            // Sort the views by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
            tmpViewsToInitialize.sort((a, b) => {
              return a.options.AutoInitializeOrdinal - b.options.AutoInitializeOrdinal;
            });
            for (let i = 0; i < tmpViewsToInitialize.length; i++) {
              tmpViewsToInitialize[i].initialize();
            }
            this.onAfterInitialize();
            if (this.options.AutoSolveAfterInitialize) {
              if (this.pict.LogNoisiness > 1) {
                this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " auto solving after initialization..."));
              }
              // Solve the template synchronously
              this.solve();
            }
            // Now check and see if we should automatically render as well
            if (this.options.AutoRenderMainViewportViewAfterInitialize) {
              if (this.pict.LogNoisiness > 1) {
                this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " auto rendering after initialization..."));
              }
              // Render the template synchronously
              this.render();
            }
            this.initializeTimestamp = this.fable.log.getTimeStamp();
            this.onCompletionOfInitialize();
            return true;
          } else {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " initialize called but initialization is already completed.  Aborting."));
            return false;
          }
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        initializeAsync(fCallback) {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow APPLICATION [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " initializeAsync:"));
          }

          // Allow the callback to be passed in as the last parameter no matter what
          let tmpCallback = typeof fCallback === 'function' ? fCallback : false;
          if (!tmpCallback) {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " initializeAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " initializeAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          if (!this.initializeTimestamp) {
            let tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');
            if (this.pict.LogNoisiness > 3) {
              this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " beginning initialization..."));
            }
            if ('ConfigurationOnlyViews' in this.options) {
              // Load all the configuration only views
              for (let i = 0; i < this.options.ConfigurationOnlyViews.length; i++) {
                let tmpViewIdentifier = typeof this.options.ConfigurationOnlyViews[i].ViewIdentifier === 'undefined' ? "AutoView-".concat(this.fable.getUUID()) : this.options.ConfigurationOnlyViews[i].ViewIdentifier;
                this.log.info("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " adding configuration only view: ").concat(tmpViewIdentifier));
                this.pict.addView(tmpViewIdentifier, this.options.ConfigurationOnlyViews[i]);
              }
            }
            tmpAnticipate.anticipate(this.onBeforeInitializeAsync.bind(this));
            tmpAnticipate.anticipate(this.onInitializeAsync.bind(this));

            // Walk through any loaded providers and solve them as well.
            let tmpLoadedProviders = Object.keys(this.pict.providers);
            let tmpProvidersToInitialize = [];
            for (let i = 0; i < tmpLoadedProviders.length; i++) {
              let tmpProvider = this.pict.providers[tmpLoadedProviders[i]];
              if (tmpProvider.options.AutoInitialize) {
                tmpProvidersToInitialize.push(tmpProvider);
              }
            }
            // Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
            tmpProvidersToInitialize.sort((a, b) => {
              return a.options.AutoInitializeOrdinal - b.options.AutoInitializeOrdinal;
            });
            for (let i = 0; i < tmpProvidersToInitialize.length; i++) {
              tmpAnticipate.anticipate(tmpProvidersToInitialize[i].initializeAsync.bind(tmpProvidersToInitialize[i]));
            }

            // Now walk through any loaded views and initialize them as well.
            // TODO: Some optimization cleverness could be gained by grouping them into a parallelized async operation, by ordinal.
            let tmpLoadedViews = Object.keys(this.pict.views);
            let tmpViewsToInitialize = [];
            for (let i = 0; i < tmpLoadedViews.length; i++) {
              let tmpView = this.pict.views[tmpLoadedViews[i]];
              if (tmpView.options.AutoInitialize) {
                tmpViewsToInitialize.push(tmpView);
              }
            }
            // Sort the views by their priority
            // If they are all the default priority 0, it will end up being add order due to JSON Object Property Key order stuff
            tmpViewsToInitialize.sort((a, b) => {
              return a.options.AutoInitializeOrdinal - b.options.AutoInitializeOrdinal;
            });
            for (let i = 0; i < tmpViewsToInitialize.length; i++) {
              let tmpView = tmpViewsToInitialize[i];
              tmpAnticipate.anticipate(tmpView.initializeAsync.bind(tmpView));
            }
            tmpAnticipate.anticipate(this.onAfterInitializeAsync.bind(this));
            if (this.options.AutoLoginAfterInitialize) {
              if (this.pict.LogNoisiness > 1) {
                this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " auto login (asynchronously) after initialization..."));
              }
              tmpAnticipate.anticipate(this.loginAsync.bind(this));
            }
            if (this.options.AutoSolveAfterInitialize) {
              if (this.pict.LogNoisiness > 1) {
                this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " auto solving (asynchronously) after initialization..."));
              }
              tmpAnticipate.anticipate(this.solveAsync.bind(this));
            }
            if (this.options.AutoRenderMainViewportViewAfterInitialize) {
              if (this.pict.LogNoisiness > 1) {
                this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " auto rendering (asynchronously) after initialization..."));
              }
              tmpAnticipate.anticipate(this.renderMainViewportAsync.bind(this));
            }
            tmpAnticipate.wait(pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " initializeAsync Error: ").concat(pError.message || pError), {
                  stack: pError.stack
                });
              }
              this.initializeTimestamp = this.fable.log.getTimeStamp();
              if (this.pict.LogNoisiness > 2) {
                this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " initialization complete."));
              }
              return tmpCallback();
            });
          } else {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " async initialize called but initialization is already completed.  Aborting."));
            // TODO: Should this be an error?
            return this.onCompletionOfInitializeAsync(tmpCallback);
          }
        }

        /**
         * @return {boolean}
         */
        onAfterInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onAfterInitialize:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onAfterInitializeAsync(fCallback) {
          this.onAfterInitialize();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        onCompletionOfInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onCompletionOfInitialize:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onCompletionOfInitializeAsync(fCallback) {
          this.onCompletionOfInitialize();
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Marshal Data From All Views              */
        /* -------------------------------------------------------------------------- */
        /**
         * @return {boolean}
         */
        onBeforeMarshalFromViews() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onBeforeMarshalFromViews:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onBeforeMarshalFromViewsAsync(fCallback) {
          this.onBeforeMarshalFromViews();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        onMarshalFromViews() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onMarshalFromViews:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onMarshalFromViewsAsync(fCallback) {
          this.onMarshalFromViews();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        marshalFromViews() {
          if (this.pict.LogNoisiness > 2) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " executing marshalFromViews() function..."));
          }
          this.onBeforeMarshalFromViews();
          // Now walk through any loaded views and initialize them as well.
          let tmpLoadedViews = Object.keys(this.pict.views);
          let tmpViewsToMarshalFromViews = [];
          for (let i = 0; i < tmpLoadedViews.length; i++) {
            let tmpView = this.pict.views[tmpLoadedViews[i]];
            tmpViewsToMarshalFromViews.push(tmpView);
          }
          for (let i = 0; i < tmpViewsToMarshalFromViews.length; i++) {
            tmpViewsToMarshalFromViews[i].marshalFromView();
          }
          this.onMarshalFromViews();
          this.onAfterMarshalFromViews();
          this.lastMarshalFromViewsTimestamp = this.fable.log.getTimeStamp();
          return true;
        }

        /**
         * @param {(error?: Error) => void} fCallback
         */
        marshalFromViewsAsync(fCallback) {
          let tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');

          // Allow the callback to be passed in as the last parameter no matter what
          let tmpCallback = typeof fCallback === 'function' ? fCallback : false;
          if (!tmpCallback) {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalFromViewsAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalFromViewsAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeMarshalFromViewsAsync.bind(this));
          // Walk through any loaded views and marshalFromViews them as well.
          let tmpLoadedViews = Object.keys(this.pict.views);
          let tmpViewsToMarshalFromViews = [];
          for (let i = 0; i < tmpLoadedViews.length; i++) {
            let tmpView = this.pict.views[tmpLoadedViews[i]];
            tmpViewsToMarshalFromViews.push(tmpView);
          }
          for (let i = 0; i < tmpViewsToMarshalFromViews.length; i++) {
            tmpAnticipate.anticipate(tmpViewsToMarshalFromViews[i].marshalFromViewAsync.bind(tmpViewsToMarshalFromViews[i]));
          }
          tmpAnticipate.anticipate(this.onMarshalFromViewsAsync.bind(this));
          tmpAnticipate.anticipate(this.onAfterMarshalFromViewsAsync.bind(this));
          tmpAnticipate.wait(pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalFromViewsAsync() complete."));
            }
            this.lastMarshalFromViewsTimestamp = this.fable.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * @return {boolean}
         */
        onAfterMarshalFromViews() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onAfterMarshalFromViews:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onAfterMarshalFromViewsAsync(fCallback) {
          this.onAfterMarshalFromViews();
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Marshal Data To All Views                */
        /* -------------------------------------------------------------------------- */
        /**
         * @return {boolean}
         */
        onBeforeMarshalToViews() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onBeforeMarshalToViews:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onBeforeMarshalToViewsAsync(fCallback) {
          this.onBeforeMarshalToViews();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        onMarshalToViews() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onMarshalToViews:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onMarshalToViewsAsync(fCallback) {
          this.onMarshalToViews();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        marshalToViews() {
          if (this.pict.LogNoisiness > 2) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " executing marshalToViews() function..."));
          }
          this.onBeforeMarshalToViews();
          // Now walk through any loaded views and initialize them as well.
          let tmpLoadedViews = Object.keys(this.pict.views);
          let tmpViewsToMarshalToViews = [];
          for (let i = 0; i < tmpLoadedViews.length; i++) {
            let tmpView = this.pict.views[tmpLoadedViews[i]];
            tmpViewsToMarshalToViews.push(tmpView);
          }
          for (let i = 0; i < tmpViewsToMarshalToViews.length; i++) {
            tmpViewsToMarshalToViews[i].marshalToView();
          }
          this.onMarshalToViews();
          this.onAfterMarshalToViews();
          this.lastMarshalToViewsTimestamp = this.fable.log.getTimeStamp();
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        marshalToViewsAsync(fCallback) {
          let tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');

          // Allow the callback to be passed in as the last parameter no matter what
          let tmpCallback = typeof fCallback === 'function' ? fCallback : false;
          if (!tmpCallback) {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalToViewsAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalToViewsAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeMarshalToViewsAsync.bind(this));
          // Walk through any loaded views and marshalToViews them as well.
          let tmpLoadedViews = Object.keys(this.pict.views);
          let tmpViewsToMarshalToViews = [];
          for (let i = 0; i < tmpLoadedViews.length; i++) {
            let tmpView = this.pict.views[tmpLoadedViews[i]];
            tmpViewsToMarshalToViews.push(tmpView);
          }
          for (let i = 0; i < tmpViewsToMarshalToViews.length; i++) {
            tmpAnticipate.anticipate(tmpViewsToMarshalToViews[i].marshalToViewAsync.bind(tmpViewsToMarshalToViews[i]));
          }
          tmpAnticipate.anticipate(this.onMarshalToViewsAsync.bind(this));
          tmpAnticipate.anticipate(this.onAfterMarshalToViewsAsync.bind(this));
          tmpAnticipate.wait(pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalToViewsAsync() complete."));
            }
            this.lastMarshalToViewsTimestamp = this.fable.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * @return {boolean}
         */
        onAfterMarshalToViews() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onAfterMarshalToViews:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onAfterMarshalToViewsAsync(fCallback) {
          this.onAfterMarshalToViews();
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Render View                              */
        /* -------------------------------------------------------------------------- */
        /**
         * @return {boolean}
         */
        onBeforeRender() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onBeforeRender:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onBeforeRenderAsync(fCallback) {
          this.onBeforeRender();
          return fCallback();
        }

        /**
         * @param {string} [pViewIdentifier] - The hash of the view to render. By default, the main viewport view is rendered.
         * @param {string} [pRenderableHash] - The hash of the renderable to render.
         * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string} [pTemplateDataAddress] - The address where the data for the template is stored.
         *
         * TODO: Should we support objects for pTemplateDataAddress for parity with pict-view?
         */
        render(pViewIdentifier, pRenderableHash, pRenderDestinationAddress, pTemplateDataAddress) {
          let tmpViewIdentifier = typeof pViewIdentifier !== 'string' ? this.options.MainViewportViewIdentifier : pViewIdentifier;
          let tmpRenderableHash = typeof pRenderableHash !== 'string' ? this.options.MainViewportRenderableHash : pRenderableHash;
          let tmpRenderDestinationAddress = typeof pRenderDestinationAddress !== 'string' ? this.options.MainViewportDestinationAddress : pRenderDestinationAddress;
          let tmpTemplateDataAddress = typeof pTemplateDataAddress !== 'string' ? this.options.MainViewportDefaultDataAddress : pTemplateDataAddress;
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow APPLICATION [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " VIEW Renderable[").concat(tmpRenderableHash, "] Destination[").concat(tmpRenderDestinationAddress, "] TemplateDataAddress[").concat(tmpTemplateDataAddress, "] render:"));
          }
          this.onBeforeRender();

          // Now get the view (by hash) from the loaded views
          let tmpView = typeof tmpViewIdentifier === 'string' ? this.servicesMap.PictView[tmpViewIdentifier] : false;
          if (!tmpView) {
            this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " could not render from View ").concat(tmpViewIdentifier, " because it is not a valid view."));
            return false;
          }
          this.onRender();
          tmpView.render(tmpRenderableHash, tmpRenderDestinationAddress, tmpTemplateDataAddress);
          this.onAfterRender();
          return true;
        }
        /**
         * @return {boolean}
         */
        onRender() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onRender:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onRenderAsync(fCallback) {
          this.onRender();
          return fCallback();
        }

        /**
         * @param {string|((error?: Error) => void)} pViewIdentifier - The hash of the view to render. By default, the main viewport view is rendered. (or the callback)
         * @param {string|((error?: Error) => void)} [pRenderableHash] - The hash of the renderable to render. (or the callback)
         * @param {string|((error?: Error) => void)} [pRenderDestinationAddress] - The address where the renderable will be rendered. (or the callback)
         * @param {string|((error?: Error) => void)} [pTemplateDataAddress] - The address where the data for the template is stored. (or the callback)
         * @param {(error?: Error) => void} [fCallback] - The callback, if all other parameters are provided.
         *
         * TODO: Should we support objects for pTemplateDataAddress for parity with pict-view?
         */
        renderAsync(pViewIdentifier, pRenderableHash, pRenderDestinationAddress, pTemplateDataAddress, fCallback) {
          let tmpViewIdentifier = typeof pViewIdentifier !== 'string' ? this.options.MainViewportViewIdentifier : pViewIdentifier;
          let tmpRenderableHash = typeof pRenderableHash !== 'string' ? this.options.MainViewportRenderableHash : pRenderableHash;
          let tmpRenderDestinationAddress = typeof pRenderDestinationAddress !== 'string' ? this.options.MainViewportDestinationAddress : pRenderDestinationAddress;
          let tmpTemplateDataAddress = typeof pTemplateDataAddress !== 'string' ? this.options.MainViewportDefaultDataAddress : pTemplateDataAddress;

          // Allow the callback to be passed in as the last parameter no matter what
          let tmpCallback = typeof fCallback === 'function' ? fCallback : typeof pTemplateDataAddress === 'function' ? pTemplateDataAddress : typeof pRenderDestinationAddress === 'function' ? pRenderDestinationAddress : typeof pRenderableHash === 'function' ? pRenderableHash : typeof pViewIdentifier === 'function' ? pViewIdentifier : false;
          if (!tmpCallback) {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow APPLICATION [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " VIEW Renderable[").concat(tmpRenderableHash, "] Destination[").concat(tmpRenderDestinationAddress, "] TemplateDataAddress[").concat(tmpTemplateDataAddress, "] renderAsync:"));
          }
          let tmpRenderAnticipate = this.fable.newAnticipate();
          tmpRenderAnticipate.anticipate(this.onBeforeRenderAsync.bind(this));
          let tmpView = typeof tmpViewIdentifier === 'string' ? this.servicesMap.PictView[tmpViewIdentifier] : false;
          if (!tmpView) {
            let tmpErrorMessage = "PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " could not asynchronously render from View ").concat(tmpViewIdentifier, " because it is not a valid view.");
            if (this.pict.LogNoisiness > 3) {
              this.log.error(tmpErrorMessage);
            }
            return tmpCallback(new Error(tmpErrorMessage));
          }
          tmpRenderAnticipate.anticipate(this.onRenderAsync.bind(this));
          tmpRenderAnticipate.anticipate(fNext => {
            tmpView.renderAsync.call(tmpView, tmpRenderableHash, tmpRenderDestinationAddress, tmpTemplateDataAddress, fNext);
          });
          tmpRenderAnticipate.anticipate(this.onAfterRenderAsync.bind(this));
          return tmpRenderAnticipate.wait(tmpCallback);
        }

        /**
         * @return {boolean}
         */
        onAfterRender() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " onAfterRender:"));
          }
          return true;
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        onAfterRenderAsync(fCallback) {
          this.onAfterRender();
          return fCallback();
        }

        /**
         * @return {boolean}
         */
        renderMainViewport() {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow APPLICATION [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderMainViewport:"));
          }
          return this.render();
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        renderMainViewportAsync(fCallback) {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow APPLICATION [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderMainViewportAsync:"));
          }
          return this.renderAsync(fCallback);
        }
        /**
         * @return {void}
         */
        renderAutoViews() {
          if (this.pict.LogNoisiness > 0) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " beginning renderAutoViews..."));
          }
          // Now walk through any loaded views and sort them by the AutoRender ordinal
          let tmpLoadedViews = Object.keys(this.pict.views);
          // Sort the views by their priority
          // If they are all the default priority 0, it will end up being add order due to JSON Object Property Key order stuff
          tmpLoadedViews.sort((a, b) => {
            return this.pict.views[a].options.AutoRenderOrdinal - this.pict.views[b].options.AutoRenderOrdinal;
          });
          for (let i = 0; i < tmpLoadedViews.length; i++) {
            let tmpView = this.pict.views[tmpLoadedViews[i]];
            if (tmpView.options.AutoRender) {
              tmpView.render();
            }
          }
          if (this.pict.LogNoisiness > 0) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderAutoViewsAsync complete."));
          }
        }
        /**
         * @param {(error?: Error) => void} fCallback
         */
        renderAutoViewsAsync(fCallback) {
          let tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');

          // Allow the callback to be passed in as the last parameter no matter what
          let tmpCallback = typeof fCallback === 'function' ? fCallback : false;
          if (!tmpCallback) {
            this.log.warn("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderAutoViewsAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderAutoViewsAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          if (this.pict.LogNoisiness > 0) {
            this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " beginning renderAutoViewsAsync..."));
          }

          // Now walk through any loaded views and sort them by the AutoRender ordinal
          // TODO: Some optimization cleverness could be gained by grouping them into a parallelized async operation, by ordinal.
          let tmpLoadedViews = Object.keys(this.pict.views);
          // Sort the views by their priority
          // If they are all the default priority 0, it will end up being add order due to JSON Object Property Key order stuff
          tmpLoadedViews.sort((a, b) => {
            return this.pict.views[a].options.AutoRenderOrdinal - this.pict.views[b].options.AutoRenderOrdinal;
          });
          for (let i = 0; i < tmpLoadedViews.length; i++) {
            let tmpView = this.pict.views[tmpLoadedViews[i]];
            if (tmpView.options.AutoRender) {
              tmpAnticipate.anticipate(tmpView.renderAsync.bind(tmpView));
            }
          }
          tmpAnticipate.wait(pError => {
            this.lastAutoRenderTimestamp = this.fable.log.getTimeStamp();
            if (this.pict.LogNoisiness > 0) {
              this.log.trace("PictApp [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderAutoViewsAsync complete."));
            }
            return tmpCallback(pError);
          });
        }

        /**
         * @return {boolean}
         */
        get isPictApplication() {
          return true;
        }
      }
      module.exports = PictApplication;
    }, {
      "../package.json": 4,
      "fable-serviceproviderbase": 3
    }],
    6: [function (require, module, exports) {
      module.exports = {
        "name": "pict-provider",
        "version": "1.0.13",
        "description": "Pict Provider Base Class",
        "main": "source/Pict-Provider.js",
        "scripts": {
          "start": "node source/Pict-Provider.js",
          "test": "npx quack test",
          "tests": "npx quack test -g",
          "coverage": "npx quack coverage",
          "build": "npx quack build",
          "docker-dev-build": "docker build ./ -f Dockerfile_LUXURYCode -t pict-provider-image:local",
          "docker-dev-run": "docker run -it -d --name pict-provider-dev -p 24125:8080 -p 30027:8086 -v \"$PWD/.config:/home/coder/.config\"  -v \"$PWD:/home/coder/pict-provider\" -u \"$(id -u):$(id -g)\" -e \"DOCKER_USER=$USER\" pict-provider-image:local",
          "docker-dev-shell": "docker exec -it pict-provider-dev /bin/bash",
          "lint": "eslint source/**",
          "types": "tsc -p ."
        },
        "types": "types/source/Pict-Provider.d.ts",
        "repository": {
          "type": "git",
          "url": "git+https://github.com/stevenvelozo/pict-provider.git"
        },
        "author": "steven velozo <steven@velozo.com>",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/stevenvelozo/pict-provider/issues"
        },
        "homepage": "https://github.com/stevenvelozo/pict-provider#readme",
        "devDependencies": {
          "@eslint/js": "^9.39.1",
          "eslint": "^9.39.1",
          "pict": "^1.0.351",
          "pict-docuserve": "^0.1.5",
          "quackage": "^1.1.0",
          "typescript": "^5.9.3"
        },
        "dependencies": {
          "fable-serviceproviderbase": "^3.0.19"
        },
        "mocha": {
          "diff": true,
          "extension": ["js"],
          "package": "./package.json",
          "reporter": "spec",
          "slow": "75",
          "timeout": "5000",
          "ui": "tdd",
          "watch-files": ["source/**/*.js", "test/**/*.js"],
          "watch-ignore": ["lib/vendor"]
        }
      };
    }, {}],
    7: [function (require, module, exports) {
      const libFableServiceBase = require('fable-serviceproviderbase');
      const libPackage = require('../package.json');
      const defaultPictProviderSettings = {
        ProviderIdentifier: false,
        // If this is set to true, when the App initializes this will.
        // After the App initializes, initialize will be called as soon as it's added.
        AutoInitialize: true,
        AutoInitializeOrdinal: 0,
        AutoLoadDataWithApp: true,
        AutoLoadDataOrdinal: 0,
        AutoSolveWithApp: true,
        AutoSolveOrdinal: 0,
        Manifests: {},
        Templates: []
      };
      class PictProvider extends libFableServiceBase {
        /**
         * @param {import('fable')} pFable - The Fable instance.
         * @param {Record<string, any>} [pOptions] - The options for the provider.
         * @param {string} [pServiceHash] - The service hash for the provider.
         */
        constructor(pFable, pOptions, pServiceHash) {
          // Intersect default options, parent constructor, service information
          let tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(defaultPictProviderSettings)), pOptions);
          super(pFable, tmpOptions, pServiceHash);

          /** @type {import('fable') & import('pict') & { instantiateServiceProviderWithoutRegistration(pServiceType: string, pOptions?: Record<string, any>, pCustomServiceHash?: string): any }} */
          this.fable;
          /** @type {import('fable') & import('pict') & { instantiateServiceProviderWithoutRegistration(pServiceType: string, pOptions?: Record<string, any>, pCustomServiceHash?: string): any }} */
          this.pict;
          /** @type {any} */
          this.log;
          /** @type {Record<string, any>} */
          this.options;
          /** @type {string} */
          this.UUID;
          /** @type {string} */
          this.Hash;
          if (!this.options.ProviderIdentifier) {
            this.options.ProviderIdentifier = "AutoProviderID-".concat(this.fable.getUUID());
          }
          this.serviceType = 'PictProvider';
          /** @type {Record<string, any>} */
          this._Package = libPackage;

          // Convenience and consistency naming
          this.pict = this.fable;

          // Wire in the essential Pict application state
          /** @type {Record<string, any>} */
          this.AppData = this.pict.AppData;
          /** @type {Record<string, any>} */
          this.Bundle = this.pict.Bundle;
          this.initializeTimestamp = false;
          this.lastSolvedTimestamp = false;
          for (let i = 0; i < this.options.Templates.length; i++) {
            let tmpDefaultTemplate = this.options.Templates[i];
            if (!tmpDefaultTemplate.hasOwnProperty('Postfix') || !tmpDefaultTemplate.hasOwnProperty('Template')) {
              this.log.error("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " could not load Default Template ").concat(i, " in the options array."), tmpDefaultTemplate);
            } else {
              if (!tmpDefaultTemplate.Source) {
                tmpDefaultTemplate.Source = "PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " options object.");
              }
              this.pict.TemplateProvider.addDefaultTemplate(tmpDefaultTemplate.Prefix, tmpDefaultTemplate.Postfix, tmpDefaultTemplate.Template, tmpDefaultTemplate.Source);
            }
          }
        }

        /* -------------------------------------------------------------------------- */
        /*                        Code Section: Initialization                        */
        /* -------------------------------------------------------------------------- */
        onBeforeInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onBeforeInitialize:"));
          }
          return true;
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after pre-pinitialization.
         *
         * @return {void}
         */
        onBeforeInitializeAsync(fCallback) {
          this.onBeforeInitialize();
          return fCallback();
        }
        onInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onInitialize:"));
          }
          return true;
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after initialization.
         *
         * @return {void}
         */
        onInitializeAsync(fCallback) {
          this.onInitialize();
          return fCallback();
        }
        initialize() {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow PROVIDER [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " initialize:"));
          }
          if (!this.initializeTimestamp) {
            this.onBeforeInitialize();
            this.onInitialize();
            this.onAfterInitialize();
            this.initializeTimestamp = this.pict.log.getTimeStamp();
            return true;
          } else {
            this.log.warn("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " initialize called but initialization is already completed.  Aborting."));
            return false;
          }
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after initialization.
         *
         * @return {void}
         */
        initializeAsync(fCallback) {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow PROVIDER [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " initializeAsync:"));
          }
          if (!this.initializeTimestamp) {
            let tmpAnticipate = this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');
            if (this.pict.LogNoisiness > 0) {
              this.log.info("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " beginning initialization..."));
            }
            tmpAnticipate.anticipate(this.onBeforeInitializeAsync.bind(this));
            tmpAnticipate.anticipate(this.onInitializeAsync.bind(this));
            tmpAnticipate.anticipate(this.onAfterInitializeAsync.bind(this));
            tmpAnticipate.wait(pError => {
              this.initializeTimestamp = this.pict.log.getTimeStamp();
              if (pError) {
                this.log.error("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " initialization failed: ").concat(pError.message || pError), {
                  Stack: pError.stack
                });
              } else if (this.pict.LogNoisiness > 0) {
                this.log.info("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " initialization complete."));
              }
              return fCallback();
            });
          } else {
            this.log.warn("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " async initialize called but initialization is already completed.  Aborting."));
            // TODO: Should this be an error?
            return fCallback();
          }
        }
        onAfterInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onAfterInitialize:"));
          }
          return true;
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after initialization.
         *
         * @return {void}
         */
        onAfterInitializeAsync(fCallback) {
          this.onAfterInitialize();
          return fCallback();
        }
        onPreRender() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onPreRender:"));
          }
          return true;
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after pre-render.
         *
         * @return {void}
         */
        onPreRenderAsync(fCallback) {
          this.onPreRender();
          return fCallback();
        }
        render() {
          return this.onPreRender();
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after render.
         *
         * @return {void}
         */
        renderAsync(fCallback) {
          this.onPreRender();
          return fCallback();
        }
        onPreSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onPreSolve:"));
          }
          return true;
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after pre-solve.
         *
         * @return {void}
         */
        onPreSolveAsync(fCallback) {
          this.onPreSolve();
          return fCallback();
        }
        solve() {
          return this.onPreSolve();
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after solve.
         *
         * @return {void}
         */
        solveAsync(fCallback) {
          this.onPreSolve();
          return fCallback();
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after the data pre-load.
         */
        onBeforeLoadDataAsync(fCallback) {
          return fCallback();
        }

        /**
         * Hook to allow the provider to load data during application data load.
         *
         * @param {(pError?: Error) => void} fCallback - The callback to call after the data load.
         */
        onLoadDataAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onLoadDataAsync:"));
          }
          return fCallback();
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after the data post-load.
         */
        onAfterLoadDataAsync(fCallback) {
          return fCallback();
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after the data pre-load.
         *
         * @return {void}
         */
        onBeforeSaveDataAsync(fCallback) {
          return fCallback();
        }

        /**
         * Hook to allow the provider to load data during application data load.
         *
         * @param {(pError?: Error) => void} fCallback - The callback to call after the data load.
         *
         * @return {void}
         */
        onSaveDataAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onSaveDataAsync:"));
          }
          return fCallback();
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after the data post-load.
         *
         * @return {void}
         */
        onAfterSaveDataAsync(fCallback) {
          return fCallback();
        }
      }
      module.exports = PictProvider;
    }, {
      "../package.json": 6,
      "fable-serviceproviderbase": 3
    }],
    8: [function (require, module, exports) {
      /**
       * Simple syntax highlighter for use with CodeJar.
       *
       * Provides basic keyword/string/number/comment highlighting for common languages.
       * Can be replaced with Prism.js or highlight.js for more sophisticated highlighting
       * by passing a custom highlight function to the view options.
       *
       * @module Pict-Code-Highlighter
       */

      // Language definition map
      const _LanguageDefinitions = {
        'javascript': {
          // Combined regex to tokenize: comments, strings, template literals, regex, then everything else
          tokenizer: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(["'])(?:(?!\2|\\).|\\.)*?\2|(`(?:[^`\\]|\\.)*?`)|(\/(?![/*])(?:\\.|\[(?:\\.|[^\]])*\]|[^/\\\n])+\/[gimsuvy]*)/g,
          keywords: /\b(async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|function|get|if|import|in|instanceof|let|new|of|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/g,
          builtins: /\b(true|false|null|undefined|NaN|Infinity|console|window|document|Math|JSON|Array|Object|String|Number|Boolean|Date|RegExp|Map|Set|Promise|Error|Symbol|parseInt|parseFloat|require|module|exports)\b/g,
          numbers: /\b(\d+\.?\d*(?:e[+-]?\d+)?|0x[0-9a-fA-F]+|0b[01]+|0o[0-7]+)\b/g
        },
        'json': {
          tokenizer: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*")/g,
          keywords: /\b(true|false|null)\b/g,
          numbers: /-?\b\d+\.?\d*(?:e[+-]?\d+)?\b/g
        },
        'html': {
          // Tokenizer captures: (1) comments, (2) strings, (3) tags with attributes
          tokenizer: /(<!--[\s\S]*?-->)|(["'])(?:(?!\2|\\).|\\.)*?\2|(<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s+[a-zA-Z-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*))?)*\s*\/?>)/g,
          // tagToken group index for identifying tag matches
          tagGroupIndex: 3
        },
        'css': {
          tokenizer: /(\/\*[\s\S]*?\*\/)|(["'])(?:(?!\2|\\).|\\.)*?\2/g,
          selectors: /([.#]?[a-zA-Z_][\w-]*(?:\s*[>+~]\s*[.#]?[a-zA-Z_][\w-]*)*)\s*\{/g,
          properties: /\b([a-zA-Z-]+)\s*:/g,
          numbers: /\b(\d+\.?\d*)(px|em|rem|%|vh|vw|s|ms|deg|fr)?\b/g,
          keywords: /\b(important|inherit|initial|unset|none|auto|block|inline|flex|grid)\b/g
        },
        'sql': {
          tokenizer: /(--[^\n]*|\/\*[\s\S]*?\*\/)|(["'])(?:(?!\2|\\).|\\.)*?\2/g,
          keywords: /\b(SELECT|FROM|WHERE|AND|OR|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|ALTER|ADD|COLUMN|INDEX|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|COUNT|SUM|AVG|MIN|MAX|NOT|NULL|IS|IN|BETWEEN|LIKE|EXISTS|CASE|WHEN|THEN|ELSE|END|PRIMARY|KEY|FOREIGN|REFERENCES|CONSTRAINT|DEFAULT|CHECK|UNIQUE|CASCADE|GRANT|REVOKE|COMMIT|ROLLBACK|BEGIN|TRANSACTION|INT|VARCHAR|DATETIME|AUTO_INCREMENT|CURRENT_TIMESTAMP)\b/gi,
          numbers: /\b\d+\.?\d*\b/g
        }
      };

      // Alias some common language names
      _LanguageDefinitions['js'] = _LanguageDefinitions['javascript'];
      _LanguageDefinitions['htm'] = _LanguageDefinitions['html'];

      /**
       * Escape HTML special characters to prevent XSS when inserting into innerHTML.
       *
       * @param {string} pString - The string to escape
       * @returns {string} The escaped string
       */
      function escapeHTML(pString) {
        return pString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }

      /**
       * Highlight a segment of code that is NOT inside a string or comment.
       * This applies keyword, number, and structural highlighting.
       *
       * @param {string} pCode - The code segment to highlight (already HTML-escaped)
       * @param {object} pLanguageDef - The language definition
       * @returns {string} The highlighted HTML
       */
      function highlightCodeSegment(pCode, pLanguageDef) {
        let tmpResult = pCode;

        // CSS selectors
        if (pLanguageDef.selectors) {
          pLanguageDef.selectors.lastIndex = 0;
          tmpResult = tmpResult.replace(pLanguageDef.selectors, '<span class="function-name">$1</span>{');
        }

        // CSS properties
        if (pLanguageDef.properties) {
          pLanguageDef.properties.lastIndex = 0;
          tmpResult = tmpResult.replace(pLanguageDef.properties, '<span class="property">$1</span>:');
        }

        // Keywords
        if (pLanguageDef.keywords) {
          pLanguageDef.keywords.lastIndex = 0;
          tmpResult = tmpResult.replace(pLanguageDef.keywords, '<span class="keyword">$1</span>');
        }

        // Builtins
        if (pLanguageDef.builtins) {
          pLanguageDef.builtins.lastIndex = 0;
          tmpResult = tmpResult.replace(pLanguageDef.builtins, '<span class="keyword">$1</span>');
        }

        // Numbers (CSS numbers may have units as a capture group, others do not)
        if (pLanguageDef.numbers) {
          pLanguageDef.numbers.lastIndex = 0;
          tmpResult = tmpResult.replace(pLanguageDef.numbers, pMatch => {
            return "<span class=\"number\">".concat(pMatch, "</span>");
          });
        }
        return tmpResult;
      }

      /**
       * Highlight an HTML tag token, applying tag name, attribute name, and attribute value colors.
       *
       * The approach: parse the raw tag into structured pieces first, then build the
       * highlighted output from those pieces. This avoids mixing raw text with HTML span
       * tags, which would cause regex replacements to match span attributes on subsequent passes.
       *
       * @param {string} pTag - The raw (unescaped) tag string
       * @returns {string} The highlighted HTML
       */
      function highlightHTMLTag(pTag) {
        let tmpResult = '';
        let tmpRest = pTag;

        // 1. Extract the opening bracket and tag name: < or </  followed by tagname
        let tmpTagNameMatch = tmpRest.match(/^(<\/?)([a-zA-Z][a-zA-Z0-9-]*)/);
        if (!tmpTagNameMatch) {
          // Not a recognizable tag, just escape the whole thing
          return escapeHTML(pTag);
        }
        tmpResult += escapeHTML(tmpTagNameMatch[1]);
        tmpResult += '<span class="tag">' + escapeHTML(tmpTagNameMatch[2]) + '</span>';
        tmpRest = tmpRest.substring(tmpTagNameMatch[0].length);

        // 2. Parse attributes from the remaining text (before the closing > or />)
        // Repeatedly match: whitespace + attr-name + optional =value
        let tmpAttrRegex = /^(\s+)([a-zA-Z-]+)(?:(\s*=\s*)(["'])([^"']*?)\4)?/;
        let tmpAttrMatch;
        while ((tmpAttrMatch = tmpRest.match(tmpAttrRegex)) !== null) {
          // Whitespace before the attribute
          tmpResult += tmpAttrMatch[1];
          // Attribute name
          tmpResult += '<span class="attr-name">' + escapeHTML(tmpAttrMatch[2]) + '</span>';

          // If there's an = value part
          if (tmpAttrMatch[3]) {
            tmpResult += escapeHTML(tmpAttrMatch[3]);
            tmpResult += '<span class="attr-value">' + escapeHTML(tmpAttrMatch[4]) + escapeHTML(tmpAttrMatch[5]) + escapeHTML(tmpAttrMatch[4]) + '</span>';
          }
          tmpRest = tmpRest.substring(tmpAttrMatch[0].length);
        }

        // 3. Whatever remains (whitespace, />, >) — escape it all
        tmpResult += escapeHTML(tmpRest);
        return tmpResult;
      }

      /**
       * Create a highlight function for a given language.
       *
       * The approach: use a single tokenizer regex to split the code into protected tokens
       * (comments, strings) and code segments. Process each segment independently.
       * This avoids placeholder/sentinel issues entirely.
       *
       * @param {string} pLanguage - The language identifier (e.g. "javascript", "json", "html")
       * @returns {function} A function that takes an element and highlights its textContent
       */
      function createHighlighter(pLanguage) {
        return function highlightElement(pElement) {
          let tmpCode = pElement.textContent;
          let tmpLanguageName = typeof pLanguage === 'string' ? pLanguage.toLowerCase() : 'javascript';
          let tmpLanguageDef = _LanguageDefinitions[tmpLanguageName];
          if (!tmpLanguageDef) {
            // No highlighting rules for this language; just escape and return
            pElement.innerHTML = escapeHTML(tmpCode);
            return;
          }
          if (!tmpLanguageDef.tokenizer) {
            // No tokenizer; just escape and apply keyword highlighting
            pElement.innerHTML = highlightCodeSegment(escapeHTML(tmpCode), tmpLanguageDef);
            return;
          }

          // Split the code into tokens using the tokenizer regex.
          // The tokenizer captures comments and strings as groups.
          // We process everything between matches as code.
          let tmpResult = '';
          let tmpLastIndex = 0;
          let tmpTagGroupIndex = tmpLanguageDef.tagGroupIndex || 0;
          tmpLanguageDef.tokenizer.lastIndex = 0;
          let tmpMatch;
          while ((tmpMatch = tmpLanguageDef.tokenizer.exec(tmpCode)) !== null) {
            // Add the code segment before this match
            if (tmpMatch.index > tmpLastIndex) {
              let tmpSegment = tmpCode.substring(tmpLastIndex, tmpMatch.index);
              tmpResult += highlightCodeSegment(escapeHTML(tmpSegment), tmpLanguageDef);
            }
            let tmpFullMatch = tmpMatch[0];

            // Determine token type from capture groups
            // Group 1 is always comments, Group 2+ are strings/template literals/regex
            if (tmpMatch[1]) {
              // Comment
              tmpResult += "<span class=\"comment\">".concat(escapeHTML(tmpFullMatch), "</span>");
            } else if (tmpTagGroupIndex > 0 && tmpMatch[tmpTagGroupIndex]) {
              // HTML tag — highlight tag name, attributes, and values
              tmpResult += highlightHTMLTag(tmpFullMatch);
            } else {
              // String, template literal, or regex
              tmpResult += "<span class=\"string\">".concat(escapeHTML(tmpFullMatch), "</span>");
            }
            tmpLastIndex = tmpLanguageDef.tokenizer.lastIndex;
          }

          // Add any remaining code after the last match
          if (tmpLastIndex < tmpCode.length) {
            let tmpSegment = tmpCode.substring(tmpLastIndex);
            tmpResult += highlightCodeSegment(escapeHTML(tmpSegment), tmpLanguageDef);
          }
          pElement.innerHTML = tmpResult;
        };
      }
      module.exports = createHighlighter;
      module.exports.LanguageDefinitions = _LanguageDefinitions;
    }, {}],
    9: [function (require, module, exports) {
      module.exports = {
        "RenderOnLoad": true,
        "DefaultRenderable": "CodeEditor-Wrap",
        "DefaultDestinationAddress": "#CodeEditor-Container-Div",
        "Templates": [{
          "Hash": "CodeEditor-Container",
          "Template": "<!-- CodeEditor-Container Rendering Soon -->"
        }],
        "Renderables": [{
          "RenderableHash": "CodeEditor-Wrap",
          "TemplateHash": "CodeEditor-Container",
          "DestinationAddress": "#CodeEditor-Container-Div"
        }],
        "TargetElementAddress": "#CodeEditor-Container-Div",
        // Address in AppData or other Pict address space to read/write code content
        "CodeDataAddress": false,
        // The language for syntax highlighting (e.g. "javascript", "html", "css", "json")
        "Language": "javascript",
        // Whether the editor is read-only
        "ReadOnly": false,
        // Tab character: use tab or spaces
        "Tab": "\t",
        // Whether to indent with the same whitespace as the previous line
        "IndentOn": /[({[]$/,
        // Whether to add a closing bracket/paren/brace
        "MoveToNewLine": /^[)}\]]/,
        // Whether to handle the closing character
        "AddClosing": true,
        // Whether to preserve indentation on new lines
        "CatchTab": true,
        // Whether to show line numbers
        "LineNumbers": true,
        // Default code content if no address is provided
        "DefaultCode": "// Enter your code here\n",
        // CSS for the code editor.
        //
        // Every color/font is wired through pict-provider-theme tokens so apps
        // using pict-provider-theme get themed code editor automatically.  Each
        // var() carries its original ATOM-One-Light hex as the fallback so apps
        // without pict-provider-theme installed look exactly as before.
        "CSS": ".pict-code-editor-wrap\n{\n\tdisplay: flex;\n\tfont-family: var(--theme-typography-family-mono, 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace);\n\tfont-size: 14px;\n\tline-height: 1.5;\n\tborder: 1px solid var(--theme-color-border-default, #D0D0D0);\n\tborder-radius: 4px;\n\toverflow: hidden;\n}\n.pict-code-editor-wrap .pict-code-line-numbers\n{\n\twidth: 40px;\n\tmin-width: 40px;\n\t/* padding-top/bottom are stamped at runtime from the editor's\n\t   computed padding so row 1 of the gutter aligns with row 1 of\n\t   the code; only horizontal padding is stylesheet-owned. */\n\tpadding: 0;\n\ttext-align: right;\n\tbackground: var(--theme-color-editor-linenumber-background, var(--theme-color-background-secondary, #F5F5F5));\n\tborder-right: 1px solid var(--theme-color-editor-gutter-border, var(--theme-color-border-default, #D0D0D0));\n\tcolor: var(--theme-color-editor-linenumber-text, var(--theme-color-text-muted, #999));\n\tfont-size: 13px;\n\t/* line-height, padding-top, padding-bottom, and font-family are\n\t   intentionally NOT declared here.  PictSectionCode._syncGutterMetrics()\n\t   copies them from the editor's computed styles at init and on every\n\t   editor resize, so the gutter is guaranteed to track the editor.\n\t   Declaring them in CSS would either be redundant (when matching) or\n\t   actively wrong (when the editor's metrics diverge \u2014 e.g. theme scale\n\t   changes the editor's font-size).  See codejar-linenumbers for the\n\t   canonical version of this pattern. */\n\tuser-select: none;\n\tpointer-events: none;\n\tbox-sizing: border-box;\n}\n.pict-code-editor-wrap .pict-code-line-numbers span\n{\n\tdisplay: block;\n\tpadding: 0 8px 0 0;\n}\n.pict-code-editor-wrap .pict-code-editor\n{\n\tmargin: 0;\n\tpadding: 10px 10px 10px 8px;\n\tmin-height: 100px;\n\tflex: 1;\n\tmin-width: 0;\n\toutline: none;\n\ttab-size: 4;\n\twhite-space: pre;\n\toverflow-wrap: normal;\n\tcolor: var(--theme-color-text-primary, #383A42);\n\tbackground: var(--theme-color-background-panel, #FAFAFA);\n\tcaret-color: var(--theme-color-brand-primary, #526FFF);\n\tborder-radius: 0 4px 4px 0;\n}\n.pict-code-editor-wrap .pict-code-editor.pict-code-no-line-numbers\n{\n\tpadding-left: 10px;\n\tborder-radius: 4px;\n}\n.pict-code-editor-wrap .pict-code-editor::selection,\n.pict-code-editor-wrap .pict-code-editor *::selection\n{\n\tbackground: var(--theme-color-editor-selection-background, var(--theme-color-selection-background, #B3D4FC));\n}\n/* Syntax token colors \u2014 each class binds to a Color.Syntax.* token from\n   pict-provider-theme. Fallback hexes match the One Light palette so apps\n   that don't install the theme provider look the same as before. */\n.pict-code-editor-wrap .pict-code-editor .keyword       { color: var(--theme-color-syntax-keyword,     #A626A4); }\n.pict-code-editor-wrap .pict-code-editor .string        { color: var(--theme-color-syntax-string,      #50A14F); }\n.pict-code-editor-wrap .pict-code-editor .number        { color: var(--theme-color-syntax-number,      #986801); }\n.pict-code-editor-wrap .pict-code-editor .comment       { color: var(--theme-color-syntax-comment,     #A0A1A7); font-style: italic; }\n.pict-code-editor-wrap .pict-code-editor .operator      { color: var(--theme-color-syntax-operator,    #0184BC); }\n.pict-code-editor-wrap .pict-code-editor .punctuation   { color: var(--theme-color-syntax-punctuation, #383A42); }\n.pict-code-editor-wrap .pict-code-editor .function-name { color: var(--theme-color-syntax-function,    #4078F2); }\n.pict-code-editor-wrap .pict-code-editor .property      { color: var(--theme-color-syntax-property,    #E45649); }\n.pict-code-editor-wrap .pict-code-editor .tag           { color: var(--theme-color-syntax-tag,         #E45649); }\n.pict-code-editor-wrap .pict-code-editor .attr-name     { color: var(--theme-color-syntax-attrname,    #986801); }\n.pict-code-editor-wrap .pict-code-editor .attr-value    { color: var(--theme-color-syntax-attrvalue,   #50A14F); }\n.pict-code-editor-wrap .pict-code-editor .builtin       { color: var(--theme-color-syntax-builtin,     #986801); }\n.pict-code-editor-wrap .pict-code-editor .type          { color: var(--theme-color-syntax-type,        #C18401); }\n.pict-code-editor-wrap .pict-code-editor .variable      { color: var(--theme-color-syntax-variable,    #383A42); }\n\n/* highlight.js class aliases \u2014 when host apps render code blocks with\n   highlight.js (e.g. markdown previews via CodeJar's hljs integration),\n   the output uses .hljs / .hljs-* classes rather than the bare token\n   classes pict-section-code emits. Mapping them here lets one stylesheet\n   theme both editor surfaces (bare classes) and hljs-rendered surfaces\n   without the host needing a separate per-app github.css. Rules are\n   intentionally unscoped (no .pict-code-editor-wrap parent) so they\n   apply globally wherever hljs paints. */\n.hljs                  { color: var(--theme-color-text-primary,         #383A42); background: transparent; }\n.hljs-keyword,\n.hljs-keyword.hljs-typeof,\n.hljs-selector-tag,\n.hljs-literal          { color: var(--theme-color-syntax-keyword,       #A626A4); }\n.hljs-string,\n.hljs-regexp,\n.hljs-template-tag,\n.hljs-template-variable { color: var(--theme-color-syntax-string,       #50A14F); }\n.hljs-number,\n.hljs-meta             { color: var(--theme-color-syntax-number,        #986801); }\n.hljs-comment,\n.hljs-quote            { color: var(--theme-color-syntax-comment,       #A0A1A7); font-style: italic; }\n.hljs-operator,\n.hljs-link             { color: var(--theme-color-syntax-operator,      #0184BC); }\n.hljs-punctuation      { color: var(--theme-color-syntax-punctuation,   #383A42); }\n.hljs-function .hljs-title,\n.hljs-title.function_,\n.hljs-title.class_     { color: var(--theme-color-syntax-function,      #4078F2); }\n.hljs-variable,\n.hljs-variable.language_,\n.hljs-params           { color: var(--theme-color-syntax-variable,      #383A42); }\n.hljs-type,\n.hljs-class .hljs-title { color: var(--theme-color-syntax-type,         #C18401); }\n.hljs-built_in,\n.hljs-builtin-name     { color: var(--theme-color-syntax-builtin,       #986801); }\n.hljs-attr,\n.hljs-property         { color: var(--theme-color-syntax-property,      #E45649); }\n.hljs-tag,\n.hljs-name             { color: var(--theme-color-syntax-tag,           #E45649); }\n.hljs-attribute        { color: var(--theme-color-syntax-attrname,      #986801); }\n.hljs-symbol           { color: var(--theme-color-syntax-attrvalue,     #50A14F); }\n.hljs-emphasis         { font-style: italic; }\n.hljs-strong           { font-weight: bold; }\n.hljs-deletion         { color: var(--theme-color-status-error,         #B62828); background: rgba(220, 50, 47, 0.08); }\n.hljs-addition         { color: var(--theme-color-status-success,       #2E7A3A); background: rgba(80, 161, 79, 0.10); }\n"
      };
    }, {}],
    10: [function (require, module, exports) {
      const libPictViewClass = require('pict-view');
      const libCreateHighlighter = require('./Pict-Code-Highlighter.js');
      const _DefaultConfiguration = require('./Pict-Section-Code-DefaultConfiguration.js');
      class PictSectionCode extends libPictViewClass {
        constructor(pFable, pOptions, pServiceHash) {
          let tmpOptions = Object.assign({}, _DefaultConfiguration, pOptions);
          super(pFable, tmpOptions, pServiceHash);
          this.initialRenderComplete = false;

          // The CodeJar instance
          this.codeJar = null;

          // The highlight function (can be overridden)
          this._highlightFunction = null;

          // The current language
          this._language = this.options.Language || 'javascript';
        }
        onBeforeInitialize() {
          super.onBeforeInitialize();
          this._codeJarPrototype = null;
          this.targetElement = false;

          // Build the default highlight function for the configured language
          this._highlightFunction = libCreateHighlighter(this._language);
          return super.onBeforeInitialize();
        }

        /**
         * Connect the CodeJar prototype.  If not passed explicitly, try to find it
         * as a global (window.CodeJar) or require it from the npm package.
         *
         * @param {function} [pCodeJarPrototype] - The CodeJar constructor function
         * @returns {boolean|void}
         */
        connectCodeJarPrototype(pCodeJarPrototype) {
          if (typeof pCodeJarPrototype === 'function') {
            this._codeJarPrototype = pCodeJarPrototype;
            return;
          }

          // Try to find CodeJar in global scope
          if (typeof window !== 'undefined') {
            if (typeof window.CodeJar === 'function') {
              this.log.trace("PICT-Code Found CodeJar in window.CodeJar.");
              this._codeJarPrototype = window.CodeJar;
              return;
            }
          }
          this.log.error("PICT-Code No CodeJar prototype found. Include codejar via script tag or call connectCodeJarPrototype(CodeJar) explicitly.");
          return false;
        }
        onAfterRender(pRenderable) {
          // Ensure the CSS from all registered views is injected into the DOM
          this.pict.CSSMap.injectCSS();
          if (!this.initialRenderComplete) {
            this.onAfterInitialRender();
            this.initialRenderComplete = true;
          }
          return super.onAfterRender(pRenderable);
        }
        onAfterInitialRender() {
          // Resolve the CodeJar prototype if not already set
          if (!this._codeJarPrototype) {
            this.connectCodeJarPrototype();
          }
          if (!this._codeJarPrototype) {
            this.log.error("PICT-Code Cannot initialize editor; no CodeJar prototype available.");
            return false;
          }
          if (this.codeJar) {
            this.log.error("PICT-Code editor is already initialized!");
            return false;
          }

          // Find the target element
          let tmpTargetElementSet = this.services.ContentAssignment.getElement(this.options.TargetElementAddress);
          if (!tmpTargetElementSet || tmpTargetElementSet.length < 1) {
            this.log.error("PICT-Code Could not find target element [".concat(this.options.TargetElementAddress, "]!"));
            this.targetElement = false;
            return false;
          }
          this.targetElement = tmpTargetElementSet[0];

          // Build the editor DOM structure
          this._buildEditorDOM();

          // Get initial code content
          let tmpCode = this._resolveCodeContent();

          // Create the CodeJar options
          let tmpCodeJarOptions = {};
          if (this.options.Tab) {
            tmpCodeJarOptions.tab = this.options.Tab;
          }
          if (this.options.IndentOn) {
            tmpCodeJarOptions.indentOn = this.options.IndentOn;
          }
          if (this.options.MoveToNewLine) {
            tmpCodeJarOptions.moveToNewLine = this.options.MoveToNewLine;
          }
          if (typeof this.options.AddClosing !== 'undefined') {
            tmpCodeJarOptions.addClosing = this.options.AddClosing;
          }
          if (typeof this.options.CatchTab !== 'undefined') {
            tmpCodeJarOptions.catchTab = this.options.CatchTab;
          }
          this.customConfigureEditorOptions(tmpCodeJarOptions);

          // Instantiate CodeJar on the editor element
          let tmpEditorElement = this._editorElement;
          this.codeJar = this._codeJarPrototype(tmpEditorElement, this._highlightFunction, tmpCodeJarOptions);

          // CodeJar forces white-space:pre-wrap and overflow-wrap:break-word
          // via inline styles, which causes line wrapping that breaks the
          // line-number alignment.  Override back to non-wrapping so the
          // wrap container scrolls horizontally instead.
          this._resetEditorWrapStyles();

          // Set the initial code
          if (tmpCode) {
            this.codeJar.updateCode(tmpCode);
          }

          // Wire up the change handler
          this.codeJar.onUpdate(pCode => {
            this._updateLineNumbers();
            this.onCodeChange(pCode);
          });

          // Initial line number render
          this._updateLineNumbers();

          // Sync line-numbers vertical position with the editor's scroll.
          //
          // The editor element scrolls internally (CodeJar uses
          // contenteditable + overflow:auto for long content), but the
          // line-numbers div is a sibling with overflow:visible — without
          // this sync the line-numbers content stays glued at the top of
          // the wrap while the editor scrolls underneath it, so "line 1"
          // appears next to whatever line is actually showing.
          //
          // Using `transform: translateY(...)` instead of scrollTop keeps
          // the sync compositor-only (no reflow per scroll event) and
          // avoids needing to change the line-numbers element's overflow
          // from visible.  Passive listener so we don't block scrolling.
          if (this._lineNumbersElement) {
            let tmpLineNumbersEl = this._lineNumbersElement;
            tmpEditorElement.addEventListener('scroll', function () {
              tmpLineNumbersEl.style.transform = 'translateY(-' + tmpEditorElement.scrollTop + 'px)';
            }, {
              passive: true
            });
          }

          // Sync gutter typographic metrics from the editor.  The gutter
          // must use the editor's exact line-height (and matching padding)
          // or rows drift apart cumulatively.  See _syncGutterMetrics().
          this._syncGutterMetrics();

          // Watch the editor for size changes (window resize affecting
          // flex layout, container resize) and re-sync the gutter so it
          // continues to track the editor.  ResizeObserver fires once per
          // frame at most, so the cost is negligible.
          if (this._lineNumbersElement && typeof ResizeObserver === 'function') {
            let tmpSelf = this;
            this._editorResizeObserver = new ResizeObserver(function () {
              tmpSelf._syncGutterMetrics();
            });
            this._editorResizeObserver.observe(tmpEditorElement);
          }

          // Watch for direct style/class mutations on the editor.  Theme
          // providers that toggle scale by swapping a class on the editor,
          // or host code that adjusts editor typography via inline styles,
          // don't necessarily change the editor's box size — so the
          // ResizeObserver above wouldn't see them.  MutationObserver on
          // the attributes catches these cases.
          if (this._lineNumbersElement && typeof MutationObserver === 'function') {
            let tmpSelf = this;
            this._editorStyleObserver = new MutationObserver(function () {
              tmpSelf._syncGutterMetrics();
            });
            this._editorStyleObserver.observe(tmpEditorElement, {
              attributes: true,
              attributeFilter: ['style', 'class']
            });
          }

          // Handle read-only
          if (this.options.ReadOnly) {
            tmpEditorElement.setAttribute('contenteditable', 'false');
          }
        }

        /**
         * Build the editor DOM elements inside the target container.
         */
        _buildEditorDOM() {
          // Clear the target
          this.targetElement.innerHTML = '';

          // Create wrapper
          let tmpWrap = document.createElement('div');
          tmpWrap.className = 'pict-code-editor-wrap';

          // Create line numbers container
          if (this.options.LineNumbers) {
            let tmpLineNumbers = document.createElement('div');
            tmpLineNumbers.className = 'pict-code-line-numbers';
            tmpWrap.appendChild(tmpLineNumbers);
            this._lineNumbersElement = tmpLineNumbers;
          }

          // Create the editor element (CodeJar needs a pre or div)
          let tmpEditor = document.createElement('div');
          tmpEditor.className = 'pict-code-editor language-' + this._language;
          if (!this.options.LineNumbers) {
            tmpEditor.className += ' pict-code-no-line-numbers';
          }
          tmpWrap.appendChild(tmpEditor);
          this.targetElement.appendChild(tmpWrap);
          this._editorElement = tmpEditor;
          this._wrapElement = tmpWrap;
        }

        /**
         * Update the line numbers display based on current code content.
         */
        _updateLineNumbers() {
          if (!this.options.LineNumbers || !this._lineNumbersElement || !this._editorElement) {
            return;
          }
          let tmpCode = this._editorElement.textContent || '';
          let tmpLineCount = tmpCode.split('\n').length;
          let tmpHTML = '';
          for (let i = 1; i <= tmpLineCount; i++) {
            tmpHTML += "<span>".concat(i, "</span>");
          }
          this._lineNumbersElement.innerHTML = tmpHTML;

          // Defense-in-depth: every line-count rebuild is also a natural
          // re-sync point.  Cheap (one getComputedStyle + a handful of
          // style writes) and guarantees newly-added spans use the same
          // metrics as the editor at the moment of the rebuild.
          this._syncGutterMetrics();
        }

        /**
         * Copy typographic metrics from the editor element to the line-numbers
         * gutter so every gutter row lines up with its corresponding code row.
         *
         * The gutter is a sibling element with its own font/line-height
         * declarations — if any one diverges from the editor (unitless
         * line-height resolving against a different font-size, host CSS
         * overriding font-family, theme scale changing the editor's metrics),
         * the two desync and the drift accumulates with every line.
         *
         * The pattern is borrowed from the canonical `codejar-linenumbers`
         * library (julianpoemp/codejar-linenumbers), which solves the same
         * class of bug by reading the editor's computed styles at init and
         * stamping them onto the gutter.  We extend that here by also
         * re-stamping whenever the editor resizes (see the ResizeObserver in
         * onAfterInitialRender), so theme scale changes self-heal too.
         *
         * Public callers can invoke {@link syncMetrics} to force a re-sync
         * after any external change that affects editor typography.
         */
        _syncGutterMetrics() {
          if (!this._lineNumbersElement || !this._editorElement) {
            return;
          }
          if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
            return;
          }
          let tmpEditorStyle = window.getComputedStyle(this._editorElement);
          let tmpLineHeight = tmpEditorStyle.lineHeight;

          // `normal` is the spec default — leave the gutter untouched so the
          // stylesheet's declaration wins (we have no number to copy).
          if (tmpLineHeight && tmpLineHeight !== 'normal') {
            this._lineNumbersElement.style.lineHeight = tmpLineHeight;
          }

          // Match the editor's vertical padding so row 1 of the gutter sits
          // at the same y-offset as row 1 of the code.
          if (tmpEditorStyle.paddingTop) {
            this._lineNumbersElement.style.paddingTop = tmpEditorStyle.paddingTop;
          }
          if (tmpEditorStyle.paddingBottom) {
            this._lineNumbersElement.style.paddingBottom = tmpEditorStyle.paddingBottom;
          }

          // Font-family must match so the visual baseline of the digits
          // aligns with the code (different monospace fonts can have
          // different x-heights even at identical line-heights).
          if (tmpEditorStyle.fontFamily) {
            this._lineNumbersElement.style.fontFamily = tmpEditorStyle.fontFamily;
          }

          // Dev-time sanity check.  If the gutter's resolved row height
          // disagrees with the editor's, alignment will drift cumulatively.
          // Warn loudly so the regression is caught at the next reload
          // instead of silently accumulating pixels per line.
          if (typeof console !== 'undefined' && console.warn) {
            let tmpFirstSpan = this._lineNumbersElement.querySelector('span');
            if (tmpFirstSpan) {
              let tmpGutterRow = tmpFirstSpan.getBoundingClientRect().height;
              let tmpEditorRow = parseFloat(tmpLineHeight);
              if (tmpGutterRow && tmpEditorRow && Math.abs(tmpGutterRow - tmpEditorRow) > 0.5) {
                console.warn('[pict-section-code] gutter/editor row-height mismatch: ' + 'gutter ' + tmpGutterRow + 'px vs editor ' + tmpEditorRow + 'px — ' + 'line numbers will drift. Check for CSS overriding ' + '.pict-code-line-numbers line-height.');
              }
            }
          }
        }

        /**
         * Public hook for hosts to force a gutter metrics re-sync after
         * external typography changes (theme scale, font-size swap, etc.).
         * The ResizeObserver attached at init handles most cases, but call
         * this from an app's post-theme-change hook for belt-and-suspenders
         * coverage.
         */
        syncMetrics() {
          this._syncGutterMetrics();
        }

        /**
         * Reset inline styles that CodeJar sets on the editor element.
         *
         * CodeJar forces white-space:pre-wrap and overflow-wrap:break-word so
         * long lines wrap visually.  That breaks line-number alignment because
         * each wrapped visual row is not a logical line.  Resetting to pre /
         * normal makes the outer .pict-code-editor-wrap scroll horizontally.
         */
        _resetEditorWrapStyles() {
          if (!this._editorElement) {
            return;
          }
          this._editorElement.style.whiteSpace = 'pre';
          this._editorElement.style.overflowWrap = 'normal';
        }

        /**
         * Resolve the initial code content from address or default.
         *
         * @returns {string} The code content
         */
        _resolveCodeContent() {
          if (this.options.CodeDataAddress) {
            const tmpAddressSpace = {
              Fable: this.fable,
              Pict: this.fable,
              AppData: this.AppData,
              Bundle: this.Bundle,
              Options: this.options
            };
            let tmpAddressedData = this.fable.manifest.getValueByHash(tmpAddressSpace, this.options.CodeDataAddress);
            if (typeof tmpAddressedData === 'string') {
              return tmpAddressedData;
            } else {
              this.log.warn("PICT-Code Address [".concat(this.options.CodeDataAddress, "] did not return a string; it was ").concat(typeof tmpAddressedData, "."));
            }
          }
          return this.options.DefaultCode || '';
        }

        /**
         * Hook for subclasses to customize CodeJar options before instantiation.
         *
         * @param {object} pOptions - The CodeJar options object to modify
         */
        customConfigureEditorOptions(pOptions) {
          // Override in subclass to tweak options
        }

        /**
         * Called when the code content changes.  Override in subclasses to handle changes.
         *
         * @param {string} pCode - The new code content
         */
        onCodeChange(pCode) {
          // Write back to data address if configured
          if (this.options.CodeDataAddress) {
            const tmpAddressSpace = {
              Fable: this.fable,
              Pict: this.fable,
              AppData: this.AppData,
              Bundle: this.Bundle,
              Options: this.options
            };
            this.fable.manifest.setValueByHash(tmpAddressSpace, this.options.CodeDataAddress, pCode);
          }
        }

        // -- Public API Methods --

        /**
         * Get the current code content.
         *
         * @returns {string} The current code
         */
        getCode() {
          if (!this.codeJar) {
            this.log.warn('PICT-Code getCode called before editor initialized.');
            return '';
          }
          return this.codeJar.toString();
        }

        /**
         * Set the code content.
         *
         * @param {string} pCode - The code to set
         */
        setCode(pCode) {
          if (!this.codeJar) {
            this.log.warn('PICT-Code setCode called before editor initialized.');
            return;
          }
          this.codeJar.updateCode(pCode);
          this._updateLineNumbers();
        }

        /**
         * Change the editor language and re-highlight.
         *
         * @param {string} pLanguage - The language identifier
         */
        setLanguage(pLanguage) {
          this._language = pLanguage;
          this._highlightFunction = libCreateHighlighter(pLanguage);
          if (this._editorElement) {
            // Update the class
            this._editorElement.className = 'pict-code-editor language-' + pLanguage;
            if (!this.options.LineNumbers) {
              this._editorElement.className += ' pict-code-no-line-numbers';
            }
          }
          if (this.codeJar) {
            // Re-create the editor with the new highlight function
            let tmpCode = this.codeJar.toString();
            this.codeJar.destroy();
            this.codeJar = this._codeJarPrototype(this._editorElement, this._highlightFunction, {
              tab: this.options.Tab,
              catchTab: this.options.CatchTab,
              addClosing: this.options.AddClosing
            });
            this._resetEditorWrapStyles();
            this.codeJar.updateCode(tmpCode);
            this.codeJar.onUpdate(pCode => {
              this._updateLineNumbers();
              this.onCodeChange(pCode);
            });
          }
        }

        /**
         * Set a custom highlight function to replace the built-in highlighter.
         * Useful for integrating Prism.js, highlight.js, or any other library.
         *
         * @param {function} pHighlightFunction - A function that takes a DOM element and highlights its textContent
         */
        setHighlightFunction(pHighlightFunction) {
          if (typeof pHighlightFunction !== 'function') {
            this.log.error('PICT-Code setHighlightFunction requires a function.');
            return;
          }
          this._highlightFunction = pHighlightFunction;
          if (this.codeJar) {
            let tmpCode = this.codeJar.toString();
            this.codeJar.destroy();
            this.codeJar = this._codeJarPrototype(this._editorElement, this._highlightFunction, {
              tab: this.options.Tab,
              catchTab: this.options.CatchTab,
              addClosing: this.options.AddClosing
            });
            this._resetEditorWrapStyles();
            this.codeJar.updateCode(tmpCode);
            this.codeJar.onUpdate(pCode => {
              this._updateLineNumbers();
              this.onCodeChange(pCode);
            });
          }
        }

        /**
         * Set the read-only state of the editor.
         *
         * @param {boolean} pReadOnly - Whether the editor should be read-only
         */
        setReadOnly(pReadOnly) {
          this.options.ReadOnly = pReadOnly;
          if (this._editorElement) {
            this._editorElement.setAttribute('contenteditable', pReadOnly ? 'false' : 'true');
          }
        }

        /**
         * Destroy the editor and clean up.
         */
        destroy() {
          if (this._editorResizeObserver) {
            this._editorResizeObserver.disconnect();
            this._editorResizeObserver = null;
          }
          if (this._editorStyleObserver) {
            this._editorStyleObserver.disconnect();
            this._editorStyleObserver = null;
          }
          if (this.codeJar) {
            this.codeJar.destroy();
            this.codeJar = null;
          }
        }

        /**
         * Marshal code content from the data address into the view.
         */
        marshalToView() {
          super.marshalToView();
          if (this.codeJar && this.options.CodeDataAddress) {
            let tmpCode = this._resolveCodeContent();
            if (typeof tmpCode === 'string') {
              this.codeJar.updateCode(tmpCode);
              this._updateLineNumbers();
            }
          }
        }

        /**
         * Marshal the current code content back to the data address.
         */
        marshalFromView() {
          super.marshalFromView();
          if (this.codeJar && this.options.CodeDataAddress) {
            this.onCodeChange(this.codeJar.toString());
          }
        }
      }
      module.exports = PictSectionCode;
      module.exports.default_configuration = _DefaultConfiguration;
      module.exports.createHighlighter = libCreateHighlighter;

      // Demo bundle for pict-docuserve.  Host apps that embed docuserve and
      // want pict-section-code's demos visible in their docs site call
      // `require('pict-section-code').registerWithDocuserve(pict)` once at
      // app boot.  Silent no-op when Docuserve-Demos isn't installed.
      //
      // The require here is intentionally eager: browserify needs a static
      // `require()` at module-toplevel to trace and bundle the demos source.
      // The apparent circular dep (demos/index.js requires THIS module to
      // reach the PictSectionCode class) is benign — by the time demos/
      // index.js runs, `module.exports = PictSectionCode` has already
      // executed, so it sees a usable class.  The `.demos` and
      // `.registerWithDocuserve` attachments below run after the require
      // returns, so demos/index.js never observes them being undefined.
      const libCodeDemos = require('./demos');
      module.exports.demos = libCodeDemos.demos;
      module.exports.registerWithDocuserve = libCodeDemos.registerWithDocuserve;
    }, {
      "./Pict-Code-Highlighter.js": 8,
      "./Pict-Section-Code-DefaultConfiguration.js": 9,
      "./demos": 11,
      "pict-view": 13
    }],
    11: [function (require, module, exports) {
      /**
       * pict-section-code demos
       *
       * Each entry is consumed by pict-docuserve's `Docuserve-Demos` provider.
       * Hosts that want these demos to appear in their docs site call
       * `require('pict-section-code/source/demos').registerWithDocuserve(pict)`
       * once at app boot (typically inside their DocuserveApplication subclass
       * after `super(...)`).
       *
       * Each demo's Mount(pict, container, spec) signature creates a fresh
       * pict-section-code view instance inside the supplied container.  Spec
       * fields are passed through to the view config so a single demo template
       * can express "JavaScript with line numbers", "JSON read-only no
       * gutter", etc. without duplicating the wiring.
       */

      const libPictSectionCode = require('../Pict-Section-Code.js');

      /**
       * Internal helper: mount a pict-section-code instance into a host
       * container according to the demo spec.  Each call registers a uniquely
       * identified view so multiple demos on the same page coexist cleanly.
       */
      function mountCodeEditor(pPict, pContainer, pSpec) {
        // Tag this mount with an id we can target as the destination.
        let tmpDestId = 'demo-code-' + (pSpec.Hash || 'unnamed') + '-' + Date.now();
        pContainer.innerHTML = '<div id="' + tmpDestId + '"></div>';
        let tmpConfig = {
          ViewIdentifier: 'Demo-Code-' + tmpDestId,
          DefaultDestinationAddress: '#' + tmpDestId,
          Templates: [{
            Hash: 'CodeEditor-Container',
            Template: '<!-- demo code editor renders here -->'
          }],
          Renderables: [{
            RenderableHash: 'CodeEditor-Wrap',
            TemplateHash: 'CodeEditor-Container',
            DestinationAddress: '#' + tmpDestId
          }],
          TargetElementAddress: '#' + tmpDestId,
          Language: pSpec.Language || 'javascript',
          ReadOnly: !!pSpec.ReadOnly,
          LineNumbers: pSpec.LineNumbers !== false,
          Tab: pSpec.Tab || '\t',
          AddClosing: pSpec.AddClosing !== false,
          CatchTab: pSpec.CatchTab !== false,
          DefaultCode: pSpec.Code || '// example code\n',
          // AutoRender is intentionally OFF so we can pre-wire CodeJar
          // before the first render fires.  pict-section-code looks for
          // window.CodeJar by default; most hosts bundle CodeJar under
          // window.CodeJarModules.CodeJar (e.g. retold-content-system's
          // codejar-bundle.js), so we wire it explicitly here.
          AutoRender: false,
          RenderOnLoad: false
        };
        let tmpView = pPict.addView(tmpConfig.ViewIdentifier, tmpConfig, libPictSectionCode);
        if (!tmpView) {
          return null;
        }

        // Connect the CodeJar prototype + highlight function from the
        // CodeJarModules global if it's loaded.  Falls back to bare CodeJar
        // if the host published the prototype directly.
        if (typeof window !== 'undefined') {
          if (window.CodeJarModules && typeof window.CodeJarModules.CodeJar === 'function') {
            tmpView.connectCodeJarPrototype(window.CodeJarModules.CodeJar);
          } else if (typeof window.CodeJar === 'function') {
            tmpView.connectCodeJarPrototype(window.CodeJar);
          }

          // Wire highlight.js highlighting if the bundle exposes it.
          if (window.CodeJarModules && window.CodeJarModules.hljs) {
            let tmpHljs = window.CodeJarModules.hljs;
            let tmpLanguage = tmpConfig.Language;
            tmpView._highlightFunction = function (pElement) {
              pElement.removeAttribute('data-highlighted');
              delete pElement.dataset.highlighted;
              pElement.className = pElement.className.replace(/\bhljs\b/g, '').replace(/\blanguage-\S+/g, '').trim();
              pElement.classList.add('language-' + tmpLanguage);
              try {
                tmpHljs.highlightElement(pElement);
              } catch (pErr) {/* swallow — highlighting is best-effort */}
            };
          }
        }
        try {
          tmpView.render();
        } catch (pError) {/* pict-section-code logs its own errors */}
        return tmpView;
      }
      const _Demos = [{
        DemoSchemaVersion: 1,
        Hash: 'javascript-editor',
        Group: 'pict',
        Module: 'pict-section-code',
        Name: 'JavaScript editor',
        Description: 'Default pict-section-code configuration — line numbers on, highlight.js for JavaScript, two-space tab.',
        Spec: {
          Hash: 'javascript-editor',
          Language: 'javascript',
          LineNumbers: true,
          Tab: '  ',
          Code: '// A small example — try editing me.\n' + 'function fibonacci(n) {\n' + '  if (n <= 1) return n;\n' + '  return fibonacci(n - 1) + fibonacci(n - 2);\n' + '}\n' + '\n' + 'for (let i = 0; i < 10; i++) {\n' + '  console.log(`fib(${i}) =`, fibonacci(i));\n' + '}\n'
        },
        Mount: mountCodeEditor,
        Sources: [{
          Name: 'spec.json',
          Language: 'json',
          Content: '{\n' + '  "Language": "javascript",\n' + '  "LineNumbers": true,\n' + '  "Tab": "  ",\n' + '  "Code": "function fibonacci(n) { … }"\n' + '}'
        }]
      }, {
        DemoSchemaVersion: 1,
        Hash: 'json-readonly',
        Group: 'pict',
        Module: 'pict-section-code',
        Name: 'JSON viewer (read-only)',
        Description: 'Read-only mode with line numbers off — useful for embedded "show me the payload" surfaces in dashboards.',
        Spec: {
          Hash: 'json-readonly',
          Language: 'json',
          ReadOnly: true,
          LineNumbers: false,
          Code: '{\n' + '  "version": "1.0.7",\n' + '  "syntax": {\n' + '    "keyword":  "#A626A4",\n' + '    "string":   "#50A14F",\n' + '    "number":   "#986801",\n' + '    "function": "#4078F2"\n' + '  },\n' + '  "features": ["highlighting", "line-numbers", "readonly", "themed"]\n' + '}\n'
        },
        Mount: mountCodeEditor,
        Sources: [{
          Name: 'spec.json',
          Language: 'json',
          Content: '{\n' + '  "Language": "json",\n' + '  "ReadOnly": true,\n' + '  "LineNumbers": false\n' + '}'
        }]
      }, {
        DemoSchemaVersion: 1,
        Hash: 'css-editor',
        Group: 'pict',
        Module: 'pict-section-code',
        Name: 'CSS editor (4-space tab)',
        Description: 'CSS-flavoured highlighting with a 4-space tab and bracket auto-close turned off — leaner editing for stylesheet snippets.',
        Spec: {
          Hash: 'css-editor',
          Language: 'css',
          LineNumbers: true,
          Tab: '    ',
          AddClosing: false,
          Code: '/* Theme-aware token usage */\n' + '.docuserve-demo-title {\n' + '    color: var(--theme-color-text-primary, #3D3229);\n' + '    font-size: 1.5em;\n' + '    font-weight: 600;\n' + '}\n' + '\n' + '.docuserve-demo-description {\n' + '    color: var(--theme-color-text-secondary, #5E5549);\n' + '    line-height: 1.55;\n' + '}\n'
        },
        Mount: mountCodeEditor,
        Sources: [{
          Name: 'spec.json',
          Language: 'json',
          Content: '{\n' + '  "Language": "css",\n' + '  "LineNumbers": true,\n' + '  "Tab": "    ",\n' + '  "AddClosing": false\n' + '}'
        }]
      }];

      /**
       * Register every pict-section-code demo with the host docuserve app.
       *
       * @param {object} pPict - The Pict instance (typically `this.pict` inside
       *                        a DocuserveApplication subclass).
       * @returns {number} count of demos registered (0 if Docuserve-Demos
       *                   provider isn't present — silent no-op).
       */
      function registerWithDocuserve(pPict) {
        if (!pPict || !pPict.providers || !pPict.providers['Docuserve-Demos']) {
          return 0;
        }
        return pPict.providers['Docuserve-Demos'].registerAll(_Demos);
      }
      module.exports = _Demos;
      module.exports.demos = _Demos;
      module.exports.registerWithDocuserve = registerWithDocuserve;
    }, {
      "../Pict-Section-Code.js": 10
    }],
    12: [function (require, module, exports) {
      module.exports = {
        "name": "pict-view",
        "version": "1.0.68",
        "description": "Pict View Base Class",
        "main": "source/Pict-View.js",
        "scripts": {
          "test": "npx quack test",
          "tests": "npx quack test -g",
          "start": "node source/Pict-View.js",
          "coverage": "npx quack coverage",
          "build": "npx quack build",
          "docker-dev-build": "docker build ./ -f Dockerfile_LUXURYCode -t pict-view-image:local",
          "docker-dev-run": "docker run -it -d --name pict-view-dev -p 30001:8080 -p 38086:8086 -v \"$PWD/.config:/home/coder/.config\"  -v \"$PWD:/home/coder/pict-view\" -u \"$(id -u):$(id -g)\" -e \"DOCKER_USER=$USER\" pict-view-image:local",
          "docker-dev-shell": "docker exec -it pict-view-dev /bin/bash",
          "types": "tsc -p .",
          "lint": "eslint source/**"
        },
        "types": "types/source/Pict-View.d.ts",
        "repository": {
          "type": "git",
          "url": "git+https://github.com/stevenvelozo/pict-view.git"
        },
        "author": "steven velozo <steven@velozo.com>",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/stevenvelozo/pict-view/issues"
        },
        "homepage": "https://github.com/stevenvelozo/pict-view#readme",
        "devDependencies": {
          "@eslint/js": "^9.39.1",
          "browser-env": "^3.3.0",
          "eslint": "^9.39.1",
          "pict": "^1.0.363",
          "quackage": "^1.0.65",
          "typescript": "^5.9.3"
        },
        "mocha": {
          "diff": true,
          "extension": ["js"],
          "package": "./package.json",
          "reporter": "spec",
          "slow": "75",
          "timeout": "5000",
          "ui": "tdd",
          "watch-files": ["source/**/*.js", "test/**/*.js"],
          "watch-ignore": ["lib/vendor"]
        },
        "dependencies": {
          "fable": "^3.1.67",
          "fable-serviceproviderbase": "^3.0.19"
        }
      };
    }, {}],
    13: [function (require, module, exports) {
      const libFableServiceBase = require('fable-serviceproviderbase');
      const libPackage = require('../package.json');
      const defaultPictViewSettings = {
        DefaultRenderable: false,
        DefaultDestinationAddress: false,
        DefaultTemplateRecordAddress: false,
        ViewIdentifier: false,
        // If this is set to true, when the App initializes this will.
        // After the App initializes, initialize will be called as soon as it's added.
        AutoInitialize: true,
        AutoInitializeOrdinal: 0,
        // If this is set to true, when the App autorenders (on load) this will.
        // After the App initializes, render will be called as soon as it's added.
        AutoRender: true,
        AutoRenderOrdinal: 0,
        AutoSolveWithApp: true,
        AutoSolveOrdinal: 0,
        CSSHash: false,
        CSS: false,
        CSSProvider: false,
        CSSPriority: 500,
        Templates: [],
        DefaultTemplates: [],
        Renderables: [],
        Manifests: {}
      };

      /** @typedef {(error?: Error) => void} ErrorCallback */
      /** @typedef {number | boolean} PictTimestamp */

      /**
       * @typedef {'replace' | 'append' | 'prepend' | 'append_once' | 'virtual-assignment'} RenderMethod
       */
      /**
       * @typedef {Object} Renderable
       *
       * @property {string} RenderableHash - A unique hash for the renderable.
       * @property {string} TemplateHash - The hash of the template to use for rendering this renderable.
       * @property {string} [DefaultTemplateRecordAddress] - The default address for resolving the data record for this renderable.
       * @property {string} [ContentDestinationAddress] - The default address (DOM CSS selector) for rendering the content of this renderable.
       * @property {RenderMethod} [RenderMethod=replace] - The method to use when projecting the renderable to the DOM ('replace', 'append', 'prepend', 'append_once', 'virtual-assignment').
       * @property {string} [TestAddress] - The address to use for testing the renderable.
       * @property {string} [TransactionHash] - The transaction hash for the root renderable.
       * @property {string} [RootRenderableViewHash] - The hash of the root renderable.
       * @property {string} [Content] - The rendered content for this renderable, if applicable.
       */

      /**
       * Represents a view in the Pict ecosystem.
       */
      class PictView extends libFableServiceBase {
        /**
         * @param {any} pFable - The Fable object that this service is attached to.
         * @param {any} [pOptions] - (optional) The options for this service.
         * @param {string} [pServiceHash] - (optional) The hash of the service.
         */
        constructor(pFable, pOptions, pServiceHash) {
          // Intersect default options, parent constructor, service information
          let tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(defaultPictViewSettings)), pOptions);
          super(pFable, tmpOptions, pServiceHash);
          //FIXME: add types to fable and ancillaries
          /** @type {any} */
          this.fable;
          /** @type {any} */
          this.options;
          /** @type {String} */
          this.UUID;
          /** @type {String} */
          this.Hash;
          /** @type {any} */
          this.log;
          const tmpHashIsUUID = this.Hash === this.UUID;
          //NOTE: since many places are using the view UUID as the HTML element ID, we prefix it to avoid starting with a number
          this.UUID = "V-".concat(this.UUID);
          if (tmpHashIsUUID) {
            this.Hash = this.UUID;
          }
          if (!this.options.ViewIdentifier) {
            this.options.ViewIdentifier = "AutoViewID-".concat(this.fable.getUUID());
          }
          this.serviceType = 'PictView';
          /** @type {Record<string, any>} */
          this._Package = libPackage;
          // Convenience and consistency naming
          /** @type {import('pict') & { log: any, instantiateServiceProviderWithoutRegistration: (hash: String) => any, instantiateServiceProviderIfNotExists: (hash: string) => any, TransactionTracking: import('pict/types/source/services/Fable-Service-TransactionTracking') }} */
          this.pict = this.fable;
          // Wire in the essential Pict application state
          this.AppData = this.pict.AppData;
          this.Bundle = this.pict.Bundle;

          /** @type {PictTimestamp} */
          this.initializeTimestamp = false;
          /** @type {PictTimestamp} */
          this.lastSolvedTimestamp = false;
          /** @type {PictTimestamp} */
          this.lastRenderedTimestamp = false;
          /** @type {PictTimestamp} */
          this.lastMarshalFromViewTimestamp = false;
          /** @type {PictTimestamp} */
          this.lastMarshalToViewTimestamp = false;
          this.pict.instantiateServiceProviderIfNotExists('TransactionTracking');

          // Load all templates from the array in the options
          // Templates are in the form of {Hash:'Some-Template-Hash',Template:'Template content',Source:'TemplateSource'}
          for (let i = 0; i < this.options.Templates.length; i++) {
            let tmpTemplate = this.options.Templates[i];
            if (!('Hash' in tmpTemplate) || !('Template' in tmpTemplate)) {
              this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not load Template ").concat(i, " in the options array."), tmpTemplate);
            } else {
              if (!tmpTemplate.Source) {
                tmpTemplate.Source = "PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " options object.");
              }
              this.pict.TemplateProvider.addTemplate(tmpTemplate.Hash, tmpTemplate.Template, tmpTemplate.Source);
            }
          }

          // Load all default templates from the array in the options
          // Templates are in the form of {Prefix:'',Postfix:'-List-Row',Template:'Template content',Source:'TemplateSourceString'}
          for (let i = 0; i < this.options.DefaultTemplates.length; i++) {
            let tmpDefaultTemplate = this.options.DefaultTemplates[i];
            if (!('Postfix' in tmpDefaultTemplate) || !('Template' in tmpDefaultTemplate)) {
              this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not load Default Template ").concat(i, " in the options array."), tmpDefaultTemplate);
            } else {
              if (!tmpDefaultTemplate.Source) {
                tmpDefaultTemplate.Source = "PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " options object.");
              }
              this.pict.TemplateProvider.addDefaultTemplate(tmpDefaultTemplate.Prefix, tmpDefaultTemplate.Postfix, tmpDefaultTemplate.Template, tmpDefaultTemplate.Source);
            }
          }

          // Load the CSS if it's available
          if (this.options.CSS) {
            let tmpCSSHash = this.options.CSSHash ? this.options.CSSHash : "View-".concat(this.options.ViewIdentifier);
            let tmpCSSProvider = this.options.CSSProvider ? this.options.CSSProvider : tmpCSSHash;
            this.pict.CSSMap.addCSS(tmpCSSHash, this.options.CSS, tmpCSSProvider, this.options.CSSPriority);
          }

          // Load all renderables
          // Renderables are launchable renderable instructions with templates
          // They look as such: {Identifier:'ContentEntry', TemplateHash:'Content-Entry-Section-Main', ContentDestinationAddress:'#ContentSection', RecordAddress:'AppData.Content.DefaultText', ManifestTransformation:'ManyfestHash', ManifestDestinationAddress:'AppData.Content.DataToTransformContent'}
          // The only parts that are necessary are Identifier and Template
          // A developer can then do render('ContentEntry') and it just kinda works.  Or they can override the ContentDestinationAddress
          /** @type {Record<String, Renderable>} */
          this.renderables = {};
          for (let i = 0; i < this.options.Renderables.length; i++) {
            /** @type {Renderable} */
            let tmpRenderable = this.options.Renderables[i];
            this.addRenderable(tmpRenderable);
          }
        }

        /**
         * Adds a renderable to the view.
         *
         * @param {string | Renderable} pRenderableHash - The hash of the renderable, or a renderable object.
         * @param {string} [pTemplateHash] - (optional) The hash of the template for the renderable.
         * @param {string} [pDefaultTemplateRecordAddress] - (optional) The default data address for the template.
         * @param {string} [pDefaultDestinationAddress] - (optional) The default destination address for the renderable.
         * @param {RenderMethod} [pRenderMethod=replace] - (optional) The method to use when rendering the renderable (ex. 'replace').
         */
        addRenderable(pRenderableHash, pTemplateHash, pDefaultTemplateRecordAddress, pDefaultDestinationAddress, pRenderMethod) {
          /** @type {Renderable} */
          let tmpRenderable;
          if (typeof pRenderableHash == 'object') {
            // The developer passed in the renderable as an object.
            // Use theirs instead!
            tmpRenderable = pRenderableHash;
          } else {
            /** @type {RenderMethod} */
            let tmpRenderMethod = typeof pRenderMethod !== 'string' ? pRenderMethod : 'replace';
            tmpRenderable = {
              RenderableHash: pRenderableHash,
              TemplateHash: pTemplateHash,
              DefaultTemplateRecordAddress: pDefaultTemplateRecordAddress,
              ContentDestinationAddress: pDefaultDestinationAddress,
              RenderMethod: tmpRenderMethod
            };
          }
          if (typeof tmpRenderable.RenderableHash != 'string' || typeof tmpRenderable.TemplateHash != 'string') {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not load Renderable; RenderableHash or TemplateHash are invalid."), tmpRenderable);
          } else {
            if (this.pict.LogNoisiness > 0) {
              this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " adding renderable [").concat(tmpRenderable.RenderableHash, "] pointed to template ").concat(tmpRenderable.TemplateHash, "."));
            }
            this.renderables[tmpRenderable.RenderableHash] = tmpRenderable;
          }
        }

        /* -------------------------------------------------------------------------- */
        /*                        Code Section: Initialization                        */
        /* -------------------------------------------------------------------------- */
        /**
         * Lifecycle hook that triggers before the view is initialized.
         */
        onBeforeInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onBeforeInitialize:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers before the view is initialized (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onBeforeInitializeAsync(fCallback) {
          this.onBeforeInitialize();
          return fCallback();
        }

        /**
         * Lifecycle hook that triggers when the view is initialized.
         */
        onInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onInitialize:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers when the view is initialized (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onInitializeAsync(fCallback) {
          this.onInitialize();
          return fCallback();
        }

        /**
         * Performs view initialization.
         */
        initialize() {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow VIEW [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " initialize:"));
          }
          if (!this.initializeTimestamp) {
            this.onBeforeInitialize();
            this.onInitialize();
            this.onAfterInitialize();
            this.initializeTimestamp = this.pict.log.getTimeStamp();
            return true;
          } else {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " initialize called but initialization is already completed.  Aborting."));
            return false;
          }
        }

        /**
         * Performs view initialization (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        initializeAsync(fCallback) {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow VIEW [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " initializeAsync:"));
          }
          if (!this.initializeTimestamp) {
            let tmpAnticipate = this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');
            if (this.pict.LogNoisiness > 0) {
              this.log.info("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " beginning initialization..."));
            }
            tmpAnticipate.anticipate(this.onBeforeInitializeAsync.bind(this));
            tmpAnticipate.anticipate(this.onInitializeAsync.bind(this));
            tmpAnticipate.anticipate(this.onAfterInitializeAsync.bind(this));
            tmpAnticipate.wait(/** @param {Error} pError */
            pError => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " initialization failed: ").concat(pError.message || pError), {
                  stack: pError.stack
                });
              }
              this.initializeTimestamp = this.pict.log.getTimeStamp();
              if (this.pict.LogNoisiness > 0) {
                this.log.info("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " initialization complete."));
              }
              return fCallback();
            });
          } else {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " async initialize called but initialization is already completed.  Aborting."));
            // TODO: Should this be an error?
            return fCallback();
          }
        }
        onAfterInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterInitialize:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers after the view is initialized (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onAfterInitializeAsync(fCallback) {
          this.onAfterInitialize();
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                            Code Section: Render                            */
        /* -------------------------------------------------------------------------- */
        /**
         * Lifecycle hook that triggers before the view is rendered.
         *
         * @param {Renderable} pRenderable - The renderable that will be rendered.
         */
        onBeforeRender(pRenderable) {
          // Overload this to mess with stuff before the content gets generated from the template
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onBeforeRender:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers before the view is rendered (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         * @param {Renderable} pRenderable - The renderable that will be rendered.
         */
        onBeforeRenderAsync(fCallback, pRenderable) {
          this.onBeforeRender(pRenderable);
          return fCallback();
        }

        /**
         * Lifecycle hook that triggers before the view is projected into the DOM.
         *
         * @param {Renderable} pRenderable - The renderable that will be projected.
         */
        onBeforeProject(pRenderable) {
          // Overload this to mess with stuff before the content gets generated from the template
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onBeforeProject:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers before the view is projected into the DOM (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         * @param {Renderable} pRenderable - The renderable that will be projected.
         */
        onBeforeProjectAsync(fCallback, pRenderable) {
          this.onBeforeProject(pRenderable);
          return fCallback();
        }

        /**
         * Builds the render options for a renderable.
         *
         * For DRY purposes on the three flavors of render.
         *
         * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
         * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object|ErrorCallback} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
         */
        buildRenderOptions(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress) {
          let tmpRenderOptions = {
            Valid: true
          };
          tmpRenderOptions.RenderableHash = typeof pRenderableHash === 'string' ? pRenderableHash : typeof this.options.DefaultRenderable == 'string' ? this.options.DefaultRenderable : false;
          if (!tmpRenderOptions.RenderableHash) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not find a suitable RenderableHash ").concat(tmpRenderOptions.RenderableHash, " (param ").concat(pRenderableHash, "because it is not a valid renderable."));
            tmpRenderOptions.Valid = false;
          }
          tmpRenderOptions.Renderable = this.renderables[tmpRenderOptions.RenderableHash];
          if (!tmpRenderOptions.Renderable) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderOptions.RenderableHash, " (param ").concat(pRenderableHash, ") because it does not exist."));
            tmpRenderOptions.Valid = false;
          }
          tmpRenderOptions.DestinationAddress = typeof pRenderDestinationAddress === 'string' ? pRenderDestinationAddress : typeof tmpRenderOptions.Renderable.ContentDestinationAddress === 'string' ? tmpRenderOptions.Renderable.ContentDestinationAddress : typeof this.options.DefaultDestinationAddress === 'string' ? this.options.DefaultDestinationAddress : false;
          if (!tmpRenderOptions.DestinationAddress) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderOptions.RenderableHash, " (param ").concat(pRenderableHash, ") because it does not have a valid destination address (param ").concat(pRenderDestinationAddress, ")."));
            tmpRenderOptions.Valid = false;
          }
          if (typeof pTemplateRecordAddress === 'object') {
            tmpRenderOptions.RecordAddress = 'Passed in as object';
            tmpRenderOptions.Record = pTemplateRecordAddress;
          } else {
            tmpRenderOptions.RecordAddress = typeof pTemplateRecordAddress === 'string' ? pTemplateRecordAddress : typeof tmpRenderOptions.Renderable.DefaultTemplateRecordAddress === 'string' ? tmpRenderOptions.Renderable.DefaultTemplateRecordAddress : typeof this.options.DefaultTemplateRecordAddress === 'string' ? this.options.DefaultTemplateRecordAddress : false;
            tmpRenderOptions.Record = typeof tmpRenderOptions.RecordAddress === 'string' ? this.pict.DataProvider.getDataByAddress(tmpRenderOptions.RecordAddress) : undefined;
          }
          return tmpRenderOptions;
        }

        /**
         * Assigns the content to the destination address.
         *
         * For DRY purposes on the three flavors of render.
         *
         * @param {Renderable} pRenderable - The renderable to render.
         * @param {string} pRenderDestinationAddress - The address where the renderable will be rendered.
         * @param {string} pContent - The content to render.
         * @returns {boolean} - Returns true if the content was assigned successfully.
         * @memberof PictView
         */
        assignRenderContent(pRenderable, pRenderDestinationAddress, pContent) {
          return this.pict.ContentAssignment.projectContent(pRenderable.RenderMethod, pRenderDestinationAddress, pContent, pRenderable.TestAddress);
        }

        /**
         * Render a renderable from this view.
         *
         * @param {string} [pRenderableHash] - The hash of the renderable to render.
         * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object} [pTemplateRecordAddress] - The address where the data for the template is stored.
         * @param {Renderable} [pRootRenderable] - The root renderable for the render operation, if applicable.
         * @return {boolean}
         */
        render(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, pRootRenderable) {
          return this.renderWithScope(this, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, pRootRenderable);
        }

        /**
         * Render a renderable from this view, providing a specifici scope for the template.
         *
         * @param {any} pScope - The scope to use for the template rendering.
         * @param {string} [pRenderableHash] - The hash of the renderable to render.
         * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object} [pTemplateRecordAddress] - The address where the data for the template is stored.
         * @param {Renderable} [pRootRenderable] - The root renderable for the render operation, if applicable.
         * @return {boolean}
         */
        renderWithScope(pScope, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, pRootRenderable) {
          let tmpRenderableHash = typeof pRenderableHash === 'string' ? pRenderableHash : typeof this.options.DefaultRenderable == 'string' ? this.options.DefaultRenderable : false;
          if (!tmpRenderableHash) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it is not a valid renderable."));
            return false;
          }

          /** @type {Renderable} */
          let tmpRenderable;
          if (tmpRenderableHash == '__Virtual') {
            tmpRenderable = {
              RenderableHash: '__Virtual',
              TemplateHash: this.renderables[this.options.DefaultRenderable].TemplateHash,
              ContentDestinationAddress: typeof pRenderDestinationAddress === 'string' ? pRenderDestinationAddress : typeof tmpRenderable.ContentDestinationAddress === 'string' ? tmpRenderable.ContentDestinationAddress : typeof this.options.DefaultDestinationAddress === 'string' ? this.options.DefaultDestinationAddress : null,
              RenderMethod: 'virtual-assignment',
              TransactionHash: pRootRenderable && pRootRenderable.TransactionHash,
              RootRenderableViewHash: pRootRenderable && pRootRenderable.RootRenderableViewHash
            };
          } else {
            tmpRenderable = Object.assign({}, this.renderables[tmpRenderableHash]);
            tmpRenderable.ContentDestinationAddress = typeof pRenderDestinationAddress === 'string' ? pRenderDestinationAddress : typeof tmpRenderable.ContentDestinationAddress === 'string' ? tmpRenderable.ContentDestinationAddress : typeof this.options.DefaultDestinationAddress === 'string' ? this.options.DefaultDestinationAddress : null;
          }
          if (!tmpRenderable.TransactionHash) {
            tmpRenderable.TransactionHash = "ViewRender-V-".concat(this.options.ViewIdentifier, "-R-").concat(tmpRenderableHash, "-U-").concat(this.pict.getUUID());
            tmpRenderable.RootRenderableViewHash = this.Hash;
            this.pict.TransactionTracking.registerTransaction(tmpRenderable.TransactionHash);
          }
          if (!tmpRenderable) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it does not exist."));
            return false;
          }
          if (!tmpRenderable.ContentDestinationAddress) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it does not have a valid destination address."));
            return false;
          }
          let tmpRecordAddress;
          let tmpRecord;
          if (typeof pTemplateRecordAddress === 'object') {
            tmpRecord = pTemplateRecordAddress;
            tmpRecordAddress = 'Passed in as object';
          } else {
            tmpRecordAddress = typeof pTemplateRecordAddress === 'string' ? pTemplateRecordAddress : typeof tmpRenderable.DefaultTemplateRecordAddress === 'string' ? tmpRenderable.DefaultTemplateRecordAddress : typeof this.options.DefaultTemplateRecordAddress === 'string' ? this.options.DefaultTemplateRecordAddress : false;
            tmpRecord = typeof tmpRecordAddress === 'string' ? this.pict.DataProvider.getDataByAddress(tmpRecordAddress) : undefined;
          }

          // Execute the developer-overridable pre-render behavior
          this.onBeforeRender(tmpRenderable);
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow VIEW [".concat(this.UUID, "]::[").concat(this.Hash, "] Renderable[").concat(tmpRenderableHash, "] Destination[").concat(tmpRenderable.ContentDestinationAddress, "] TemplateRecordAddress[").concat(tmpRecordAddress, "] render:"));
          }
          if (this.pict.LogNoisiness > 0) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " Beginning Render of Renderable[").concat(tmpRenderableHash, "] to Destination [").concat(tmpRenderable.ContentDestinationAddress, "]..."));
          }
          // Generate the content output from the template and data
          tmpRenderable.Content = this.pict.parseTemplateByHash(tmpRenderable.TemplateHash, tmpRecord, null, [this], pScope, {
            RootRenderable: typeof pRootRenderable === 'object' ? pRootRenderable : tmpRenderable
          });
          if (this.pict.LogNoisiness > 0) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " Assigning Renderable[").concat(tmpRenderableHash, "] content length ").concat(tmpRenderable.Content.length, " to Destination [").concat(tmpRenderable.ContentDestinationAddress, "] using render method [").concat(tmpRenderable.RenderMethod, "]."));
          }
          this.onBeforeProject(tmpRenderable);
          this.onProject(tmpRenderable);
          if (tmpRenderable.RenderMethod !== 'virtual-assignment') {
            this.onAfterProject(tmpRenderable);

            // Execute the developer-overridable post-render behavior
            this.onAfterRender(tmpRenderable);
          }
          return true;
        }

        /**
         * Render a renderable from this view.
         *
         * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
         * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object|ErrorCallback} [pTemplateRecordAddress] - The address where the data for the template is stored.
         * @param {Renderable|ErrorCallback} [pRootRenderable] - The root renderable for the render operation, if applicable.
         * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
         *
         * @return {void}
         */
        renderAsync(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, pRootRenderable, fCallback) {
          return this.renderWithScopeAsync(this, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, pRootRenderable, fCallback);
        }

        /**
         * Render a renderable from this view.
         *
         * @param {any} pScope - The scope to use for the template rendering.
         * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
         * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object|ErrorCallback} [pTemplateRecordAddress] - The address where the data for the template is stored.
         * @param {Renderable|ErrorCallback} [pRootRenderable] - The root renderable for the render operation, if applicable.
         * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
         *
         * @return {void}
         */
        renderWithScopeAsync(pScope, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, pRootRenderable, fCallback) {
          let tmpRenderableHash = typeof pRenderableHash === 'string' ? pRenderableHash : typeof this.options.DefaultRenderable == 'string' ? this.options.DefaultRenderable : false;

          // Allow the callback to be passed in as the last parameter no matter what
          /** @type {ErrorCallback} */
          let tmpCallback = typeof fCallback === 'function' ? fCallback : typeof pTemplateRecordAddress === 'function' ? pTemplateRecordAddress : typeof pRenderDestinationAddress === 'function' ? pRenderDestinationAddress : typeof pRenderableHash === 'function' ? pRenderableHash : typeof pRootRenderable === 'function' ? pRootRenderable : null;
          if (!tmpCallback) {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          if (!tmpRenderableHash) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not asynchronously render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, "because it is not a valid renderable."));
            return tmpCallback(new Error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not asynchronously render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, "because it is not a valid renderable.")));
          }

          /** @type {Renderable} */
          let tmpRenderable;
          if (tmpRenderableHash == '__Virtual') {
            tmpRenderable = {
              RenderableHash: '__Virtual',
              TemplateHash: this.renderables[this.options.DefaultRenderable].TemplateHash,
              ContentDestinationAddress: typeof pRenderDestinationAddress === 'string' ? pRenderDestinationAddress : typeof this.options.DefaultDestinationAddress === 'string' ? this.options.DefaultDestinationAddress : null,
              RenderMethod: 'virtual-assignment',
              TransactionHash: pRootRenderable && typeof pRootRenderable !== 'function' && pRootRenderable.TransactionHash,
              RootRenderableViewHash: pRootRenderable && typeof pRootRenderable !== 'function' && pRootRenderable.RootRenderableViewHash
            };
          } else {
            tmpRenderable = Object.assign({}, this.renderables[tmpRenderableHash]);
            tmpRenderable.ContentDestinationAddress = typeof pRenderDestinationAddress === 'string' ? pRenderDestinationAddress : typeof tmpRenderable.ContentDestinationAddress === 'string' ? tmpRenderable.ContentDestinationAddress : typeof this.options.DefaultDestinationAddress === 'string' ? this.options.DefaultDestinationAddress : null;
          }
          if (!tmpRenderable.TransactionHash) {
            tmpRenderable.TransactionHash = "ViewRender-V-".concat(this.options.ViewIdentifier, "-R-").concat(tmpRenderableHash, "-U-").concat(this.pict.getUUID());
            tmpRenderable.RootRenderableViewHash = this.Hash;
            this.pict.TransactionTracking.registerTransaction(tmpRenderable.TransactionHash);
          }
          if (!tmpRenderable) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it does not exist."));
            return tmpCallback(new Error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it does not exist.")));
          }
          if (!tmpRenderable.ContentDestinationAddress) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it does not have a valid destination address."));
            return tmpCallback(new Error("Could not render ".concat(tmpRenderableHash)));
          }
          let tmpRecordAddress;
          let tmpRecord;
          if (typeof pTemplateRecordAddress === 'object') {
            tmpRecord = pTemplateRecordAddress;
            tmpRecordAddress = 'Passed in as object';
          } else {
            tmpRecordAddress = typeof pTemplateRecordAddress === 'string' ? pTemplateRecordAddress : typeof tmpRenderable.DefaultTemplateRecordAddress === 'string' ? tmpRenderable.DefaultTemplateRecordAddress : typeof this.options.DefaultTemplateRecordAddress === 'string' ? this.options.DefaultTemplateRecordAddress : false;
            tmpRecord = typeof tmpRecordAddress === 'string' ? this.pict.DataProvider.getDataByAddress(tmpRecordAddress) : undefined;
          }
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow VIEW [".concat(this.UUID, "]::[").concat(this.Hash, "] Renderable[").concat(tmpRenderableHash, "] Destination[").concat(tmpRenderable.ContentDestinationAddress, "] TemplateRecordAddress[").concat(tmpRecordAddress, "] renderAsync:"));
          }
          if (this.pict.LogNoisiness > 2) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " Beginning Asynchronous Render (callback-style)..."));
          }
          let tmpAnticipate = this.fable.newAnticipate();
          tmpAnticipate.anticipate(fOnBeforeRenderCallback => {
            this.onBeforeRenderAsync(fOnBeforeRenderCallback, tmpRenderable);
          });
          tmpAnticipate.anticipate(fAsyncTemplateCallback => {
            // Render the template (asynchronously)
            this.pict.parseTemplateByHash(tmpRenderable.TemplateHash, tmpRecord, (pError, pContent) => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render (asynchronously) ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it did not parse the template."), pError);
                return fAsyncTemplateCallback(pError);
              }
              tmpRenderable.Content = pContent;
              return fAsyncTemplateCallback();
            }, [this], pScope, {
              RootRenderable: typeof pRootRenderable === 'object' ? pRootRenderable : tmpRenderable
            });
          });
          tmpAnticipate.anticipate(fNext => {
            this.onBeforeProjectAsync(fNext, tmpRenderable);
          });
          tmpAnticipate.anticipate(fNext => {
            this.onProjectAsync(fNext, tmpRenderable);
          });
          if (tmpRenderable.RenderMethod !== 'virtual-assignment') {
            tmpAnticipate.anticipate(fNext => {
              this.onAfterProjectAsync(fNext, tmpRenderable);
            });

            // Execute the developer-overridable post-render behavior
            tmpAnticipate.anticipate(fNext => {
              this.onAfterRenderAsync(fNext, tmpRenderable);
            });
          }
          tmpAnticipate.wait(tmpCallback);
        }

        /**
         * Renders the default renderable.
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        renderDefaultAsync(fCallback) {
          // Render the default renderable
          this.renderAsync(fCallback);
        }

        /**
         * @param {string} [pRenderableHash] - The hash of the renderable to render.
         * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
         */
        basicRender(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress) {
          return this.basicRenderWithScope(this, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress);
        }

        /**
         * @param {any} pScope - The scope to use for the template rendering.
         * @param {string} [pRenderableHash] - The hash of the renderable to render.
         * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
         */
        basicRenderWithScope(pScope, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress) {
          let tmpRenderOptions = this.buildRenderOptions(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress);
          if (tmpRenderOptions.Valid) {
            this.assignRenderContent(tmpRenderOptions.Renderable, tmpRenderOptions.DestinationAddress, this.pict.parseTemplateByHash(tmpRenderOptions.Renderable.TemplateHash, tmpRenderOptions.Record, null, [this], pScope, {
              RootRenderable: tmpRenderOptions.Renderable
            }));
            return true;
          } else {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not perform a basic render of ").concat(tmpRenderOptions.RenderableHash, " because it is not valid."));
            return false;
          }
        }

        /**
         * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
         * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|Object|ErrorCallback} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
         * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
         */
        basicRenderAsync(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, fCallback) {
          return this.basicRenderWithScopeAsync(this, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, fCallback);
        }

        /**
         * @param {any} pScope - The scope to use for the template rendering.
         * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
         * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|Object|ErrorCallback} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
         * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
         */
        basicRenderWithScopeAsync(pScope, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, fCallback) {
          // Allow the callback to be passed in as the last parameter no matter what
          /** @type {ErrorCallback} */
          let tmpCallback = typeof fCallback === 'function' ? fCallback : typeof pTemplateRecordAddress === 'function' ? pTemplateRecordAddress : typeof pRenderDestinationAddress === 'function' ? pRenderDestinationAddress : typeof pRenderableHash === 'function' ? pRenderableHash : null;
          if (!tmpCallback) {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " basicRenderAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " basicRenderAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          const tmpRenderOptions = this.buildRenderOptions(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress);
          if (tmpRenderOptions.Valid) {
            this.pict.parseTemplateByHash(tmpRenderOptions.Renderable.TemplateHash, tmpRenderOptions.Record,
            /**
             * @param {Error} [pError] - The error that occurred during template parsing.
             * @param {string} [pContent] - The content that was rendered from the template.
             */
            (pError, pContent) => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render (asynchronously) ").concat(tmpRenderOptions.RenderableHash, " because it did not parse the template."), pError);
                return tmpCallback(pError);
              }
              this.assignRenderContent(tmpRenderOptions.Renderable, tmpRenderOptions.DestinationAddress, pContent);
              return tmpCallback();
            }, [this], pScope, {
              RootRenderable: tmpRenderOptions.Renderable
            });
          } else {
            let tmpErrorMessage = "PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not perform a basic render of ").concat(tmpRenderOptions.RenderableHash, " because it is not valid.");
            this.log.error(tmpErrorMessage);
            return tmpCallback(new Error(tmpErrorMessage));
          }
        }

        /**
         * @param {Renderable} pRenderable - The renderable that was rendered.
         */
        onProject(pRenderable) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onProject:"));
          }
          if (pRenderable.RenderMethod === 'virtual-assignment') {
            this.pict.TransactionTracking.pushToTransactionQueue(pRenderable.TransactionHash, {
              ViewHash: this.Hash,
              Renderable: pRenderable
            }, 'Deferred-Post-Content-Assignment');
          }
          if (this.pict.LogNoisiness > 0) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " Assigning Renderable[").concat(pRenderable.RenderableHash, "] content length ").concat(pRenderable.Content.length, " to Destination [").concat(pRenderable.ContentDestinationAddress, "] using Async render method ").concat(pRenderable.RenderMethod, "."));
          }

          // Assign the content to the destination address
          this.pict.ContentAssignment.projectContent(pRenderable.RenderMethod, pRenderable.ContentDestinationAddress, pRenderable.Content, pRenderable.TestAddress);
          this.lastRenderedTimestamp = this.pict.log.getTimeStamp();
        }

        /**
         * Lifecycle hook that triggers after the view is projected into the DOM (async flow).
         *
         * @param {(error?: Error, content?: string) => void} fCallback - The callback to call when the async operation is complete.
         * @param {Renderable} pRenderable - The renderable that is being projected.
         */
        onProjectAsync(fCallback, pRenderable) {
          this.onProject(pRenderable);
          return fCallback();
        }

        /**
         * Lifecycle hook that triggers after the view is rendered.
         *
         * @param {Renderable} pRenderable - The renderable that was rendered.
         */
        onAfterRender(pRenderable) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterRender:"));
          }
          if (pRenderable && pRenderable.RootRenderableViewHash === this.Hash) {
            const tmpTransactionQueue = this.pict.TransactionTracking.clearTransactionQueue(pRenderable.TransactionHash) || [];
            for (const tmpEvent of tmpTransactionQueue) {
              const tmpView = this.pict.views[tmpEvent.Data.ViewHash];
              if (!tmpView) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterRender: Could not find view for transaction hash ").concat(pRenderable.TransactionHash, " and ViewHash ").concat(tmpEvent.Data.ViewHash, "."));
                continue;
              }
              tmpView.onAfterProject();

              // Execute the developer-overridable post-render behavior
              tmpView.onAfterRender(tmpEvent.Data.Renderable);
            }
            // Queue is drained and nested child renders have each cleaned up
            // their own transactions; remove this root render's entry from
            // the tracking map so it does not leak.
            this.pict.TransactionTracking.unregisterTransaction(pRenderable.TransactionHash);
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers after the view is rendered (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         * @param {Renderable} pRenderable - The renderable that was rendered.
         */
        onAfterRenderAsync(fCallback, pRenderable) {
          // NOTE: this.onAfterRender(pRenderable) will itself clear the
          // transaction queue and unregister the transaction if this view is
          // the root renderable - see onAfterRender above. So by the time the
          // loop below runs, the queue is already empty and there is nothing
          // to drain. Keeping the async queue walk here defensively in case
          // future subclasses override onAfterRender in ways that skip the
          // drain, but the common path is now "sync drain, async no-op".
          this.onAfterRender(pRenderable);
          const tmpAnticipate = this.fable.newAnticipate();
          const tmpIsRootRenderable = pRenderable && pRenderable.RootRenderableViewHash === this.Hash;
          if (tmpIsRootRenderable) {
            const queue = this.pict.TransactionTracking.clearTransactionQueue(pRenderable.TransactionHash) || [];
            for (const event of queue) {
              /** @type {PictView} */
              const tmpView = this.pict.views[event.Data.ViewHash];
              if (!tmpView) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterRenderAsync: Could not find view for transaction hash ").concat(pRenderable.TransactionHash, " and ViewHash ").concat(event.Data.ViewHash, "."));
                continue;
              }
              tmpAnticipate.anticipate(tmpView.onAfterProjectAsync.bind(tmpView));
              tmpAnticipate.anticipate(fNext => {
                tmpView.onAfterRenderAsync(fNext, event.Data.Renderable);
              });

              // Execute the developer-overridable post-render behavior
            }
          }
          return tmpAnticipate.wait(pError => {
            // Nested virtual-assignment children have now settled their own
            // onAfterRenderAsync chains (and unregistered their own
            // transactions along the way). Ensure this root render's entry
            // is also gone - unregisterTransaction is a no-op if the sync
            // onAfterRender above already removed it, so this is safe to
            // call unconditionally on the root path.
            if (tmpIsRootRenderable && pRenderable && pRenderable.TransactionHash) {
              this.pict.TransactionTracking.unregisterTransaction(pRenderable.TransactionHash);
            }
            return fCallback(pError);
          });
        }

        /**
         * Lifecycle hook that triggers after the view is projected into the DOM.
         *
         * @param {Renderable} pRenderable - The renderable that was projected.
         */
        onAfterProject(pRenderable) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterProject:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers after the view is projected into the DOM (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         * @param {Renderable} pRenderable - The renderable that was projected.
         */
        onAfterProjectAsync(fCallback, pRenderable) {
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                            Code Section: Solver                            */
        /* -------------------------------------------------------------------------- */
        /**
         * Lifecycle hook that triggers before the view is solved.
         */
        onBeforeSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onBeforeSolve:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers before the view is solved (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onBeforeSolveAsync(fCallback) {
          this.onBeforeSolve();
          return fCallback();
        }

        /**
         * Lifecycle hook that triggers when the view is solved.
         */
        onSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onSolve:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers when the view is solved (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onSolveAsync(fCallback) {
          this.onSolve();
          return fCallback();
        }

        /**
         * Performs view solving and triggers lifecycle hooks.
         *
         * @return {boolean} - True if the view was solved successfully, false otherwise.
         */
        solve() {
          if (this.pict.LogNoisiness > 2) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " executing solve() function..."));
          }
          this.onBeforeSolve();
          this.onSolve();
          this.onAfterSolve();
          this.lastSolvedTimestamp = this.pict.log.getTimeStamp();
          return true;
        }

        /**
         * Performs view solving and triggers lifecycle hooks (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        solveAsync(fCallback) {
          let tmpAnticipate = this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');

          /** @type {ErrorCallback} */
          let tmpCallback = typeof fCallback === 'function' ? fCallback : null;
          if (!tmpCallback) {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " solveAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " solveAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeSolveAsync.bind(this));
          tmpAnticipate.anticipate(this.onSolveAsync.bind(this));
          tmpAnticipate.anticipate(this.onAfterSolveAsync.bind(this));
          tmpAnticipate.wait(pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " solveAsync() complete."));
            }
            this.lastSolvedTimestamp = this.pict.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * Lifecycle hook that triggers after the view is solved.
         */
        onAfterSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterSolve:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers after the view is solved (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onAfterSolveAsync(fCallback) {
          this.onAfterSolve();
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Marshal From View                        */
        /* -------------------------------------------------------------------------- */
        /**
         * Lifecycle hook that triggers before data is marshaled from the view.
         *
         * @return {boolean} - True if the operation was successful, false otherwise.
         */
        onBeforeMarshalFromView() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onBeforeMarshalFromView:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers before data is marshaled from the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onBeforeMarshalFromViewAsync(fCallback) {
          this.onBeforeMarshalFromView();
          return fCallback();
        }

        /**
         * Lifecycle hook that triggers when data is marshaled from the view.
         */
        onMarshalFromView() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onMarshalFromView:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers when data is marshaled from the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onMarshalFromViewAsync(fCallback) {
          this.onMarshalFromView();
          return fCallback();
        }

        /**
         * Marshals data from the view.
         *
         * @return {boolean} - True if the operation was successful, false otherwise.
         */
        marshalFromView() {
          if (this.pict.LogNoisiness > 2) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " executing solve() function..."));
          }
          this.onBeforeMarshalFromView();
          this.onMarshalFromView();
          this.onAfterMarshalFromView();
          this.lastMarshalFromViewTimestamp = this.pict.log.getTimeStamp();
          return true;
        }

        /**
         * Marshals data from the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        marshalFromViewAsync(fCallback) {
          let tmpAnticipate = this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');

          /** @type {ErrorCallback} */
          let tmpCallback = typeof fCallback === 'function' ? fCallback : null;
          if (!tmpCallback) {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalFromViewAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalFromViewAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeMarshalFromViewAsync.bind(this));
          tmpAnticipate.anticipate(this.onMarshalFromViewAsync.bind(this));
          tmpAnticipate.anticipate(this.onAfterMarshalFromViewAsync.bind(this));
          tmpAnticipate.wait(pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " marshalFromViewAsync() complete."));
            }
            this.lastMarshalFromViewTimestamp = this.pict.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * Lifecycle hook that triggers after data is marshaled from the view.
         */
        onAfterMarshalFromView() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterMarshalFromView:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers after data is marshaled from the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onAfterMarshalFromViewAsync(fCallback) {
          this.onAfterMarshalFromView();
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Marshal To View                          */
        /* -------------------------------------------------------------------------- */
        /**
         * Lifecycle hook that triggers before data is marshaled into the view.
         */
        onBeforeMarshalToView() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onBeforeMarshalToView:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers before data is marshaled into the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onBeforeMarshalToViewAsync(fCallback) {
          this.onBeforeMarshalToView();
          return fCallback();
        }

        /**
         * Lifecycle hook that triggers when data is marshaled into the view.
         */
        onMarshalToView() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onMarshalToView:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers when data is marshaled into the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onMarshalToViewAsync(fCallback) {
          this.onMarshalToView();
          return fCallback();
        }

        /**
         * Marshals data into the view.
         *
         * @return {boolean} - True if the operation was successful, false otherwise.
         */
        marshalToView() {
          if (this.pict.LogNoisiness > 2) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " executing solve() function..."));
          }
          this.onBeforeMarshalToView();
          this.onMarshalToView();
          this.onAfterMarshalToView();
          this.lastMarshalToViewTimestamp = this.pict.log.getTimeStamp();
          return true;
        }

        /**
         * Marshals data into the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        marshalToViewAsync(fCallback) {
          let tmpAnticipate = this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');

          /** @type {ErrorCallback} */
          let tmpCallback = typeof fCallback === 'function' ? fCallback : null;
          if (!tmpCallback) {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalToViewAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalToViewAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeMarshalToViewAsync.bind(this));
          tmpAnticipate.anticipate(this.onMarshalToViewAsync.bind(this));
          tmpAnticipate.anticipate(this.onAfterMarshalToViewAsync.bind(this));
          tmpAnticipate.wait(pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " marshalToViewAsync() complete."));
            }
            this.lastMarshalToViewTimestamp = this.pict.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * Lifecycle hook that triggers after data is marshaled into the view.
         */
        onAfterMarshalToView() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterMarshalToView:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers after data is marshaled into the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onAfterMarshalToViewAsync(fCallback) {
          this.onAfterMarshalToView();
          return fCallback();
        }

        /** @return {boolean} - True if the object is a PictView. */
        get isPictView() {
          return true;
        }
      }
      module.exports = PictView;
    }, {
      "../package.json": 12,
      "fable-serviceproviderbase": 3
    }],
    14: [function (require, module, exports) {
      // The container for all the Pict-Section-Content related code.

      // The main content view class
      module.exports = require('./views/Pict-View-Content.js');

      // The content provider (markdown parsing, HTML escaping)
      module.exports.PictContentProvider = require('./providers/Pict-Provider-Content.js');
    }, {
      "./providers/Pict-Provider-Content.js": 15,
      "./views/Pict-View-Content.js": 16
    }],
    15: [function (require, module, exports) {
      const libPictProvider = require('pict-provider');
      const libCreateHighlighter = require('pict-section-code').createHighlighter;

      /**
       * Content Provider for Pict Section Content
       *
       * A general-purpose markdown-to-HTML parser with support for:
       * - Headings, paragraphs, lists, blockquotes, horizontal rules
       * - Fenced code blocks with language tags (nested fence support)
       * - Syntax highlighting and line numbers for code blocks (via pict-section-code)
       * - Tables (GFM pipe syntax)
       * - Mermaid diagram blocks
       * - KaTeX math (inline and display)
       * - Bold, italic, inline code, links, images
       *
       * Link resolution is customizable via an optional callback.
       */
      class PictContentProvider extends libPictProvider {
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);
        }

        /**
         * Highlight a code string using pict-section-code's syntax highlighter.
         * Uses a mock element to interface with the highlighter's DOM-based API.
         *
         * @param {string} pCode - The raw code string
         * @param {string} pLanguage - The language identifier (e.g. "javascript", "html")
         * @returns {string} The syntax-highlighted HTML
         */
        highlightCode(pCode, pLanguage) {
          if (!pCode) {
            return '';
          }
          let tmpHighlighter = libCreateHighlighter(pLanguage);
          // Create a mock element to interface with the highlighter
          let tmpMockElement = {
            textContent: pCode,
            innerHTML: ''
          };
          tmpHighlighter(tmpMockElement);
          return tmpMockElement.innerHTML;
        }

        /**
         * Generate line number HTML for a code block.
         *
         * @param {string} pCode - The raw code string
         * @returns {string} HTML string with line number spans
         */
        generateLineNumbers(pCode) {
          if (!pCode) {
            return '<span>1</span>';
          }
          let tmpLineCount = pCode.split('\n').length;
          let tmpHTML = '';
          for (let i = 1; i <= tmpLineCount; i++) {
            tmpHTML += '<span>' + i + '</span>';
          }
          return tmpHTML;
        }

        /**
         * Parse a markdown string into HTML.
         *
         * @param {string} pMarkdown - The raw markdown text
         * @param {Function} [pLinkResolver] - Optional callback for link resolution: (pHref, pLinkText) => { href, target, rel } or null
         * @param {Function} [pImageResolver] - Optional callback for image URL resolution: (pSrc, pAlt) => resolvedSrc or null
         * @param {Function} [pVocabularyResolver] - Optional callback: (pWord) => { slug, title, short } or null. Passed through to parseInline() for vocabulary term auto-linking.
         * @returns {string} The parsed HTML
         */
        parseMarkdown(pMarkdown, pLinkResolver, pImageResolver, pVocabularyResolver) {
          if (!pMarkdown) {
            return '';
          }
          let tmpLines = pMarkdown.split('\n');
          let tmpHTML = [];
          let tmpInCodeBlock = false;
          let tmpCodeFenceLength = 0;
          let tmpCodeLang = '';
          let tmpCodeLines = [];
          let tmpInList = false;
          let tmpListType = '';
          let tmpInBlockquote = false;
          let tmpBlockquoteLines = [];
          let tmpInMathBlock = false;
          let tmpMathLines = [];
          let tmpParagraphLines = [];

          // Helper to flush accumulated paragraph lines into a single <p> tag
          let fFlushParagraph = () => {
            if (tmpParagraphLines.length > 0) {
              tmpHTML.push('<p>' + tmpParagraphLines.map(pLine => {
                return this.parseInline(pLine, pLinkResolver, pImageResolver, pVocabularyResolver);
              }).join(' ') + '</p>');
              tmpParagraphLines = [];
            }
          };
          for (let i = 0; i < tmpLines.length; i++) {
            let tmpLine = tmpLines[i];

            // Display math blocks ($$...$$) — skip if inside a code block
            if (!tmpInCodeBlock && tmpLine.trim().match(/^\$\$/)) {
              if (tmpInMathBlock) {
                // End math block
                tmpHTML.push('<div class="pict-content-katex-display">' + tmpMathLines.join('\n') + '</div>');
                tmpInMathBlock = false;
                tmpMathLines = [];
              } else {
                // Flush any pending paragraph
                fFlushParagraph();
                // Close any open list or blockquote
                if (tmpInList) {
                  tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
                  tmpInList = false;
                }
                if (tmpInBlockquote) {
                  tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver, pImageResolver, pVocabularyResolver) + '</blockquote>');
                  tmpInBlockquote = false;
                  tmpBlockquoteLines = [];
                }
                tmpInMathBlock = true;
              }
              continue;
            }
            if (tmpInMathBlock) {
              tmpMathLines.push(tmpLine);
              continue;
            }

            // Code blocks (fenced) — track fence length so ````x```` nests around ```y```
            let tmpFenceMatch = tmpLine.match(/^(`{3,})/);
            if (tmpFenceMatch) {
              let tmpFenceLen = tmpFenceMatch[1].length;
              if (tmpInCodeBlock) {
                // Only close if the closing fence is at least as long as the opening
                if (tmpFenceLen >= tmpCodeFenceLength && tmpLine.trim() === tmpFenceMatch[1]) {
                  // End code block
                  if (tmpCodeLang === 'mermaid') {
                    // Mermaid diagrams: output raw content for client-side rendering
                    tmpHTML.push('<pre class="mermaid">' + tmpCodeLines.join('\n') + '</pre>');
                  } else {
                    let tmpCodeText = tmpCodeLines.join('\n');
                    let tmpHighlightedCode = this.highlightCode(tmpCodeText, tmpCodeLang);
                    let tmpLineNumbersHTML = this.generateLineNumbers(tmpCodeText);
                    tmpHTML.push('<div class="pict-content-code-wrap"><div class="pict-content-code-line-numbers">' + tmpLineNumbersHTML + '</div><pre><code class="language-' + this.escapeHTML(tmpCodeLang) + '">' + tmpHighlightedCode + '</code></pre></div>');
                  }
                  tmpInCodeBlock = false;
                  tmpCodeFenceLength = 0;
                  tmpCodeLang = '';
                  tmpCodeLines = [];
                  continue;
                } else {
                  // Inner fence with fewer backticks — treat as content
                  tmpCodeLines.push(tmpLine);
                  continue;
                }
              } else {
                // Flush any pending paragraph
                fFlushParagraph();
                // Close any open list or blockquote
                if (tmpInList) {
                  tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
                  tmpInList = false;
                }
                if (tmpInBlockquote) {
                  tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver, pImageResolver, pVocabularyResolver) + '</blockquote>');
                  tmpInBlockquote = false;
                  tmpBlockquoteLines = [];
                }
                // Start code block — record fence length
                tmpCodeFenceLength = tmpFenceLen;
                tmpCodeLang = tmpLine.replace(/^`{3,}/, '').trim();
                tmpInCodeBlock = true;
                continue;
              }
            }
            if (tmpInCodeBlock) {
              tmpCodeLines.push(tmpLine);
              continue;
            }

            // Blockquotes
            if (tmpLine.match(/^>\s?/)) {
              if (!tmpInBlockquote) {
                // Flush any pending paragraph
                fFlushParagraph();
                // Close any open list
                if (tmpInList) {
                  tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
                  tmpInList = false;
                }
                tmpInBlockquote = true;
                tmpBlockquoteLines = [];
              }
              tmpBlockquoteLines.push(tmpLine.replace(/^>\s?/, ''));
              continue;
            } else if (tmpInBlockquote) {
              tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver, pImageResolver, pVocabularyResolver) + '</blockquote>');
              tmpInBlockquote = false;
              tmpBlockquoteLines = [];
            }

            // Horizontal rule
            if (tmpLine.match(/^(-{3,}|\*{3,}|_{3,})\s*$/)) {
              fFlushParagraph();
              if (tmpInList) {
                tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
                tmpInList = false;
              }
              tmpHTML.push('<hr>');
              continue;
            }

            // Headings
            let tmpHeadingMatch = tmpLine.match(/^(#{1,6})\s+(.+)/);
            if (tmpHeadingMatch) {
              fFlushParagraph();
              if (tmpInList) {
                tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
                tmpInList = false;
              }
              let tmpLevel = tmpHeadingMatch[1].length;
              let tmpText = this.parseInline(tmpHeadingMatch[2], pLinkResolver, pImageResolver, pVocabularyResolver);
              let tmpID = tmpHeadingMatch[2].toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
              tmpHTML.push('<h' + tmpLevel + ' id="' + tmpID + '">' + tmpText + '</h' + tmpLevel + '>');
              continue;
            }

            // Unordered list items
            let tmpULMatch = tmpLine.match(/^(\s*)[-*+]\s+(.*)/);
            if (tmpULMatch) {
              fFlushParagraph();
              if (!tmpInList || tmpListType !== 'ul') {
                if (tmpInList) {
                  tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
                }
                tmpHTML.push('<ul>');
                tmpInList = true;
                tmpListType = 'ul';
              }
              tmpHTML.push('<li>' + this.parseInline(tmpULMatch[2], pLinkResolver, pImageResolver, pVocabularyResolver) + '</li>');
              continue;
            }

            // Ordered list items
            let tmpOLMatch = tmpLine.match(/^(\s*)\d+\.\s+(.*)/);
            if (tmpOLMatch) {
              fFlushParagraph();
              if (!tmpInList || tmpListType !== 'ol') {
                if (tmpInList) {
                  tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
                }
                tmpHTML.push('<ol>');
                tmpInList = true;
                tmpListType = 'ol';
              }
              tmpHTML.push('<li>' + this.parseInline(tmpOLMatch[2], pLinkResolver, pImageResolver, pVocabularyResolver) + '</li>');
              continue;
            }

            // Indented continuation line of a wrapped list item — fold its
            // content into the last <li> instead of closing the list. Closing
            // here would split a real <ol>/<ul>, and each fragment restarts
            // ordered numbering. A non-indented non-marker line still closes
            // the list (handled below); blank lines never reach this branch.
            if (tmpInList && tmpLine.match(/^\s+\S/) && tmpHTML.length > 0 && tmpHTML[tmpHTML.length - 1].endsWith('</li>')) {
              let tmpLastIndex = tmpHTML.length - 1;
              let tmpListItemBody = tmpHTML[tmpLastIndex].slice(0, -'</li>'.length);
              tmpHTML[tmpLastIndex] = tmpListItemBody + ' ' + this.parseInline(tmpLine.trim(), pLinkResolver, pImageResolver, pVocabularyResolver) + '</li>';
              continue;
            }

            // Close list if we've left list items
            if (tmpInList && tmpLine.trim() !== '') {
              tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
              tmpInList = false;
            }

            // Empty line — flush any accumulated paragraph
            if (tmpLine.trim() === '') {
              fFlushParagraph();
              continue;
            }

            // Table detection
            if (tmpLine.match(/^\|/) && i + 1 < tmpLines.length && tmpLines[i + 1].match(/^\|[\s-:|]+\|/)) {
              fFlushParagraph();
              // Close any open list
              if (tmpInList) {
                tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
                tmpInList = false;
              }
              let tmpTableHTML = '<table>';

              // Header row
              let tmpHeaders = tmpLine.split('|').filter(pCell => {
                return pCell.trim() !== '';
              });
              tmpTableHTML += '<thead><tr>';
              for (let h = 0; h < tmpHeaders.length; h++) {
                tmpTableHTML += '<th>' + this.parseInline(tmpHeaders[h].trim(), pLinkResolver, pImageResolver, pVocabularyResolver) + '</th>';
              }
              tmpTableHTML += '</tr></thead>';

              // Skip separator row
              i++;

              // Body rows
              tmpTableHTML += '<tbody>';
              while (i + 1 < tmpLines.length && tmpLines[i + 1].match(/^\|/)) {
                i++;
                let tmpCells = tmpLines[i].split('|').filter(pCell => {
                  return pCell.trim() !== '';
                });
                tmpTableHTML += '<tr>';
                for (let c = 0; c < tmpCells.length; c++) {
                  tmpTableHTML += '<td>' + this.parseInline(tmpCells[c].trim(), pLinkResolver, pImageResolver, pVocabularyResolver) + '</td>';
                }
                tmpTableHTML += '</tr>';
              }
              tmpTableHTML += '</tbody></table>';
              tmpHTML.push(tmpTableHTML);
              continue;
            }

            // Accumulate paragraph lines — consecutive non-blank text lines
            // will be joined into a single <p> tag when flushed
            tmpParagraphLines.push(tmpLine);
          }

          // Flush any remaining accumulated paragraph
          fFlushParagraph();

          // Close any trailing open elements
          if (tmpInList) {
            tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
          }
          if (tmpInBlockquote) {
            tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver, pImageResolver, pVocabularyResolver) + '</blockquote>');
          }
          if (tmpInCodeBlock) {
            let tmpCodeText = tmpCodeLines.join('\n');
            let tmpHighlightedCode = this.highlightCode(tmpCodeText, tmpCodeLang);
            let tmpLineNumbersHTML = this.generateLineNumbers(tmpCodeText);
            tmpHTML.push('<div class="pict-content-code-wrap"><div class="pict-content-code-line-numbers">' + tmpLineNumbersHTML + '</div><pre><code>' + tmpHighlightedCode + '</code></pre></div>');
          }
          return tmpHTML.join('\n');
        }

        /**
         * Parse inline markdown elements (bold, italic, code, links, images, KaTeX).
         *
         * @param {string} pText - The text to parse
         * @param {Function} [pLinkResolver] - Optional callback: (pHref, pLinkText) => { href, target, rel } or null
         * @param {Function} [pImageResolver] - Optional callback: (pSrc, pAlt) => resolvedSrc or null
         * @param {Function} [pVocabularyResolver] - Optional callback: (pWord) => { slug, title, short } or null. When provided, known vocabulary terms in the rendered text are wrapped in <span class="pict-vocab-term"> with data attributes carrying the popover content.
         * @returns {string} HTML with inline elements
         */
        parseInline(pText, pLinkResolver, pImageResolver, pVocabularyResolver) {
          if (!pText) {
            return '';
          }
          let tmpResult = pText;

          // Extract inline code spans into placeholders so bold/italic regexes don't mangle their contents
          let tmpCodeSpans = [];
          tmpResult = tmpResult.replace(/`([^`]+)`/g, (pMatch, pCode) => {
            let tmpIndex = tmpCodeSpans.length;
            tmpCodeSpans.push('<code>' + pCode + '</code>');
            return '\x00CODEINLINE' + tmpIndex + '\x00';
          });

          // Inline LaTeX equations ($...$) — must be processed before other inline patterns
          // Match single $ delimiters that aren't adjacent to spaces (to avoid false positives with currency)
          tmpResult = tmpResult.replace(/\$([^\$\s][^\$]*?[^\$\s])\$/g, '<span class="pict-content-katex-inline">$1</span>');
          // Also match single-character inline math like $x$
          tmpResult = tmpResult.replace(/\$([^\$\s])\$/g, '<span class="pict-content-katex-inline">$1</span>');

          // Images
          tmpResult = tmpResult.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (pMatch, pAlt, pSrc) => {
            let tmpSrc = pSrc;
            if (typeof pImageResolver === 'function') {
              let tmpResolved = pImageResolver(pSrc, pAlt);
              if (tmpResolved) {
                tmpSrc = tmpResolved;
              }
            }
            return '<img src="' + tmpSrc + '" alt="' + pAlt + '">';
          });

          // Links
          tmpResult = tmpResult.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (pMatch, pLinkText, pHref) => {
            if (typeof pLinkResolver === 'function') {
              let tmpResolved = pLinkResolver(pHref, pLinkText);
              if (tmpResolved) {
                let tmpTarget = tmpResolved.target ? ' target="' + tmpResolved.target + '"' : '';
                let tmpRel = tmpResolved.rel ? ' rel="' + tmpResolved.rel + '"' : '';
                return '<a href="' + tmpResolved.href + '"' + tmpTarget + tmpRel + '>' + pLinkText + '</a>';
              }
            }
            // Default behavior: external links open in new tab
            if (pHref.match(/^https?:\/\//)) {
              return '<a href="' + pHref + '" target="_blank" rel="noopener">' + pLinkText + '</a>';
            }
            return '<a href="' + pHref + '">' + pLinkText + '</a>';
          });

          // Bold
          tmpResult = tmpResult.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
          tmpResult = tmpResult.replace(/__([^_]+)__/g, '<strong>$1</strong>');

          // Italic
          tmpResult = tmpResult.replace(/\*([^*]+)\*/g, '<em>$1</em>');
          tmpResult = tmpResult.replace(/_([^_]+)_/g, '<em>$1</em>');

          // Restore inline code spans from placeholders
          tmpResult = tmpResult.replace(/\x00CODEINLINE(\d+)\x00/g, (pMatch, pIndex) => {
            return tmpCodeSpans[parseInt(pIndex)];
          });

          // Vocabulary term auto-linking: scan the rendered text for
          // known vocabulary terms and wrap each first occurrence in a
          // span with data attributes for the popover system. Skips
          // content inside <code>, <a>, <pre>, and <strong> tags to
          // avoid mangling links, code, or already-emphasized text.
          if (typeof pVocabularyResolver === 'function') {
            tmpResult = this._applyVocabularyLinks(tmpResult, pVocabularyResolver);
          }
          return tmpResult;
        }

        /**
         * Scan HTML for vocabulary terms and wrap the first occurrence
         * of each in a <span class="pict-vocab-term"> element. The
         * resolver callback is called for each candidate word/phrase
         * and returns { slug, title, short } if it's a known term.
         *
         * Skips content inside HTML tags to avoid breaking links,
         * code spans, and other markup.
         *
         * @param {string} pHTML
         * @param {Function} pResolver - (word) => {slug, title, short} | null
         * @returns {string}
         */
        _applyVocabularyLinks(pHTML, pResolver) {
          if (!pHTML || typeof pResolver !== 'function') {
            return pHTML;
          }

          // Track which terms we've already linked to avoid duplicate
          // links for the same term appearing multiple times.
          let tmpLinked = {};

          // Split the HTML into segments: tags vs text nodes. We only
          // scan text nodes for vocabulary terms; tags pass through.
          // This regex captures HTML tags as separators.
          let tmpParts = pHTML.split(/(<[^>]+>)/g);

          // Track whether we're inside a tag that should be skipped
          let tmpSkipDepth = 0;
          let tmpSkipTags = ['code', 'a', 'pre', 'span'];
          for (let i = 0; i < tmpParts.length; i++) {
            let tmpPart = tmpParts[i];

            // Check if this is an HTML tag
            if (tmpPart.charAt(0) === '<') {
              // Opening tag?
              let tmpOpenMatch = tmpPart.match(/^<(\w+)/);
              if (tmpOpenMatch && tmpSkipTags.indexOf(tmpOpenMatch[1].toLowerCase()) !== -1) {
                tmpSkipDepth++;
              }
              // Closing tag?
              let tmpCloseMatch = tmpPart.match(/^<\/(\w+)/);
              if (tmpCloseMatch && tmpSkipTags.indexOf(tmpCloseMatch[1].toLowerCase()) !== -1) {
                tmpSkipDepth = Math.max(0, tmpSkipDepth - 1);
              }
              continue; // Don't modify tags
            }

            // Skip text inside protected elements
            if (tmpSkipDepth > 0) continue;

            // Scan this text node for vocabulary terms. Use word
            // boundary regex to match whole words only.
            tmpParts[i] = tmpPart.replace(/\b([A-Za-z][A-Za-z0-9_-]{1,30})\b/g, (pMatch, pWord) => {
              // Skip very short words and common English words
              if (pWord.length < 3) return pMatch;
              let tmpLower = pWord.toLowerCase();
              if (tmpLinked[tmpLower]) return pMatch; // already linked

              let tmpResult = pResolver(tmpLower);
              if (!tmpResult) return pMatch;
              tmpLinked[tmpLower] = true;
              let tmpShortEsc = (tmpResult.short || '').replace(/"/g, '&quot;');
              return '<span class="pict-vocab-term" data-vocab-slug="' + tmpResult.slug + '" data-vocab-title="' + (tmpResult.title || '').replace(/"/g, '&quot;') + '" data-vocab-short="' + tmpShortEsc + '">' + pMatch + '</span>';
            });
          }
          return tmpParts.join('');
        }

        /**
         * Escape HTML special characters.
         *
         * @param {string} pText - The text to escape
         * @returns {string} The escaped text
         */
        escapeHTML(pText) {
          if (!pText) {
            return '';
          }
          return pText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }
      }
      module.exports = PictContentProvider;
      module.exports.default_configuration = {
        ProviderIdentifier: "Pict-Content",
        AutoInitialize: true,
        AutoInitializeOrdinal: 0
      };
    }, {
      "pict-provider": 7,
      "pict-section-code": 10
    }],
    16: [function (require, module, exports) {
      const libPictView = require('pict-view');
      const _ViewConfiguration = {
        ViewIdentifier: "Pict-Content",
        DefaultRenderable: "Pict-Content-Display",
        DefaultDestinationAddress: "#Pict-Content-Container",
        AutoRender: false,
        CSS: /*css*/"\n\t\t.pict-content {\n\t\t\tpadding: 2em 3em;\n\t\t\tmax-width: 900px;\n\t\t\tmargin: 0 auto;\n\t\t}\n\t\t.pict-content-loading {\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\tmin-height: 200px;\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t\tfont-size: 1em;\n\t\t}\n\t\t.pict-content h1 {\n\t\t\tfont-size: 2em;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\tborder-bottom: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tpadding-bottom: 0.3em;\n\t\t\tmargin-top: 0;\n\t\t}\n\t\t.pict-content h2 {\n\t\t\tfont-size: 1.5em;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\tborder-bottom: 1px solid var(--theme-color-border-light, #EAE3D8);\n\t\t\tpadding-bottom: 0.25em;\n\t\t\tmargin-top: 1.5em;\n\t\t}\n\t\t.pict-content h3 {\n\t\t\tfont-size: 1.25em;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\tmargin-top: 1.25em;\n\t\t}\n\t\t.pict-content h4, .pict-content h5, .pict-content h6 {\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t\tmargin-top: 1em;\n\t\t}\n\t\t.pict-content p {\n\t\t\tline-height: 1.7;\n\t\t\tcolor: var(--theme-color-text-primary, #423D37);\n\t\t\tmargin: 0.75em 0;\n\t\t}\n\t\t.pict-content a {\n\t\t\tcolor: var(--theme-color-brand-primary, #2E7D74);\n\t\t\ttext-decoration: none;\n\t\t}\n\t\t.pict-content a:hover {\n\t\t\ttext-decoration: underline;\n\t\t}\n\t\t/* \u2500\u2500\u2500 Code blocks \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\t\t   Background, text color, line-number gutter, and every\n\t\t   syntax token route through pict-provider-theme tokens \u2014\n\t\t   the same set pict-section-code (the live editor) uses.\n\t\t   This way the rendered-preview code blocks look identical\n\t\t   to the live editor and re-skin together when the theme\n\t\t   switches.  Previous version used the text-primary token\n\t\t   as the code background (a TEXT token used as BACKGROUND),\n\t\t   which broke in dark mode and any palette where text and\n\t\t   background-tertiary diverge.\n\t\t*/\n\t\t.pict-content pre {\n\t\t\tbackground:    var(--theme-color-background-tertiary, #F0ECE4);\n\t\t\tcolor:         var(--theme-color-text-primary,        #3D3229);\n\t\t\tborder:        1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tpadding: 1.25em;\n\t\t\tborder-radius: 6px;\n\t\t\toverflow-x: auto;\n\t\t\tline-height: 1.5;\n\t\t\tfont-size: 0.9em;\n\t\t\tfont-family: var(--theme-typography-family-mono, 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace);\n\t\t}\n\t\t/* Inline code (single backtick) \u2014 slightly differentiated\n\t\t   from block code so it doesn't disappear into prose. */\n\t\t.pict-content code {\n\t\t\tbackground:    var(--theme-color-background-secondary, #FAF8F4);\n\t\t\tcolor:         var(--theme-color-text-primary,         #3D3229);\n\t\t\tpadding: 0.15em 0.4em;\n\t\t\tborder-radius: 3px;\n\t\t\tfont-size: 0.9em;\n\t\t\tfont-family: var(--theme-typography-family-mono, 'SFMono-Regular', 'SF Mono', 'Menlo', monospace);\n\t\t}\n\t\t.pict-content-code-wrap {\n\t\t\tdisplay: flex;\n\t\t\tflex-direction: row;\n\t\t\tfont-family: var(--theme-typography-family-mono, 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace);\n\t\t\tfont-size: 14px;\n\t\t\tline-height: 1.5;\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tborder-radius: 6px;\n\t\t\toverflow: hidden;\n\t\t\tmargin: 1em 0;\n\t\t\tbackground: var(--theme-color-background-tertiary, #F0ECE4);\n\t\t}\n\t\t.pict-content-code-wrap .pict-content-code-line-numbers {\n\t\t\twidth: 40px;\n\t\t\tmin-width: 40px;\n\t\t\tpadding: 1.25em 0;\n\t\t\ttext-align: right;\n\t\t\tbackground:    var(--theme-color-background-secondary, #FAF8F4);\n\t\t\tborder-right:  1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tcolor:         var(--theme-color-text-muted,           #8A7F72);\n\t\t\tfont-family: inherit;\n\t\t\tfont-size: inherit;\n\t\t\tline-height: inherit;\n\t\t\tuser-select: none;\n\t\t\tpointer-events: none;\n\t\t\tbox-sizing: border-box;\n\t\t}\n\t\t.pict-content-code-wrap .pict-content-code-line-numbers span {\n\t\t\tdisplay: block;\n\t\t\tpadding: 0 8px 0 0;\n\t\t}\n\t\t.pict-content-code-wrap pre {\n\t\t\tmargin: 0;\n\t\t\tbackground: var(--theme-color-background-tertiary, #F0ECE4);\n\t\t\tcolor:      var(--theme-color-text-primary,        #3D3229);\n\t\t\tborder: none;\n\t\t\tpadding: 1.25em 1.25em 1.25em 8px;\n\t\t\tborder-radius: 0 6px 6px 0;\n\t\t\toverflow-x: auto;\n\t\t\tline-height: 1.5;\n\t\t\tfont-size: inherit;\n\t\t\tflex: 1;\n\t\t\tmin-width: 0;\n\t\t}\n\t\t.pict-content-code-wrap pre code {\n\t\t\tbackground: none;\n\t\t\tpadding: 0;\n\t\t\tcolor: inherit;\n\t\t\tfont-size: inherit;\n\t\t\tfont-family: inherit;\n\t\t}\n\t\t/* Syntax token colors \u2014 every class binds to a --theme-color-syntax-*\n\t\t   variable, the same tokens pict-section-code (the live editor) uses.\n\t\t   Each var() carries an Atom One Light hex as fallback for hosts\n\t\t   without a theme provider; themes that DO ship syntax tokens\n\t\t   (pict-default, retold-content-system, etc.) drive everything\n\t\t   coherently. */\n\t\t.pict-content-code-wrap .keyword       { color: var(--theme-color-syntax-keyword,     #A626A4); }\n\t\t.pict-content-code-wrap .string        { color: var(--theme-color-syntax-string,      #50A14F); }\n\t\t.pict-content-code-wrap .number        { color: var(--theme-color-syntax-number,      #986801); }\n\t\t.pict-content-code-wrap .comment       { color: var(--theme-color-syntax-comment,     #A0A1A7); font-style: italic; }\n\t\t.pict-content-code-wrap .operator      { color: var(--theme-color-syntax-operator,    #0184BC); }\n\t\t.pict-content-code-wrap .punctuation   { color: var(--theme-color-syntax-punctuation, #383A42); }\n\t\t.pict-content-code-wrap .function-name { color: var(--theme-color-syntax-function,    #4078F2); }\n\t\t.pict-content-code-wrap .property      { color: var(--theme-color-syntax-property,    #E45649); }\n\t\t.pict-content-code-wrap .tag           { color: var(--theme-color-syntax-tag,         #E45649); }\n\t\t.pict-content-code-wrap .attr-name     { color: var(--theme-color-syntax-attrname,    #986801); }\n\t\t.pict-content-code-wrap .attr-value    { color: var(--theme-color-syntax-attrvalue,   #50A14F); }\n\t\t.pict-content-code-wrap .builtin       { color: var(--theme-color-syntax-builtin,     #986801); }\n\t\t.pict-content-code-wrap .type          { color: var(--theme-color-syntax-type,        #C18401); }\n\t\t.pict-content-code-wrap .variable      { color: var(--theme-color-syntax-variable,    #383A42); }\n\t\t.pict-content pre code {\n\t\t\tbackground: none;\n\t\t\tpadding: 0;\n\t\t\tcolor: inherit;\n\t\t\tfont-size: inherit;\n\t\t}\n\t\t.pict-content blockquote {\n\t\t\tborder-left: 4px solid var(--theme-color-brand-primary, #2E7D74);\n\t\t\tmargin: 1em 0;\n\t\t\tpadding: 0.5em 1em;\n\t\t\tbackground: var(--theme-color-background-secondary, #F7F5F0);\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t}\n\t\t.pict-content blockquote p {\n\t\t\tmargin: 0.25em 0;\n\t\t}\n\t\t.pict-content ul, .pict-content ol {\n\t\t\tpadding-left: 2em;\n\t\t\tline-height: 1.8;\n\t\t}\n\t\t.pict-content li {\n\t\t\tmargin: 0.25em 0;\n\t\t\tcolor: var(--theme-color-text-primary, #423D37);\n\t\t}\n\t\t.pict-content hr {\n\t\t\tborder: none;\n\t\t\tborder-top: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tmargin: 2em 0;\n\t\t}\n\t\t.pict-content table {\n\t\t\twidth: 100%;\n\t\t\tborder-collapse: collapse;\n\t\t\tmargin: 1em 0;\n\t\t}\n\t\t.pict-content table th {\n\t\t\tbackground: var(--theme-color-background-secondary, #F5F0E8);\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tpadding: 0.6em 0.8em;\n\t\t\ttext-align: left;\n\t\t\tfont-weight: 600;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t}\n\t\t.pict-content table td {\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tpadding: 0.5em 0.8em;\n\t\t\tcolor: var(--theme-color-text-primary, #423D37);\n\t\t}\n\t\t.pict-content table tr:nth-child(even) {\n\t\t\tbackground: var(--theme-color-background-secondary, #F7F5F0);\n\t\t}\n\t\t.pict-content img {\n\t\t\tmax-width: 100%;\n\t\t\theight: auto;\n\t\t}\n\t\t.pict-content pre.mermaid {\n\t\t\tbackground: var(--theme-color-background-panel, #fff);\n\t\t\tcolor: var(--theme-color-text-primary, #2A241E);\n\t\t\ttext-align: center;\n\t\t\tpadding: 1em;\n\t\t}\n\t\t.pict-content pre.mermaid text,\n\t\t.pict-content pre.mermaid .nodeLabel,\n\t\t.pict-content pre.mermaid .edgeLabel,\n\t\t.pict-content pre.mermaid .label,\n\t\t.pict-content pre.mermaid .cluster-label,\n\t\t.pict-content pre.mermaid span,\n\t\t.pict-content pre.mermaid foreignObject p,\n\t\t.pict-content pre.mermaid foreignObject div,\n\t\t.pict-content pre.mermaid foreignObject span {\n\t\t\tcolor: var(--theme-color-text-primary, #2A241E) !important;\n\t\t\tfill: var(--theme-color-text-primary, #2A241E) !important;\n\t\t}\n\t\t.pict-content pre.mermaid .edgePath .path {\n\t\t\tstroke: var(--theme-color-text-secondary, #5E5549) !important;\n\t\t}\n\t\t.pict-content pre.mermaid .arrowheadPath {\n\t\t\tfill: var(--theme-color-text-secondary, #5E5549) !important;\n\t\t}\n\t\t.pict-content .pict-content-katex-display {\n\t\t\ttext-align: center;\n\t\t\tmargin: 1em 0;\n\t\t\tpadding: 0.5em;\n\t\t\toverflow-x: auto;\n\t\t}\n\t\t.pict-content .pict-content-katex-inline {\n\t\t\tdisplay: inline;\n\t\t}\n\n\t\t/* Fullscreen viewer for images and mermaid diagrams (click-to-zoom) */\n\t\t.pict-content [data-fullscreen-source] {\n\t\t\tcursor: zoom-in;\n\t\t\toutline: 1px solid transparent;\n\t\t\toutline-offset: 3px;\n\t\t\tborder-radius: 4px;\n\t\t\ttransition: outline-color 0.15s ease;\n\t\t}\n\t\t.pict-content [data-fullscreen-source]:hover {\n\t\t\toutline-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t}\n\t\t/* Code block container with hover-revealed action buttons */\n\t\t.pict-content-code-container {\n\t\t\tposition: relative;\n\t\t\tdisplay: flex;\n\t\t\talign-items: flex-start;\n\t\t\tgap: 8px;\n\t\t\tmargin: 1em 0;\n\t\t}\n\t\t.pict-content-code-container > .pict-content-code-wrap {\n\t\t\tmargin: 0;\n\t\t\tflex: 1 1 auto;\n\t\t\tmin-width: 0;\n\t\t}\n\t\t.pict-content-code-actions {\n\t\t\tposition: sticky;\n\t\t\ttop: 64px;\n\t\t\talign-self: flex-start;\n\t\t\tdisplay: flex;\n\t\t\tflex-direction: column;\n\t\t\tgap: 6px;\n\t\t\tflex: 0 0 auto;\n\t\t\tpadding-top: 6px;\n\t\t\topacity: 0;\n\t\t\ttransform: translateX(-4px);\n\t\t\ttransition: opacity 0.15s ease, transform 0.15s ease;\n\t\t\tpointer-events: none;\n\t\t}\n\t\t.pict-content-code-container:hover .pict-content-code-actions,\n\t\t.pict-content-code-container:focus-within .pict-content-code-actions {\n\t\t\topacity: 1;\n\t\t\ttransform: translateX(0);\n\t\t\tpointer-events: auto;\n\t\t}\n\t\t.pict-content-code-action-btn {\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\twidth: 28px;\n\t\t\theight: 28px;\n\t\t\tpadding: 0;\n\t\t\tbackground: var(--theme-color-background-panel, #FFFFFF);\n\t\t\tcolor: var(--theme-color-text-muted, #5E5549);\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tborder-radius: 6px;\n\t\t\tcursor: pointer;\n\t\t\tbox-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);\n\t\t\ttransition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;\n\t\t}\n\t\t.pict-content-code-action-btn svg {\n\t\t\tdisplay: block;\n\t\t\twidth: 14px;\n\t\t\theight: 14px;\n\t\t\tstroke: currentColor;\n\t\t\tfill: none;\n\t\t\tstroke-width: 1.6;\n\t\t\tstroke-linecap: round;\n\t\t\tstroke-linejoin: round;\n\t\t}\n\t\t.pict-content-code-action-btn:hover {\n\t\t\tbackground: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tcolor: var(--theme-color-text-on-brand, #FFFFFF);\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tbox-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);\n\t\t}\n\t\t.pict-content-code-action-btn:focus-visible {\n\t\t\toutline: 2px solid var(--theme-color-brand-primary, #2E7D74);\n\t\t\toutline-offset: 2px;\n\t\t}\n\t\t.pict-content-code-action-btn.is-copied {\n\t\t\tbackground: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tcolor: var(--theme-color-text-on-brand, #FFFFFF);\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t}\n\t\t.pict-content-code-action-btn.is-copy-failed {\n\t\t\tbackground: var(--theme-color-status-error, #B23A3A);\n\t\t\tcolor: var(--theme-color-text-on-brand, #FFFFFF);\n\t\t\tborder-color: var(--theme-color-status-error, #B23A3A);\n\t\t}\n\t\t.pict-fullscreen-overlay {\n\t\t\tposition: fixed;\n\t\t\tinset: 0;\n\t\t\tz-index: 9999;\n\t\t\tdisplay: flex;\n\t\t\tflex-direction: column;\n\t\t\tbackground: rgba(0, 0, 0, 0.62);\n\t\t\tbackdrop-filter: blur(6px);\n\t\t\t-webkit-backdrop-filter: blur(6px);\n\t\t\tcolor: var(--theme-color-text-primary, #2A241E);\n\t\t}\n\t\t.pict-fullscreen-overlay[hidden] {\n\t\t\tdisplay: none;\n\t\t}\n\t\t.pict-fullscreen-titlebar {\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: space-between;\n\t\t\tgap: 1em;\n\t\t\theight: 48px;\n\t\t\tpadding: 0 1em;\n\t\t\tbackground: var(--theme-color-background-panel, #FFFFFF);\n\t\t\tcolor: var(--theme-color-text-primary, #1A1612);\n\t\t\tborder-bottom: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tbox-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);\n\t\t\tflex: 0 0 auto;\n\t\t}\n\t\t.pict-fullscreen-title {\n\t\t\tfont-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n\t\t\tfont-size: 0.95em;\n\t\t\tfont-weight: 600;\n\t\t\tletter-spacing: 0.01em;\n\t\t\twhite-space: nowrap;\n\t\t\toverflow: hidden;\n\t\t\ttext-overflow: ellipsis;\n\t\t\tcolor: var(--theme-color-text-primary, #1A1612);\n\t\t}\n\t\t.pict-fullscreen-controls {\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tgap: 4px;\n\t\t}\n\t\t.pict-fullscreen-btn {\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\twidth: 32px;\n\t\t\theight: 32px;\n\t\t\tpadding: 0;\n\t\t\tbackground: transparent;\n\t\t\tborder: 1px solid transparent;\n\t\t\tborder-radius: 6px;\n\t\t\tcolor: var(--theme-color-text-muted, #5E5549);\n\t\t\tcursor: pointer;\n\t\t\ttransition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;\n\t\t}\n\t\t.pict-fullscreen-btn svg {\n\t\t\tdisplay: block;\n\t\t\twidth: 16px;\n\t\t\theight: 16px;\n\t\t\tstroke: currentColor;\n\t\t\tfill: none;\n\t\t\tstroke-width: 1.75;\n\t\t\tstroke-linecap: round;\n\t\t\tstroke-linejoin: round;\n\t\t}\n\t\t.pict-fullscreen-btn:hover {\n\t\t\tbackground: var(--theme-color-border-light, #EAE3D8);\n\t\t\tcolor: var(--theme-color-text-primary, #1A1612);\n\t\t}\n\t\t.pict-fullscreen-btn:focus-visible {\n\t\t\toutline: 2px solid var(--theme-color-brand-primary, #2E7D74);\n\t\t\toutline-offset: 2px;\n\t\t}\n\t\t.pict-fullscreen-close:hover {\n\t\t\tbackground: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tcolor: var(--theme-color-text-on-brand, #FFFFFF);\n\t\t}\n\t\t.pict-fullscreen-stage {\n\t\t\tflex: 1 1 auto;\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\toverflow: hidden;\n\t\t\tpadding: 1.5em;\n\t\t\tcursor: zoom-in;\n\t\t\ttouch-action: none;\n\t\t}\n\t\t.pict-fullscreen-stage.is-zoomed {\n\t\t\tcursor: grab;\n\t\t}\n\t\t.pict-fullscreen-stage.is-panning {\n\t\t\tcursor: grabbing;\n\t\t}\n\t\t.pict-fullscreen-content {\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\tmax-width: 100%;\n\t\t\tmax-height: 100%;\n\t\t\ttransform-origin: center center;\n\t\t\ttransition: transform 0.05s linear;\n\t\t\twill-change: transform;\n\t\t}\n\t\t.pict-fullscreen-content > * {\n\t\t\tbox-shadow: 0 12px 48px rgba(0, 0, 0, 0.45);\n\t\t}\n\t\t.pict-fullscreen-content .pict-fullscreen-img {\n\t\t\tmax-width: 90vw;\n\t\t\tmax-height: calc(100vh - 96px);\n\t\t\twidth: auto;\n\t\t\theight: auto;\n\t\t\tobject-fit: contain;\n\t\t\tbackground: var(--theme-color-background-panel, #FFFFFF);\n\t\t\tpadding: 12px;\n\t\t\tborder-radius: 6px;\n\t\t}\n\t\t.pict-fullscreen-content .pict-fullscreen-mermaid-svg {\n\t\t\twidth: min(90vw, 1400px);\n\t\t\theight: auto;\n\t\t\tmax-height: calc(100vh - 96px);\n\t\t\tbackground: var(--theme-color-background-panel, #FFFFFF);\n\t\t\tpadding: 16px;\n\t\t\tborder-radius: 6px;\n\t\t}\n\t\t.pict-fullscreen-content .pict-fullscreen-codewrap {\n\t\t\tmax-width: 90vw;\n\t\t\tmax-height: calc(100vh - 96px);\n\t\t\tmargin: 0;\n\t\t\toverflow: auto;\n\t\t\tbox-shadow: 0 12px 48px rgba(0, 0, 0, 0.45);\n\t\t}\n\t",
        Templates: [{
          Hash: "Pict-Content-Template",
          Template: /*html*/"\n<div class=\"pict-content\" id=\"Pict-Content-Body\">\n\t<div class=\"pict-content-loading\">Loading content...</div>\n</div>\n"
        }],
        Renderables: [{
          RenderableHash: "Pict-Content-Display",
          TemplateHash: "Pict-Content-Template",
          DestinationAddress: "#Pict-Content-Container",
          RenderMethod: "replace"
        }]
      };
      class PictContentView extends libPictView {
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);
        }

        /**
         * Display parsed HTML content in the content area.
         *
         * @param {string} pHTMLContent - The HTML to display
         * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
         */
        displayContent(pHTMLContent, pContainerID) {
          let tmpContainerID = pContainerID || 'Pict-Content-Body';
          this.pict.ContentAssignment.assignContent('#' + tmpContainerID, pHTMLContent);

          // Scroll to top of content area
          let tmpContentContainer = document.getElementById(tmpContainerID);
          if (tmpContentContainer && tmpContentContainer.parentElement) {
            tmpContentContainer.parentElement.scrollTop = 0;
          }

          // Ensure the container carries the `.pict-content` class so the
          // 30+ theme-scoped CSS rules below (`.pict-content a`, `.pict-content
          // h1`, `.pict-content pre`, ...) actually match when a host passes
          // a custom container ID.  Idempotent — re-adding the class is a
          // no-op if it's already there from the host's markup.
          if (tmpContentContainer && !tmpContentContainer.classList.contains('pict-content')) {
            tmpContentContainer.classList.add('pict-content');
          }

          // Tag images and code blocks immediately so they're clickable.
          // Mermaid blocks are tagged after mermaid.run() resolves (see below).
          this.enableFullscreenViewers(tmpContainerID, {
            skipMermaid: true
          });

          // Post-render: initialize Mermaid diagrams if mermaid is available.
          // Once mermaid finishes, retag so the rendered SVGs are also clickable.
          this.renderMermaidDiagrams(tmpContainerID);

          // Post-render: render KaTeX equations if katex is available
          this.renderKaTeXEquations(tmpContainerID);
        }

        /**
         * Initialize Mermaid with theme variables read from the active
         * pict-provider-theme palette. Mermaid's `base` theme honors
         * `themeVariables`, so the diagram colors (node fills, cluster
         * backgrounds, edges, labels) follow whatever theme is applied.
         *
         * Idempotent and cheap. Called lazily before the first
         * `mermaid.run()` and again from the onApply subscription when
         * the user switches themes.
         */
        _initializeMermaidTheme() {
          if (typeof mermaid === 'undefined' || typeof window === 'undefined') {
            return;
          }
          let tmpCs = getComputedStyle(document.documentElement);
          let tmpVar = (pName, pFallback) => {
            let tmpVal = (tmpCs.getPropertyValue(pName) || '').trim();
            return tmpVal || pFallback;
          };
          // Read every token Mermaid 'base' actually consumes. Falling
          // back to the retold-content-system warm-beige hexes keeps the
          // diagram readable even if the theme provider isn't installed.
          try {
            mermaid.initialize({
              startOnLoad: false,
              theme: 'base',
              securityLevel: 'loose',
              themeVariables: {
                // Primary surfaces (node fills + cluster background)
                primaryColor: tmpVar('--theme-color-background-panel', '#FAF8F4'),
                primaryTextColor: tmpVar('--theme-color-text-primary', '#3D3229'),
                primaryBorderColor: tmpVar('--theme-color-brand-primary', '#2E7D74'),
                // Secondary (alt rows, alternate nodes, sequence actor bg)
                secondaryColor: tmpVar('--theme-color-background-secondary', '#F0EDE8'),
                secondaryTextColor: tmpVar('--theme-color-text-secondary', '#5E5549'),
                secondaryBorderColor: tmpVar('--theme-color-border-default', '#DDD6CA'),
                // Tertiary (clusters, accent groups)
                tertiaryColor: tmpVar('--theme-color-background-tertiary', '#EDE9E3'),
                tertiaryTextColor: tmpVar('--theme-color-text-secondary', '#5E5549'),
                tertiaryBorderColor: tmpVar('--theme-color-border-light', '#E8E2D7'),
                // Page-level + line + note
                background: tmpVar('--theme-color-background-panel', '#FAF8F4'),
                mainBkg: tmpVar('--theme-color-background-panel', '#FAF8F4'),
                secondBkg: tmpVar('--theme-color-background-secondary', '#F0EDE8'),
                lineColor: tmpVar('--theme-color-text-secondary', '#5E5549'),
                textColor: tmpVar('--theme-color-text-primary', '#3D3229'),
                noteBkgColor: tmpVar('--theme-color-background-tertiary', '#EDE9E3'),
                noteTextColor: tmpVar('--theme-color-text-primary', '#3D3229'),
                noteBorderColor: tmpVar('--theme-color-border-default', '#DDD6CA'),
                // Status (Mermaid uses these for error/warning highlights)
                errorBkgColor: tmpVar('--theme-color-status-error', '#D9534F'),
                errorTextColor: tmpVar('--theme-color-text-on-brand', '#FFFFFF'),
                // Typography
                fontFamily: tmpVar('--theme-typography-family-sans', 'inherit')
              }
            });
          } catch (pError) {
            if (this.log && this.log.warn) {
              this.log.warn('Mermaid theme init failed: ' + pError.message);
            }
          }
        }

        /**
         * Subscribe to pict-provider-theme apply events so Mermaid diagrams
         * re-render with the new palette on theme change. Idempotent — safe
         * to call multiple times. Falls through silently when the provider
         * isn't installed (apps using pict-section-content without
         * pict-provider-theme still get the static base theme).
         */
        _subscribeToThemeChanges() {
          if (this._mermaidThemeSubscribed) {
            return;
          }
          let tmpProvider = this.pict && this.pict.providers && this.pict.providers.Theme;
          if (!tmpProvider || typeof tmpProvider.onApply !== 'function') {
            return;
          }
          let tmpSelf = this;
          tmpProvider.onApply(function () {
            tmpSelf._initializeMermaidTheme();
            tmpSelf._refreshMermaidDiagrams();
          });
          this._mermaidThemeSubscribed = true;
        }

        /**
         * Re-render every Mermaid diagram on the page using its cached
         * source. Called after a theme change so the new themeVariables
         * take effect on already-displayed diagrams.
         *
         * Mermaid replaces `pre.mermaid`'s textContent with the rendered
         * SVG during `mermaid.run()`. To re-render we need the original
         * source, which `renderMermaidDiagrams` stashes on each element
         * as `data-mermaid-source` BEFORE running. This method restores
         * that source, drops the `data-processed` flag, and re-runs.
         */
        _refreshMermaidDiagrams() {
          if (typeof mermaid === 'undefined' || typeof document === 'undefined') {
            return;
          }
          let tmpRendered = document.querySelectorAll('pre.mermaid[data-mermaid-source]');
          if (tmpRendered.length < 1) {
            return;
          }
          for (let i = 0; i < tmpRendered.length; i++) {
            let tmpEl = tmpRendered[i];
            tmpEl.textContent = tmpEl.getAttribute('data-mermaid-source');
            tmpEl.removeAttribute('data-processed');
            tmpEl.classList.remove('mermaid-rendered');
          }
          try {
            let tmpResult = mermaid.run({
              nodes: tmpRendered
            });
            if (tmpResult && typeof tmpResult.catch === 'function') {
              tmpResult.catch(pError => {
                if (this.log && this.log.warn) {
                  this.log.warn('Mermaid re-render failed: ' + (pError && pError.message ? pError.message : pError));
                }
              });
            }
          } catch (pError) {
            if (this.log && this.log.warn) {
              this.log.warn('Mermaid re-render failed: ' + pError.message);
            }
          }
        }

        /**
         * Render any Mermaid diagram blocks in the content area.
         * Mermaid blocks are `<pre class="mermaid">` elements produced by parseMarkdown.
         *
         * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
         */
        renderMermaidDiagrams(pContainerID) {
          if (typeof mermaid === 'undefined') {
            return;
          }
          let tmpContainerID = pContainerID || 'Pict-Content-Body';
          let tmpContentBody = document.getElementById(tmpContainerID);
          if (!tmpContentBody) {
            return;
          }
          let tmpMermaidElements = tmpContentBody.querySelectorAll('pre.mermaid');
          if (tmpMermaidElements.length < 1) {
            return;
          }

          // First-time setup: apply theme variables and subscribe to
          // theme apply events so diagrams re-render on theme change.
          this._initializeMermaidTheme();
          this._subscribeToThemeChanges();

          // Cache each diagram's source on the element so theme-change
          // re-renders can restore it. Mermaid replaces textContent with
          // the rendered SVG during run(), so we lose the source unless
          // we stash it here first.
          for (let i = 0; i < tmpMermaidElements.length; i++) {
            let tmpEl = tmpMermaidElements[i];
            if (!tmpEl.hasAttribute('data-mermaid-source')) {
              tmpEl.setAttribute('data-mermaid-source', tmpEl.textContent);
            }
          }

          // mermaid.run() will process all pre.mermaid elements in the container.
          // It returns a promise; once it resolves the inner SVG exists and we
          // can tag the diagrams as fullscreen-clickable.
          try {
            let tmpResult = mermaid.run({
              nodes: tmpMermaidElements
            });
            if (tmpResult && typeof tmpResult.then === 'function') {
              tmpResult.then(() => {
                this.enableFullscreenViewers(tmpContainerID, {
                  onlyMermaid: true
                });
              }).catch(pError => {
                this.log.error('Mermaid rendering error: ' + (pError && pError.message ? pError.message : pError));
              });
            } else {
              // Synchronous fallback (older mermaid)
              this.enableFullscreenViewers(tmpContainerID, {
                onlyMermaid: true
              });
            }
          } catch (pError) {
            this.log.error('Mermaid rendering error: ' + pError.message);
          }
        }

        /**
         * Render KaTeX inline and display math elements in the content area.
         * Inline: `<span class="pict-content-katex-inline">`
         * Display: `<div class="pict-content-katex-display">`
         *
         * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
         */
        renderKaTeXEquations(pContainerID) {
          if (typeof katex === 'undefined') {
            return;
          }
          let tmpContainerID = pContainerID || 'Pict-Content-Body';
          let tmpContentBody = document.getElementById(tmpContainerID);
          if (!tmpContentBody) {
            return;
          }

          // Render inline math
          let tmpInlineElements = tmpContentBody.querySelectorAll('.pict-content-katex-inline');
          for (let i = 0; i < tmpInlineElements.length; i++) {
            try {
              katex.render(tmpInlineElements[i].textContent, tmpInlineElements[i], {
                throwOnError: false,
                displayMode: false
              });
            } catch (pError) {
              this.log.warn('KaTeX inline error: ' + pError.message);
            }
          }

          // Render display math
          let tmpDisplayElements = tmpContentBody.querySelectorAll('.pict-content-katex-display');
          for (let i = 0; i < tmpDisplayElements.length; i++) {
            try {
              katex.render(tmpDisplayElements[i].textContent, tmpDisplayElements[i], {
                throwOnError: false,
                displayMode: true
              });
            } catch (pError) {
              this.log.warn('KaTeX display error: ' + pError.message);
            }
          }
        }

        /**
         * Walk the freshly-rendered content and tag images, mermaid diagrams,
         * and fenced code blocks so they're click-to-fullscreen.  Also installs
         * a single delegated click listener on the container the first time it
         * is called for that container.
         *
         * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
         * @param {Object} [pOptions] - { skipMermaid: bool, onlyMermaid: bool }
         */
        enableFullscreenViewers(pContainerID, pOptions) {
          let tmpContainerID = pContainerID || 'Pict-Content-Body';
          let tmpContentBody = document.getElementById(tmpContainerID);
          if (!tmpContentBody) {
            return;
          }
          let tmpOptions = pOptions || {};
          if (!tmpOptions.onlyMermaid) {
            // Images
            let tmpImages = tmpContentBody.querySelectorAll('img:not([data-fullscreen-source])');
            for (let i = 0; i < tmpImages.length; i++) {
              let tmpImg = tmpImages[i];
              tmpImg.setAttribute('data-fullscreen-source', 'image');
              let tmpAlt = tmpImg.getAttribute('alt');
              if (!tmpAlt) {
                let tmpSrc = tmpImg.getAttribute('src') || '';
                tmpAlt = tmpSrc.split('/').pop().split('?')[0] || 'Image';
              }
              tmpImg.setAttribute('data-fullscreen-title', tmpAlt);
            }

            // Code wraps (fenced blocks): do NOT tag for click-to-fullscreen —
            // that would conflict with text selection for copy/paste.
            // Instead wrap each in a container with hover-revealed action
            // buttons (fullscreen + copy) floating to the right.
            let tmpCodeWraps = tmpContentBody.querySelectorAll('.pict-content-code-wrap:not([data-code-actions-wired])');
            for (let i = 0; i < tmpCodeWraps.length; i++) {
              this._wireCodeActions(tmpCodeWraps[i]);
            }
          }
          if (!tmpOptions.skipMermaid) {
            // Mermaid diagrams (after mermaid.run() has replaced the inner pre)
            let tmpMermaid = tmpContentBody.querySelectorAll('pre.mermaid:not([data-fullscreen-source])');
            for (let i = 0; i < tmpMermaid.length; i++) {
              let tmpPre = tmpMermaid[i];
              // Only tag once mermaid has actually rendered an svg into it
              if (tmpPre.querySelector('svg')) {
                tmpPre.setAttribute('data-fullscreen-source', 'mermaid');
                tmpPre.setAttribute('data-fullscreen-title', 'Mermaid Diagram');
              }
            }
          }

          // Install delegated click listener once per container.
          if (!tmpContentBody.__pictFullscreenWired) {
            tmpContentBody.__pictFullscreenWired = true;
            tmpContentBody.addEventListener('click', pEvent => {
              let tmpTarget = pEvent.target;
              while (tmpTarget && tmpTarget !== tmpContentBody && !tmpTarget.hasAttribute('data-fullscreen-source')) {
                tmpTarget = tmpTarget.parentElement;
              }
              if (tmpTarget && tmpTarget !== tmpContentBody && tmpTarget.hasAttribute('data-fullscreen-source')) {
                pEvent.preventDefault();
                this._openFullscreen(tmpTarget);
              }
            });
          }
        }

        /**
         * Wrap a fenced code block in a container that holds the existing
         * .pict-content-code-wrap plus a hover-revealed action column with
         * fullscreen + copy buttons.  The action column is sticky-positioned
         * so it follows the page scroll while the user is alongside a long
         * code block.
         *
         * @param {HTMLElement} pCodeWrap - The .pict-content-code-wrap element
         */
        _wireCodeActions(pCodeWrap) {
          if (!pCodeWrap || pCodeWrap.hasAttribute('data-code-actions-wired')) {
            return;
          }
          pCodeWrap.setAttribute('data-code-actions-wired', 'true');

          // Determine the fullscreen title from the language tag, if any.
          let tmpCodeEl = pCodeWrap.querySelector('code[class*="language-"]');
          let tmpLang = 'Code';
          if (tmpCodeEl) {
            let tmpMatch = (tmpCodeEl.getAttribute('class') || '').match(/language-(\S+)/);
            if (tmpMatch) {
              tmpLang = tmpMatch[1] + ' code';
            }
          }
          pCodeWrap.setAttribute('data-code-language', tmpLang);

          // Build the wrapping container.
          let tmpContainer = document.createElement('div');
          tmpContainer.className = 'pict-content-code-container';
          let tmpActions = document.createElement('div');
          tmpActions.className = 'pict-content-code-actions';
          tmpActions.setAttribute('aria-hidden', 'false');
          let tmpFullscreenBtn = document.createElement('button');
          tmpFullscreenBtn.type = 'button';
          tmpFullscreenBtn.className = 'pict-content-code-action-btn';
          tmpFullscreenBtn.setAttribute('aria-label', 'Open code in fullscreen');
          tmpFullscreenBtn.setAttribute('title', 'Open in fullscreen');
          tmpFullscreenBtn.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><polyline points="3 6 3 3 6 3"></polyline><polyline points="13 6 13 3 10 3"></polyline><polyline points="3 10 3 13 6 13"></polyline><polyline points="13 10 13 13 10 13"></polyline></svg>';
          let tmpCopyBtn = document.createElement('button');
          tmpCopyBtn.type = 'button';
          tmpCopyBtn.className = 'pict-content-code-action-btn';
          tmpCopyBtn.setAttribute('aria-label', 'Copy code to clipboard');
          tmpCopyBtn.setAttribute('title', 'Copy code');
          tmpCopyBtn.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="9" height="9" rx="1.25"></rect><path d="M11 5V3.25A1.25 1.25 0 0 0 9.75 2H3.25A1.25 1.25 0 0 0 2 3.25v6.5A1.25 1.25 0 0 0 3.25 11H5"></path></svg>';
          tmpActions.appendChild(tmpFullscreenBtn);
          tmpActions.appendChild(tmpCopyBtn);

          // Insert the container in the place of the code wrap, then move the
          // code wrap inside it followed by the actions column.
          let tmpParent = pCodeWrap.parentNode;
          tmpParent.insertBefore(tmpContainer, pCodeWrap);
          tmpContainer.appendChild(pCodeWrap);
          tmpContainer.appendChild(tmpActions);

          // Click handlers
          tmpFullscreenBtn.addEventListener('click', pEvent => {
            pEvent.preventDefault();
            pEvent.stopPropagation();
            this._openCodeFullscreen(pCodeWrap);
          });
          tmpCopyBtn.addEventListener('click', pEvent => {
            pEvent.preventDefault();
            pEvent.stopPropagation();
            this._copyCodeToClipboard(pCodeWrap, tmpCopyBtn);
          });
        }

        /**
         * Open the fullscreen overlay for a fenced code block.  Reuses the
         * same overlay singleton as image / mermaid.
         */
        _openCodeFullscreen(pCodeWrap) {
          let tmpOverlay = this._buildFullscreenOverlay();
          // Stamp the source attributes the overlay's open() expects.
          pCodeWrap.setAttribute('data-fullscreen-source', 'code');
          pCodeWrap.setAttribute('data-fullscreen-title', pCodeWrap.getAttribute('data-code-language') || 'Code');
          tmpOverlay.open(pCodeWrap);
        }

        /**
         * Copy the raw text of a code block to the clipboard and briefly flash
         * a "Copied!" state on the trigger button.
         */
        _copyCodeToClipboard(pCodeWrap, pButton) {
          let tmpCodeEl = pCodeWrap.querySelector('code');
          let tmpText = tmpCodeEl ? tmpCodeEl.textContent : pCodeWrap.textContent;
          let fFlashOk = () => {
            pButton.classList.add('is-copied');
            pButton.setAttribute('title', 'Copied!');
            setTimeout(() => {
              pButton.classList.remove('is-copied');
              pButton.setAttribute('title', 'Copy code');
            }, 1400);
          };
          let fFlashFail = () => {
            pButton.classList.add('is-copy-failed');
            pButton.setAttribute('title', 'Copy failed');
            setTimeout(() => {
              pButton.classList.remove('is-copy-failed');
              pButton.setAttribute('title', 'Copy code');
            }, 1400);
          };
          try {
            if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
              navigator.clipboard.writeText(tmpText).then(fFlashOk).catch(fFlashFail);
              return;
            }
          } catch (e) {
            // fall through to legacy fallback
          }

          // Legacy fallback for non-secure contexts.
          try {
            let tmpTextarea = document.createElement('textarea');
            tmpTextarea.value = tmpText;
            tmpTextarea.style.position = 'fixed';
            tmpTextarea.style.opacity = '0';
            document.body.appendChild(tmpTextarea);
            tmpTextarea.select();
            let tmpOk = document.execCommand('copy');
            document.body.removeChild(tmpTextarea);
            if (tmpOk) {
              fFlashOk();
            } else {
              fFlashFail();
            }
          } catch (e) {
            fFlashFail();
          }
        }

        /**
         * Lazily build the singleton fullscreen overlay element and attach it
         * to <body>.  Returns the existing instance if already built.
         */
        _buildFullscreenOverlay() {
          if (PictContentView._FullscreenOverlay) {
            return PictContentView._FullscreenOverlay;
          }
          let tmpOverlay = document.createElement('div');
          tmpOverlay.className = 'pict-fullscreen-overlay';
          tmpOverlay.setAttribute('role', 'dialog');
          tmpOverlay.setAttribute('aria-modal', 'true');
          tmpOverlay.setAttribute('aria-labelledby', 'pict-fullscreen-title');
          tmpOverlay.setAttribute('hidden', '');
          tmpOverlay.innerHTML = '' + '<div class="pict-fullscreen-titlebar">' + '<span class="pict-fullscreen-title" id="pict-fullscreen-title"></span>' + '<div class="pict-fullscreen-controls">' + '<button type="button" class="pict-fullscreen-btn" data-action="zoom-out" aria-label="Zoom out" title="Zoom out"><svg viewBox="0 0 16 16" aria-hidden="true"><line x1="3" y1="8" x2="13" y2="8"></line></svg></button>' + '<button type="button" class="pict-fullscreen-btn" data-action="zoom-reset" aria-label="Reset zoom" title="Reset zoom"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5"></circle><line x1="8" y1="5" x2="8" y2="11"></line><line x1="5" y1="8" x2="11" y2="8"></line></svg></button>' + '<button type="button" class="pict-fullscreen-btn" data-action="zoom-in" aria-label="Zoom in" title="Zoom in"><svg viewBox="0 0 16 16" aria-hidden="true"><line x1="3" y1="8" x2="13" y2="8"></line><line x1="8" y1="3" x2="8" y2="13"></line></svg></button>' + '<button type="button" class="pict-fullscreen-btn pict-fullscreen-close" data-action="close" aria-label="Close" title="Close (Esc)"><svg viewBox="0 0 16 16" aria-hidden="true"><line x1="4" y1="4" x2="12" y2="12"></line><line x1="12" y1="4" x2="4" y2="12"></line></svg></button>' + '</div>' + '</div>' + '<div class="pict-fullscreen-stage">' + '<div class="pict-fullscreen-content"></div>' + '</div>';
          document.body.appendChild(tmpOverlay);
          let tmpState = {
            scale: 1,
            translateX: 0,
            translateY: 0,
            isPanning: false,
            didPan: false,
            currentKind: '',
            panStartX: 0,
            panStartY: 0,
            panOrigX: 0,
            panOrigY: 0,
            pinchInitialDistance: 0,
            pinchInitialScale: 1
          };
          let tmpStage = tmpOverlay.querySelector('.pict-fullscreen-stage');
          let tmpContent = tmpOverlay.querySelector('.pict-fullscreen-content');
          let tmpTitleEl = tmpOverlay.querySelector('.pict-fullscreen-title');
          let fApplyTransform = () => {
            tmpContent.style.transform = 'translate(' + tmpState.translateX + 'px, ' + tmpState.translateY + 'px) scale(' + tmpState.scale + ')';
            tmpStage.classList.toggle('is-zoomed', tmpState.scale > 1.001);
          };
          let fClampScale = pValue => {
            if (pValue < 0.5) return 0.5;
            if (pValue > 8) return 8;
            return pValue;
          };
          let fZoomAt = (pNewScale, pAnchorClientX, pAnchorClientY) => {
            let tmpClamped = fClampScale(pNewScale);
            let tmpStageRect = tmpStage.getBoundingClientRect();
            let tmpAnchorX = pAnchorClientX !== undefined ? pAnchorClientX : tmpStageRect.left + tmpStageRect.width / 2;
            let tmpAnchorY = pAnchorClientY !== undefined ? pAnchorClientY : tmpStageRect.top + tmpStageRect.height / 2;
            // Convert anchor into the local coordinate of the content (which is centered)
            let tmpCenterX = tmpStageRect.left + tmpStageRect.width / 2;
            let tmpCenterY = tmpStageRect.top + tmpStageRect.height / 2;
            let tmpDX = tmpAnchorX - tmpCenterX;
            let tmpDY = tmpAnchorY - tmpCenterY;
            let tmpRatio = tmpClamped / tmpState.scale;
            tmpState.translateX = tmpDX - tmpRatio * (tmpDX - tmpState.translateX);
            tmpState.translateY = tmpDY - tmpRatio * (tmpDY - tmpState.translateY);
            tmpState.scale = tmpClamped;
            fApplyTransform();
          };
          let fResetTransform = () => {
            tmpState.scale = 1;
            tmpState.translateX = 0;
            tmpState.translateY = 0;
            fApplyTransform();
          };
          let fClose = () => {
            tmpOverlay.setAttribute('hidden', '');
            tmpContent.innerHTML = '';
            fResetTransform();
            document.documentElement.style.removeProperty('overflow');
            document.removeEventListener('keydown', fKeydown);
          };
          let fKeydown = pEvent => {
            if (pEvent.key === 'Escape') {
              pEvent.preventDefault();
              fClose();
            } else if (pEvent.key === '+' || pEvent.key === '=') {
              pEvent.preventDefault();
              fZoomAt(tmpState.scale + 0.25);
            } else if (pEvent.key === '-' || pEvent.key === '_') {
              pEvent.preventDefault();
              fZoomAt(tmpState.scale - 0.25);
            } else if (pEvent.key === '0') {
              pEvent.preventDefault();
              fResetTransform();
            }
          };

          // Backdrop click closes (only when clicking the backdrop itself or
          // the stage area, not the inner content).  Suppress if a
          // drag-to-pan just finished — the pointerup that ended the pan
          // also fires a click event which we must ignore.
          tmpOverlay.addEventListener('click', pEvent => {
            if (tmpState.didPan) {
              tmpState.didPan = false;
              return;
            }
            if (pEvent.target === tmpOverlay || pEvent.target === tmpStage) {
              fClose();
            }
          });

          // Toolbar buttons
          tmpOverlay.querySelectorAll('[data-action]').forEach(pBtn => {
            pBtn.addEventListener('click', pEvent => {
              pEvent.stopPropagation();
              let tmpAction = pBtn.getAttribute('data-action');
              if (tmpAction === 'close') {
                fClose();
              } else if (tmpAction === 'zoom-in') {
                fZoomAt(tmpState.scale + 0.25);
              } else if (tmpAction === 'zoom-out') {
                fZoomAt(tmpState.scale - 0.25);
              } else if (tmpAction === 'zoom-reset') {
                fResetTransform();
              }
            });
          });

          // Wheel zoom — for images and mermaid diagrams.
          // For code blocks, let the browser handle native scrolling
          // so the user can scroll through long code.
          tmpStage.addEventListener('wheel', pEvent => {
            if (tmpState.currentKind === 'code') {
              return;
            }
            pEvent.preventDefault();
            let tmpDelta = -pEvent.deltaY;
            let tmpStep = (tmpDelta > 0 ? 1 : -1) * 0.15;
            fZoomAt(tmpState.scale + tmpStep, pEvent.clientX, pEvent.clientY);
          }, {
            passive: false
          });

          // Drag-to-pan when zoomed (not for code blocks — they scroll natively)
          tmpStage.addEventListener('pointerdown', pEvent => {
            if (tmpState.currentKind === 'code') {
              return;
            }
            if (tmpState.scale <= 1.001) {
              return;
            }
            if (pEvent.target.closest('.pict-fullscreen-controls')) {
              return;
            }
            tmpState.isPanning = true;
            tmpState.panStartX = pEvent.clientX;
            tmpState.panStartY = pEvent.clientY;
            tmpState.panOrigX = tmpState.translateX;
            tmpState.panOrigY = tmpState.translateY;
            tmpStage.setPointerCapture(pEvent.pointerId);
            tmpStage.classList.add('is-panning');
          });
          tmpStage.addEventListener('pointermove', pEvent => {
            if (!tmpState.isPanning) {
              return;
            }
            tmpState.translateX = tmpState.panOrigX + (pEvent.clientX - tmpState.panStartX);
            tmpState.translateY = tmpState.panOrigY + (pEvent.clientY - tmpState.panStartY);
            fApplyTransform();
          });
          let fEndPan = pEvent => {
            if (!tmpState.isPanning) {
              return;
            }
            tmpState.isPanning = false;
            // Flag that a pan just ended so the subsequent click event
            // (which the browser fires after pointerup) does not close
            // the overlay via the backdrop-close handler.
            tmpState.didPan = true;
            tmpStage.classList.remove('is-panning');
            try {
              tmpStage.releasePointerCapture(pEvent.pointerId);
            } catch (e) {}
          };
          tmpStage.addEventListener('pointerup', fEndPan);
          tmpStage.addEventListener('pointercancel', fEndPan);

          // Touch pinch zoom
          let tmpActiveTouches = {};
          tmpStage.addEventListener('touchstart', pEvent => {
            for (let i = 0; i < pEvent.touches.length; i++) {
              let tmpT = pEvent.touches[i];
              tmpActiveTouches[tmpT.identifier] = {
                x: tmpT.clientX,
                y: tmpT.clientY
              };
            }
            if (pEvent.touches.length === 2) {
              let tmpA = pEvent.touches[0];
              let tmpB = pEvent.touches[1];
              let tmpDX = tmpB.clientX - tmpA.clientX;
              let tmpDY = tmpB.clientY - tmpA.clientY;
              tmpState.pinchInitialDistance = Math.sqrt(tmpDX * tmpDX + tmpDY * tmpDY);
              tmpState.pinchInitialScale = tmpState.scale;
            }
          }, {
            passive: true
          });
          tmpStage.addEventListener('touchmove', pEvent => {
            if (pEvent.touches.length === 2 && tmpState.pinchInitialDistance > 0) {
              pEvent.preventDefault();
              let tmpA = pEvent.touches[0];
              let tmpB = pEvent.touches[1];
              let tmpDX = tmpB.clientX - tmpA.clientX;
              let tmpDY = tmpB.clientY - tmpA.clientY;
              let tmpDist = Math.sqrt(tmpDX * tmpDX + tmpDY * tmpDY);
              let tmpRatio = tmpDist / tmpState.pinchInitialDistance;
              let tmpMidX = (tmpA.clientX + tmpB.clientX) / 2;
              let tmpMidY = (tmpA.clientY + tmpB.clientY) / 2;
              fZoomAt(tmpState.pinchInitialScale * tmpRatio, tmpMidX, tmpMidY);
            }
          }, {
            passive: false
          });
          tmpStage.addEventListener('touchend', () => {
            tmpActiveTouches = {};
            tmpState.pinchInitialDistance = 0;
          });
          PictContentView._FullscreenOverlay = {
            element: tmpOverlay,
            content: tmpContent,
            titleEl: tmpTitleEl,
            state: tmpState,
            open: pSourceEl => {
              let tmpTitle = pSourceEl.getAttribute('data-fullscreen-title') || '';
              tmpTitleEl.textContent = tmpTitle;
              tmpContent.innerHTML = '';
              let tmpKind = pSourceEl.getAttribute('data-fullscreen-source');
              tmpState.currentKind = tmpKind || '';
              let tmpClone;
              if (tmpKind === 'mermaid') {
                let tmpSvg = pSourceEl.querySelector('svg');
                if (tmpSvg) {
                  tmpClone = tmpSvg.cloneNode(true);
                  tmpClone.classList.add('pict-fullscreen-mermaid-svg');
                  // Drop mermaid's inline max-width / width / height style so the
                  // fullscreen CSS rule actually controls the size.
                  tmpClone.removeAttribute('style');
                  tmpClone.removeAttribute('width');
                  tmpClone.removeAttribute('height');
                } else {
                  tmpClone = pSourceEl.cloneNode(true);
                }
              } else if (tmpKind === 'image') {
                tmpClone = pSourceEl.cloneNode(true);
                tmpClone.classList.add('pict-fullscreen-img');
              } else {
                tmpClone = pSourceEl.cloneNode(true);
                tmpClone.classList.add('pict-fullscreen-codewrap');
              }
              tmpContent.appendChild(tmpClone);

              // Hide zoom controls for code blocks (they scroll natively)
              let tmpZoomBtns = tmpOverlay.querySelectorAll('[data-action="zoom-in"], [data-action="zoom-out"], [data-action="zoom-reset"]');
              for (let i = 0; i < tmpZoomBtns.length; i++) {
                tmpZoomBtns[i].style.display = tmpKind === 'code' ? 'none' : '';
              }
              fResetTransform();
              tmpOverlay.removeAttribute('hidden');
              document.documentElement.style.overflow = 'hidden';
              document.addEventListener('keydown', fKeydown);
            },
            close: fClose
          };
          return PictContentView._FullscreenOverlay;
        }

        /**
         * Open the fullscreen overlay for a tagged source element.
         */
        _openFullscreen(pSourceEl) {
          let tmpOverlay = this._buildFullscreenOverlay();
          tmpOverlay.open(pSourceEl);
        }

        /**
         * Show a loading indicator.
         *
         * @param {string} [pMessage] - Loading message (defaults to 'Loading content...')
         * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
         */
        showLoading(pMessage, pContainerID) {
          let tmpContainerID = pContainerID || 'Pict-Content-Body';
          let tmpMessage = pMessage || 'Loading content...';
          this.pict.ContentAssignment.assignContent('#' + tmpContainerID, '<div class="pict-content-loading">' + tmpMessage + '</div>');
        }
      }
      module.exports = PictContentView;
      module.exports.default_configuration = _ViewConfiguration;
    }, {
      "pict-view": 13
    }]
  }, {}, [1])(1);
});
