# Rectx

> React + Context -> Rectx, 轻量级状态管理库。

## 安装

```bash
npm install --save rectx
```

## 简单使用

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, Machine, Listen } from 'rectx'

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

ReactDOM.render(
    <Provider>
        <Like />
    </Provider>,
    document.getElementById('root')
)
```

现在我们已经完成了一个非常简单的例子。在这个例子中，我们定义了一个 LikeMachine 状态机，用于保存 Like 组件所需要的一切状态。

## 意义何在？

让我们认真的观察一下这段简单的代码，很快你就能发现其中的奥妙：

```js
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
```

发现了吗？只要使用 `<Listen to={[LikeMachine]}/>` 对组件进行包裹，那么这个组件就拥有了监听状态变化的能力。没错，这其实还是 PUB/SUB 模式的一种，但是相对于 Redux 我们更好理解。因为，我们依旧在使用 ``setState API `` 。




