// @flow

import { isString } from 'lodash';

export type ActionArgs = {
  error?: boolean,
  meta?: { [string]: any },
  payload?: mixed,
  type: string,
};

export default class Action {
  _error: boolean;
  _meta: { [string]: any };
  _payload: mixed;
  _type: string;

  constructor({
    error, meta, payload, type,
  }: ActionArgs = {}) {
    this._error = error || false;
    this._meta = meta || {};
    this._payload = payload || null;
    this._type = type;
  }

  get type(): string {
    return this._type;
  }

  valid(): boolean {
    return isString(this._type);
  }
}
