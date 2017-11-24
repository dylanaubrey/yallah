// @flow

import { isString } from 'lodash';
import type { ObjectMap } from '../types';

export type ActionArgs = {
  error?: boolean,
  meta?: ObjectMap,
  payload?: any,
  type: string,
};

export default class Action {
  _error: ?boolean;
  _meta: ?ObjectMap;
  _payload: any;
  _type: string;

  constructor({
    error = false, meta = {}, payload = null, type,
  }: ActionArgs) {
    this._error = error;
    this._meta = meta;
    this._payload = payload;
    this._type = type;
  }

  get type(): string {
    return this._type;
  }

  valid(): boolean {
    return isString(this._type);
  }
}
