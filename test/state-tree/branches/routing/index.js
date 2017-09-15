import { createBrowserHistory, createMemoryHistory } from 'history';
import { isNumber, isPlainObject, isString } from 'lodash';
import { GO_BACK, GO_FORWARD, GO, PUSH, REPLACE, locationChange } from '../../actions/routing';
import Branch from '../../../../src/branch';
import logger from '../../../../src/logger';

const history = process.env.WEB_ENV ? createBrowserHistory() : createMemoryHistory();

const routing = new Branch('routing', () => {
  locationChange(history.location, 'INIT');

  history.listen((location, action) => {
    this.dispatch(locationChange(location, action));
  });
});

routing.subscribe(GO_BACK, () => {
  history.goBack();
});

routing.subscribe(GO_FORWARD, () => {
  history.goForward();
});

routing.subscribe(GO, ({ payload }) => {
  if (!isNumber(payload)) {
    const errors = 'Yallah::routing::GO::The payload was invalid.';
    logger.error(errors);
    return;
  }

  history.go(payload);
});

routing.subscribe(PUSH, ({ payload: { state, url } }) => {
  if (!isPlainObject(state) || !isString(url)) {
    const errors = 'Yallah::routing::PUSH::The payload was invalid.';
    logger.error(errors);
    return;
  }

  history.push(url, state);
});

routing.subscribe(REPLACE, ({ payload: { state, url } }) => {
  if (!isPlainObject(state) || !isString(url)) {
    const errors = 'Yallah::routing::REPLACE::The payload was invalid.';
    logger.error(errors);
    return;
  }

  history.replace(url, state);
});

export default routing;
