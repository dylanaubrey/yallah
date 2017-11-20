import { isFunction, isNumber, isPlainObject } from 'lodash';
import logger from '../../logger';

let yamljs;

if (!process.env.WEB_ENV) {
  yamljs = require('yamljs'); // eslint-disable-line global-require
}

/**
 *
 * The Yallah config
 */
export default class Config {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {Config}
   */
  constructor({
    /**
     * Absolute file location of
     * the config yaml file.
     *
     * @type {string}
     */
    filePath,
    /**
     * Callback to be executed to
     * determine whether to use the
     * config. Callback receives the
     * app state as its argument.
     *
     * @type {Function}
     */
    matcher,
    /**
     * The priority of the config
     * over the other configs. Lower
     * priority configs are overwritten
     * by highter priority configs.
     *
     * @type {number}
     */
    priority,
  } = {}) {
    this._filePath = filePath;
    if (isFunction(matcher)) this._matcher = matcher;
    this._priority = priority;

    try {
      this._obj = yamljs.load(this._filePath);
    } catch (err) {
      const message = 'Yallah::config::constructor::Failed to load yaml file';
      logger.error(message, err);
    }
  }

  /**
   *
   * @return {Function}
   */
  get matcher() {
    return this._matcher;
  }

  /**
   *
   * @return {Object}
   */
  get obj() {
    return this._obj;
  }

  /**
   *
   * @return {boolean}
   */
  valid() {
    return isPlainObject(this._obj) && isNumber(this._priority);
  }
}
