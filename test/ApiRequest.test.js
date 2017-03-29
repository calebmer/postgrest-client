import assert from 'assert'
import ApiRequest from '../lib/ApiRequest'

describe('ApiRequest', () => {
  it('will only ever accept json', () => {
    const { req } = new ApiRequest('GET', '/')
    assert.equal(req._headers.accept, 'application/json')
  })

  it('will authorize in auth() using a token', () => {
    const { req } = new ApiRequest('GET', '/').auth('token')
    assert.equal(req._headers.authorization, 'Bearer token')
  })

  it('will authorize in auth() using a basic auth object', () => {
    const user = 'user'
    const pass = 'pass'
    const authHeader = new Buffer(`${user}:${pass}`).toString('base64')
    const { req } = new ApiRequest('GET', '/').auth({ user, pass })
    assert.equal(req._headers.authorization, `Basic ${authHeader}`)
  })

  it('will translate match() key/values to filter', () => {
    const { qs } = new ApiRequest('GET', '/').match({ key1: 'value1', key2: 'value2' })
    assert.deepEqual(qs, { key1: 'eq.value1', key2: 'eq.value2' })
  })

  it('won‘t assign to the passed match() filter', () => {
    const match = { key1: 'value1', key2: 'value2' }
    const { qs } = new ApiRequest('GET', '/').match(match)
    assert.deepEqual(qs, { key1: 'eq.value1', key2: 'eq.value2' })
    assert.deepEqual(match, { key1: 'value1', key2: 'value2' })
  })

  it('will return a promise from end()', () => {
    const request = new ApiRequest('GET', '/')
    assert(request.end() instanceof Promise)
  })

  it('will return same promise from second call of end()', () => {
    const request = new ApiRequest('GET', '/')
		const firstEndPromise = request.end()
		const secondEndPromise = request.end()
    assert(firstEndPromise === secondEndPromise)
  })

  it('can be resolved', done => {
    const request = new ApiRequest('GET', '/')
    Promise.resolve(request).catch(() => done())
  })

  it('can be used in an async/await context', async () => {
    try {
      await new ApiRequest('GET', '/')
      throw new Error('Another error should be thrown')
    }
    catch (error) {
      if (error.code !== 'ECONNREFUSED') {
        throw error
      }
    }
  })
})
