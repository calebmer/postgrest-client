var PostgREST = require('./lib/Api').default

PostgREST.default = PostgREST
PostgREST.Api = require('./lib/Api').default
PostgREST.ApiRequest = require('./lib/ApiRequest').default

module.exports = PostgREST
