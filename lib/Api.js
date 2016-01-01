import ApiRequest from './ApiRequest'

/**
 * Creates a new PostgREST API object. Use this to start building PostgREST
 * requests.
 *
 * @class
 * @param {string} The base URL of the API.
 */

class Api {
  // TODO: Use an `OPTIONS *` request to get the server version to output
  // warnings for unsupported features.
  constructor (url) {
    this.url = url
  }

  /**
   * Convenience wrapper for starting a PostgREST request builder. Adds the
   * API URL to the provided path.
   *
   * @param {string} The HTTP method of the request.
   * @param {string} The path of the request.
   * @returns {ApiRequest} The API request object.
   */

  request (method, path) {
    return new ApiRequest(method, this.url + path)
  }
}

/**
 * Basic HTTP method functions for quick chaining.
 *
 * @param {string} The path of the request.
 * @returns {ApiRequest} The API request object.
 */

const methods = ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS']

methods.forEach(method =>
  Api.prototype[method.toLowerCase()] = function requestMethod (path) {
    return this.request(method, path)
  }
)

export default Api
