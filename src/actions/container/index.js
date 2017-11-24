// @flow

import type { ActionArgs } from '../../core/action';

export const START = 'CONTAINER/START';
export const STOP = 'CONTAINER/STOP';

export const start = function start(): ActionArgs {
  return { type: START };
};

export const stop = function stop(): ActionArgs {
  return { type: STOP };
};
