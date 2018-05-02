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

class Ctl1 extends Controller {
  state = {
    foo: 'bar'
  }
}

class Ctl2 extends Controller {
  state = {
    foo: 'Ctl2'
  }
}

it('multicomponent render without crash', () => {
  let foo = ''
  let foo2 = ''
  const wrapper = mount(
    <Provider>
      <Listen to={[Ctl1, Ctl2]}>
        {(c1, c2) => {
          foo = c1.state.foo
          foo2 = c2.state.foo
          return <div id="test-div">{c1.state.foo}</div>
        }}
      </Listen>
    </Provider>
  )
  expect(foo).equal('bar')
  expect(foo2).equal('Ctl2')
})

it('multicomponent render without crash', () => {
  let foo = ''
  let foo2 = ''
  const wrapper = mount(
    <Provider>
      <Listen to={[Ctl1, Ctl2]}>
        {(c1, c2) => {
          foo = c1.state.foo
          foo2 = c2.state.foo
          return <div id="test-div">{c1.state.foo}</div>
        }}
      </Listen>
    </Provider>
  )
  expect(foo).equal('bar')
  expect(foo2).equal('Ctl2')
})

it('multicomponent render without crash', async () => {
  let foo = ''
  let foo2 = ''
  let render = 0

  const m = (ctl1, Ctl2) => {
    ctl1.setState(draft => {
      draft.foo = 'hello'
    })
    Ctl2.setState(draft => {
      draft.foo = 'hello 2'
    })
  }

  const wrapper = mount(
    <Provider>
      <Listen to={[Ctl1, Ctl2]} didMount={m}>
        {(c1, c2) => {
          foo = c1.state.foo
          foo2 = c2.state.foo
          render++
          return <div id="test-div">{c1.state.foo}</div>
        }}
      </Listen>
    </Provider>
  )

  await noop()

  expect(foo).equal('hello')
  expect(foo2).equal('hello 2')
  expect(render).equal(3)
})
