/**
 *
 * @param {Function} dispatch
 * @return {void}
 */
export async function addDispatchEventListener(dispatch) {
  window.addEventListener('dispatch', ({ detail: { action } }) => {
    dispatch(action);
  });
}

/**
 *
 * @param {Function} dispatch
 * @return {void}
 */
export async function removeDispatchEventListener(dispatch) {
  window.removeEventListener('dispatch', ({ detail: { action } }) => {
    dispatch(action);
  });
}
