// @flow

import {
  domReady,
  load,
  beforeUnload,
  unload,
  pageShow,
  pageHide,
  online,
  offline,
} from '../../../actions/browser-lifecycle';

import type { Dispatch } from '../../containers/base';
import type { ListenerArgs } from '../../listener';

export default function browserLifecycleListeners(dispatch: Dispatch): ListenerArgs[] {
  return [{
    callback(e: Event): void {
      dispatch(domReady(e));
    },
    target: document,
    type: 'DOMContentLoaded',
  }, {
    callback(e: Event): void {
      dispatch(load(e));
    },
    target: window,
    type: 'load',
  }, {
    callback(e: Event): void {
      dispatch(beforeUnload(e));
    },
    target: window,
    type: 'beforeunload',
  }, {
    callback(e: Event): void {
      dispatch(unload(e));
    },
    target: window,
    type: 'unload',
  }, {
    callback(e: Event): void {
      dispatch(pageShow(e));
    },
    target: window,
    type: 'pageshow',
  }, {
    callback(e: Event): void {
      dispatch(pageHide(e));
    },
    target: window,
    type: 'pagehide',
  }, {
    callback(e: Event): void {
      dispatch(online(e));
    },
    target: document,
    type: 'online',
  }, {
    callback(e: Event): void {
      dispatch(offline(e));
    },
    target: document,
    type: 'offline',
  }];
}
