// @flow

import { isFunction, isString } from 'lodash';

export type ListenerArgs = {
  callback: Function,
  target: EventTarget,
  type: string,
};

export default class Listener {
  _callback: Function;
  _target: EventTarget;
  _type: string;

  constructor({ callback, target, type }: ListenerArgs = {}) {
    this._callback = callback;
    this._target = target;
    this._type = type;
  }

  get callback(): Function {
    return this._callback;
  }

  get target(): EventTarget {
    return this._target;
  }

  get type(): string {
    return this._type;
  }

  valid(): boolean {
    return isFunction(this._target.addEventListener) && isString(this._type)
      && isFunction(this._callback);
  }
}
