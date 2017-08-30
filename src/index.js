import { isFunction, isString } from 'lodash';
import Action from './action';
import Branch from './branch';
import Subscriber from './subscriber';

let instance;

/**
 *
 * The Yallah state tree
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
     * Whether to create a new instance of a
     * client or return the existing instance.
     *
     * @type {boolean}
     */
    newInstance = false,
  } = {}) {
    if (instance && !newInstance) return instance;
    this._addEventListener();
    instance = this;
    return instance;
  }

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
   * @return {void}
   */
  _addEventListener() {
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
    if (!action.valid()) return;
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
    if (!subscriber.valid()) return;
    const subscribers = this._subscribers.get(subscriber.type) || new Set();
    subscribers.add(subscriber);
    this._subscribers.set(subscriber.type, subscribers);
  }

  /**
   *
   * @param {EventTarget} target
   * @param {string} type
   * @param {Function} callback
   * @return {void}
   */
  addEventListener(target, type, callback) {
    if (!(target instanceof EventTarget) || !isString(type) || !isFunction(callback)) return;

    target.addEventListener(type, (e) => {
      callback(e);
    });
  }

  /**
   *
   * @param {Object} opts
   * @param {string} opts.name
   * @return {Object|Branch}
   */
  createBranch({ name }) {
    const errors = 'Yallah::createBranch::The branch name was invalid.';
    if (!isString(name)) return { errors };
    const context = { dispatch: this._dispatch, subscribe: this._subscribe };
    this._tree.set(name, new Branch({ context, name }));
    return this._tree.get(name);
  }

  /**
   *
   * @param {Object} action
   * @return {void}
   */
  async dispatch(action) {
    this._dispatch(action);
  }
}
