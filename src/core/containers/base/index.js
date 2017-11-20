import { castArray, isArray } from 'lodash';
import { start, stop } from '../../../actions/container';
import routing from '../../../modules/routing';
import logger from '../../../logger';
import Action from '../../action';
import Module from '../../module';
import Subscriber from '../../subscriber';

require('es6-promise').polyfill();

let _this;

/**
 *
 * The Yallah base app container
 */
export default class BaseContainer {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {BaseContainer}
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
    getConfig: this._getConfig,
    dispatch: this._dispatch,
    getState: this._getState,
    subscribe: this._subscribe,
  };

  /**
   *
   * @private
   * @type {Object}
   */
  _config = {};

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
   * @param {Array<string>} names
   * @return {void}
   */
  _addDefaultModules(names) {
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
   * @param {Module} mod
   * @return {void}
   */
  _addModule(mod) {
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
    await Promise.all(Object.keys(this._modules)
      .map(moduleName => this._modules[moduleName].addSubscribers()));
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

    await _this._distribute(action);
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

    await Promise.all(subscribers.map(subscriber => subscriber.execute(action)));
  }

  /**
   *
   * @private
   * @param {string} [key]
   * @return {any}
   */
  _getConfig(key) {
    if (!key) return _this._config;
    return _this._config[key];
  }

  /**
   *
   * @return {Object}
   */
  _getState() {
    if (!_this._started) {
      const info = 'Yallah::container::_getState::The application has not started.';
      logger.info(info);
      return undefined;
    }

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
  async _removeSubscribers() {
    this._subscribers = {};
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _reset() {
    await Promise.all([
      this._removeSubscribers(),
      this._resetConfig(),
      this._resetState(),
    ]);
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _resetConfig() {
    this._config = {};
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
  async _start() {
    await Promise.all([
      this._addSubscribers(),
    ]);
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
   * @param {Array<Module>|Module} mod
   * @return {void}
   */
  addModule(mod) {
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
    await this._dispatch(action);
  }

  /**
   *
   * @param {string} [key]
   * @return {any}
   */
  getConfig(key) {
    return this._getConfig(key);
  }

  /**
   *
   * @return {Object}
   */
  getState() {
    return this._getState();
  }

  /**
   *
   * @return {void}
   */
  async reset() {
    await this._reset();
  }

  /**
   *
   * @return {void}
   */
  async start() {
    this._started = true;
    await this._start();
    await this._dispatch(start());
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
