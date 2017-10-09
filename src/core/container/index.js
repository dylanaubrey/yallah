import { castArray, isArray, isPlainObject } from 'lodash';
import { start, stop } from '../../actions/container';

import {
  addBrowserLifecycleEventListeners,
  removeBrowserLifecycleEventListeners,
} from '../../event-listeners/browser-lifecycle';

import {
  addDispatchEventListener,
  removeDispatchEventListener,
} from '../../event-listeners/dispatch';

import routing from '../../modules/routing';
import logger from '../../logger';
import Action from '../action';
import Listener from '../listener';
import Module from '../module';
import Subscriber from '../subscriber';

require('es6-promise').polyfill();

let _this;

/**
 *
 * The Yallah app container
 */
export default class Yallah {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {Yallah}
   */
  constructor({
    /**
     * Optional list of default modules
     * to initialise in the state tree.
     *
     * @type {Array<string>}
     */
    defaultModuleNames = ['routing'],
    /**
     * Whether to create a new instance of a
     * client or return the existing instance.
     *
     * @type {boolean}
     */
    newInstance = false,
  } = {}) {
    if (_this && !newInstance) return _this;
    this._addDefaultModules(defaultModuleNames);
    _this = this;
    return _this;
  }

  /**
   *
   * @private
   * @type {Object}
   */
  _context = {
    dispatch: this._dispatch,
    getState: this._getState,
    subscribe: this._subscribe,
  };

  /**
   *
   * @private
   * @type {Array<string>}
   */
  _defaultModuleNames;

  /**
   *
   * @private
   * @type {Array<Class>}
   */
  _defaultModules = { routing };

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
  _initialState = {};

  /**
   *
   * @private
   * @type {Object}
   */
  _modules = {};

  /**
   *
   * @private
   * @type {boolean}
   */
  _started = false;

  /**
   *
   * @private
   * @type {Object}
   */
  _subscribers = {};

  /**
   *
   * @private
   * @return {void}
   */
  async _addBrowserLifecycleEventListeners() {
    addBrowserLifecycleEventListeners(this._dispatch);
  }

  /**
   *
   * @private
   * @param {Array<string>} names
   * @return {void}
   */
  async _addDefaultModules(names) {
    if (!isArray(names)) {
      const error = 'Yallah::container::_addDefaultModules::The default module names were invalid.';
      logger.error(error, { names });
      return;
    }

    names.forEach((name) => {
      const defaultModule = this._defaultModules[name];

      if (!defaultModule) {
        const error = 'Yallah::container::_addDefaultModules::The default module name was invalid.';
        logger.error(error, { name });
        return;
      }

      this._addModule(defaultModule);
    });
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _addDispatchEventListener() {
    addDispatchEventListener(this._dispatch);
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _addListeners() {
    if (!process.env.WEB_ENV) return;
    this._addBrowserLifecycleEventListeners();
    this._addDispatchEventListener();

    this._listeners.forEach(({ target, type, callback }) => {
      target.addEventListener(type, (e) => {
        callback(e);
      });
    });
  }

  /**
   *
   * @private
   * @param {Module} mod
   * @return {void}
   */
  async _addModule(mod) {
    if (!(mod instanceof Module)) {
      logger.error('Yallah::container::_addModule::The module was invalid.', { module: mod });
      return;
    }

    mod.setContext(this._context);
    this._modules[mod.name] = mod;
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _addSubscribers() {
    Object.keys(this._modules).forEach((moduleName) => {
      this._modules[moduleName].addSubscribers();
    });
  }

  /**
   *
   * @private
   * @param {Object} args
   * @param {Object} args.error
   * @param {Object} args.meta
   * @param {Object} args.payload
   * @param {Object} args.type
   * @return {void}
   */
  async _dispatch(args) {
    if (!_this._started) {
      logger.info('Yallah::container::_dispatch::The application has not started.', { args });
      return;
    }

    const action = new Action(args);

    if (!action.valid()) {
      logger.error('Yallah::container::_dispatch::The action was invalid.', { action });
      return;
    }

    _this._distribute(action);
  }

  /**
   *
   * @private
   * @param {Action} action
   * @return {void}
   */
  async _distribute(action) {
    const subscribers = this._subscribers[action.type];
    if (!subscribers) return;

    subscribers.forEach((subscriber) => {
      subscriber.execute(action);
    });
  }

  /**
   *
   * @param {string} [moduleName]
   * @return {Object}
   */
  _getState(moduleName) {
    if (!_this._started) {
      const info = 'Yallah::container::_getState::The application has not started.';
      logger.info(info, { args: moduleName });
      return undefined;
    }

    if (moduleName) return _this._modules[moduleName].state;
    const state = {};

    Object.keys(_this._modules).forEach((name) => {
      state[name] = _this._modules[name].state;
    });

    return state;
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _removeBrowserLifecycleEventListeners() {
    removeBrowserLifecycleEventListeners(this._dispatch);
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _removeDispatchEventListener() {
    removeDispatchEventListener(this._dispatch);
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _removeListeners() {
    if (!process.env.WEB_ENV) return;
    this._removeBrowserLifecycleEventListeners();
    this._removeDispatchEventListener();

    this._listeners.forEach(({ target, type, callback }) => {
      target.removeEventListener(type, (e) => {
        callback(e);
      });
    });
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _resetState() {
    Object.keys(this._modules).forEach((moduleName) => {
      const mod = this._modules[moduleName];
      mod.resetState();
    });
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _removeSubscribers() {
    this._subscribers = {};
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _setInitialState() {
    Object.keys(this._modules).forEach((moduleName) => {
      const mod = this._modules[moduleName];
      if (this._initialState[moduleName]) mod._setState(this._initialState[moduleName]);
    });
  }

  /**
   *
   * @private
   * @param {Object} args
   * @param {Function} args.callback
   * @param {string} args.name
   * @param {string} args.type
   * @return {void}
   */
  async _subscribe(args) {
    if (!_this._started) {
      logger.info('Yallah::container::_subscribe::The application has not started.', { args });
      return;
    }

    const subscriber = new Subscriber(args);

    if (!subscriber.valid()) {
      logger.error('Yallah::container::_subscribe::The subscriber was invalid.', { subscriber });
      return;
    }

    const subscribers = _this._subscribers[subscriber.type] || [];
    subscribers.push(subscriber);
    _this._subscribers[subscriber.type] = subscribers;
  }

  /**
   *
   * @param {EventTarget} target
   * @param {string} type
   * @param {Function} callback
   * @return {void}
   */
  async listen(target, type, callback) {
    const listener = new Listener({ callback, target, type });

    if (!listener.valid()) {
      const error = 'Yallah::container::listen::The listener was invalid.';
      logger.error(error, { args: { target, type, callback } });
      return;
    }

    this._listeners.push(listener);
  }

  /**
   *
   * @param {Array<Module>|Module} mod
   * @return {void}
   */
  async addModule(mod) {
    const mods = castArray(mod);

    mods.forEach((value) => {
      this._addModule(value);
    });
  }

  /**
   *
   * @param {Object} action
   * @return {void}
   */
  async dispatch(action) {
    this._dispatch(action);
  }

  /**
   *
   * @param {string} [moduleName]
   * @return {Object}
   */
  getState(moduleName) {
    return this._getState(moduleName);
  }

  /**
   *
   * @return {void}
   */
  async reset() {
    this._removeListeners();
    this._removeSubscribers();
    this._resetState();
  }

  /**
   *
   * @param {Object} initialState
   * @return {void}
   */
  async setInitialState(initialState) {
    if (!isPlainObject(initialState)) {
      const error = 'Yallah::container::setInitialState::The initial state was invalid.';
      logger.error(error, { initialState });
      return;
    }

    this._initialState = initialState;
  }

  /**
   *
   * @return {void}
   */
  async start() {
    this._started = true;

    await Promise.all([
      this._addListeners(),
      this._addSubscribers(),
      this._setInitialState(),
    ]);

    this._dispatch(start());
  }

  /**
   *
   * @return {void}
   */
  async stop() {
    await this._dispatch(stop());
    this._started = false;
  }
}
