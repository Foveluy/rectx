import React from 'react';
import ReactDOM from 'react-dom';
import {configure, mount, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {expect} from 'chai';
import {init} from '..';

configure({adapter: new Adapter()});

describe('test for rectx', () => {
  const {Put, Ctx} = init({
    value: 1,
    dummy: 1,
  });

  const TestComponent = () => Ctx(s => <div id="test-div">{s.value}</div>);

  it('renders without crashing', () => {
    const wrapper = mount(<TestComponent />);
    const node = wrapper.find('#test-div');
    expect(node.getDOMNode().textContent).equal('1');
  });

  it('should mutate when calling `Put`', async () => {
    const wrapper = mount(<TestComponent />);
    const node = wrapper.find('#test-div');
    expect(node.getDOMNode().textContent).equal('1');

    Put({value: 2});

    expect(node.getDOMNode().textContent).equal('2');
  });

  it('should mutate when use `mutatable api`', async () => {
    const wrapper = mount(<TestComponent />);
    const node = wrapper.find('#test-div');
    expect(node.getDOMNode().textContent).equal('1');

    Put(s => (s.value = 2));

    expect(node.getDOMNode().textContent).equal('2');
  });

  it('should unListen when component is unmounted && without getting wrong', async () => {
    const wrapper = mount(<TestComponent />);
    const node = wrapper.find('#test-div');
    expect(node.getDOMNode().textContent).equal('1');

    wrapper.unmount();
    Put(s => (s.value = 2));

    Ctx(s => {
      expect(s.value).equal('2');
    });
  });

  test('`Ctx` can be a render-props funtion', async () => {
    const App = () => (
      <Ctx>{s => <div id="test-div-render-props">{s.value}</div>}</Ctx>
    );

    const wrapper = mount(<App />);
    const node = wrapper.find('#test-div-render-props');
    expect(node.getDOMNode().textContent).equal('1');

    Put(s => (s.value = 2));

    expect(node.getDOMNode().textContent).equal('2');
  });

  test('auto should component update 1', async () => {
    let renderTimes = 0;
    const Dummy = ({data}) => {
      renderTimes = renderTimes + 1;
      return <div id="dummy">{data}</div>;
    };

    const App = () => (
      <div>
        <div>
          <Ctx>{s => <Dummy data={s.dummy} />}</Ctx>
        </div>
        <Ctx>{s => <div id="test-div-render-props">{s.value}</div>}</Ctx>
      </div>
    );

    const wrapper = mount(<App />);
    const node = wrapper.find('#test-div-render-props');
    expect(node.getDOMNode().textContent).equal('1');
    expect(renderTimes).equal(1);

    Put(s => (s.value = 2));

    expect(renderTimes).equal(1);
    expect(node.getDOMNode().textContent).equal('2');
  });

  // it('renders without crashing', () => {
  //   const wrapper = mount(<TestComponent />);
  //   const node = wrapper.find('#test-div');
  //   expect(node.getDOMNode().textContent).equal('bar');
  // });

  // it('mutate state after click (async) ', async () => {
  //   const wrapper = mount(<TestClass />);

  //   const node = wrapper.find('#test-div');
  //   expect(node.getDOMNode().textContent).equal('0');

  //   node.simulate('click');

  //   const check = () => {
  //     return new Promise(res => {
  //       setTimeout(() => {
  //         res(node.getDOMNode().textContent);
  //       }, 10);
  //     });
  //   };
  //   const text = await check();
  //   expect(text).equal('1');
  //   wrapper.unmount();
  // });

  // it('setState with function (change with immutable)', async () => {
  //   class Ctl extends Controller {
  //     state = {
  //       foo: 'bar',
  //       index: 0,
  //     };
  //     upByFuntionStyle = () => {
  //       this.setState(draft => {
  //         draft.index = 3;
  //         draft.foo = 'bar-by';
  //       });
  //     };
  //   }

  //   class SetStateFunction extends React.Component {
  //     render() {
  //       return (
  //         <Provider>
  //           <Listen to={[Ctl]}>
  //             {test => {
  //               return (
  //                 <div id="test-div" onClick={() => test.upByFuntionStyle()}>
  //                   {test.state.foo}
  //                   {test.state.index}
  //                 </div>
  //               );
  //             }}
  //           </Listen>
  //         </Provider>
  //       );
  //     }
  //   }

  //   const wrapper = mount(<SetStateFunction />);

  //   const node = wrapper.find('#test-div');
  //   expect(node.getDOMNode().textContent).equal('bar' + '0');

  //   node.simulate('click');

  //   const check = () => {
  //     return new Promise(res => {
  //       setTimeout(() => {
  //         res(node.getDOMNode().textContent);
  //       }, 10);
  //     });
  //   };
  //   const text = await check();
  //   expect(text).equal('bar-by' + '3');
  // });

  // it('Unmounted component cannot setState', async () => {
  //   let renderTimes = 0;

  //   class Clr extends Controller {
  //     state = {
  //       foo: 'bar',
  //       index: 0,
  //     };

  //     fetchMock = () => {
  //       setTimeout(() => {
  //         this.setState({
  //           index: 1,
  //           foo: 'bar-by',
  //         });
  //       }, 50);
  //     };
  //   }

  //   class Unmount extends React.Component {
  //     render() {
  //       renderTimes++;
  //       return (
  //         <Provider>
  //           <Listen to={[Clr]}>
  //             {test => {
  //               return (
  //                 <div id="test-div" onClick={() => test.fetchMock()}>
  //                   {test.state.foo}
  //                   {test.state.index}
  //                 </div>
  //               );
  //             }}
  //           </Listen>
  //         </Provider>
  //       );
  //     }
  //   }

  //   const wrapper = mount(<Unmount />);

  //   expect(renderTimes).equal(1);
  //   const node = wrapper.find('#test-div');
  //   node.simulate('click');
  //   wrapper.unmount();
  //   const check = () => {
  //     return new Promise(res => {
  //       setTimeout(() => {
  //         res(renderTimes);
  //       }, 100);
  //     });
  //   };
  //   const times = await check();

  //   expect(renderTimes).equal(1);
  // });

  // it('will call `didMount` when <Listen/> mounted', async () => {
  //   let renderTimes = 0;

  //   class Clr extends Controller {
  //     state = {
  //       foo: 'bar',
  //       index: 0,
  //     };
  //   }

  //   class Unmount extends React.Component {
  //     ListenDidMount() {
  //       renderTimes++;
  //     }

  //     render() {
  //       return (
  //         <Provider>
  //           <Listen to={[Clr]} didMount={this.ListenDidMount}>
  //             {test => {
  //               return (
  //                 <div id="test-div">
  //                   {test.state.foo}
  //                   {test.state.index}
  //                 </div>
  //               );
  //             }}
  //           </Listen>
  //         </Provider>
  //       );
  //     }
  //   }

  //   const wrapper = mount(<Unmount />);

  //   expect(renderTimes).equal(1);
  // });

  // it('will update when controller state are not change', async () => {
  //   let renderTimes = 0;
  //   let willUpdateRenderTimes = 0;
  //   class Clr extends Controller {
  //     state = {
  //       foo: 'bar',
  //       index: 0,
  //     };
  //   }
  //   class ListenWillNotUpdate extends React.Component {
  //     componentDidMount() {
  //       this.setState({});
  //     }
  //     render() {
  //       return (
  //         <div>
  //           <Listen to={[Clr]}>
  //             {test => {
  //               renderTimes++;
  //               return <div id="test-div" />;
  //             }}
  //           </Listen>
  //         </div>
  //       );
  //     }
  //   }

  //   const wrapper = mount(
  //     <Provider>
  //       <ListenWillNotUpdate />
  //     </Provider>
  //   );
  //   await noop();
  //   expect(renderTimes).equal(2);
  // });

  // it('nesting with ListenWillNotUpdate && ListenWillUpdate,', async () => {
  //   let renderTimes = 0;
  //   let willUpdateRenderTimes = 0;
  //   class Clr extends Controller {
  //     state = {
  //       foo: 'bar',
  //       index: 0,
  //     };
  //   }

  //   class ListenWillUpdate extends React.Component {
  //     didMount = test => {
  //       test.setState({});
  //     };
  //     render() {
  //       return (
  //         <Listen to={[Clr]} didMount={this.didMount}>
  //           {test => {
  //             renderTimes++;
  //             return <div id="test-div" />;
  //           }}
  //         </Listen>
  //       );
  //     }
  //   }

  //   class ListenWillNotUpdate extends React.Component {
  //     componentDidMount() {
  //       // this.setState({})
  //     }
  //     render() {
  //       return (
  //         <Listen to={[Clr]}>
  //           {test => {
  //             renderTimes++;
  //             return <div id="test-div" />;
  //           }}
  //         </Listen>
  //       );
  //     }
  //   }

  //   const wrapper = mount(
  //     <Provider>
  //       <ListenWillNotUpdate />
  //       <ListenWillUpdate />
  //     </Provider>
  //   );
  //   await noop();
  //   expect(renderTimes).equal(4);
  // });

  // it('if controller is updating,Father update will be accept ,', async () => {
  //   let renderTimes = 0;
  //   let willUpdateRenderTimes = 0;
  //   class Clr extends Controller {
  //     state = {
  //       foo: 'bar',
  //       index: 0,
  //     };
  //   }

  //   class ListenWillUpdate extends React.Component {
  //     didMount = test => {
  //       test.setState({});
  //     };
  //     render() {
  //       return (
  //         <Listen to={[Clr]} didMount={this.didMount}>
  //           {test => {
  //             renderTimes++;
  //             return <div id="test-div" />;
  //           }}
  //         </Listen>
  //       );
  //     }
  //   }

  //   class Father extends React.Component {
  //     componentDidMount() {
  //       //Father update will be accept when Clr change
  //       this.setState({});
  //     }
  //     render() {
  //       return (
  //         <Listen to={[Clr]}>
  //           {test => {
  //             renderTimes++;
  //             return <div id="test-div" />;
  //           }}
  //         </Listen>
  //       );
  //     }
  //   }

  //   const wrapper = mount(
  //     <Provider>
  //       <Father />
  //       <ListenWillUpdate />
  //     </Provider>
  //   );
  //   await noop();
  //   expect(renderTimes).equal(5);
  // });
});
