export const TURN_ON = 'ALFA/TURN_ON';
export const TURN_OFF = 'ALFA/TURN_OFF';

/**
 *
 * @param {Object} state
 * @return {Object}
 */
export const turnOn = function turnOn(state) {
  return { type: TURN_ON, payload: state };
};

/**
 *
 * @param {Object} state
 * @return {Object}
 */
export const turnOff = function turnOff(state) {
  return { type: TURN_OFF, payload: state };
};
