import { castArray, isFunction, isPlainObject, isString } from 'lodash';
import Action from './action';
import Branch from './branch';
import addBrowserLifecycleEventListeners from './event-listeners/browser-lifecycle';
import logger from './logger';
import Subscriber from './subscriber';

let instance;

/**
 *
 * The Yallah app state tree
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
     * Optionally add browser lifecycle
     * event listeners.
     *
     * @type {boolean}
     */
    browserLifecycleEventListeners = true,
    /**
     * Whether to create a new instance of a
     * client or return the existing instance.
     *
     * @type {boolean}
     */
    newInstance = false,
  } = {}) {
    if (instance && !newInstance) return instance;

    if (process.env.WEB_ENV) {
      this._addDispatchEventListener();
      if (browserLifecycleEventListeners) this._addBrowserLifecycleEventListeners();
    }

    instance = this;
    return instance;
  }

  /**
   *
   * @private
   * @type {Object}
   */
  _context = { dispatch: this._dispatch, subscribe: this._subscribe };

  /**
   *
   * @private
   * @type {Map}
   */
  _subscribers = new Map();

  /**
   *
   * @private
   * @type {Map}
   */
  _tree = new Map();

  /**
   *
   * @private
   * @param {Branch} branch
   * @return {void}
   */
  _addBranch(branch) {
    if (!(branch instanceof Branch)) {
      const errors = 'Yallah::createBranch::The branch name was invalid.';
      logger.error(errors);
      return;
    }

    branch.setContext(this._context);
    this._tree.set(branch);
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
  _addDispatchEventListener() {
    window.addEventListener('dispatch', ({ action }) => {
      this._dispatch(action);
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
    const action = new Action({ error, meta, payload, type });

    if (!action.valid()) {
      const errors = 'Yallah::_dispatch::The action was invalid.';
      logger.error(errors);
      return;
    }

    this._distribute(action);
  }

  /**
   *
   * @private
   * @param {Action} action
   * @return {void}
   */
  async _distribute(action) {
    const subscribers = this._subscribers.get(action.type);
    if (!subscribers) return;

    subscribers.forEach((subscriber) => {
      subscriber.receive(action);
    });
  }

  /**
   *
   * @private
   * @param {Object} args
   * @param {Function} args.callback
   * @param {string} args.type
   * @return {void}
   */
  _subscribe({ callback, type }) {
    const subscriber = new Subscriber({ callback, type });

    if (!subscriber.valid()) {
      const errors = 'Yallah::_subscribe::The subscriber was invalid.';
      logger.error(errors);
      return;
    }

    const subscribers = this._subscribers.get(subscriber.type) || new Set();
    subscribers.add(subscriber);
    this._subscribers.set(subscriber.type, subscribers);
  }

  /**
   *
   * @param {Array<Branch>|Branch} branch
   * @return {void}
   */
  addBranch(branch) {
    const branches = castArray(branch);

    branches.forEach((value) => {
      this._addBranch(value);
    });
  }

  /**
   *
   * @param {EventTarget} target
   * @param {string} type
   * @param {Function} callback
   * @return {void}
   */
  addEventListener(target, type, callback) {
    if (!(target instanceof EventTarget) || !isString(type) || !isFunction(callback)) {
      const errors = 'Yallah::addEventListener::The arguments were invalid.';
      logger.error(errors);
      return;
    }

    target.addEventListener(type, (e) => {
      callback(e);
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
   * @return {Object}
   */
  getState() {
    const state = {};

    this._tree.forEach((branch, branchName) => {
      state[branchName] = branch.state;
    });

    return state;
  }

  /**
   *
   * @param {Object} initialState
   * @return {void}
   */
  setInitialState(initialState) {
    if (!isPlainObject(initialState)) {
      const errors = 'Yallah::setInitialState::The initial state was invalid.';
      logger.error(errors);
      return;
    }

    Object.keys(initialState).forEach((branchName) => {
      if (!this._tree.has(branchName)) return;
      const branch = this._tree.get(branchName);
      branch.setState(initialState[branchName]);
    });
  }
}
