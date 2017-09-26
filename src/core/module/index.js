import deepFreeze from '../../helpers';

/**
 *
 * The Yallah container module
 */
export default class Module {
  /**
   *
   * @constructor
   * @param {String} name
   * @return {Branch}
   */
  constructor(name) {
    if (!name) throw new Error('Name is a mandatory argument for a module.');
    this._name = name;
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
   * @type {string}
   */
  _name;

  /**
   *
   * @private
   * @type {Object}
   */
  _state = {};

  /**
   *
   * @private
   * @type {Array<Object>}
   */
  _subscribers = [];

  /**
   *
   * @return {string}
   */
  get name() {
    return this._name;
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
   * @return {void}
   */
  addSubscribers() {
    this._subscribers.forEach((subscriber) => {
      this._context.subscribe(subscriber);
    });
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
    this._subscribers.push({ callback, type });
  }
}