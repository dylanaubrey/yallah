import { isFunction, isString } from 'lodash';

/**
 *
 * The Yallah subscriber
 */
export default class Subscriber {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {Subscriber}
   */
  constructor({
    /**
     * Callback to be executed when a
     * matching action is received.
     *
     * @type {Function}
     */
    callback,
    /**
     * Name of the subscriber.
     *
     * @type {string}
     */
    name,
    /**
     * Action to subscribe to.
     *
     * @type {string}
     */
    type,
  } = {}) {
    this._callback = callback;
    this._name = name;
    this._type = type;
  }

  /**
   *
   * @return {string}
   */
  get type() {
    return this._type;
  }

  /**
   *
   * @param {Action} action
   * @return {void}
   */
  async execute(action) {
    this._callback(action);
  }

  /**
   *
   * @return {boolean}
   */
  valid() {
    return isString(this._type) && isString(this._name) && isFunction(this._callback);
  }
}
