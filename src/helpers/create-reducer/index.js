// @flow

import { cloneDeep } from 'lodash';
import deepFreeze from '../deep-freeze';
import type { StateObj } from '../../core/types';

export type Reducer = (StateObj, StateObj) => StateObj;

export default function createReducer(callback: Reducer): Reducer {
  return async (previousState, newState) => deepFreeze(await callback(
    previousState,
    cloneDeep(newState),
  ));
}
