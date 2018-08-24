# Rectx
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/rectx.svg?style=flat-square
[npm-url]: https://npmjs.org/package/rectx
[travis-image]: https://img.shields.io/travis/foveluy/rectx.svg?style=flat-square
[travis-url]: https://travis-ci.org/foveluy/rectx
[coveralls-image]: https://img.shields.io/coveralls/foveluy/rectx.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/foveluy/rectx?branch=master
[david-image]: https://img.shields.io/david/foveluy/rectx.svg?style=flat-square
[david-url]: https://david-dm.org/foveluy/rectx
[node-image]: https://img.shields.io/badge/node.js-%3E=_8.0-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rectx.svg?style=flat-square
[download-url]: https://npmjs.org/package/rectx

![](https://github.com/foveluy/rectx/blob/master/docs/rectx.png?raw=true)

React + Context -> Rectx, a light-weight state manager with mutable api.

## React version requires

Rectx requires React > 16, but if you are using React < 16, I think it would be ok :)

## Installation

```bash
npm install --save rectx babel-core
```

## Simple Usage

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, Controller, Listen } from 'rectx'

/**
 * we create a state machine `LikeController` inherit from Controller
 * define a class function `handleClick` for setting state by calling `this.setState`
 */
class LikeController extends Controller {
    state = {
        isLike: false,
        isMount: false
    }

    handleClick = () => {
        this.setState({
            isLike: !this.state.isLike
        })
    }
}

/**
 * a simple `<Like/>` react component with property `to` and `didMount`
 * @to:array, state machine arrays, this property can be set a bunch of `Machine`
 * @didMount:function, when `<Lisent/>` component mounted, it will be fired,
 * The arguments of didMount is the instances of `Machine` you just put in `to` property.
 */
const Like = () => (
    <Listen
        to={[LikeController]}
        didMount={like => {
            like.setState({ isMount: true })
        }}
    >
        {like => (
            <div>
                <button onClick={() => like.handleClick()}>Click me</button>
                <div>{like.state.isMount ? 'component being loaded' : 'component not loaded'}</div>
                <div>{like.state.isLike ? 'I love you' : 'I hate you'}</div>
            </div>
        )}
    </Listen>
)

/**
 * <Provider/> is necessary wrapper for this system.
 */
ReactDOM.render(
    <Provider>
        <Like />
    </Provider>,
    document.getElementById('root')
)
```

Now done, simple as that. We have create some awesome code here.

## Middleware free

`redux` has a great middleware mechanism to help developer to deal with `side-effects`, such as `http request`. In rectx, you might not need middlewares. Check out the exsample for async class function:

[codeSandbox](https://codesandbox.io/s/l970jx93pz)


## Inspiration

this library inspirated by [unstated](https://unstated.io)
