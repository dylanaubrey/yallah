import { createBrowserHistory } from 'history';
import { GO_BACK, GO_FORWARD, GO, PUSH, REPLACE, locationChange } from '../../actions/routing';
import Branch from '../../../../src/branch';

const history = createBrowserHistory();

const routing = new Branch('routing', () => {
  locationChange(history.location, 'PAGE_LOAD');

  history.listen((location, action) => {
    this.dispatch(locationChange(location, action));
  });
});

routing.subscribe(GO_BACK, () => {
  // TODO
});

routing.subscribe(GO_FORWARD, () => {
  // TODO
});

routing.subscribe(GO, () => {
  // TODO
});

routing.subscribe(PUSH, () => {
  // TODO
});

routing.subscribe(REPLACE, () => {
  // TODO
});

export default routing;
