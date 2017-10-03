import {
  domReady,
  load,
  beforeUnload,
  unload,
  pageShow,
  pageHide,
  online,
  offline,
} from '../../actions/browser-lifecycle';

/**
 *
 * @param {Function} dispatch
 * @return {void}
 */
export async function addBrowserLifecycleEventListeners(dispatch) {
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

/**
 *
 * @param {Function} dispatch
 * @return {void}
 */
export default async function removeBrowserLifecycleEventListeners(dispatch) {
  document.removeEventListener('DOMContentLoaded', (e) => {
    dispatch(domReady(e));
  });

  window.removeEventListener('load', (e) => {
    dispatch(load(e));
  });

  window.removeEventListener('beforeunload', (e) => {
    dispatch(beforeUnload(e));
  });

  window.removeEventListener('unload', (e) => {
    dispatch(unload(e));
  });

  window.removeEventListener('pageshow', (e) => {
    dispatch(pageShow(e));
  });

  window.removeEventListener('pagehide', (e) => {
    dispatch(pageHide(e));
  });

  window.removeEventListener('online', (e) => {
    dispatch(online(e));
  });

  window.removeEventListener('offline', (e) => {
    dispatch(offline(e));
  });
}
