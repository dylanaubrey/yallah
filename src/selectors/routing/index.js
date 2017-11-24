// @flow

import { parse } from 'querystring';
import { createSelector } from 'reselect';
import type { StateObj } from '../../core/types';

export const getRouting = (({ routing }: StateObj) => routing);

export const getHistory = createSelector(
  getRouting,
  ({ history }) => history,
);

export const getLocation = createSelector(
  getHistory,
  ({ location }) => location,
);

export const getAction = createSelector(
  getHistory,
  ({ action }) => action,
);

export const getPathname = createSelector(
  getLocation,
  ({ pathname }) => pathname || '',
);

export const getQueryString = createSelector(
  getLocation,
  ({ search }) => (search ? search.substr(1) : ''),
);

export const getQueryParams = createSelector(
  getQueryString,
  queryString => parse(queryString),
);
