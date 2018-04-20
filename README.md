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
import { Provider, Machine, Listen } from 'rectx'

/**
 * we create a state machine `LikeMachine` inherit from Machine
 * define a class function `handleClick` for setting state by calling `this.setState`
*/
class LikeMachine extends Machine {
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
 * @didMount:function, when `<Lisent/>` component mounted, it will be fired. The arguments is the instances of `Machine`
*/
const Like = () => (
    <Listen
        to={[LikeMachine]}
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

## Inspiration

this library inspirated by [unstated](https://unstated.io)
