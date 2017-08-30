/**
 *
 * The Yallah branch
 */
export default class Branch {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {Branch}
   */
  constructor({
    /**
     * Global context passed down to
     * all branches.
     *
     * @type {Object}
     */
    context,
    /**
     * Branch name
     *
     * @type {string}
     */
    name,
  } = {}) {
    this._context = context;
    this._name = name;
  }

  /**
   *
   * @param {Object} action
   * @return {void}
   */
  async dispatch(action) {
    this._context.dispatch(action);
  }

  /**
   *
   * @param {string} type
   * @param {Function} callback
   * @return {void}
   */
  subscribe(type, callback) {
    this._context.subscribe({ callback, type });
  }
}
