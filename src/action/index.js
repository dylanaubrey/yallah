import { isString } from 'lodash';

/**
 *
 * The Yallah action
 */
export default class Action {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {Action}
   */
  constructor({
    /**
     * Optional property to indicate error.
     *
     * @type {boolean}
     */
    error,
    /**
     * Optional property to pass additional data.
     *
     * @type {any}
     */
    meta,
    /**
     * Optional property to pass payload
     * of action.
     *
     * @type {any}
     */
    payload,
    /**
     * Type of action
     *
     * @type {string}
     */
    type,
  } = {}) {
    this._error = error || false;
    this._meta = meta || {};
    this._payload = payload || null;
    this._type = type;
  }

  /**
   *
   * @return {boolean}
   */
  get error() {
    return this._error;
  }

  /**
   *
   * @return {Object}
   */
  get meta() {
    return this._meta;
  }

  /**
   *
   * @return {any}
   */
  get payload() {
    return this._payload;
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
    return isString(this._type);
  }
}
