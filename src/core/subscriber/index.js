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
  _name: string;
  _type: string;

  constructor({ callback, name, type }: SubscriberArgs) {
    this._callback = callback;
    this._name = name;
    this._type = type;
  }

  get type(): string {
    return this._type;
  }

  async execute(action: Action): Promise<void> {
    await this._callback(action);
  }

  valid(): boolean {
    return isString(this._type) && isString(this._name) && isFunction(this._callback);
  }
}
