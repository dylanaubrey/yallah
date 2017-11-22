// @flow

import { type ListenerArgs } from '../../listener';

export default function dispatchListener(dispatch: Function): ListenerArgs {
  return {
    callback: ({ detail: { action } }: CustomEvent) => dispatch(action),
    target: window,
    type: 'dispatch',
  };
}
