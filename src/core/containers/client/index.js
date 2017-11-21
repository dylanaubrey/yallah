import { isPlainObject } from 'lodash';
import BaseContainer from '../base';
import Listener from '../../listener';
import { deepFreeze } from '../../../helpers';

import {
  addBrowserLifecycleEventListeners,
  removeBrowserLifecycleEventListeners,
} from '../../../event-listeners/browser-lifecycle';

import {
  addDispatchEventListener,
  removeDispatchEventListener,
} from '../../../event-listeners/dispatch';

import logger from '../../../logger';

let _this;

/**
 *
 * The Yallah client-side app container
 */
export default class ClientContainer extends BaseContainer {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {ClientContainer}
   */
  constructor(config) {
    _this = super(config);
    return _this;
  }

  /**
   *
   * @private
   * @type {Array<Listener>}
   */
  _listeners = [];

  /**
   *
   * @private
   * @type {Object}
   */
  _serverState = {};

  /**
   *
   * @private
   * @type {Object}
   */
  _serverConfig = {};

  /**
   *
   * @private
   * @return {void}
   */
  async _addBrowserLifecycleEventListeners() {
    await addBrowserLifecycleEventListeners(this._dispatch);
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _addDispatchEventListener() {
    await addDispatchEventListener(this._dispatch);
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _addListeners() {
    await this._addBrowserLifecycleEventListeners();
    await this._addDispatchEventListener();

    this._listeners.forEach(({ target, type, callback }) => {
      target.addEventListener(type, callback);
    });
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _removeBrowserLifecycleEventListeners() {
    await removeBrowserLifecycleEventListeners(this._dispatch);
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _removeDispatchEventListener() {
    await removeDispatchEventListener(this._dispatch);
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _removeListeners() {
    // NOTE: Event listeners will not unbind unless function
    // passed into it is the same, which currently it is not.
    await this._removeBrowserLifecycleEventListeners();
    await this._removeDispatchEventListener();

    this._listeners.forEach(({ target, type, callback }) => {
      target.removeEventListener(type, callback);
    });
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _reset() {
    await super._reset();
    await this._removeListeners();
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _setConfig() {
    this._config = await deepFreeze(this._serverConfig);
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _setServerState() {
    await Promise.all(Object.keys(this._modules).map(async (moduleName) => {
      const mod = this._modules[moduleName];
      if (this._serverState[moduleName]) await mod._setState(this._serverState[moduleName]);
    }));
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _start() {
    await super._start();
    await this._setConfig();
    await this._setServerState();
    await this._addListeners();
  }

  /**
   *
   * @param {Object} serverConfig
   * @return {void}
   */
  addConfig(serverConfig) {
    if (!isPlainObject(serverConfig)) {
      const error = 'Yallah::container::setConfig::The server config was invalid.';
      logger.error(error, { serverConfig });
      return;
    }

    this._serverConfig = serverConfig;
  }

  /**
   *
   * @param {Object} serverState
   * @return {void}
   */
  addServerState(serverState) {
    if (!isPlainObject(serverState)) {
      const error = 'Yallah::container::addServerState::The server state was invalid.';
      logger.error(error, { serverState });
      return;
    }

    this._serverState = serverState;
  }

  /**
   *
   * @param {EventTarget} target
   * @param {string} type
   * @param {Function} callback
   * @return {void}
   */
  listen(target, type, callback) {
    const listener = new Listener({ callback, target, type });

    if (!listener.valid()) {
      const error = 'Yallah::container::listen::The listener was invalid.';
      logger.error(error, { args: { target, type, callback } });
      return;
    }

    this._listeners.push(listener);
  }
}
