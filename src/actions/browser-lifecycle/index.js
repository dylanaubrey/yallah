// @flow

import type { ActionArgs } from '../../core/action';

export const DOM_READY = 'BROWSER_LIFECYCLE/DOM_READY';
export const LOAD = 'BROWSER_LIFECYCLE/LOAD';
export const BEFORE_UNLOAD = 'BROWSER_LIFECYCLE/BEFORE_UNLOAD';
export const UNLOAD = 'BROWSER_LIFECYCLE/UNLOAD';
export const PAGE_SHOW = 'BROWSER_LIFECYCLE/PAGE_SHOW';
export const PAGE_HIDE = 'BROWSER_LIFECYCLE/PAGE_HIDE';
export const ONLINE = 'BROWSER_LIFECYCLE/ONLINE';
export const OFFLINE = 'BROWSER_LIFECYCLE/OFFLINE';

export const domReady = function domReady(e: Event): ActionArgs {
  return { type: DOM_READY, payload: e };
};

export const load = function load(e: Event): ActionArgs {
  return { type: LOAD, payload: e };
};

export const beforeUnload = function beforeUnload(e: Event): ActionArgs {
  return { type: BEFORE_UNLOAD, payload: e };
};

export const unload = function unload(e: Event): ActionArgs {
  return { type: UNLOAD, payload: e };
};

export const pageShow = function pageShow(e: Event): ActionArgs {
  return { type: PAGE_SHOW, payload: e };
};

export const pageHide = function pageHide(e: Event): ActionArgs {
  return { type: PAGE_HIDE, payload: e };
};

export const online = function online(e: Event): ActionArgs {
  return { type: ONLINE, payload: e };
};

export const offline = function offline(e: Event): ActionArgs {
  return { type: OFFLINE, payload: e };
};
