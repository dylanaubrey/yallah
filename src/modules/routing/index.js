import { createBrowserHistory, createMemoryHistory } from 'history';
import { isEqual, isNumber, isPlainObject, isString } from 'lodash';
import { GO_BACK, GO_FORWARD, GO, PUSH, REPLACE, locationChange } from '../../actions/routing';
import { START, STOP } from '../../actions/container';
import Module from '../../core/module';
import logger from '../../logger';

const routing = new Module('routing');
const history = process.env.WEB_ENV ? createBrowserHistory() : createMemoryHistory();
let unlisten;

routing.subscribe(START, async () => {
  await routing.setState(history.location);
  routing.dispatch(locationChange(routing.state, 'START'));

  unlisten = history.listen(async (location, action) => {
    if (isEqual(location, routing.state)) return;
    await routing.setState(location);
    routing.dispatch(locationChange(routing.state, action));
  });
});

routing.subscribe(STOP, () => {
  unlisten();
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
