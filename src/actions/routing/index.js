export const GO_BACK = 'ROUTING/GO_BACK';
export const GO_FORWARD = 'ROUTING/GO_FORWARD';
export const GO = 'ROUTING/GO';
export const ROUTE_CHANGE = 'ROUTING/ROUTE_CHANGE';
export const PUSH = 'ROUTING/PUSH';
export const REPLACE = 'ROUTING/REPLACE';

/**
 *
 * @return {Object}
 */
export const goBack = function goBack() {
  return { type: GO_BACK };
};

/**
 *
 * @return {Object}
 */
export const goForward = function goForward() {
  return { type: GO_FORWARD };
};

/**
 *
 * @param {number} index
 * @return {Object}
 */
export const go = function go(index) {
  return { type: GO, payload: index };
};

/**
 *
 * @param {string} action
 * @return {Object}
 */
export const routeChange = function routeChange(action) {
  return { type: ROUTE_CHANGE, payload: action };
};

/**
 *
 * @param {string} url
 * @param {Object} state
 * @return {Object}
 */
export const push = function push(url, state = {}) {
  return { type: GO, payload: { state, url } };
};

/**
 *
 * @param {string} url
 * @param {Object} state
 * @return {Object}
 */
export const replace = function replace(url, state = {}) {
  return { type: GO, payload: { state, url } };
};
