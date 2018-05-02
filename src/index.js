import React from 'react'
import createReactContext from 'create-react-context'
import produce from 'immer'



const Context = createReactContext()
let ListenerID = 0

export class Controller {
  constructor() {
    this.state = {}
    this.setFaterState = []
    this.produce = produce
    this.isDirty = false
    this.map = new Map()
  }

  addListener = (setState, id) => {
    if (!this.map.get(id)) {
      this.map.set(id, true)
      this.setFaterState.push({ fn: setState, id: id })
    }
  }

  removeListener = id => {
    this.map.delete(id)
    this.setFaterState = this.setFaterState.filter(i => i.id !== id)
  }

  setState(partial, cb) {
    this.isDirty = true
    setImmediate(() => {
      let newState
      if (typeof partial === 'function') {
        newState = produce(this.state, partial)
      } else {
        newState = { ...this.state, ...partial }
      }

      this.state = newState

      let callback_length = this.setFaterState.length
      this.setFaterState.forEach(({ fn, id }) => {
        fn(this.state, () => {
          callback_length--
          if (callback_length <= 0) {
            this.isDirty = false
          }
          cb && cb(this.state)
        })
      })
      // no matter what `newState` is, we have to set state to original state
    })
  }
}

export class Listen extends React.Component {
  constructor(props) {
    ListenerID++
    super(props)
    this.id = ListenerID
    this.state = {}
    this.Machines = []
    this._isMounted = false
  }
  shouldComponentUpdate() {
    for (let i in this.Machines) {
      if (this.Machines[i].isDirty === true) {
        return true
      }
    }
    return false
  }

  componentWillUnmount() {
    this.Machines.forEach(m => {
      m.removeListener(this.id)
    })
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
    this.props.didMount && this.props.didMount.apply(null, this.Machines)
  }

  _noopUpdate = (state, cb) => {
    this.setState({}, cb)
  }

  createMachine = context => {
    if (context === void 666) {
      throw new Error('<Listen/> components must be wrapped in a <Provider/>')
    }

    const MachineConstructor = this.props.to

    let newMachines = MachineConstructor.map(Machine => {
      if (context.get(Machine)) {
        const instance = context.get(Machine)
        instance.addListener(this._noopUpdate.bind(this), this.id)
        return instance
      }

      let newInstance = new Machine()
      newInstance.addListener(this._noopUpdate.bind(this), this.id)
      context.set(Machine, newInstance)
      return newInstance
    })

    this.Machines = newMachines
    return this.Machines
  }

  render() {
    return (
      <Context.Consumer>{context => this.props.children.apply(null, this.createMachine(context))}</Context.Consumer>
    )
  }
}

export class Provider extends React.Component {
  render() {
    return (
      <Context.Consumer>
        {topState => {
          let childState = new Map(topState)
          return <Context.Provider value={childState}>{this.props.children}</Context.Provider>
        }}
      </Context.Consumer>
    )
  }
}
