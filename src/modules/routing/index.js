// @flow

import { createBrowserHistory, createMemoryHistory } from 'history';
import { isNumber, isPlainObject, isString } from 'lodash';
import { GO_BACK, GO_FORWARD, GO, PUSH, REPLACE, routeChange } from '../../actions/routing';
import { START, STOP } from '../../actions/container';
import Module from '../../core/module';
import logger from '../../logger';
import setHistory from '../../reducers/routing';
import { getAction } from '../../selectors/routing';

const routing = new Module('routing');
const history = process.env.WEB_ENV ? createBrowserHistory() : createMemoryHistory();
let unlisten;

routing.subscribe(START, async () => {
  routing.setState(await setHistory(routing.state, { history }));
  routing.dispatch(routeChange('START'));

  unlisten = history.listen(async () => {
    routing.setState(await setHistory(routing.state, { history }));
    routing.dispatch(routeChange(getAction(routing.appState())));
  });
});

routing.subscribe(STOP, async () => {
  unlisten();
});

routing.subscribe(GO_BACK, async () => {
  history.goBack();
});

routing.subscribe(GO_FORWARD, async () => {
  history.goForward();
});

routing.subscribe(GO, async ({ payload }) => {
  if (!isNumber(payload)) {
    const errors = 'Yallah::routing::GO::The payload was invalid.';
    logger.error(errors);
    return;
  }

  history.go(payload);
});

routing.subscribe(PUSH, async ({ payload: { state, url } }) => {
  if (!isPlainObject(state) || !isString(url)) {
    const errors = 'Yallah::routing::PUSH::The payload was invalid.';
    logger.error(errors);
    return;
  }

  history.push(url, state);
});

routing.subscribe(REPLACE, async ({ payload: { state, url } }) => {
  if (!isPlainObject(state) || !isString(url)) {
    const errors = 'Yallah::routing::REPLACE::The payload was invalid.';
    logger.error(errors);
    return;
  }

  history.replace(url, state);
});

export default routing;
