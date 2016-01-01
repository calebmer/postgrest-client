'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _superagent = require('superagent');

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var contentRangeStructure = /^(\d+)-(\d+)\/(\d+)$/;

/**
 * A request building object which contains convenience methods for
 * communicating with a PostgREST server.
 *
 * @class
 * @param {string} The HTTP method of the request.
 * @param {string} The path to the request.
 */

var ApiRequest = (function (_Request) {
  _inherits(ApiRequest, _Request);

  function ApiRequest(method, path) {
    _classCallCheck(this, ApiRequest);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ApiRequest).call(this, method, path));

    _this.set('Accept', 'application/json');

    // Fix for superagent disconnect on client & server.
    if (!_this.get) {
      _this.get = _this.getHeader;
    }
    return _this;
  }

  /**
   * Set auth using special formats. If only one string paramter is passed, it
   * is interpreted as a bearer token. If an object and nothing else is passed,
   * `user` and `pass` keys are extracted from it and used for basic auth.
   *
   * @param {string|object} The user, bearer token, or user/pass object.
   * @param {string|void} The pass or undefined.
   * @returns {ApiRequest} The API request object.
   */

  _createClass(ApiRequest, [{
    key: 'auth',
    value: function auth(user, pass) {
      if (typeof user === 'string' && pass == null) {
        this.set('Authorization', 'Bearer ' + user);
        return this;
      }

      if ((typeof user === 'undefined' ? 'undefined' : _typeof(user)) === 'object' && pass == null) {
        pass = user.pass;
        user = user.user;
      }

      return _get(Object.getPrototypeOf(ApiRequest.prototype), 'auth', this).call(this, user, pass);
    }

    /**
     * Takes a query object and translates it to a PostgREST filter query string.
     * All values are prefixed with `eq.`.
     *
     * @param {object} The object to match against.
     * @returns {ApiRequest} The API request object.
     */

  }, {
    key: 'match',
    value: function match(query) {
      Object.keys(query).forEach(function (key) {
        return query[key] = 'eq.' + query[key];
      });
      return this.query(query);
    }

    /**
     * Cleans up a select string by stripping all whitespace. Then the string is
     * set as a query string value. Also always forces a root @id column.
     *
     * @param {string} The unformatted select string.
     * @returns {ApiRequest} The API request object.
     */

  }, {
    key: 'select',
    value: function select(_select) {
      if (_select) {
        this.query({ select: _select.replace(/\s/g, '') });
      }

      return this;
    }

    /**
     * Tells PostgREST in what order the result should be returned.
     *
     * @param {string} The property name to order by.
     * @param {bool} True for descending results, false by default.
     * @param {bool} True for nulls first, false by default.
     * @returns {ApiRequest} The API request object.
     */

  }, {
    key: 'order',
    value: function order(property) {
      var ascending = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var nullsFirst = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      this.query('order=' + property + '.' + (ascending ? 'asc' : 'desc') + '.' + (nullsFirst ? 'nullsfirst' : 'nullslast'));
      return this;
    }

    /**
     * Specify a range of items for PostgREST to return. If the second value is
     * not defined, the rest of the collection will be sent back.
     *
     * @param {number} The first object to select.
     * @param {number|void} The last object to select.
     * @returns {ApiRequest} The API request object.
     */

  }, {
    key: 'range',
    value: function range(from, to) {
      this.set('Range-Unit', 'items');
      this.set('Range', (from || 0) + '-' + (to || ''));
      return this;
    }

    /**
     * Sets the header which signifies to PostgREST the response must be a single
     * object or 404.
     *
     * @returns {ApiRequest} The API request object.
     */

  }, {
    key: 'single',
    value: function single() {
      return this.set('Prefer', 'plurality=singular');
    }

    /**
     * Sends the request and returns a promise. The super class uses the errback
     * pattern, but this function overrides that preference to use a promise.
     *
     * @returns {Promise} Resolves when the request has completed.
     */

  }, {
    key: 'end',
    value: function end() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        return _get(Object.getPrototypeOf(ApiRequest.prototype), 'end', _this2).call(_this2, function (error, response) {
          if (error) {
            return reject(error);
          }

          var body = response.body;
          var headers = response.headers;

          var contentRange = headers['content-range'];

          if (Array.isArray(body) && contentRange && contentRangeStructure.test(contentRange)) {
            body.fullLength = parseInt(contentRangeStructure.exec(contentRange)[3], 10);
          }

          return resolve(body);
        });
      });
    }

    /**
     * Makes the ApiRequest object then-able. Allows for usage with
     * `Promise.resolve` and async/await contexts. Just a proxy for `.then()` on
     * the promise returned from `.end()`.
     *
     * @param {function} Called when the request resolves.
     * @param {function} Called when the request errors.
     * @returns {Promise} Resolves when the resolution resolves.
     */

  }, {
    key: 'then',
    value: function then(resolve, reject) {
      return this.end().then(resolve, reject);
    }

    /**
     * Just a proxy for `.catch()` on the promise returned from `.end()`.
     *
     * @param {function} Called when the request errors.
     * @returns {Promise} Resolves when there is an error.
     */

  }, {
    key: 'catch',
    value: function _catch(reject) {
      return this.end().catch(reject);
    }
  }]);

  return ApiRequest;
})(_superagent.Request);

/**
 * For all of the PostgREST filters add a shortcut method to use it.
 *
 * @param {string} The name of the column.
 * @param {any} The value of the column to be filtered.
 * @returns {ApiRequest} The API request object.
 */

var filters = ['eq', 'gt', 'lt', 'gte', 'lte', 'like', 'ilike', 'is', 'in', 'not'];

filters.forEach(function (filter) {
  return ApiRequest.prototype[filter] = function filterValue(name, value) {
    return this.query(name + '=' + filter + '.' + (Array.isArray(value) ? value.join(',') : value));
  };
});

exports.default = ApiRequest;