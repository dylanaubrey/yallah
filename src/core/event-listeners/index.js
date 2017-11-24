// @flow

import { castArray } from 'lodash';
import Listener, { type ListenerArgs } from '../listener';
import logger from '../../logger';

export default class EventListeners {
  _listeners: Listener[] = [];

  async add(): Promise<void> {
    this._listeners.forEach(({ target, type, callback }) => {
      target.addEventListener(type, callback);
    });
  }

  async remove(): Promise<void> {
    this._listeners.forEach(({ target, type, callback }) => {
      target.removeEventListener(type, callback);
    });
  }

  stage(args: ListenerArgs[] | ListenerArgs): void {
    const listeners = castArray(args);

    listeners.forEach((_args) => {
      const listener = new Listener(_args);

      if (!listener.valid()) {
        const error = 'Yallah::EventListeners::stage::The listener was invalid.';
        logger.error(error, { args });
        return;
      }

      this._listeners.push(listener);
    });
  }
}
