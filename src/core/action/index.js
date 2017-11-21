// @flow

import { isString } from 'lodash';

export type ActionArgs = {
  error?: boolean,
  meta?: { [string]: any },
  payload?: mixed,
  type: string,
};

export default class Action {
  error: boolean;
  meta: { [string]: any };
  payload: mixed;
  type: string;

  constructor({
    error, meta, payload, type,
  }: ActionArgs = {}) {
    this.error = error || false;
    this.meta = meta || {};
    this.payload = payload || null;
    this.type = type;
  }

  valid(): boolean {
    return isString(this.type);
  }
}
