# Rectx

> React + Context -> Rectx, a light-weight state manager.

## Installation

```bash
npm install --save rectx
```

## Simple Usage

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, Machine, Listen } from 'rectx'

class LikeMachine extends Machine {
    state = {
        isLike: false
    }

    handleClick = () => {
        this.setState({
            isLike: !this.state.isLike
        })
    }
}

const Like = () => (
    <Listen to={[LikeMachine]}>
        {like => (
            <div>
                <button onClick={() => like.handleClick()} />
                <div>{like.state.isLike ? 'I love you' : 'I hate you'}</div>
            </div>
        )}
    </Listen>
)

ReactDOM.render(
    <Provider>
        <Like />
    </Provider>,
    document.getElementById('root')
)
```

Now done, simple as that. We have create some awesome code here. 


