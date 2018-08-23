import React from 'react';
import produce from 'immer';
import equal from 'fast-deep-equal';

function createSubscribe() {
  const listener = [];

  const listen = updator => {
    listener.push(updator);
  };

  const unListen = l => {
    listener.splice(listener.indexOf(l), 1);
  };

  const update = updator => {
    for (let i = 0; i < listener.length; i++) {
      listener[i](updator);
    }
  };
  return {listen, unListen, update};
}

export function init(store) {
  const {listen, unListen, update} = createSubscribe();

  class Provider extends React.PureComponent {
    state = store;

    reRender = updator => {
      if (typeof updator === 'function') {
        const newState = produce(this.state, draft => {
          updator(draft);
        });
        if (!equal(newState, this.state)) {
          this.setState(newState);
        }
        return;
      }

      if (!equal(updator, this.state)) {
        this.setState(updator);
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
    Ctx: props => {
      if (typeof props !== 'function') {
        return <Provider>{props.children}</Provider>;
      }
      return <Provider>{props}</Provider>;
    },
    Put: update,
  };
}
