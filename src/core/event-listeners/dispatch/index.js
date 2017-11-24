// @flow

import type { Dispatch } from '../../containers/base';
import type { ListenerArgs } from '../../listener';

export default function dispatchListener(dispatch: Dispatch): ListenerArgs {
  return {
    callback: ({ detail: { action } }: CustomEvent): Promise<void> => dispatch(action),
    target: window,
    type: 'dispatch',
  };
}
