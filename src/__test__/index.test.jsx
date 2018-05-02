import React from 'react'
import ReactDOM from 'react-dom'
import { configure, mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { expect } from 'chai'
import { Provider, Controller, Listen } from '..'

configure({ adapter: new Adapter() })

const noop = () => {
  return new Promise(res => {
    setTimeout(() => {
      res()
    }, 5)
  })
}

describe('test for rectx', () => {
  class TestController extends Controller {
    state = {
      foo: 'bar',
      index: 0
    }

    up = () => {
      this.setState({
        index: 1
      })
    }

    upByFuntionStyle = () => {
      this.setState(state => ({ index: 3, foo: 'bar-by' }))
    }
  }

  const TestComponent = () => (
    <Provider>
      <Listen to={[TestController]}>
        {test => {
          return <div id="test-div">{test.state.foo}</div>
        }}
      </Listen>
    </Provider>
  )

  class TestClass extends React.Component {
    render() {
      return (
        <Provider>
          <Listen to={[TestController]}>
            {test => {
              return (
                <div id="test-div" onClick={() => test.up()}>
                  {test.state.index}
                </div>
              )
            }}
          </Listen>
        </Provider>
      )
    }
  }
  it('<Listen/> components must be wrapped in a <Provider/>', () => {
    try {
      const wrapper = mount(
        <Listen to={[TestController]}>
          {test => {
            return <div id="test-div">{test.state.foo}</div>
          }}
        </Listen>
      )
    } catch (e) {
      expect(e.message).equal('<Listen/> components must be wrapped in a <Provider/>')
    }
  })

  it('renders without crashing', () => {
    const wrapper = mount(<TestComponent />)
    const node = wrapper.find('#test-div')
    expect(node.getDOMNode().textContent).equal('bar')
  })

  it('mutate state after click (async) ', async () => {
    const wrapper = mount(<TestClass />)

    const node = wrapper.find('#test-div')
    expect(node.getDOMNode().textContent).equal('0')

    node.simulate('click')

    const check = () => {
      return new Promise(res => {
        setTimeout(() => {
          res(node.getDOMNode().textContent)
        }, 10)
      })
    }
    const text = await check()
    expect(text).equal('1')
    wrapper.unmount()
  })

  it('setState with function (change with immutable)', async () => {
    class Ctl extends Controller {
      state = {
        foo: 'bar',
        index: 0
      }
      upByFuntionStyle = () => {
        this.setState(draft => {
          draft.index = 3
          draft.foo = 'bar-by'
        })
      }
    }

    class SetStateFunction extends React.Component {
      render() {
        return (
          <Provider>
            <Listen to={[Ctl]}>
              {test => {
                return (
                  <div id="test-div" onClick={() => test.upByFuntionStyle()}>
                    {test.state.foo}
                    {test.state.index}
                  </div>
                )
              }}
            </Listen>
          </Provider>
        )
      }
    }

    const wrapper = mount(<SetStateFunction />)

    const node = wrapper.find('#test-div')
    expect(node.getDOMNode().textContent).equal('bar' + '0')

    node.simulate('click')

    const check = () => {
      return new Promise(res => {
        setTimeout(() => {
          res(node.getDOMNode().textContent)
        }, 10)
      })
    }
    const text = await check()
    expect(text).equal('bar-by' + '3')
  })

  it('Unmounted component cannot setState', async () => {
    let renderTimes = 0

    class Clr extends Controller {
      state = {
        foo: 'bar',
        index: 0
      }

      fetchMock = () => {
        setTimeout(() => {
          this.setState({
            index: 1,
            foo: 'bar-by'
          })
        }, 50)
      }
    }

    class Unmount extends React.Component {
      render() {
        renderTimes++
        return (
          <Provider>
            <Listen to={[Clr]}>
              {test => {
                return (
                  <div id="test-div" onClick={() => test.fetchMock()}>
                    {test.state.foo}
                    {test.state.index}
                  </div>
                )
              }}
            </Listen>
          </Provider>
        )
      }
    }

    const wrapper = mount(<Unmount />)

    expect(renderTimes).equal(1)
    const node = wrapper.find('#test-div')
    node.simulate('click')
    wrapper.unmount()
    const check = () => {
      return new Promise(res => {
        setTimeout(() => {
          res(renderTimes)
        }, 100)
      })
    }
    const times = await check()

    expect(renderTimes).equal(1)
  })

  it('will call `didMount` when <Listen/> mounted', async () => {
    let renderTimes = 0

    class Clr extends Controller {
      state = {
        foo: 'bar',
        index: 0
      }
    }

    class Unmount extends React.Component {
      ListenDidMount() {
        renderTimes++
      }

      render() {
        return (
          <Provider>
            <Listen to={[Clr]} didMount={this.ListenDidMount}>
              {test => {
                return (
                  <div id="test-div">
                    {test.state.foo}
                    {test.state.index}
                  </div>
                )
              }}
            </Listen>
          </Provider>
        )
      }
    }

    const wrapper = mount(<Unmount />)

    expect(renderTimes).equal(1)
  })
  

  it('will not update when controller state are not change', async () => {
    let renderTimes = 0
    let willUpdateRenderTimes = 0
    class Clr extends Controller {
      state = {
        foo: 'bar',
        index: 0
      }
    }
    class ListenWillNotUpdate extends React.Component {
      componentDidMount() {
        this.setState({})
      }
      render() {
        return (
          <div>
            <Listen to={[Clr]}>
              {test => {
                renderTimes++
                return <div id="test-div" />
              }}
            </Listen>
          </div>
        )
      }
    }

    const wrapper = mount(
      <Provider>
        <ListenWillNotUpdate />
      </Provider>
    )
    await noop()
    expect(renderTimes).equal(1)
  })

  it('nesting with ListenWillNotUpdate && ListenWillUpdate,', async () => {
    let renderTimes = 0
    let willUpdateRenderTimes = 0
    class Clr extends Controller {
      state = {
        foo: 'bar',
        index: 0
      }
    }

    class ListenWillUpdate extends React.Component {
      didMount = test => {
        test.setState({})
      }
      render() {
        return (
          <Listen to={[Clr]} didMount={this.didMount}>
            {test => {
              renderTimes++
              return <div id="test-div" />
            }}
          </Listen>
        )
      }
    }

    class ListenWillNotUpdate extends React.Component {
      componentDidMount() {
        // this.setState({})
      }
      render() {
        return (
          <Listen to={[Clr]}>
            {test => {
              renderTimes++
              return <div id="test-div" />
            }}
          </Listen>
        )
      }
    }

    const wrapper = mount(
      <Provider>
        <ListenWillNotUpdate />
        <ListenWillUpdate />
      </Provider>
    )
    await noop()
    expect(renderTimes).equal(4)
  })

  it('if controller is updating,Father update will be accept ,', async () => {
    let renderTimes = 0
    let willUpdateRenderTimes = 0
    class Clr extends Controller {
      state = {
        foo: 'bar',
        index: 0
      }
    }

    class ListenWillUpdate extends React.Component {
      didMount = test => {
        test.setState({})
      }
      render() {
        return (
          <Listen to={[Clr]} didMount={this.didMount}>
            {test => {
              renderTimes++
              return <div id="test-div" />
            }}
          </Listen>
        )
      }
    }

    class Father extends React.Component {
      componentDidMount() {
        //Father update will be accept when Clr change
        this.setState({})
      }
      render() {
        return (
          <Listen to={[Clr]}>
            {test => {
              renderTimes++
              return <div id="test-div" />
            }}
          </Listen>
        )
      }
    }

    const wrapper = mount(
      <Provider>
        <Father />
        <ListenWillUpdate />
      </Provider>
    )
    await noop()
    expect(renderTimes).equal(5)
  })
})
