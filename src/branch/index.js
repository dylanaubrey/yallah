import { isFunction } from 'lodash';
import { deepFreeze } from '../helpers';

/**
 *
 * The Yallah branch
 */
export default class Branch {
  /**
   *
   * @constructor
   * @param {String} name
   * @param {Function} callback
   * @return {Branch}
   */
  constructor(name, callback) {
    if (!name) throw new Error('Name is a mandatory argument for a branch.');
    this._name = name;
    if (isFunction(callback)) callback.call(this);
  }

  /**
   *
   * @private
   * @type {Object}
   */
  _context = {};

  /**
   *
   * @private
   * @type {Object}
   */
  _state = {};

  /**
   *
   * @return {Object}
   */
  get state() {
    return this._state;
  }

  /**
   *
   * @private
   * @param {Object} obj
   * @return {void}
   */
  _setState(obj) {
    this._state = deepFreeze(obj);
  }

  /**
   *
   * @param {Object} action
   * @return {void}
   */
  async dispatch(action) {
    this._context.dispatch(action);
  }

  /**
   *
   * @param {Object} context
   * @return {void}
   */
  setContext(context) {
    this._context = { ...this._context, ...context };
  }

  /**
   *
   * @param {Object} obj
   * @return {void}
   */
  async setState(obj) {
    this._setState(obj);
  }

  /**
   *
   * @param {string} type
   * @param {Function} callback
   * @return {void}
   */
  subscribe(type, callback) {
    this._context.subscribe({ callback, type });
  }
}
