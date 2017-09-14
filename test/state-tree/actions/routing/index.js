export const GO_BACK = 'ROUTING/GO_BACK';
export const GO_FORWARD = 'ROUTING/GO_FORWARD';
export const GO = 'ROUTING/GO';
export const LOCATION_CHANGE = 'ROUTING/LOCATION_CHANGE';
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
 * @param {Object} location
 * @param {string} action
 * @return {Object}
 */
export const locationChange = function locationChange(location, action) {
  return { type: LOCATION_CHANGE, payload: { action, location } };
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
 * @param {string} url
 * @param {Object} state
 * @return {Object}
 */
export const push = function push(url, state) {
  return { type: GO, payload: { state, url } };
};

/**
 *
 * @param {string} url
 * @param {Object} state
 * @return {Object}
 */
export const replace = function replace(url, state) {
  return { type: GO, payload: { state, url } };
};
