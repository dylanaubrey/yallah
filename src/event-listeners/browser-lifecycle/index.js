import {
  domReady,
  load,
  beforeUnload,
  unload,
  pageShow,
  pageHide,
  online,
  offline,
} from './actions';

/**
 *
 * @param {Function} dispatch
 * @return {void}
 */
export default function addBrowserLifecycleEventListeners(dispatch) {
  document.addEventListener('DOMContentLoaded', (e) => {
    dispatch(domReady(e));
  });

  window.addEventListener('load', (e) => {
    dispatch(load(e));
  });

  window.addEventListener('beforeunload', (e) => {
    dispatch(beforeUnload(e));
  });

  window.addEventListener('unload', (e) => {
    dispatch(unload(e));
  });

  window.addEventListener('pageshow', (e) => {
    dispatch(pageShow(e));
  });

  window.addEventListener('pagehide', (e) => {
    dispatch(pageHide(e));
  });

  window.addEventListener('online', (e) => {
    dispatch(online(e));
  });

  window.addEventListener('offline', (e) => {
    dispatch(offline(e));
  });
}
