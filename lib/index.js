import React from 'react'

const Context = React.createContext()

export class Machine {
    constructor(setState) {
        this.state = {}
        this.setFaterState = setState
    }

    setState(partial, cb) {
        setImmediate(() => {
            if (typeof partial === 'function') {
                this.state = partial(this.state)
            } else {
                const newState = { ...this.state, ...partial }
                this.state = newState
            }

            this.setFaterState(this.state, cb)
        })
    }
}

export class Listen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
        this.Machines = []
        this._isMounted = false
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    componentDidMount() {
        this._isMounted = true
        this.props.didMount && this.props.didMount.apply(null, this.Machines)
    }

    _noopUpdate = (state, cb) => {
        if (this._isMounted) this.setState({}, cb)
    }

    createMachine = context => {
        if (context === void 666) {
            throw new Error('<Listen/> components must be wrapped in a <Provider/>')
        }

        const MachineConstructor = this.props.to

        let newMachines = MachineConstructor.map(Machine => {
            if (context.get(Machine)) {
                return context.get(Machine)
            }
            let newInstance = new Machine(this._noopUpdate)
            context.set(Machine, newInstance)
            return newInstance
        })

        this.Machines = newMachines
        return this.Machines
    }

    render() {
        return (
            <Context.Consumer>
                {context => this.props.children.apply(null, this.createMachine(context))}
            </Context.Consumer>
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
