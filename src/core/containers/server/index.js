// @flow

import { castArray, merge } from 'lodash';
import BaseContainer, { type ContainerArgs } from '../base';
import Config, { type ConfigArgs, type Matcher } from '../../config';
import type { ConfigObj } from '../../types';
import { deepFreeze } from '../../../helpers';
import logger from '../../../logger';

let _this;

export default class ServerContainer extends BaseContainer {
  _configs: ConfigObj[] = [];

  constructor(config: ContainerArgs) {
    _this = super(config);
    return _this;
  }

  _addConfig(filePath: string, matcher: ?Matcher, priority: number) {
    const config = new Config({ filePath, matcher, priority });

    if (!config.valid()) {
      logger.error('Yallah::container::_addConfig::The config was invalid.', { config });
      return;
    }

    this._configs[priority] = config;
  }

  async _setConfig(): Promise<void> {
    let mergedConfig = {};
    this._configs.sort((a, b) => a.priority - b.priority);

    for (let i = this._configs.length - 1; i >= 0; i -= 1) {
      const config = this._configs[i];

      if (config.use(this._getState())) {
        mergedConfig = merge(mergedConfig, config.obj);
      }
    }

    this._config = await deepFreeze(mergedConfig);
  }

  async _setInitialState() {
    // TODO
  }

  /**
   *
   * @private
   * @return {void}
   */
  async _start() {
    await super._start();
    await this._setInitialState();
    await this._setConfig();
  }

  addConfig(config: ConfigArgs | ConfigArgs[]): void {
    const configs = castArray(config);

    configs.forEach(({ filePath, matcher, priority }, index) => {
      this._addConfig(filePath, matcher, priority || index);
    });
  }
}
