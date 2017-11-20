import { castArray, merge } from 'lodash';
import BaseContainer from '../base';
import Config from '../../config';
import { deepFreeze } from '../../../helpers';
import logger from '../../../logger';

require('es6-promise').polyfill();

let _this;

/**
 *
 * The Yallah server-side app container
 */
export default class ServerContainer extends BaseContainer {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {ServerContainer}
   */
  constructor(config) {
    _this = super(config);
    return _this;
  }

  /**
   *
   * @private
   * @type {Array<Object>}
   */
  _configs = [];

  /**
   *
   * @private
   * @param {Object} args
   * @param {string} args.filePath
   * @param {Function} args.matcher
   * @param {number} priority
   * @return {void}
   */
  _addConfig(args, priority) {
    const config = new Config({ ...args, priority });

    if (!config.valid()) {
      logger.error('Yallah::container::_addConfig::The config was invalid.', { config });
      return;
    }

    this._configs[priority] = config;
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _setConfig() {
    let mergedConfig = {};

    for (let i = this._configs.length - 1; i >= 0; i -= 1) {
      const config = this._configs[i];

      if (!config.matcher || config.matcher(this._getState())) {
        mergedConfig = merge(mergedConfig, config.obj);
      }
    }

    this._config = await deepFreeze(mergedConfig);
  }

  /**
   *
   * @param {Array<Object>} config
   * @return {void}
   */
  addConfig(config) {
    const configs = castArray(config);

    configs.forEach((value, index) => {
      this._addConfig(value, index);
    });
  }
}
