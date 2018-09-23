import React from 'react';
import produce from 'immer';
import equal from 'fast-deep-equal';

class Wrapper extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !equal(this.props.data, nextProps.data);
  }
  render() {
    return this.props.fn(this.props.data);
  }
}

export function init(_store) {
  let store = _store;
  function createSubscribe() {
    const listener = [];
    return {
      listen: updator => listener.push(updator),
      unListen: l => listener.splice(listener.indexOf(l), 1),
      update: updator => {
        for (let i = 0; i < listener.length; i++) {
          listener[i](updator);
        }
        if (listener.length === 0) {
          if (typeof updator === 'function') {
            const newState = produce(store, draft => {
              updator(draft);
            });
            if (!equal(newState, store)) {
              store = newState;
            }
            return;
          }
        }
      },
    };
  }
  const {listen, unListen, update} = createSubscribe();

  class Provider extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = store;
    }

    reRender = updator => {
      if (typeof updator === 'function') {
        const newState = produce(this.state, draft => {
          updator(draft);
        });
        if (!equal(newState, this.state)) {
          this.setState(newState);
          store = newState;
        }
        return;
      }
    };
    componentWillUnmount() {
      unListen(this.reRender);
    }

    componentDidMount() {
      listen(this.reRender);
    }

    render() {
      return this.props.children(this.state);
    }
  }

  return {
    Store: () => store,
    Ctx: props => <Provider>{props.children}</Provider>,
    Put: update,
    Auto: selector => fn => (
      <Provider>{state => <Wrapper data={selector(state)} fn={fn} />}</Provider>
    ),
  };
}
