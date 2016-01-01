'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ApiRequest = require('./ApiRequest');

var _ApiRequest2 = _interopRequireDefault(_ApiRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Creates a new PostgREST API object. Use this to start building PostgREST
 * requests.
 *
 * @class
 * @param {string} The base URL of the API.
 */

var Api = (function () {
  // TODO: Use an `OPTIONS *` request to get the server version to output
  // warnings for unsupported features.

  function Api(url) {
    _classCallCheck(this, Api);

    this.url = url;
  }

  /**
   * Convenience wrapper for starting a PostgREST request builder. Adds the
   * API URL to the provided path.
   *
   * @param {string} The HTTP method of the request.
   * @param {string} The path of the request.
   * @returns {ApiRequest} The API request object.
   */

  _createClass(Api, [{
    key: 'request',
    value: function request(method, path) {
      return new _ApiRequest2.default(method, this.url + path);
    }
  }]);

  return Api;
})();

/**
 * Basic HTTP method functions for quick chaining.
 *
 * @param {string} The path of the request.
 * @returns {ApiRequest} The API request object.
 */

var methods = ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'];

methods.forEach(function (method) {
  return Api.prototype[method.toLowerCase()] = function requestMethod(path) {
    return this.request(method, path);
  };
});

exports.default = Api;