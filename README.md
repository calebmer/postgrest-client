# PostgREST Client

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Isomorphic and integratabtle with any JavaScript framework, the PostgREST JavaScript client provides powerful bindings and features to be used exclusively with [PostgREST](https://github.com/begriffs/postgrest) APIs.

## Usage
1. Install with NPM in your project‘s folder.

   ```bash
   $ npm install postgrest-client
   ```

2. Require in your JavaScript code and create a new instance of the API.

   ```js
   var PostgREST = require('postgrest-client')

   var Api = new PostgREST('https://postgrest.herokuapp.com')
   ```

**TODO**: Specific PostgREST client builds for use outside of the Node.JS/NPM/CommonJS ecosystem.

## Isomorphic
As JavaScript grows it more and more begins to fulfill the promise of its namesake, Java: write once, run everywhere. The PostgREST client follows this goal. Whether it be a Node.JS server, a browser, or a refrigerator you should have a connection to your PostgREST API.

Keeping the file size as small as possible is another requirement of this goal. Having users download a mammoth JavaScript library is never fun, therefore the PostgREST client will always try to be as small as possible.

## Convenience
PostgREST client provides a great range of methods specifically designed for the wants and needs of JavaScript developers including chaining and advanced promise support. As promises are the future of JavaScript async code PostgREST fully embraces them. Using the PostgREST client in an async/await context couldn‘t be more easy.

```js
async function fetchPosts(authorId) {
  return await Api.get('/posts').match({ authorId })
}
```

## Feature checklist for 2.0
- [ ] Advanced caching.
- [ ] Response denormalization.
- [ ] Reactivity.

## Future Features
- Web socket integration.
- Data validation with schemas.
- Warnings for using outdated PostgREST instances.

## API
Currently, the PostgREST client is a simple skin over [`superagent`](http://visionmedia.github.io/superagent/). For a detailed explanation of all available base features, please see the `superagent` documentation. All enhancements will be described here.

### Api
The entry point to the client. This is a class which should be initialized for every PostgREST instance you have. It takes one string parameter, the root URL of the API.

```js
var api = new Api('https://postgrest.herokuapp.com')
```

#### Api#request(method, path)
Creates a new `ApiRequest` object which has a reference to the `Api` class. Accepts a method and a path parameter. It also has aliases for the most common methods.

```js
api.request('get', '/sessions')
api.get('/sessions')
api.post('/speakers')
api.patch('/speakers')
api.delete('/speakers')
api.options('/sponsors')
```

### ApiRequest
Extends functionality from the `superagent` request class. It has complete backwards compatibility except for the `#end()` method which now returns a promise and does not accept a callback. An `ApiRequest` is also then-able which means it may be treated like a promise.

When resolved, instead of returning the entire response, only the data object is returned. Some non-enumerable properties are attached to the data object such as `fullLength` which is an integer representing the total count of objects in the collection.

```js
var request = api.get('/sessions') // This is an `ApiRequest` object.

api.get('/sessions').then(data => console.log(data)) // Will print the data array.
api.get('/sessions').end().then(data => console.log(data)) // Behaves the exact same as above.
```

#### ApiRequest#auth(userOrToken, pass?)
When passed a single string, the request will be authenticated using the `Bearer` scheme. Two parameters will be the `Basic` scheme. An object with `user` and `pass` properties will also use the `Basic` scheme.

```js
api.get('/speakers').auth('bob', 'password') // Basic
api.get('/speakers').auth({ user: 'bob', pass: 'password' }) // Basic
api.get('/speakers').auth('xyz') // Bearer
```

#### ApiRequest#match(filterObject)
Takes an object and adds it to the query string except it also adds an `eq.` prefix to all the values.

```js
api.get('/speakers').match({ featured: true }) // /speakers?featured=eq.true
```

#### ApiRequest#select(selectString)
Takes a select string, strips all whitespace, and sets it to the query string. Helpful if you would like to write your select strings in an indented syntax.

```js
api.get('/sessions').select(`
  start_time,
  end_time,
  speaker {
    name,
    twitter
  }
`)
```

#### ApiRequest#order(property, ascending = false, nullsFirst = false)
Designates what order the response objects will be in.

```js
api.get('/sessions').order('start_time', true)
```

#### ApiRequest#range(from, to?)
The range of items to select from the collection. If the second parameter, `to`, is not defined all remaining objects will be selected.

```js
api.get('/speakers').range(0, 5)
api.get('/speakers').range(2, 4)
api.get('/speakers').range(5)
```

#### ApiRequest#single()
Sets the `Prefer` header to `plurality=singular`. This tells the API that you want the first object of the collection back, not an array.

```js
api.get('/speakers').match({ id: 1 }).single()
```

#### ApiRequest#\[filter](property, value)
These methods allows you to filter a request with ease. It takes the property and the value to filter by and uses the method name as the operation.

Supported abbreviations are:
- eq
- gt
- lt
- gte
- lte
- like
- ilike
- is
- in
- not

```js
api.get('/sessions').gt('start_time', Date.now())
api.get('/speakers').eq('twitter', 'calebmer')
api.get('/speakers').in('twitter', ['begriffs', 'ruslantalpa', 'diogob', 'adambaker'])
```
