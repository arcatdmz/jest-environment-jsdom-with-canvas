"use strict";

var _jestUtil = require("jest-util");

var _jestMock = _interopRequireDefault(require("jest-mock"));

var _jsdom = require("jsdom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class JSDOMEnvironment {
  constructor(config, options = {}) {
    _defineProperty(this, "dom", void 0);

    _defineProperty(this, "fakeTimers", void 0);

    _defineProperty(this, "global", void 0);

    _defineProperty(this, "errorEventListener", void 0);

    _defineProperty(this, "moduleMocker", void 0);

    this.dom = new _jsdom.JSDOM('<!DOCTYPE html>', Object.assign({
      pretendToBeVisual: true,
      runScripts: 'dangerously',
      url: config.testURL,
      virtualConsole: new _jsdom.VirtualConsole().sendTo(options.console || console)
    }, config.testEnvironmentOptions));
    const global = this.global = this.dom.window.document.defaultView; // Node's error-message stack size is limited at 10, but it's pretty useful
    // to see more than that when a test fails.

    this.global.Error.stackTraceLimit = 100;
    (0, _jestUtil.installCommonGlobals)(global, config.globals); // Report uncaught errors.

    this.errorEventListener = event => {
      if (userErrorListenerCount === 0 && event.error) {
        process.emit('uncaughtException', event.error);
      }
    };

    global.addEventListener('error', this.errorEventListener); // However, don't report them as uncaught if the user listens to 'error' event.
    // In that case, we assume the might have custom error handling logic.

    const originalAddListener = global.addEventListener;
    const originalRemoveListener = global.removeEventListener;
    let userErrorListenerCount = 0;

    global.addEventListener = function (name) {
      if (name === 'error') {
        userErrorListenerCount++;
      }

      return originalAddListener.apply(this, arguments);
    };

    global.removeEventListener = function (name) {
      if (name === 'error') {
        userErrorListenerCount--;
      }

      return originalRemoveListener.apply(this, arguments);
    };

    this.moduleMocker = new _jestMock.default.ModuleMocker(global);
    const timerConfig = {
      idToRef: id => id,
      refToId: ref => ref
    };
    this.fakeTimers = new _jestUtil.FakeTimers({
      config,
      global,
      moduleMocker: this.moduleMocker,
      timerConfig
    });
  }

  setup() {
    return Promise.resolve();
  }

  teardown() {
    if (this.fakeTimers) {
      this.fakeTimers.dispose();
    }

    if (this.global) {
      if (this.errorEventListener) {
        this.global.removeEventListener('error', this.errorEventListener);
      } // Dispose "document" to prevent "load" event from triggering.


      Object.defineProperty(this.global, 'document', {
        value: null
      });
      this.global.close();
    }

    this.errorEventListener = null;
    this.global = null;
    this.dom = null;
    this.fakeTimers = null;
    return Promise.resolve();
  }

  runScript(script) {
    if (this.dom) {
      return this.dom.runVMScript(script);
    }

    return null;
  }

}

module.exports = JSDOMEnvironment;