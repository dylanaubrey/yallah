export const DOM_READY = 'BROWSER_LIFECYCLE/DOM_READY';
export const LOAD = 'BROWSER_LIFECYCLE/LOAD';
export const BEFORE_UNLOAD = 'BROWSER_LIFECYCLE/BEFORE_UNLOAD';
export const UNLOAD = 'BROWSER_LIFECYCLE/UNLOAD';
export const PAGE_SHOW = 'BROWSER_LIFECYCLE/PAGE_SHOW';
export const PAGE_HIDE = 'BROWSER_LIFECYCLE/PAGE_HIDE';
export const ONLINE = 'BROWSER_LIFECYCLE/ONLINE';
export const OFFLINE = 'BROWSER_LIFECYCLE/OFFLINE';

/**
 *
 * @param {Event} e
 * @return {Object}
 */
export const domReady = function domReady(e) {
  return { type: DOM_READY, payload: e };
};

/**
 *
 * @param {Event} e
 * @return {Object}
 */
export const load = function load(e) {
  return { type: LOAD, payload: e };
};

/**
 *
 * @param {Event} e
 * @return {Object}
 */
export const beforeUnload = function beforeUnload(e) {
  return { type: BEFORE_UNLOAD, payload: e };
};

/**
 *
 * @param {Event} e
 * @return {Object}
 */
export const unload = function unload(e) {
  return { type: UNLOAD, payload: e };
};

/**
 *
 * @param {Event} e
 * @return {Object}
 */
export const pageShow = function pageShow(e) {
  return { type: PAGE_SHOW, payload: e };
};
/**
 *
 * @param {Event} e
 * @return {Object}
 */
export const pageHide = function pageHide(e) {
  return { type: PAGE_HIDE, payload: e };
};

/**
 *
 * @param {Event} e
 * @return {Object}
 */
export const online = function online(e) {
  return { type: ONLINE, payload: e };
};

/**
 *
 * @param {Event} e
 * @return {Object}
 */
export const offline = function offline(e) {
  return { type: OFFLINE, payload: e };
};
