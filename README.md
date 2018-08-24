# Rectx

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/rectx.svg?style=flat-square
[npm-url]: https://npmjs.org/package/rectx
[travis-image]: https://img.shields.io/travis/Foveluy/rectx.svg?style=flat-square
[travis-url]: https://travis-ci.org/Foveluy/rectx
[coveralls-image]: https://img.shields.io/coveralls/Foveluy/rectx.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/Foveluy/rectx?branch=master
[david-image]: https://img.shields.io/david/Foveluy/rectx.svg?style=flat-square
[david-url]: https://david-dm.org/Foveluy/rectx
[node-image]: https://img.shields.io/badge/node.js-%3E=_8.0-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rectx.svg?style=flat-square
[download-url]: https://npmjs.org/package/rectx

![](https://github.com/Foveluy/rectx/blob/master/docs/rectx.png?raw=true)

React + Context -> Rectx, a light-weight state manager with mutable api.

## Installation

```bash
npm install --save rectx
```

## Simple Usage

```js
import React from 'react';
import {render} from 'react-dom';
import {init} from 'rectx';

const {Put, Ctx} = init({foo: 1});

const App = () => (
  <div>
    <Ctx>{s => <div>{s.foo}</div>}</Ctx>
    <button onClick={() => Put(s => (s.foo = s.foo + 1))}>add</button>
  </div>
);

render(<App />, document.getElementById('root'));
```
