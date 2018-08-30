import * as React from 'react';

type GetFn<T> = (state: T) => React.ReactNode;
type PrevState<T> = (prevState: T) => T;

interface State<T> {
  Store: () => T;
  Ctx: (
    fn: GetFn<T> | {children: (state: T) => React.ReactNode}
  ) => React.ReactNode;
  Put: (nextState: T | PrevState<T>) => void;
  Auto: <S = any>(
    selector: (state: T) => S
  ) => (
    fn: GetFn<S> | {children: (state: S) => React.ReactNode}
  ) => React.ReactNode;
}

export function init<T = any>(initial: T = {}): State<T>;
