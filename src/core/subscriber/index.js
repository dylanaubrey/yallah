// @flow

import { isFunction, isString } from 'lodash';
import Action from '../action';

export type SubscriberArgs = {
  callback: Function,
  name: string,
  type: string,
};

export default class Subscriber {
  _callback: Function;
  name: string;
  type: string;

  constructor({ callback, name, type }: SubscriberArgs = {}) {
    this._callback = callback;
    this.name = name;
    this.type = type;
  }

  async execute(action: Action): Promise<void> {
    await this._callback(action);
  }

  valid(): boolean {
    return isString(this.type) && isString(this.name) && isFunction(this._callback);
  }
}
