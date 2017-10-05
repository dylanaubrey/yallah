/**
 *
 * @param {Function} dispatch
 * @return {void}
 */
export async function addDispatchEventListener(dispatch) {
  window.addEventListener('dispatch', ({ action }) => {
    dispatch(action);
  });
}

/**
 *
 * @param {Function} dispatch
 * @return {void}
 */
export async function removeDispatchEventListener(dispatch) {
  window.removeEventListener('dispatch', ({ action }) => {
    dispatch(action);
  });
}
