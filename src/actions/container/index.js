export const START = 'STATE_TREE/START';
export const STOP = 'STATE_TREE/STOP';

/**
 *
 * @return {Object}
 */
export const start = function start() {
  return { type: START };
};

/**
 *
 * @return {Object}
 */
export const stop = function stop() {
  return { type: STOP };
};
