[server](../README.md) / [Exports](../modules.md) / [middleware/auth.middleware](../modules/middleware_auth_middleware.md) / AuthenticatedRequest

# Interface: AuthenticatedRequest

[middleware/auth.middleware](../modules/middleware_auth_middleware.md).AuthenticatedRequest

## Hierarchy

- `Request`

  ↳ **`AuthenticatedRequest`**

## Table of contents

### Properties

- [aborted](middleware_auth_middleware.AuthenticatedRequest.md#aborted)
- [accepted](middleware_auth_middleware.AuthenticatedRequest.md#accepted)
- [app](middleware_auth_middleware.AuthenticatedRequest.md#app)
- [baseUrl](middleware_auth_middleware.AuthenticatedRequest.md#baseurl)
- [body](middleware_auth_middleware.AuthenticatedRequest.md#body)
- [closed](middleware_auth_middleware.AuthenticatedRequest.md#closed)
- [complete](middleware_auth_middleware.AuthenticatedRequest.md#complete)
- [connection](middleware_auth_middleware.AuthenticatedRequest.md#connection)
- [cookies](middleware_auth_middleware.AuthenticatedRequest.md#cookies)
- [destroyed](middleware_auth_middleware.AuthenticatedRequest.md#destroyed)
- [errored](middleware_auth_middleware.AuthenticatedRequest.md#errored)
- [fresh](middleware_auth_middleware.AuthenticatedRequest.md#fresh)
- [headers](middleware_auth_middleware.AuthenticatedRequest.md#headers)
- [headersDistinct](middleware_auth_middleware.AuthenticatedRequest.md#headersdistinct)
- [host](middleware_auth_middleware.AuthenticatedRequest.md#host)
- [hostname](middleware_auth_middleware.AuthenticatedRequest.md#hostname)
- [httpVersion](middleware_auth_middleware.AuthenticatedRequest.md#httpversion)
- [httpVersionMajor](middleware_auth_middleware.AuthenticatedRequest.md#httpversionmajor)
- [httpVersionMinor](middleware_auth_middleware.AuthenticatedRequest.md#httpversionminor)
- [ip](middleware_auth_middleware.AuthenticatedRequest.md#ip)
- [ips](middleware_auth_middleware.AuthenticatedRequest.md#ips)
- [method](middleware_auth_middleware.AuthenticatedRequest.md#method)
- [next](middleware_auth_middleware.AuthenticatedRequest.md#next)
- [originalUrl](middleware_auth_middleware.AuthenticatedRequest.md#originalurl)
- [params](middleware_auth_middleware.AuthenticatedRequest.md#params)
- [path](middleware_auth_middleware.AuthenticatedRequest.md#path)
- [protocol](middleware_auth_middleware.AuthenticatedRequest.md#protocol)
- [query](middleware_auth_middleware.AuthenticatedRequest.md#query)
- [rawHeaders](middleware_auth_middleware.AuthenticatedRequest.md#rawheaders)
- [rawTrailers](middleware_auth_middleware.AuthenticatedRequest.md#rawtrailers)
- [readable](middleware_auth_middleware.AuthenticatedRequest.md#readable)
- [readableAborted](middleware_auth_middleware.AuthenticatedRequest.md#readableaborted)
- [readableDidRead](middleware_auth_middleware.AuthenticatedRequest.md#readabledidread)
- [readableEncoding](middleware_auth_middleware.AuthenticatedRequest.md#readableencoding)
- [readableEnded](middleware_auth_middleware.AuthenticatedRequest.md#readableended)
- [readableFlowing](middleware_auth_middleware.AuthenticatedRequest.md#readableflowing)
- [readableHighWaterMark](middleware_auth_middleware.AuthenticatedRequest.md#readablehighwatermark)
- [readableLength](middleware_auth_middleware.AuthenticatedRequest.md#readablelength)
- [readableObjectMode](middleware_auth_middleware.AuthenticatedRequest.md#readableobjectmode)
- [res](middleware_auth_middleware.AuthenticatedRequest.md#res)
- [route](middleware_auth_middleware.AuthenticatedRequest.md#route)
- [secure](middleware_auth_middleware.AuthenticatedRequest.md#secure)
- [signedCookies](middleware_auth_middleware.AuthenticatedRequest.md#signedcookies)
- [socket](middleware_auth_middleware.AuthenticatedRequest.md#socket)
- [stale](middleware_auth_middleware.AuthenticatedRequest.md#stale)
- [statusCode](middleware_auth_middleware.AuthenticatedRequest.md#statuscode)
- [statusMessage](middleware_auth_middleware.AuthenticatedRequest.md#statusmessage)
- [subdomains](middleware_auth_middleware.AuthenticatedRequest.md#subdomains)
- [trailers](middleware_auth_middleware.AuthenticatedRequest.md#trailers)
- [trailersDistinct](middleware_auth_middleware.AuthenticatedRequest.md#trailersdistinct)
- [url](middleware_auth_middleware.AuthenticatedRequest.md#url)
- [user](middleware_auth_middleware.AuthenticatedRequest.md#user)
- [xhr](middleware_auth_middleware.AuthenticatedRequest.md#xhr)

### Methods

- [[asyncDispose]](middleware_auth_middleware.AuthenticatedRequest.md#[asyncdispose])
- [[asyncIterator]](middleware_auth_middleware.AuthenticatedRequest.md#[asynciterator])
- [[captureRejectionSymbol]](middleware_auth_middleware.AuthenticatedRequest.md#[capturerejectionsymbol])
- [\_construct](middleware_auth_middleware.AuthenticatedRequest.md#_construct)
- [\_destroy](middleware_auth_middleware.AuthenticatedRequest.md#_destroy)
- [\_read](middleware_auth_middleware.AuthenticatedRequest.md#_read)
- [accepts](middleware_auth_middleware.AuthenticatedRequest.md#accepts)
- [acceptsCharsets](middleware_auth_middleware.AuthenticatedRequest.md#acceptscharsets)
- [acceptsEncodings](middleware_auth_middleware.AuthenticatedRequest.md#acceptsencodings)
- [acceptsLanguages](middleware_auth_middleware.AuthenticatedRequest.md#acceptslanguages)
- [addListener](middleware_auth_middleware.AuthenticatedRequest.md#addlistener)
- [asIndexedPairs](middleware_auth_middleware.AuthenticatedRequest.md#asindexedpairs)
- [compose](middleware_auth_middleware.AuthenticatedRequest.md#compose)
- [destroy](middleware_auth_middleware.AuthenticatedRequest.md#destroy)
- [drop](middleware_auth_middleware.AuthenticatedRequest.md#drop)
- [emit](middleware_auth_middleware.AuthenticatedRequest.md#emit)
- [eventNames](middleware_auth_middleware.AuthenticatedRequest.md#eventnames)
- [every](middleware_auth_middleware.AuthenticatedRequest.md#every)
- [filter](middleware_auth_middleware.AuthenticatedRequest.md#filter)
- [find](middleware_auth_middleware.AuthenticatedRequest.md#find)
- [flatMap](middleware_auth_middleware.AuthenticatedRequest.md#flatmap)
- [forEach](middleware_auth_middleware.AuthenticatedRequest.md#foreach)
- [get](middleware_auth_middleware.AuthenticatedRequest.md#get)
- [getMaxListeners](middleware_auth_middleware.AuthenticatedRequest.md#getmaxlisteners)
- [header](middleware_auth_middleware.AuthenticatedRequest.md#header)
- [is](middleware_auth_middleware.AuthenticatedRequest.md#is)
- [isPaused](middleware_auth_middleware.AuthenticatedRequest.md#ispaused)
- [iterator](middleware_auth_middleware.AuthenticatedRequest.md#iterator)
- [listenerCount](middleware_auth_middleware.AuthenticatedRequest.md#listenercount)
- [listeners](middleware_auth_middleware.AuthenticatedRequest.md#listeners)
- [map](middleware_auth_middleware.AuthenticatedRequest.md#map)
- [off](middleware_auth_middleware.AuthenticatedRequest.md#off)
- [on](middleware_auth_middleware.AuthenticatedRequest.md#on)
- [once](middleware_auth_middleware.AuthenticatedRequest.md#once)
- [pause](middleware_auth_middleware.AuthenticatedRequest.md#pause)
- [pipe](middleware_auth_middleware.AuthenticatedRequest.md#pipe)
- [prependListener](middleware_auth_middleware.AuthenticatedRequest.md#prependlistener)
- [prependOnceListener](middleware_auth_middleware.AuthenticatedRequest.md#prependoncelistener)
- [push](middleware_auth_middleware.AuthenticatedRequest.md#push)
- [range](middleware_auth_middleware.AuthenticatedRequest.md#range)
- [rawListeners](middleware_auth_middleware.AuthenticatedRequest.md#rawlisteners)
- [read](middleware_auth_middleware.AuthenticatedRequest.md#read)
- [reduce](middleware_auth_middleware.AuthenticatedRequest.md#reduce)
- [removeAllListeners](middleware_auth_middleware.AuthenticatedRequest.md#removealllisteners)
- [removeListener](middleware_auth_middleware.AuthenticatedRequest.md#removelistener)
- [resume](middleware_auth_middleware.AuthenticatedRequest.md#resume)
- [setEncoding](middleware_auth_middleware.AuthenticatedRequest.md#setencoding)
- [setMaxListeners](middleware_auth_middleware.AuthenticatedRequest.md#setmaxlisteners)
- [setTimeout](middleware_auth_middleware.AuthenticatedRequest.md#settimeout)
- [some](middleware_auth_middleware.AuthenticatedRequest.md#some)
- [take](middleware_auth_middleware.AuthenticatedRequest.md#take)
- [toArray](middleware_auth_middleware.AuthenticatedRequest.md#toarray)
- [unpipe](middleware_auth_middleware.AuthenticatedRequest.md#unpipe)
- [unshift](middleware_auth_middleware.AuthenticatedRequest.md#unshift)
- [wrap](middleware_auth_middleware.AuthenticatedRequest.md#wrap)

## Properties

### aborted

• **aborted**: `boolean`

The `message.aborted` property will be `true` if the request has
been aborted.

**`Since`**

v10.1.0

**`Deprecated`**

Since v17.0.0,v16.12.0 - Check `message.destroyed` from <a href="stream.html#class-streamreadable" class="type">stream.Readable</a>.

#### Inherited from

Request.aborted

#### Defined in

node_modules/@types/node/http.d.ts:1206

___

### accepted

• **accepted**: `MediaType`[]

Return an array of Accepted media types
ordered from highest quality to lowest.

#### Inherited from

Request.accepted

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:523

___

### app

• **app**: `Application`\<`Record`\<`string`, `any`\>\>

#### Inherited from

Request.app

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:654

___

### baseUrl

• **baseUrl**: `string`

#### Inherited from

Request.baseUrl

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:652

___

### body

• **body**: `any`

#### Inherited from

Request.body

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:633

___

### closed

• `Readonly` **closed**: `boolean`

Is `true` after `'close'` has been emitted.

**`Since`**

v18.0.0

#### Inherited from

Request.closed

#### Defined in

node_modules/@types/node/stream.d.ts:157

___

### complete

• **complete**: `boolean`

The `message.complete` property will be `true` if a complete HTTP message has
been received and successfully parsed.

This property is particularly useful as a means of determining if a client or
server fully transmitted a message before a connection was terminated:

```js
const req = http.request({
  host: '127.0.0.1',
  port: 8080,
  method: 'POST',
}, (res) => {
  res.resume();
  res.on('end', () => {
    if (!res.complete)
      console.error(
        'The connection was terminated while the message was still being sent');
  });
});
```

**`Since`**

v0.3.0

#### Inherited from

Request.complete

#### Defined in

node_modules/@types/node/http.d.ts:1241

___

### connection

• **connection**: `Socket`

Alias for `message.socket`.

**`Since`**

v0.1.90

**`Deprecated`**

Since v16.0.0 - Use `socket`.

#### Inherited from

Request.connection

#### Defined in

node_modules/@types/node/http.d.ts:1247

___

### cookies

• **cookies**: `any`

#### Inherited from

Request.cookies

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:636

___

### destroyed

• **destroyed**: `boolean`

Is `true` after `readable.destroy()` has been called.

**`Since`**

v8.0.0

#### Inherited from

Request.destroyed

#### Defined in

node_modules/@types/node/stream.d.ts:152

___

### errored

• `Readonly` **errored**: ``null`` \| `Error`

Returns error if the stream has been destroyed with an error.

**`Since`**

v18.0.0

#### Inherited from

Request.errored

#### Defined in

node_modules/@types/node/stream.d.ts:162

___

### fresh

• `Readonly` **fresh**: `boolean`

Check if the request is fresh, aka
Last-Modified and/or the ETag
still match.

#### Inherited from

Request.fresh

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:618

___

### headers

• **headers**: `IncomingHttpHeaders`

The request/response headers object.

Key-value pairs of header names and values. Header names are lower-cased.

```js
// Prints something like:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*' }
console.log(request.headers);
```

Duplicates in raw headers are handled in the following ways, depending on the
header name:

* Duplicates of `age`, `authorization`, `content-length`, `content-type`, `etag`, `expires`, `from`, `host`, `if-modified-since`, `if-unmodified-since`, `last-modified`, `location`,
`max-forwards`, `proxy-authorization`, `referer`, `retry-after`, `server`, or `user-agent` are discarded.
To allow duplicate values of the headers listed above to be joined,
use the option `joinDuplicateHeaders` in request and createServer. See RFC 9110 Section 5.3 for more
information.
* `set-cookie` is always an array. Duplicates are added to the array.
* For duplicate `cookie` headers, the values are joined together with `; `.
* For all other headers, the values are joined together with `, `.

**`Since`**

v0.1.5

#### Inherited from

Request.headers

#### Defined in

node_modules/@types/node/http.d.ts:1287

___

### headersDistinct

• **headersDistinct**: `Dict`\<`string`[]\>

Similar to `message.headers`, but there is no join logic and the values are
always arrays of strings, even for headers received just once.

```js
// Prints something like:
//
// { 'user-agent': ['curl/7.22.0'],
//   host: ['127.0.0.1:8000'],
//   accept: ['*'] }
console.log(request.headersDistinct);
```

**`Since`**

v18.3.0, v16.17.0

#### Inherited from

Request.headersDistinct

#### Defined in

node_modules/@types/node/http.d.ts:1302

___

### host

• `Readonly` **host**: `string`

Contains the host derived from the `Host` HTTP header.

#### Inherited from

Request.host

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:611

___

### hostname

• `Readonly` **hostname**: `string`

Contains the hostname derived from the `Host` HTTP header.

#### Inherited from

Request.hostname

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:606

___

### httpVersion

• **httpVersion**: `string`

In case of server request, the HTTP version sent by the client. In the case of
client response, the HTTP version of the connected-to server.
Probably either `'1.1'` or `'1.0'`.

Also `message.httpVersionMajor` is the first integer and `message.httpVersionMinor` is the second.

**`Since`**

v0.1.1

#### Inherited from

Request.httpVersion

#### Defined in

node_modules/@types/node/http.d.ts:1215

___

### httpVersionMajor

• **httpVersionMajor**: `number`

#### Inherited from

Request.httpVersionMajor

#### Defined in

node_modules/@types/node/http.d.ts:1216

___

### httpVersionMinor

• **httpVersionMinor**: `number`

#### Inherited from

Request.httpVersionMinor

#### Defined in

node_modules/@types/node/http.d.ts:1217

___

### ip

• `Readonly` **ip**: `undefined` \| `string`

Return the remote address, or when
"trust proxy" is `true` return
the upstream addr.

Value may be undefined if the `req.socket` is destroyed
(for example, if the client disconnected).

#### Inherited from

Request.ip

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:573

___

### ips

• `Readonly` **ips**: `string`[]

When "trust proxy" is `true`, parse
the "X-Forwarded-For" ip address list.

For example if the value were "client, proxy1, proxy2"
you would receive the array `["client", "proxy1", "proxy2"]`
where "proxy2" is the furthest down-stream.

#### Inherited from

Request.ips

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:583

___

### method

• **method**: `string`

#### Inherited from

Request.method

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:638

___

### next

• `Optional` **next**: `NextFunction`

#### Inherited from

Request.next

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:661

___

### originalUrl

• **originalUrl**: `string`

#### Inherited from

Request.originalUrl

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:648

___

### params

• **params**: `ParamsDictionary`

#### Inherited from

Request.params

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:640

___

### path

• `Readonly` **path**: `string`

Short-hand for `url.parse(req.url).pathname`.

#### Inherited from

Request.path

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:601

___

### protocol

• `Readonly` **protocol**: `string`

Return the protocol string "http" or "https"
when requested with TLS. When the "trust proxy"
setting is enabled the "X-Forwarded-Proto" header
field will be trusted. If you're running behind
a reverse proxy that supplies https for you this
may be enabled.

#### Inherited from

Request.protocol

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:556

___

### query

• **query**: `ParsedQs`

#### Inherited from

Request.query

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:642

___

### rawHeaders

• **rawHeaders**: `string`[]

The raw request/response headers list exactly as they were received.

The keys and values are in the same list. It is _not_ a
list of tuples. So, the even-numbered offsets are key values, and the
odd-numbered offsets are the associated values.

Header names are not lowercased, and duplicates are not merged.

```js
// Prints something like:
//
// [ 'user-agent',
//   'this is invalid because there can be only one',
//   'User-Agent',
//   'curl/7.22.0',
//   'Host',
//   '127.0.0.1:8000',
//   'ACCEPT',
//   '*' ]
console.log(request.rawHeaders);
```

**`Since`**

v0.11.6

#### Inherited from

Request.rawHeaders

#### Defined in

node_modules/@types/node/http.d.ts:1327

___

### rawTrailers

• **rawTrailers**: `string`[]

The raw request/response trailer keys and values exactly as they were
received. Only populated at the `'end'` event.

**`Since`**

v0.11.6

#### Inherited from

Request.rawTrailers

#### Defined in

node_modules/@types/node/http.d.ts:1345

___

### readable

• **readable**: `boolean`

Is `true` if it is safe to call [read](middleware_auth_middleware.AuthenticatedRequest.md#read), which means
the stream has not been destroyed or emitted `'error'` or `'end'`.

**`Since`**

v11.4.0

#### Inherited from

Request.readable

#### Defined in

node_modules/@types/node/stream.d.ts:109

___

### readableAborted

• `Readonly` **readableAborted**: `boolean`

Returns whether the stream was destroyed or errored before emitting `'end'`.

**`Since`**

v16.8.0

#### Inherited from

Request.readableAborted

#### Defined in

node_modules/@types/node/stream.d.ts:103

___

### readableDidRead

• `Readonly` **readableDidRead**: `boolean`

Returns whether `'data'` has been emitted.

**`Since`**

v16.7.0, v14.18.0

#### Inherited from

Request.readableDidRead

#### Defined in

node_modules/@types/node/stream.d.ts:114

___

### readableEncoding

• `Readonly` **readableEncoding**: ``null`` \| `BufferEncoding`

Getter for the property `encoding` of a given `Readable` stream. The `encoding` property can be set using the [setEncoding](middleware_auth_middleware.AuthenticatedRequest.md#setencoding) method.

**`Since`**

v12.7.0

#### Inherited from

Request.readableEncoding

#### Defined in

node_modules/@types/node/stream.d.ts:119

___

### readableEnded

• `Readonly` **readableEnded**: `boolean`

Becomes `true` when [`'end'`](https://nodejs.org/docs/latest-v24.x/api/stream.html#event-end) event is emitted.

**`Since`**

v12.9.0

#### Inherited from

Request.readableEnded

#### Defined in

node_modules/@types/node/stream.d.ts:124

___

### readableFlowing

• `Readonly` **readableFlowing**: ``null`` \| `boolean`

This property reflects the current state of a `Readable` stream as described
in the [Three states](https://nodejs.org/docs/latest-v24.x/api/stream.html#three-states) section.

**`Since`**

v9.4.0

#### Inherited from

Request.readableFlowing

#### Defined in

node_modules/@types/node/stream.d.ts:130

___

### readableHighWaterMark

• `Readonly` **readableHighWaterMark**: `number`

Returns the value of `highWaterMark` passed when creating this `Readable`.

**`Since`**

v9.3.0

#### Inherited from

Request.readableHighWaterMark

#### Defined in

node_modules/@types/node/stream.d.ts:135

___

### readableLength

• `Readonly` **readableLength**: `number`

This property contains the number of bytes (or objects) in the queue
ready to be read. The value provides introspection data regarding
the status of the `highWaterMark`.

**`Since`**

v9.4.0

#### Inherited from

Request.readableLength

#### Defined in

node_modules/@types/node/stream.d.ts:142

___

### readableObjectMode

• `Readonly` **readableObjectMode**: `boolean`

Getter for the property `objectMode` of a given `Readable` stream.

**`Since`**

v12.3.0

#### Inherited from

Request.readableObjectMode

#### Defined in

node_modules/@types/node/stream.d.ts:147

___

### res

• `Optional` **res**: `Response`\<`any`, `Record`\<`string`, `any`\>, `number`\>

After middleware.init executed, Request will contain res and next properties
See: express/lib/middleware/init.js

#### Inherited from

Request.res

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:660

___

### route

• **route**: `any`

#### Inherited from

Request.route

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:644

___

### secure

• `Readonly` **secure**: `boolean`

Short-hand for:

   req.protocol == 'https'

#### Inherited from

Request.secure

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:563

___

### signedCookies

• **signedCookies**: `any`

#### Inherited from

Request.signedCookies

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:646

___

### socket

• **socket**: `Socket`

The `net.Socket` object associated with the connection.

With HTTPS support, use `request.socket.getPeerCertificate()` to obtain the
client's authentication details.

This property is guaranteed to be an instance of the `net.Socket` class,
a subclass of `stream.Duplex`, unless the user specified a socket
type other than `net.Socket` or internally nulled.

**`Since`**

v0.3.0

#### Inherited from

Request.socket

#### Defined in

node_modules/@types/node/http.d.ts:1259

___

### stale

• `Readonly` **stale**: `boolean`

Check if the request is stale, aka
"Last-Modified" and / or the "ETag" for the
resource has changed.

#### Inherited from

Request.stale

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:625

___

### statusCode

• `Optional` **statusCode**: `number`

**Only valid for response obtained from ClientRequest.**

The 3-digit HTTP response status code. E.G. `404`.

**`Since`**

v0.1.1

#### Inherited from

Request.statusCode

#### Defined in

node_modules/@types/node/http.d.ts:1407

___

### statusMessage

• `Optional` **statusMessage**: `string`

**Only valid for response obtained from ClientRequest.**

The HTTP response status message (reason phrase). E.G. `OK` or `Internal Server Error`.

**`Since`**

v0.11.10

#### Inherited from

Request.statusMessage

#### Defined in

node_modules/@types/node/http.d.ts:1414

___

### subdomains

• `Readonly` **subdomains**: `string`[]

Return subdomains as an array.

Subdomains are the dot-separated parts of the host before the main domain of
the app. By default, the domain of the app is assumed to be the last two
parts of the host. This can be changed by setting "subdomain offset".

For example, if the domain is "tobi.ferrets.example.com":
If "subdomain offset" is not set, req.subdomains is `["ferrets", "tobi"]`.
If "subdomain offset" is 3, req.subdomains is `["tobi"]`.

#### Inherited from

Request.subdomains

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:596

___

### trailers

• **trailers**: `Dict`\<`string`\>

The request/response trailers object. Only populated at the `'end'` event.

**`Since`**

v0.3.0

#### Inherited from

Request.trailers

#### Defined in

node_modules/@types/node/http.d.ts:1332

___

### trailersDistinct

• **trailersDistinct**: `Dict`\<`string`[]\>

Similar to `message.trailers`, but there is no join logic and the values are
always arrays of strings, even for headers received just once.
Only populated at the `'end'` event.

**`Since`**

v18.3.0, v16.17.0

#### Inherited from

Request.trailersDistinct

#### Defined in

node_modules/@types/node/http.d.ts:1339

___

### url

• **url**: `string`

#### Inherited from

Request.url

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:650

___

### user

• `Optional` **user**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `email?` | `string` |
| `role?` | `string` |
| `userId` | `number` |

#### Defined in

[server/src/middleware/auth.middleware.ts:12](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/middleware/auth.middleware.ts#L12)

___

### xhr

• `Readonly` **xhr**: `boolean`

Check if the request was an _XMLHttpRequest_.

#### Inherited from

Request.xhr

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:630

## Methods

### [asyncDispose]

▸ **[asyncDispose]**(): `Promise`\<`void`\>

Calls `readable.destroy()` with an `AbortError` and returns a promise that fulfills when the stream is finished.

#### Returns

`Promise`\<`void`\>

**`Since`**

v20.4.0

#### Inherited from

Request.[asyncDispose]

#### Defined in

node_modules/@types/node/stream.d.ts:690

___

### [asyncIterator]

▸ **[asyncIterator]**(): `AsyncIterator`\<`any`, `undefined`, `any`\>

#### Returns

`AsyncIterator`\<`any`, `undefined`, `any`\>

#### Inherited from

Request.[asyncIterator]

#### Defined in

node_modules/@types/node/stream.d.ts:685

___

### [captureRejectionSymbol]

▸ **[captureRejectionSymbol]**\<`K`\>(`error`, `event`, `...args`): `void`

#### Type parameters

| Name |
| :------ |
| `K` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `Error` |
| `event` | `string` \| `symbol` |
| `...args` | `AnyRest` |

#### Returns

`void`

#### Inherited from

Request.[captureRejectionSymbol]

#### Defined in

node_modules/@types/node/events.d.ts:136

___

### \_construct

▸ **_construct**(`callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

#### Inherited from

Request.\_construct

#### Defined in

node_modules/@types/node/stream.d.ts:164

___

### \_destroy

▸ **_destroy**(`error`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | ``null`` \| `Error` |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

#### Inherited from

Request.\_destroy

#### Defined in

node_modules/@types/node/stream.d.ts:605

___

### \_read

▸ **_read**(`size`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`void`

#### Inherited from

Request.\_read

#### Defined in

node_modules/@types/node/stream.d.ts:165

___

### accepts

▸ **accepts**(): `string`[]

Check if the given `type(s)` is acceptable, returning
the best match when true, otherwise `undefined`, in which
case you should respond with 406 "Not Acceptable".

The `type` value may be a single mime type string
such as "application/json", the extension name
such as "json", a comma-delimted list such as "json, html, text/plain",
or an array `["json", "html", "text/plain"]`. When a list
or array is given the _best_ match, if any is returned.

Examples:

    // Accept: text/html
    req.accepts('html');
    // => "html"

    // Accept: text/*, application/json
    req.accepts('html');
    // => "html"
    req.accepts('text/html');
    // => "text/html"
    req.accepts('json, text');
    // => "json"
    req.accepts('application/json');
    // => "application/json"

    // Accept: text/*, application/json
    req.accepts('image/png');
    req.accepts('png');
    // => false

    // Accept: text/*;q=.5, application/json
    req.accepts(['html', 'json']);
    req.accepts('html, json');
    // => "json"

#### Returns

`string`[]

#### Inherited from

Request.accepts

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:464

▸ **accepts**(`type`): `string` \| ``false``

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |

#### Returns

`string` \| ``false``

#### Inherited from

Request.accepts

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:465

▸ **accepts**(`type`): `string` \| ``false``

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string`[] |

#### Returns

`string` \| ``false``

#### Inherited from

Request.accepts

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:466

▸ **accepts**(`...type`): `string` \| ``false``

#### Parameters

| Name | Type |
| :------ | :------ |
| `...type` | `string`[] |

#### Returns

`string` \| ``false``

#### Inherited from

Request.accepts

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:467

___

### acceptsCharsets

▸ **acceptsCharsets**(): `string`[]

Returns the first accepted charset of the specified character sets,
based on the request's Accept-Charset HTTP header field.
If none of the specified charsets is accepted, returns false.

For more information, or if you have issues or concerns, see accepts.

#### Returns

`string`[]

#### Inherited from

Request.acceptsCharsets

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:476

▸ **acceptsCharsets**(`charset`): `string` \| ``false``

#### Parameters

| Name | Type |
| :------ | :------ |
| `charset` | `string` |

#### Returns

`string` \| ``false``

#### Inherited from

Request.acceptsCharsets

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:477

▸ **acceptsCharsets**(`charset`): `string` \| ``false``

#### Parameters

| Name | Type |
| :------ | :------ |
| `charset` | `string`[] |

#### Returns

`string` \| ``false``

#### Inherited from

Request.acceptsCharsets

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:478

▸ **acceptsCharsets**(`...charset`): `string` \| ``false``

#### Parameters

| Name | Type |
| :------ | :------ |
| `...charset` | `string`[] |

#### Returns

`string` \| ``false``

#### Inherited from

Request.acceptsCharsets

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:479

___

### acceptsEncodings

▸ **acceptsEncodings**(): `string`[]

Returns the first accepted encoding of the specified encodings,
based on the request's Accept-Encoding HTTP header field.
If none of the specified encodings is accepted, returns false.

For more information, or if you have issues or concerns, see accepts.

#### Returns

`string`[]

#### Inherited from

Request.acceptsEncodings

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:488

▸ **acceptsEncodings**(`encoding`): `string` \| ``false``

#### Parameters

| Name | Type |
| :------ | :------ |
| `encoding` | `string` |

#### Returns

`string` \| ``false``

#### Inherited from

Request.acceptsEncodings

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:489

▸ **acceptsEncodings**(`encoding`): `string` \| ``false``

#### Parameters

| Name | Type |
| :------ | :------ |
| `encoding` | `string`[] |

#### Returns

`string` \| ``false``

#### Inherited from

Request.acceptsEncodings

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:490

▸ **acceptsEncodings**(`...encoding`): `string` \| ``false``

#### Parameters

| Name | Type |
| :------ | :------ |
| `...encoding` | `string`[] |

#### Returns

`string` \| ``false``

#### Inherited from

Request.acceptsEncodings

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:491

___

### acceptsLanguages

▸ **acceptsLanguages**(): `string`[]

Returns the first accepted language of the specified languages,
based on the request's Accept-Language HTTP header field.
If none of the specified languages is accepted, returns false.

For more information, or if you have issues or concerns, see accepts.

#### Returns

`string`[]

#### Inherited from

Request.acceptsLanguages

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:500

▸ **acceptsLanguages**(`lang`): `string` \| ``false``

#### Parameters

| Name | Type |
| :------ | :------ |
| `lang` | `string` |

#### Returns

`string` \| ``false``

#### Inherited from

Request.acceptsLanguages

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:501

▸ **acceptsLanguages**(`lang`): `string` \| ``false``

#### Parameters

| Name | Type |
| :------ | :------ |
| `lang` | `string`[] |

#### Returns

`string` \| ``false``

#### Inherited from

Request.acceptsLanguages

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:502

▸ **acceptsLanguages**(`...lang`): `string` \| ``false``

#### Parameters

| Name | Type |
| :------ | :------ |
| `...lang` | `string`[] |

#### Returns

`string` \| ``false``

#### Inherited from

Request.acceptsLanguages

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:503

___

### addListener

▸ **addListener**(`event`, `listener`): `this`

Event emitter
The defined events on documents including:
1. close
2. data
3. end
4. error
5. pause
6. readable
7. resume

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.addListener

#### Defined in

node_modules/@types/node/stream.d.ts:629

▸ **addListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

`this`

#### Inherited from

Request.addListener

#### Defined in

node_modules/@types/node/stream.d.ts:630

▸ **addListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.addListener

#### Defined in

node_modules/@types/node/stream.d.ts:631

▸ **addListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

`this`

#### Inherited from

Request.addListener

#### Defined in

node_modules/@types/node/stream.d.ts:632

▸ **addListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.addListener

#### Defined in

node_modules/@types/node/stream.d.ts:633

▸ **addListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.addListener

#### Defined in

node_modules/@types/node/stream.d.ts:634

▸ **addListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.addListener

#### Defined in

node_modules/@types/node/stream.d.ts:635

▸ **addListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`this`

#### Inherited from

Request.addListener

#### Defined in

node_modules/@types/node/stream.d.ts:636

___

### asIndexedPairs

▸ **asIndexedPairs**(`options?`): `Readable`

This method returns a new stream with chunks of the underlying stream paired with a counter
in the form `[index, chunk]`. The first index value is `0` and it increases by 1 for each chunk produced.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Pick`\<`ArrayOptions`, ``"signal"``\> |

#### Returns

`Readable`

a stream of indexed pairs.

**`Since`**

v17.5.0

#### Inherited from

Request.asIndexedPairs

#### Defined in

node_modules/@types/node/stream.d.ts:580

___

### compose

▸ **compose**\<`T`\>(`stream`, `options?`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `ReadableStream` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `stream` | `ComposeFnParam` \| `T` \| `Iterable`\<`T`\> \| `AsyncIterable`\<`T`\> |
| `options?` | `Object` |
| `options.signal` | `AbortSignal` |

#### Returns

`T`

#### Inherited from

Request.compose

#### Defined in

node_modules/@types/node/stream.d.ts:35

___

### destroy

▸ **destroy**(`error?`): `this`

Calls `destroy()` on the socket that received the `IncomingMessage`. If `error` is provided, an `'error'` event is emitted on the socket and `error` is passed
as an argument to any listeners on the event.

#### Parameters

| Name | Type |
| :------ | :------ |
| `error?` | `Error` |

#### Returns

`this`

**`Since`**

v0.3.0

#### Inherited from

Request.destroy

#### Defined in

node_modules/@types/node/http.d.ts:1420

___

### drop

▸ **drop**(`limit`, `options?`): `Readable`

This method returns a new stream with the first *limit* chunks dropped from the start.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `limit` | `number` | the number of chunks to drop from the readable. |
| `options?` | `Pick`\<`ArrayOptions`, ``"signal"``\> | - |

#### Returns

`Readable`

a stream with *limit* chunks dropped from the start.

**`Since`**

v17.5.0

#### Inherited from

Request.drop

#### Defined in

node_modules/@types/node/stream.d.ts:566

___

### emit

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |

#### Returns

`boolean`

#### Inherited from

Request.emit

#### Defined in

node_modules/@types/node/stream.d.ts:637

▸ **emit**(`event`, `chunk`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `chunk` | `any` |

#### Returns

`boolean`

#### Inherited from

Request.emit

#### Defined in

node_modules/@types/node/stream.d.ts:638

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |

#### Returns

`boolean`

#### Inherited from

Request.emit

#### Defined in

node_modules/@types/node/stream.d.ts:639

▸ **emit**(`event`, `err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `err` | `Error` |

#### Returns

`boolean`

#### Inherited from

Request.emit

#### Defined in

node_modules/@types/node/stream.d.ts:640

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |

#### Returns

`boolean`

#### Inherited from

Request.emit

#### Defined in

node_modules/@types/node/stream.d.ts:641

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |

#### Returns

`boolean`

#### Inherited from

Request.emit

#### Defined in

node_modules/@types/node/stream.d.ts:642

▸ **emit**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |

#### Returns

`boolean`

#### Inherited from

Request.emit

#### Defined in

node_modules/@types/node/stream.d.ts:643

▸ **emit**(`event`, `...args`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Inherited from

Request.emit

#### Defined in

node_modules/@types/node/stream.d.ts:644

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

Returns an array listing the events for which the emitter has registered
listeners. The values in the array are strings or `Symbol`s.

```js
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

#### Returns

(`string` \| `symbol`)[]

**`Since`**

v6.0.0

#### Inherited from

Request.eventNames

#### Defined in

node_modules/@types/node/events.d.ts:921

___

### every

▸ **every**(`fn`, `options?`): `Promise`\<`boolean`\>

This method is similar to `Array.prototype.every` and calls *fn* on each chunk in the stream
to check if all awaited return values are truthy value for *fn*. Once an *fn* call on a chunk
`await`ed return value is falsy, the stream is destroyed and the promise is fulfilled with `false`.
If all of the *fn* calls on the chunks return a truthy value, the promise is fulfilled with `true`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`data`: `any`, `options?`: `Pick`\<`ArrayOptions`, ``"signal"``\>) => `boolean` \| `Promise`\<`boolean`\> | a function to call on each chunk of the stream. Async or not. |
| `options?` | `ArrayOptions` | - |

#### Returns

`Promise`\<`boolean`\>

a promise evaluating to `true` if *fn* returned a truthy value for every one of the chunks.

**`Since`**

v17.5.0

#### Inherited from

Request.every

#### Defined in

node_modules/@types/node/stream.d.ts:545

___

### filter

▸ **filter**(`fn`, `options?`): `Readable`

This method allows filtering the stream. For each chunk in the stream the *fn* function will be called
and if it returns a truthy value, the chunk will be passed to the result stream.
If the *fn* function returns a promise - that promise will be `await`ed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`data`: `any`, `options?`: `Pick`\<`ArrayOptions`, ``"signal"``\>) => `boolean` \| `Promise`\<`boolean`\> | a function to filter chunks from the stream. Async or not. |
| `options?` | `ArrayOptions` | - |

#### Returns

`Readable`

a stream filtered with the predicate *fn*.

**`Since`**

v17.4.0, v16.14.0

#### Inherited from

Request.filter

#### Defined in

node_modules/@types/node/stream.d.ts:473

___

### find

▸ **find**\<`T`\>(`fn`, `options?`): `Promise`\<`undefined` \| `T`\>

This method is similar to `Array.prototype.find` and calls *fn* on each chunk in the stream
to find a chunk with a truthy value for *fn*. Once an *fn* call's awaited return value is truthy,
the stream is destroyed and the promise is fulfilled with value for which *fn* returned a truthy value.
If all of the *fn* calls on the chunks return a falsy value, the promise is fulfilled with `undefined`.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`data`: `any`, `options?`: `Pick`\<`ArrayOptions`, ``"signal"``\>) => data is T | a function to call on each chunk of the stream. Async or not. |
| `options?` | `ArrayOptions` | - |

#### Returns

`Promise`\<`undefined` \| `T`\>

a promise evaluating to the first chunk for which *fn* evaluated with a truthy value,
or `undefined` if no element was found.

**`Since`**

v17.5.0

#### Inherited from

Request.find

#### Defined in

node_modules/@types/node/stream.d.ts:528

▸ **find**(`fn`, `options?`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | (`data`: `any`, `options?`: `Pick`\<`ArrayOptions`, ``"signal"``\>) => `boolean` \| `Promise`\<`boolean`\> |
| `options?` | `ArrayOptions` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

Request.find

#### Defined in

node_modules/@types/node/stream.d.ts:532

___

### flatMap

▸ **flatMap**(`fn`, `options?`): `Readable`

This method returns a new stream by applying the given callback to each chunk of the stream
and then flattening the result.

It is possible to return a stream or another iterable or async iterable from *fn* and the result streams
will be merged (flattened) into the returned stream.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`data`: `any`, `options?`: `Pick`\<`ArrayOptions`, ``"signal"``\>) => `any` | a function to map over every chunk in the stream. May be async. May be a stream or generator. |
| `options?` | `ArrayOptions` | - |

#### Returns

`Readable`

a stream flat-mapped with the function *fn*.

**`Since`**

v17.5.0

#### Inherited from

Request.flatMap

#### Defined in

node_modules/@types/node/stream.d.ts:559

___

### forEach

▸ **forEach**(`fn`, `options?`): `Promise`\<`void`\>

This method allows iterating a stream. For each chunk in the stream the *fn* function will be called.
If the *fn* function returns a promise - that promise will be `await`ed.

This method is different from `for await...of` loops in that it can optionally process chunks concurrently.
In addition, a `forEach` iteration can only be stopped by having passed a `signal` option
and aborting the related AbortController while `for await...of` can be stopped with `break` or `return`.
In either case the stream will be destroyed.

This method is different from listening to the `'data'` event in that it uses the `readable` event
in the underlying machinary and can limit the number of concurrent *fn* calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`data`: `any`, `options?`: `Pick`\<`ArrayOptions`, ``"signal"``\>) => `void` \| `Promise`\<`void`\> | a function to call on each chunk of the stream. Async or not. |
| `options?` | `ArrayOptions` | - |

#### Returns

`Promise`\<`void`\>

a promise for when the stream has finished.

**`Since`**

v17.5.0

#### Inherited from

Request.forEach

#### Defined in

node_modules/@types/node/stream.d.ts:492

___

### get

▸ **get**(`name`): `undefined` \| `string`[]

Return request header.

The `Referrer` header field is special-cased,
both `Referrer` and `Referer` are interchangeable.

Examples:

    req.get('Content-Type');
    // => "text/plain"

    req.get('content-type');
    // => "text/plain"

    req.get('Something');
    // => undefined

Aliased as `req.header()`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | ``"set-cookie"`` |

#### Returns

`undefined` \| `string`[]

#### Inherited from

Request.get

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:421

▸ **get**(`name`): `undefined` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`undefined` \| `string`

#### Inherited from

Request.get

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:422

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to EventEmitter.defaultMaxListeners.

#### Returns

`number`

**`Since`**

v1.0.0

#### Inherited from

Request.getMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:773

___

### header

▸ **header**(`name`): `undefined` \| `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | ``"set-cookie"`` |

#### Returns

`undefined` \| `string`[]

#### Inherited from

Request.header

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:424

▸ **header**(`name`): `undefined` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`undefined` \| `string`

#### Inherited from

Request.header

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:425

___

### is

▸ **is**(`type`): ``null`` \| `string` \| ``false``

Check if the incoming request contains the "Content-Type"
header field, and it contains the give mime `type`.

Examples:

     // With Content-Type: text/html; charset=utf-8
     req.is('html');
     req.is('text/html');
     req.is('text/*');
     // => true

     // When Content-Type is application/json
     req.is('json');
     req.is('application/json');
     req.is('application/*');
     // => true

     req.is('html');
     // => false

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` \| `string`[] |

#### Returns

``null`` \| `string` \| ``false``

#### Inherited from

Request.is

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:546

___

### isPaused

▸ **isPaused**(): `boolean`

The `readable.isPaused()` method returns the current operating state of the `Readable`.
This is used primarily by the mechanism that underlies the `readable.pipe()` method.
In most typical cases, there will be no reason to use this method directly.

```js
const readable = new stream.Readable();

readable.isPaused(); // === false
readable.pause();
readable.isPaused(); // === true
readable.resume();
readable.isPaused(); // === false
```

#### Returns

`boolean`

**`Since`**

v0.11.14

#### Inherited from

Request.isPaused

#### Defined in

node_modules/@types/node/stream.d.ts:326

___

### iterator

▸ **iterator**(`options?`): `AsyncIterator`\<`any`, `undefined`, `any`\>

The iterator created by this method gives users the option to cancel the destruction
of the stream if the `for await...of` loop is exited by `return`, `break`, or `throw`,
or if the iterator should destroy the stream if the stream emitted an error during iteration.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `Object` | - |
| `options.destroyOnReturn?` | `boolean` | When set to `false`, calling `return` on the async iterator, or exiting a `for await...of` iteration using a `break`, `return`, or `throw` will not destroy the stream. **Default: `true`**. |

#### Returns

`AsyncIterator`\<`any`, `undefined`, `any`\>

**`Since`**

v16.3.0

#### Inherited from

Request.iterator

#### Defined in

node_modules/@types/node/stream.d.ts:456

___

### listenerCount

▸ **listenerCount**\<`K`\>(`eventName`, `listener?`): `number`

Returns the number of listeners listening for the event named `eventName`.
If `listener` is provided, it will return how many times the listener is found
in the list of the listeners of the event.

#### Type parameters

| Name |
| :------ |
| `K` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event being listened for |
| `listener?` | `Function` | The event handler function |

#### Returns

`number`

**`Since`**

v3.2.0

#### Inherited from

Request.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:867

___

### listeners

▸ **listeners**\<`K`\>(`eventName`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```

#### Type parameters

| Name |
| :------ |
| `K` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

**`Since`**

v0.1.26

#### Inherited from

Request.listeners

#### Defined in

node_modules/@types/node/events.d.ts:786

___

### map

▸ **map**(`fn`, `options?`): `Readable`

This method allows mapping over the stream. The *fn* function will be called for every chunk in the stream.
If the *fn* function returns a promise - that promise will be `await`ed before being passed to the result stream.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`data`: `any`, `options?`: `Pick`\<`ArrayOptions`, ``"signal"``\>) => `any` | a function to map over every chunk in the stream. Async or not. |
| `options?` | `ArrayOptions` | - |

#### Returns

`Readable`

a stream mapped with the function *fn*.

**`Since`**

v17.4.0, v16.14.0

#### Inherited from

Request.map

#### Defined in

node_modules/@types/node/stream.d.ts:464

___

### off

▸ **off**\<`K`\>(`eventName`, `listener`): `this`

Alias for `emitter.removeListener()`.

#### Type parameters

| Name |
| :------ |
| `K` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`this`

**`Since`**

v10.0.0

#### Inherited from

Request.off

#### Defined in

node_modules/@types/node/events.d.ts:746

___

### on

▸ **on**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.on

#### Defined in

node_modules/@types/node/stream.d.ts:645

▸ **on**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

`this`

#### Inherited from

Request.on

#### Defined in

node_modules/@types/node/stream.d.ts:646

▸ **on**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.on

#### Defined in

node_modules/@types/node/stream.d.ts:647

▸ **on**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

`this`

#### Inherited from

Request.on

#### Defined in

node_modules/@types/node/stream.d.ts:648

▸ **on**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.on

#### Defined in

node_modules/@types/node/stream.d.ts:649

▸ **on**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.on

#### Defined in

node_modules/@types/node/stream.d.ts:650

▸ **on**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.on

#### Defined in

node_modules/@types/node/stream.d.ts:651

▸ **on**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`this`

#### Inherited from

Request.on

#### Defined in

node_modules/@types/node/stream.d.ts:652

___

### once

▸ **once**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.once

#### Defined in

node_modules/@types/node/stream.d.ts:653

▸ **once**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

`this`

#### Inherited from

Request.once

#### Defined in

node_modules/@types/node/stream.d.ts:654

▸ **once**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.once

#### Defined in

node_modules/@types/node/stream.d.ts:655

▸ **once**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

`this`

#### Inherited from

Request.once

#### Defined in

node_modules/@types/node/stream.d.ts:656

▸ **once**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.once

#### Defined in

node_modules/@types/node/stream.d.ts:657

▸ **once**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.once

#### Defined in

node_modules/@types/node/stream.d.ts:658

▸ **once**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.once

#### Defined in

node_modules/@types/node/stream.d.ts:659

▸ **once**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`this`

#### Inherited from

Request.once

#### Defined in

node_modules/@types/node/stream.d.ts:660

___

### pause

▸ **pause**(): `this`

The `readable.pause()` method will cause a stream in flowing mode to stop
emitting `'data'` events, switching out of flowing mode. Any data that
becomes available will remain in the internal buffer.

```js
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
  readable.pause();
  console.log('There will be no additional data for 1 second.');
  setTimeout(() => {
    console.log('Now data will start flowing again.');
    readable.resume();
  }, 1000);
});
```

The `readable.pause()` method has no effect if there is a `'readable'` event listener.

#### Returns

`this`

**`Since`**

v0.9.4

#### Inherited from

Request.pause

#### Defined in

node_modules/@types/node/stream.d.ts:290

___

### pipe

▸ **pipe**\<`T`\>(`destination`, `options?`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `WritableStream` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | `T` |
| `options?` | `Object` |
| `options.end?` | `boolean` |

#### Returns

`T`

#### Inherited from

Request.pipe

#### Defined in

node_modules/@types/node/stream.d.ts:29

___

### prependListener

▸ **prependListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.prependListener

#### Defined in

node_modules/@types/node/stream.d.ts:661

▸ **prependListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

`this`

#### Inherited from

Request.prependListener

#### Defined in

node_modules/@types/node/stream.d.ts:662

▸ **prependListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.prependListener

#### Defined in

node_modules/@types/node/stream.d.ts:663

▸ **prependListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

`this`

#### Inherited from

Request.prependListener

#### Defined in

node_modules/@types/node/stream.d.ts:664

▸ **prependListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.prependListener

#### Defined in

node_modules/@types/node/stream.d.ts:665

▸ **prependListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.prependListener

#### Defined in

node_modules/@types/node/stream.d.ts:666

▸ **prependListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.prependListener

#### Defined in

node_modules/@types/node/stream.d.ts:667

▸ **prependListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`this`

#### Inherited from

Request.prependListener

#### Defined in

node_modules/@types/node/stream.d.ts:668

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.prependOnceListener

#### Defined in

node_modules/@types/node/stream.d.ts:669

▸ **prependOnceListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

`this`

#### Inherited from

Request.prependOnceListener

#### Defined in

node_modules/@types/node/stream.d.ts:670

▸ **prependOnceListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.prependOnceListener

#### Defined in

node_modules/@types/node/stream.d.ts:671

▸ **prependOnceListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

`this`

#### Inherited from

Request.prependOnceListener

#### Defined in

node_modules/@types/node/stream.d.ts:672

▸ **prependOnceListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.prependOnceListener

#### Defined in

node_modules/@types/node/stream.d.ts:673

▸ **prependOnceListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.prependOnceListener

#### Defined in

node_modules/@types/node/stream.d.ts:674

▸ **prependOnceListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.prependOnceListener

#### Defined in

node_modules/@types/node/stream.d.ts:675

▸ **prependOnceListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`this`

#### Inherited from

Request.prependOnceListener

#### Defined in

node_modules/@types/node/stream.d.ts:676

___

### push

▸ **push**(`chunk`, `encoding?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunk` | `any` |
| `encoding?` | `BufferEncoding` |

#### Returns

`boolean`

#### Inherited from

Request.push

#### Defined in

node_modules/@types/node/stream.d.ts:446

___

### range

▸ **range**(`size`, `options?`): `undefined` \| `Ranges` \| `Result`

Parse Range header field, capping to the given `size`.

Unspecified ranges such as "0-" require knowledge of your resource length. In
the case of a byte range this is of course the total number of bytes.
If the Range header field is not given `undefined` is returned.
If the Range header field is given, return value is a result of range-parser.
See more ./types/range-parser/index.d.ts

NOTE: remember that ranges are inclusive, so for example "Range: users=0-3"
should respond with 4 users when available, not 3.

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |
| `options?` | `Options` |

#### Returns

`undefined` \| `Ranges` \| `Result`

#### Inherited from

Request.range

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:517

___

### rawListeners

▸ **rawListeners**\<`K`\>(`eventName`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`,
including any wrappers (such as those created by `.once()`).

```js
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

#### Type parameters

| Name |
| :------ |
| `K` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

**`Since`**

v9.4.0

#### Inherited from

Request.rawListeners

#### Defined in

node_modules/@types/node/events.d.ts:817

___

### read

▸ **read**(`size?`): `any`

The `readable.read()` method reads data out of the internal buffer and
returns it. If no data is available to be read, `null` is returned. By default,
the data is returned as a `Buffer` object unless an encoding has been
specified using the `readable.setEncoding()` method or the stream is operating
in object mode.

The optional `size` argument specifies a specific number of bytes to read. If
`size` bytes are not available to be read, `null` will be returned _unless_ the
stream has ended, in which case all of the data remaining in the internal buffer
will be returned.

If the `size` argument is not specified, all of the data contained in the
internal buffer will be returned.

The `size` argument must be less than or equal to 1 GiB.

The `readable.read()` method should only be called on `Readable` streams
operating in paused mode. In flowing mode, `readable.read()` is called
automatically until the internal buffer is fully drained.

```js
const readable = getReadableStreamSomehow();

// 'readable' may be triggered multiple times as data is buffered in
readable.on('readable', () => {
  let chunk;
  console.log('Stream is readable (new data received in buffer)');
  // Use a loop to make sure we read all currently available data
  while (null !== (chunk = readable.read())) {
    console.log(`Read ${chunk.length} bytes of data...`);
  }
});

// 'end' will be triggered once when there is no more data available
readable.on('end', () => {
  console.log('Reached end of stream.');
});
```

Each call to `readable.read()` returns a chunk of data, or `null`. The chunks
are not concatenated. A `while` loop is necessary to consume all data
currently in the buffer. When reading a large file `.read()` may return `null`,
having consumed all buffered content so far, but there is still more data to
come not yet buffered. In this case a new `'readable'` event will be emitted
when there is more data in the buffer. Finally the `'end'` event will be
emitted when there is no more data to come.

Therefore to read a file's whole contents from a `readable`, it is necessary
to collect chunks across multiple `'readable'` events:

```js
const chunks = [];

readable.on('readable', () => {
  let chunk;
  while (null !== (chunk = readable.read())) {
    chunks.push(chunk);
  }
});

readable.on('end', () => {
  const content = chunks.join('');
});
```

A `Readable` stream in object mode will always return a single item from
a call to `readable.read(size)`, regardless of the value of the `size` argument.

If the `readable.read()` method returns a chunk of data, a `'data'` event will
also be emitted.

Calling [read](middleware_auth_middleware.AuthenticatedRequest.md#read) after the `'end'` event has
been emitted will return `null`. No runtime error will be raised.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size?` | `number` | Optional argument to specify how much data to read. |

#### Returns

`any`

**`Since`**

v0.9.4

#### Inherited from

Request.read

#### Defined in

node_modules/@types/node/stream.d.ts:243

___

### reduce

▸ **reduce**\<`T`\>(`fn`, `initial?`, `options?`): `Promise`\<`T`\>

This method calls *fn* on each chunk of the stream in order, passing it the result from the calculation
on the previous element. It returns a promise for the final value of the reduction.

If no *initial* value is supplied the first chunk of the stream is used as the initial value.
If the stream is empty, the promise is rejected with a `TypeError` with the `ERR_INVALID_ARGS` code property.

The reducer function iterates the stream element-by-element which means that there is no *concurrency* parameter
or parallelism. To perform a reduce concurrently, you can extract the async function to `readable.map` method.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`previous`: `any`, `data`: `any`, `options?`: `Pick`\<`ArrayOptions`, ``"signal"``\>) => `T` | a reducer function to call over every chunk in the stream. Async or not. |
| `initial?` | `undefined` | the initial value to use in the reduction. |
| `options?` | `Pick`\<`ArrayOptions`, ``"signal"``\> | - |

#### Returns

`Promise`\<`T`\>

a promise for the final value of the reduction.

**`Since`**

v17.5.0

#### Inherited from

Request.reduce

#### Defined in

node_modules/@types/node/stream.d.ts:595

▸ **reduce**\<`T`\>(`fn`, `initial`, `options?`): `Promise`\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | (`previous`: `T`, `data`: `any`, `options?`: `Pick`\<`ArrayOptions`, ``"signal"``\>) => `T` |
| `initial` | `T` |
| `options?` | `Pick`\<`ArrayOptions`, ``"signal"``\> |

#### Returns

`Promise`\<`T`\>

#### Inherited from

Request.reduce

#### Defined in

node_modules/@types/node/stream.d.ts:600

___

### removeAllListeners

▸ **removeAllListeners**(`eventName?`): `this`

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName?` | `string` \| `symbol` |

#### Returns

`this`

**`Since`**

v0.1.26

#### Inherited from

Request.removeAllListeners

#### Defined in

node_modules/@types/node/events.d.ts:757

___

### removeListener

▸ **removeListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"close"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.removeListener

#### Defined in

node_modules/@types/node/stream.d.ts:677

▸ **removeListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"data"`` |
| `listener` | (`chunk`: `any`) => `void` |

#### Returns

`this`

#### Inherited from

Request.removeListener

#### Defined in

node_modules/@types/node/stream.d.ts:678

▸ **removeListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.removeListener

#### Defined in

node_modules/@types/node/stream.d.ts:679

▸ **removeListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

`this`

#### Inherited from

Request.removeListener

#### Defined in

node_modules/@types/node/stream.d.ts:680

▸ **removeListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"pause"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.removeListener

#### Defined in

node_modules/@types/node/stream.d.ts:681

▸ **removeListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"readable"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.removeListener

#### Defined in

node_modules/@types/node/stream.d.ts:682

▸ **removeListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"resume"`` |
| `listener` | () => `void` |

#### Returns

`this`

#### Inherited from

Request.removeListener

#### Defined in

node_modules/@types/node/stream.d.ts:683

▸ **removeListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`this`

#### Inherited from

Request.removeListener

#### Defined in

node_modules/@types/node/stream.d.ts:684

___

### resume

▸ **resume**(): `this`

The `readable.resume()` method causes an explicitly paused `Readable` stream to
resume emitting `'data'` events, switching the stream into flowing mode.

The `readable.resume()` method can be used to fully consume the data from a
stream without actually processing any of that data:

```js
getReadableStreamSomehow()
  .resume()
  .on('end', () => {
    console.log('Reached the end, but did not read anything.');
  });
```

The `readable.resume()` method has no effect if there is a `'readable'` event listener.

#### Returns

`this`

**`Since`**

v0.9.4

#### Inherited from

Request.resume

#### Defined in

node_modules/@types/node/stream.d.ts:309

___

### setEncoding

▸ **setEncoding**(`encoding`): `this`

The `readable.setEncoding()` method sets the character encoding for
data read from the `Readable` stream.

By default, no encoding is assigned and stream data will be returned as `Buffer` objects. Setting an encoding causes the stream data
to be returned as strings of the specified encoding rather than as `Buffer` objects. For instance, calling `readable.setEncoding('utf8')` will cause the
output data to be interpreted as UTF-8 data, and passed as strings. Calling `readable.setEncoding('hex')` will cause the data to be encoded in hexadecimal
string format.

The `Readable` stream will properly handle multi-byte characters delivered
through the stream that would otherwise become improperly decoded if simply
pulled from the stream as `Buffer` objects.

```js
const readable = getReadableStreamSomehow();
readable.setEncoding('utf8');
readable.on('data', (chunk) => {
  assert.equal(typeof chunk, 'string');
  console.log('Got %d characters of string data:', chunk.length);
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `encoding` | `BufferEncoding` | The encoding to use. |

#### Returns

`this`

**`Since`**

v0.9.4

#### Inherited from

Request.setEncoding

#### Defined in

node_modules/@types/node/stream.d.ts:268

___

### setMaxListeners

▸ **setMaxListeners**(`n`): `this`

By default `EventEmitter`s will print a warning if more than `10` listeners are
added for a particular event. This is a useful default that helps finding
memory leaks. The `emitter.setMaxListeners()` method allows the limit to be
modified for this specific `EventEmitter` instance. The value can be set to `Infinity` (or `0`) to indicate an unlimited number of listeners.

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

`this`

**`Since`**

v0.3.5

#### Inherited from

Request.setMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:767

___

### setTimeout

▸ **setTimeout**(`msecs`, `callback?`): `this`

Calls `message.socket.setTimeout(msecs, callback)`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `msecs` | `number` |
| `callback?` | () => `void` |

#### Returns

`this`

**`Since`**

v0.5.9

#### Inherited from

Request.setTimeout

#### Defined in

node_modules/@types/node/http.d.ts:1350

___

### some

▸ **some**(`fn`, `options?`): `Promise`\<`boolean`\>

This method is similar to `Array.prototype.some` and calls *fn* on each chunk in the stream
until the awaited return value is `true` (or any truthy value). Once an *fn* call on a chunk
`await`ed return value is truthy, the stream is destroyed and the promise is fulfilled with `true`.
If none of the *fn* calls on the chunks return a truthy value, the promise is fulfilled with `false`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`data`: `any`, `options?`: `Pick`\<`ArrayOptions`, ``"signal"``\>) => `boolean` \| `Promise`\<`boolean`\> | a function to call on each chunk of the stream. Async or not. |
| `options?` | `ArrayOptions` | - |

#### Returns

`Promise`\<`boolean`\>

a promise evaluating to `true` if *fn* returned a truthy value for at least one of the chunks.

**`Since`**

v17.5.0

#### Inherited from

Request.some

#### Defined in

node_modules/@types/node/stream.d.ts:514

___

### take

▸ **take**(`limit`, `options?`): `Readable`

This method returns a new stream with the first *limit* chunks.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `limit` | `number` | the number of chunks to take from the readable. |
| `options?` | `Pick`\<`ArrayOptions`, ``"signal"``\> | - |

#### Returns

`Readable`

a stream with *limit* chunks taken.

**`Since`**

v17.5.0

#### Inherited from

Request.take

#### Defined in

node_modules/@types/node/stream.d.ts:573

___

### toArray

▸ **toArray**(`options?`): `Promise`\<`any`[]\>

This method allows easily obtaining the contents of a stream.

As this method reads the entire stream into memory, it negates the benefits of streams. It's intended
for interoperability and convenience, not as the primary way to consume streams.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Pick`\<`ArrayOptions`, ``"signal"``\> |

#### Returns

`Promise`\<`any`[]\>

a promise containing an array with the contents of the stream.

**`Since`**

v17.5.0

#### Inherited from

Request.toArray

#### Defined in

node_modules/@types/node/stream.d.ts:504

___

### unpipe

▸ **unpipe**(`destination?`): `this`

The `readable.unpipe()` method detaches a `Writable` stream previously attached
using the [pipe](middleware_auth_middleware.AuthenticatedRequest.md#pipe) method.

If the `destination` is not specified, then _all_ pipes are detached.

If the `destination` is specified, but no pipe is set up for it, then
the method does nothing.

```js
import fs from 'node:fs';
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// All the data from readable goes into 'file.txt',
// but only for the first second.
readable.pipe(writable);
setTimeout(() => {
  console.log('Stop writing to file.txt.');
  readable.unpipe(writable);
  console.log('Manually close the file stream.');
  writable.end();
}, 1000);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `destination?` | `WritableStream` | Optional specific stream to unpipe |

#### Returns

`this`

**`Since`**

v0.9.4

#### Inherited from

Request.unpipe

#### Defined in

node_modules/@types/node/stream.d.ts:353

___

### unshift

▸ **unshift**(`chunk`, `encoding?`): `void`

Passing `chunk` as `null` signals the end of the stream (EOF) and behaves the
same as `readable.push(null)`, after which no more data can be written. The EOF
signal is put at the end of the buffer and any buffered data will still be
flushed.

The `readable.unshift()` method pushes a chunk of data back into the internal
buffer. This is useful in certain situations where a stream is being consumed by
code that needs to "un-consume" some amount of data that it has optimistically
pulled out of the source, so that the data can be passed on to some other party.

The `stream.unshift(chunk)` method cannot be called after the `'end'` event
has been emitted or a runtime error will be thrown.

Developers using `stream.unshift()` often should consider switching to
use of a `Transform` stream instead. See the `API for stream implementers` section for more information.

```js
// Pull off a header delimited by \n\n.
// Use unshift() if we get too much.
// Call the callback with (error, header, stream).
import { StringDecoder } from 'node:string_decoder';
function parseHeader(stream, callback) {
  stream.on('error', callback);
  stream.on('readable', onReadable);
  const decoder = new StringDecoder('utf8');
  let header = '';
  function onReadable() {
    let chunk;
    while (null !== (chunk = stream.read())) {
      const str = decoder.write(chunk);
      if (str.includes('\n\n')) {
        // Found the header boundary.
        const split = str.split(/\n\n/);
        header += split.shift();
        const remaining = split.join('\n\n');
        const buf = Buffer.from(remaining, 'utf8');
        stream.removeListener('error', callback);
        // Remove the 'readable' listener before unshifting.
        stream.removeListener('readable', onReadable);
        if (buf.length)
          stream.unshift(buf);
        // Now the body of the message can be read from the stream.
        callback(null, header, stream);
        return;
      }
      // Still reading the header.
      header += str;
    }
  }
}
```

Unlike [push](middleware_auth_middleware.AuthenticatedRequest.md#push), `stream.unshift(chunk)` will not
end the reading process by resetting the internal reading state of the stream.
This can cause unexpected results if `readable.unshift()` is called during a
read (i.e. from within a [_read](middleware_auth_middleware.AuthenticatedRequest.md#_read) implementation on a
custom stream). Following the call to `readable.unshift()` with an immediate [push](middleware_auth_middleware.AuthenticatedRequest.md#push) will reset the reading state appropriately,
however it is best to simply avoid calling `readable.unshift()` while in the
process of performing a read.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunk` | `any` | Chunk of data to unshift onto the read queue. For streams not operating in object mode, `chunk` must be a {string}, {Buffer}, {TypedArray}, {DataView} or `null`. For object mode streams, `chunk` may be any JavaScript value. |
| `encoding?` | `BufferEncoding` | Encoding of string chunks. Must be a valid `Buffer` encoding, such as `'utf8'` or `'ascii'`. |

#### Returns

`void`

**`Since`**

v0.9.11

#### Inherited from

Request.unshift

#### Defined in

node_modules/@types/node/stream.d.ts:419

___

### wrap

▸ **wrap**(`stream`): `this`

Prior to Node.js 0.10, streams did not implement the entire `node:stream` module API as it is currently defined. (See `Compatibility` for more
information.)

When using an older Node.js library that emits `'data'` events and has a [pause](middleware_auth_middleware.AuthenticatedRequest.md#pause) method that is advisory only, the `readable.wrap()` method can be used to create a `Readable`
stream that uses
the old stream as its data source.

It will rarely be necessary to use `readable.wrap()` but the method has been
provided as a convenience for interacting with older Node.js applications and
libraries.

```js
import { OldReader } from './old-api-module.js';
import { Readable } from 'node:stream';
const oreader = new OldReader();
const myReader = new Readable().wrap(oreader);

myReader.on('readable', () => {
  myReader.read(); // etc.
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stream` | `ReadableStream` | An "old style" readable stream |

#### Returns

`this`

**`Since`**

v0.9.4

#### Inherited from

Request.wrap

#### Defined in

node_modules/@types/node/stream.d.ts:445
