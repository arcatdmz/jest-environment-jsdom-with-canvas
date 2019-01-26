# jest-environment-jsdom-with-canvas
Jest environment with jsdom v13 and node-canvas v2

## why I created this

- [Jest officially supports Node v6](http://facebook.github.io/jest/docs/en/troubleshooting.html#compatibility-issues)
- [jsdom v12 and later requires Node v8](https://github.com/jsdom/jsdom/blob/master/Changelog.md#1200)
- [jsdom v13 and later removed support for v1.x of the canvas package in favor of v2.x](https://github.com/jsdom/jsdom/blob/master/Changelog.md#1300)

So, in short, if we want to use `node-canvas` v2.x with Jest, we cannot rely on the official environment (i.e., `jsdom` defined at [packages/jest-environment-jsdom](https://github.com/facebook/jest/tree/master/packages/jest-environment-jsdom)).

This repository provides a Jest environment with the latest `jsdom` and `node-canvas` as of January, 2019.

## how to use

For a more detailed usage example, see [another repository](https://github.com/arcatdmz/createjs-with-jest-and-canvas/) that uses [CreateJS/EaselJS](https://github.com/CreateJS/EaselJS/) for canvas manipulation.

1. install this package along with Jest

```sh
$ npm i -D jest
$ npm i -D https://github.com/arcatdmz/jest-environment-jsdom-with-canvas.git
```

2. create `jest.config.js` so that Jest uses `jest-environment-jsdom-with-canvas`

```javascript
module.exports = {
  testEnvironment: "jest-environment-jsdom-with-canvas"
};
```
3. write tests (e.g., `./__tests__/canvas.js`)

```
describe("canvas", () => {
  let canvas = document.createElement("canvas");
  test("get context", () => {
    let ctx = null;
    try {
      ctx = canvas.getContext("2d")
    } catch (e) {}
    expect(ctx).not.toBeNull();
  });
});
```

## links

- Jest: https://jestjs.io/
- jsdom: https://github.com/jsdom/jsdom
- node-canvas (or simply `canvas`): https://github.com/Automattic/node-canvas

---
https://github.com/arcatdmz/jest-environment-jsdom-with-canvas
