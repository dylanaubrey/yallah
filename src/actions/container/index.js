export const START = 'CONTAINER/START';
export const STOP = 'CONTAINER/STOP';

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
