// @flow

import type { ActionArgs } from '../action';
import type { Context } from '../containers/base';
import type { SubscriberArgs } from '../subscriber';
import type { StateObj } from '../types';

export default class Module {
  _context: Context;
  _name: string;
  _state: StateObj;
  _subscribers: SubscriberArgs[] = [];

  constructor(name: string) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  get state(): StateObj {
    return this._state;
  }

  _resetState(): void {
    this._state = {};
  }

  _setState(obj: StateObj): void {
    this._state = obj;
  }

  appState(): StateObj {
    return this._context.getState();
  }

  async addSubscribers(): Promise<void> {
    await Promise.all(this._subscribers.map(subscriber => this._context.subscribe(subscriber)));
  }

  async dispatch(action: ActionArgs): Promise<void> {
    await this._context.dispatch(action);
  }

  getConfig(key: ?string): any {
    return this._context.getConfig(key);
  }

  resetState(): void {
    this._resetState();
  }

  setContext(context: Context): void {
    this._context = context;
  }

  setState(obj: StateObj): void {
    this._setState(obj);
  }

  subscribe(type: string, callback: Function): void {
    this._subscribers.push({ callback, name: this._name, type });
  }
}
