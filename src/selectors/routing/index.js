import { isUndefined } from 'lodash';
import { createSelector } from 'reselect';

export const getRouting = (({ routing }) => routing);

export const getLocation = createSelector(
  getRouting,
  ({ location }) => location,
);

export const getAction = createSelector(
  getRouting,
  ({ action }) => action,
);

export const getPathname = createSelector(
  getLocation,
  ({ pathname }) => pathname,
);

export const getQueryString = createSelector(
  getLocation,
  ({ search }) => search,
);

export const getQueryParams = createSelector(
  getQueryString,
  (queryString) => {
    const queryList = queryString.substr(1).split('&');
    const params = {};

    queryList.forEach((value) => {
      const split = value.split('=');
      params[split[0]] = !isUndefined(split[1]) ? split[1] : true;
    });

    return params;
  },
);
