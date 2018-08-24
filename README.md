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

> React + Context -> Rectx, a light-weight state manager with mutable api.

## 安装

```bash
npm install --save rectx
```

## 特点

新版本的 `rectx` 有着强大的功能，他不仅能提供一个状态库，甚至能提供一个良好的类型辅助系统，这也意味着你可以在 `TypeScript` 中支持它！

- [x] 完整的测试，测试覆盖率极高
- [x] `typescript` 的 `d.ts` 支持
- [x] 不用写 `shouldComponentUpdate` 的组件
- [x] 高性能，轻量

## 最简单的使用

当然了，这个例子如果你看就懂，那我非常建议你直接去看我是如何处理，使得不需要写 `shouldComponentUpdate` 的

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

## 无需 `shouldComponentUpdate` 的组件 `Auto`

[code sandbox 例子](https://codesandbox.io/s/ly62j89q39)
