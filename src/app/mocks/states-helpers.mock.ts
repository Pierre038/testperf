import { StateContext } from '@ngxs/store';

export function createMockStateContexte<T>(): StateContext<T> {
  return {
    dispatch: jest.fn().mockName('stateContext.dispatch'),
    getState: jest.fn().mockName('stateContext.getState'),
    patchState: jest.fn().mockName('stateContext.patchState'),
    setState: jest.fn().mockName('stateContext.setState'),
  };
}
