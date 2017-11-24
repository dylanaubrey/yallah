export const CLICK = 'USER/CLICK';

/**
 *
 * @param {Event} e
 * @return {Object}
 */
export const click = function click(e) {
  return { type: CLICK, payload: e };
};
