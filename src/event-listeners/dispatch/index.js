/**
 *
 * @param {Function} dispatch
 * @return {void}
 */
export async function addDispatchEventListeners(dispatch) {
  window.addEventListener('dispatch', ({ action }) => {
    dispatch(action);
  });
}

/**
 *
 * @param {Function} dispatch
 * @return {void}
 */
export async function removeDispatchEventListeners(dispatch) {
  window.removeEventListener('dispatch', ({ action }) => {
    dispatch(action);
  });
}
