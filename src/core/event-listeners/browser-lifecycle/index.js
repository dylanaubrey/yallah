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
    callback: (e: Event): Promise<void> => dispatch(domReady(e)),
    target: document,
    type: 'DOMContentLoaded',
  }, {
    callback: (e: Event): Promise<void> => dispatch(load(e)),
    target: window,
    type: 'load',
  }, {
    callback: (e: Event): Promise<void> => dispatch(beforeUnload(e)),
    target: window,
    type: 'beforeunload',
  }, {
    callback: (e: Event): Promise<void> => dispatch(unload(e)),
    target: window,
    type: 'unload',
  }, {
    callback: (e: Event): Promise<void> => dispatch(pageShow(e)),
    target: window,
    type: 'pageshow',
  }, {
    callback: (e: Event): Promise<void> => dispatch(pageHide(e)),
    target: window,
    type: 'pagehide',
  }, {
    callback: (e: Event): Promise<void> => dispatch(online(e)),
    target: document,
    type: 'online',
  }, {
    callback: (e: Event): Promise<void> => dispatch(offline(e)),
    target: document,
    type: 'offline',
  }];
}
