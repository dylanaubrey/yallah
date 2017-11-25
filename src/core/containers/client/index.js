// @flow

import { isPlainObject } from 'lodash';
import BaseContainer, { type ContainerArgs } from '../base';
import type { ListenerArgs } from '../../listener';
import EventListeners from '../../event-listeners';
import type { ConfigObj, StateObj } from '../../types';
import deepFreeze from '../../../helpers/deep-freeze';
import logger from '../../../logger';
import browserLifecycleListeners from '../../event-listeners/browser-lifecycle';
import dispatchListener from '../../event-listeners/dispatch';

let _this;

export default class ClientContainer extends BaseContainer {
  _eventListeners: EventListeners = new EventListeners();
  _serverConfig: ConfigObj = {};
  _serverState: StateObj = {};

  constructor(args: ?ContainerArgs) {
    const _args = args || {};
    const { newInstance = false } = _args;
    if (_this && !newInstance) return _this;
    super(_args);
    this._stageListeners();
    _this = this;
    return _this;
  }

  async _addListeners(): Promise<void> {
    await this._eventListeners.add();
  }

  async _removeListeners(): Promise<void> {
    await this._eventListeners.remove();
  }

  async _reset(): Promise<void> {
    await super._reset();
    await this._removeListeners();
  }

  async _setConfig(): Promise<void> {
    this._config = await deepFreeze(this._serverConfig);
  }

  async _setServerState(): Promise<void> {
    await Promise.all(Object.keys(this._modules).map(async (moduleName) => {
      const mod = this._modules[moduleName];
      if (this._serverState[moduleName]) await mod._setState(this._serverState[moduleName]);
    }));
  }

  _stageListeners(): void {
    this._eventListeners.stage([
      ...browserLifecycleListeners(this._dispatch),
      dispatchListener(this._dispatch),
    ]);
  }

  async _start(): Promise<void> {
    await super._start();
    await this._setConfig();
    await this._setServerState();
    await this._addListeners();
  }

  addConfig(serverConfig: ConfigObj): void {
    if (!isPlainObject(serverConfig)) {
      const error = 'Yallah::container::addConfig::The server config was invalid.';
      logger.error(error, { serverConfig });
      return;
    }

    this._serverConfig = serverConfig;
  }

  addServerState(serverState: StateObj): void {
    if (!isPlainObject(serverState)) {
      const error = 'Yallah::container::addServerState::The server state was invalid.';
      logger.error(error, { serverState });
      return;
    }

    this._serverState = serverState;
  }

  listen(args: ListenerArgs | ListenerArgs[]): void {
    this._eventListeners.stage(args);
  }
}
