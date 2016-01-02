var PostgREST = require('./dist/lib/Api').default

PostgREST.default = PostgREST
PostgREST.Api = require('./dist/lib/Api').default
PostgREST.ApiRequest = require('./dist/lib/ApiRequest').default

module.exports = PostgREST
