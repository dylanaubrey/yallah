import { isFunction, isString } from 'lodash';

/**
 *
 * The Yallah listener
 */
export default class Listener {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {Listener}
   */
  constructor({
    /**
     * Callback to be executed when a
     * event is triggered.
     *
     * @type {Function}
     */
    callback,
    /**
     * Event target to bind to.
     *
     * @type {EventTarget}
     */
    target,
    /**
     * Event type to subscribe to.
     *
     * @type {string}
     */
    type,
  } = {}) {
    this._callback = callback;
    this._target = target;
    this._type = type;
  }

  /**
   *
   * @return {Function}
   */
  get callback() {
    return this._callback;
  }

  /**
   *
   * @return {EventTarget}
   */
  get target() {
    return this._target;
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
   * @return {boolean}
   */
  valid() {
    return isFunction(this._target.addEventListener) && isString(this._type)
      && isFunction(this._callback);
  }
}
