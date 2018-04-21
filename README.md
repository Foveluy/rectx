# Rectx

React + Context -> Rectx, a light-weight state manager.

## Installation

```bash
npm install --save rectx @babel/runtime
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
