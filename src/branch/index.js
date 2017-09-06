import { deepFreeze } from '../helpers';

/**
 *
 * The Yallah branch
 */
export default class Branch {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {Branch}
   */
  constructor({
    /**
     * Global context passed down to
     * all branches.
     *
     * @type {Object}
     */
    context,
    /**
     * Branch name
     *
     * @type {string}
     */
    name,
  } = {}) {
    this._context = context;
    this._name = name;
    this._state = {};
  }

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
