// @flow

import { castArray } from 'lodash';
import Action, { type ActionArgs } from '../../action';
import Module from '../../module';
import Subscriber, { type SubscriberArgs } from '../../subscriber';
import type { ConfigObj, StateObj } from '../../types';
import { start, stop } from '../../../actions/container';
import routing from '../../../modules/routing';
import logger from '../../../logger';

require('es6-promise').polyfill();

export type GetConfig = (key: ?string) => any;
export type Dispatch = (args: ActionArgs) => Promise<void>;
export type GetState = () => StateObj;
export type Subscribe = (args: SubscriberArgs) => Promise<void>;

export type Context = {
  dispatch: Dispatch,
  getConfig: GetConfig,
  getState: GetState,
  subscribe: Subscribe,
};

export type ContainerArgs = {
  defaultModuleNames?: string[],
  newInstance?: boolean,
};

export default class BaseContainer {
  _config: ConfigObj = {};

  _context: Context = {
    getConfig: this._getConfig.bind(this),
    dispatch: this._dispatch.bind(this),
    getState: this._getState.bind(this),
    subscribe: this._subscribe.bind(this),
  };

  _defaultModules: { [string]: Module } = { routing };
  _modules: { [string]: Module } = {};
  _started: boolean = false;
  _subscribers: { [string]: Subscriber[] } = {};

  constructor({ defaultModuleNames }: ContainerArgs) {
    this._addDefaultModules(defaultModuleNames);
  }

  _addDefaultModules(names: ?string[]): void {
    const _names = names || Object.keys(this._defaultModules);

    _names.forEach((name) => {
      const defaultModule = this._defaultModules[name];

      if (!defaultModule) {
        const error = 'Yallah::container::_addDefaultModules::The default module name was invalid.';
        logger.error(error, { name });
        return;
      }

      this._addModule(defaultModule);
    });
  }

  _addModule(mod: Module): void {
    if (!(mod instanceof Module)) {
      logger.error('Yallah::container::_addModule::The module was invalid.', { module: mod });
      return;
    }

    mod.setContext(this._context);
    this._modules[mod.name] = mod;
  }

  async _addSubscribers(): Promise<void> {
    await Promise.all(Object.keys(this._modules)
      .map(moduleName => this._modules[moduleName].addSubscribers()));
  }

  async _dispatch(args: ActionArgs): Promise<void> {
    if (!this._started) {
      logger.info('Yallah::container::_dispatch::The application has not started.', { args });
      return;
    }

    const action = new Action(args);

    if (!action.valid()) {
      logger.error('Yallah::container::_dispatch::The action was invalid.', { action });
      return;
    }

    await this._distribute(action);
  }

  async _distribute(action: Action): Promise<void> {
    const subscribers = this._subscribers[action.type];
    if (!subscribers) return;
    await Promise.all(subscribers.map(subscriber => subscriber.execute(action)));
  }

  _getConfig(key: ?string): any {
    if (!key) return this._config;
    return this._config[key];
  }

  _getState(): StateObj {
    const state: StateObj = {};

    if (!this._started) {
      const info = 'Yallah::container::_getState::The application has not started.';
      logger.info(info);
      return state;
    }

    Object.keys(this._modules).forEach((name) => {
      state[name] = this._modules[name].state;
    });

    return state;
  }

  async _removeSubscribers(): Promise<void> {
    this._subscribers = {};
  }

  async _reset(): Promise<void> {
    await Promise.all([
      this._removeSubscribers(),
      this._resetConfig(),
      this._resetState(),
    ]);
  }

  async _resetConfig(): Promise<void> {
    this._config = {};
  }

  async _resetState(): Promise<void> {
    Object.keys(this._modules).forEach((moduleName) => {
      const mod = this._modules[moduleName];
      mod.resetState();
    });
  }

  async _start(): Promise<void> {
    await this._addSubscribers();
  }

  async _subscribe(args: SubscriberArgs): Promise<void> {
    if (!this._started) {
      logger.info('Yallah::container::_subscribe::The application has not started.', { args });
      return;
    }

    const subscriber = new Subscriber(args);

    if (!subscriber.valid()) {
      logger.error('Yallah::container::_subscribe::The subscriber was invalid.', { subscriber });
      return;
    }

    const subscribers = this._subscribers[subscriber.type] || [];
    subscribers.push(subscriber);
    this._subscribers[subscriber.type] = subscribers;
  }

  addModule(mod: Module | Module[]): void {
    const mods = castArray(mod);

    mods.forEach((value) => {
      this._addModule(value);
    });
  }

  async dispatch(action: ActionArgs): Promise<void> {
    await this._dispatch(action);
  }

  getConfig(key?: string): ConfigObj {
    return this._getConfig(key);
  }

  getState(): StateObj {
    return this._getState();
  }

  async reset(): Promise<void> {
    await this._reset();
  }

  async start(): Promise<void> {
    this._started = true;
    await this._start();
    await this._dispatch(start());
  }

  async stop(): Promise<void> {
    await this._dispatch(stop());
    this._started = false;
  }
}
