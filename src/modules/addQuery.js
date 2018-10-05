import deleteProps from '../modules/deleteProps';
import { history } from '../constants';
import query from 'querystringify';

/**
 * Adding or removing new query params
 *
 * @param {object}  newQuery     - Object with new query params
 * @param {array}   deleteQuery  - Array with query params for delete
 * @param {boolean} createString - If true, then return string with new queries
 *
 * @return {string/undefined}
 */

export default function(newQuery, deleteQuery, createString) {
  const previousQuery =
    deleteQuery && deleteQuery.length
      ? deleteProps(query.parse(history.location.search), deleteQuery)
      : query.parse(history.location.search);

  if (createString) {
    return query.stringify({ ...previousQuery, ...newQuery }, true);
  }

  history.push({ search: query.stringify({ ...previousQuery, ...newQuery }) });
}
