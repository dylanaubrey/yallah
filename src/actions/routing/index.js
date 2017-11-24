// @flow

import type { ActionArgs } from '../../core/action';
import type { ObjectMap } from '../../core/types';

export const GO_BACK = 'ROUTING/GO_BACK';
export const GO_FORWARD = 'ROUTING/GO_FORWARD';
export const GO = 'ROUTING/GO';
export const ROUTE_CHANGE = 'ROUTING/ROUTE_CHANGE';
export const PUSH = 'ROUTING/PUSH';
export const REPLACE = 'ROUTING/REPLACE';

export const goBack = function goBack(): ActionArgs {
  return { type: GO_BACK };
};

export const goForward = function goForward(): ActionArgs {
  return { type: GO_FORWARD };
};

export const go = function go(index: number): ActionArgs {
  return { type: GO, payload: index };
};

export const routeChange = function routeChange(action: string): ActionArgs {
  return { type: ROUTE_CHANGE, payload: action };
};

export const push = function push(url: string, state: ObjectMap = {}): ActionArgs {
  return { type: GO, payload: { state, url } };
};

export const replace = function replace(url: string, state: ObjectMap = {}): ActionArgs {
  return { type: GO, payload: { state, url } };
};
