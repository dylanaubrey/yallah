import { castArray, isPlainObject } from 'lodash';
import { start } from '../../actions/container';
import addBrowserLifecycleEventListeners from '../../event-listeners/browser-lifecycle';
import routing from '../../modules/routing';
import logger from '../../logger';
import Action from '../action';
import Listener from '../listener';
import Module from '../module';
import Subscriber from '../subscriber';

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
    this._defaultModuleNames = defaultModuleNames;
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
  _eventListeners = [];

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
   * @param {Module} mod
   * @return {void}
   */
  _addModule(mod) {
    if (!(mod instanceof Module)) {
      logger.error('Yallah::_addModule::The module was invalid.');
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
  _addBrowserLifecycleEventListeners() {
    addBrowserLifecycleEventListeners(this._dispatch);
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _addDefaultModules() {
    this._defaultModuleNames.forEach((name) => {
      const defaultModule = this._defaultModules[name];

      if (!defaultModule) {
        logger.error('Yallah::_addDefaultModules::The default module name was invalid.');
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
  _addDispatchEventListener() {
    window.addEventListener('dispatch', ({ action }) => {
      this._dispatch(action);
    });
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _addEventListeners() {
    if (!process.env.WEB_ENV) return;
    this._addBrowserLifecycleEventListeners();
    this._addDispatchEventListener();

    this._eventListeners.forEach(({ target, type, callback }) => {
      target.addEventListener(type, (e) => {
        callback(e);
      });
    });
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
  async _dispatch({ error, meta, payload, type }) {
    if (!_this._started) {
      logger.info('Yallah::_dispatch::The application has not started.');
      return;
    }

    const action = new Action({ error, meta, payload, type });

    if (!action.valid()) {
      logger.error('Yallah::_dispatch::The action was invalid.');
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
      logger.info('Yallah::_getState::The application has not started.');
      return undefined;
    }

    if (moduleName) return _this._modules[moduleName];
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
  async _setInitialState() {
    Object.keys(this._initialState).forEach((moduleName) => {
      if (!this._modules[moduleName]) return;
      const mod = this._modules[moduleName];
      mod.setState(this._initialState[moduleName]);
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
  _subscribe({ callback, name, type }) {
    if (!_this._started) {
      logger.info('Yallah::_subscribe::The application has not started.');
      return;
    }

    const subscriber = new Subscriber({ callback, name, type });

    if (!subscriber.valid()) {
      logger.error('Yallah::_subscribe::The subscriber was invalid.');
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
  addEventListener(target, type, callback) {
    if (!this._started) {
      logger.info('Yallah::addEventListener::The application has not started.');
      return;
    }

    const listener = new Listener({ callback, target, type });

    if (!listener.valid()) {
      logger.error('Yallah::addEventListener::The listener was invalid.');
      return;
    }

    this._eventListeners.push(listener);
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
  reset() {

  }

  /**
   *
   * @param {Object} initialState
   * @return {void}
   */
  setInitialState(initialState) {
    if (!isPlainObject(initialState)) {
      logger.error('Yallah::setInitialState::The initial state was invalid.');
      return;
    }

    this._initialState = initialState;
  }

  /**
   *
   * @return {void}
   */
  async start() {
    await Promise.all([
      this._addDefaultModules(),
      this._addEventListeners(),
      this._addSubscribers(),
      this._setInitialState(),
    ]);

    this._started = true;
    this._dispatch(start());
  }

  /**
   *
   * @return {void}
   */
  stop() {

  }
}
