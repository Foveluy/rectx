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

> a light-weight state manager with mutable api.

## 安装

```bash
npm install --save rectx
```

## 又一个轮子？

`Redux` 和 `Mobx` 都非常的棒，但对于大部分项目都只是 `CRUD` 的项目来说，这些个玩意儿都略显太重了。而且对于 `react` 的 immutable 哲学而言，实在是模版代码相当的多，对新手、高手、熟练工都不是很友好：新手觉得复杂，高手觉得烦躁，熟练工觉得不够快。再加上，`react` 函数式编程以及 DOM-diff 依赖的是 `html tag` 的缘故，因此我们需要手动优化，臭名昭著的 `shouldComponentUpdate` 由此而来。

为了更好的解决上述的一些问题，我开始寻找一种方式能够解决：
1. 模版化很少
2. 无需手动 `shouldComponentUpdate`
3. API 极少，学习成本低
4. `mutable` API

以下就是我的解决方案。


## 特点

`rectx` 有着强大的功能，他不仅能提供一个状态库，甚至能提供一个良好的类型辅助系统，这也意味着你可以在 `TypeScript` 中支持它！

- [x] 并不依赖 `react.context api`，支持 15、16 版本的 `react`
- [x] `mutable api`，再也不用写模版代码
- [x] 完整的测试，测试覆盖率极高
- [x] `typescript` 的 `d.ts` 支持，非常友好的类型提示
- [x] 不用写 `shouldComponentUpdate` 的组件 `Auto`（自动）
- [x] 高性能，轻量

## 最简单的使用

当然了，这个例子如果你看就懂，那我非常建议你直接去看我是如何处理，使得不需要写 `shouldComponentUpdate` 的[code sandbox 例子](https://codesandbox.io/s/ly62j89q39)

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
值得注意的是,`Put(s => (s.foo = s.foo + 1))` 在这里，我们直接修改了我们的数值，当数据非常复杂的时候，这种操作方式尤为珍贵。


## 无需 `shouldComponentUpdate` 的组件 `Auto`

[code sandbox 例子](https://codesandbox.io/s/ly62j89q39)

```js
import { init } from "rectx";

const { Put, Ctx, Auto } = init({ foo: 1, bar: 1 });
```
首先我们依然是引入我们的组件，`Put` 用于更新，`Ctx` 用于获取，那么 `Auto` 是一个什么鬼？

`Auto` 是一个选择器，他能够分离我们的 Store ，把每一个 Store 切分成一个小粒度的`块`，使得我们的代码更加简洁。比如我们想获取全局状态 `store` 中的，`bar`，我们就可以：
```js
const Bars = Auto(s => s.bar);
```
当我们使用 `Bars` 的时候，我们获取到的就是 bar 这个属性了。当然，`Auto` 翻译为自动，这是他第一个`自动的`地方，第二个特点请看下面：

```js
import React from "react";
import { render } from "react-dom";
import { init } from "rectx";

const { Put, Ctx, Auto } = init({ foo: 1, bar: 1 });

const Bars = Auto(s => s.bar);

const App = () => (
  <div>
    <Ctx>{s => <div>Foo:{s.foo}</div>}</Ctx>
    {Bars(bar => <div>Bar:{bar}</div>)}
    <button onClick={() => Put(s => (s.foo = s.foo + 1))}>change Foo</button>
    <button onClick={() => Put(s => (s.bar = s.bar + 1))}>change Bar</button>
  </div>
);

render(<App />, document.getElementById("root"));
```
首先 `Auto` 是一个 `selector`，其作用是获取全局的状态，从中选出 **你关心的** 属性，当这些属性被选择出来以后，**只要这些属性没有被更新**，那么他们所返回的组件 **一定不会** 更新。同时，外部的属性是否更新，跟他们同样没有任何关系。

熟悉 React 的同学，一定知道这么做的珍贵之处，再也不用手动书写 `shouldComponentUpdate` 了。


## 类型提示

得益于 `typescript`， `Rectx` 得到了良好的类型提示。

![](https://github.com/Foveluy/rectx/blob/master/docs/leixing1.png?raw=true)
当我们初始化 `store` 以后，我们的 `store` 里面具体有什么值，在纯 js 中并没有智能提示，但加入了 ts 之后，一切会大不一样

![](https://github.com/Foveluy/rectx/blob/master/docs/leixing2.png?raw=true)

## 开源协议 

MIT
