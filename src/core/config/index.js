// @flow

import { isFunction, isPlainObject } from 'lodash';
import type { ConfigObj, StateObj } from '../types';
import logger from '../../logger';

let yamljs;

if (!process.env.WEB_ENV) {
  yamljs = require('yamljs'); // eslint-disable-line global-require
}

export type Matcher = (StateObj) => boolean;

export type ConfigArgs = {
  filePath: string,
  matcher?: ?Matcher,
  priority?: number,
};

export default class Config {
  _filePath: string;
  _matcher: ?Matcher;
  _obj: ConfigObj;
  _priority: ?number;

  constructor({ filePath, matcher, priority }: ConfigArgs) {
    this._filePath = filePath;
    this._matcher = matcher;
    this._priority = priority;

    try {
      this._obj = yamljs.load(this._filePath);
    } catch (error) {
      const message = 'Yallah::config::constructor::Failed to load yaml file';
      logger.error(message, { error });
    }
  }

  get obj(): ConfigObj {
    return this._obj;
  }

  use(state: StateObj): boolean {
    if (!isFunction(this._matcher)) return true;
    return this._matcher(state);
  }

  valid(): boolean {
    return isPlainObject(this._obj);
  }
}
