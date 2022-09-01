## urlium
Build most standard urls with minimal hassle and minus the string manipulation

```js
import { Builder } from 'urlium';

const url = 'https://github.com/{user}/{repo}';
const user = 'ikeohachidi';
const repo = 'url-builder';
const builder1 = Builder(url)
				.setParams({
					user,
					repo
				})
				.setQuery('lang', 'en')

console.log(builder.toString())
// expected output: https://github.com/ikeohachidi/url-builder?lang=en
```

## Methods
#### `toObject`
Returns raw underlying object

#### `addParam`
Adds a parameter to the resulting url
```js
const url = Builder('https://github.com')
			.addParam('hello', 'world');
			.toString();
// result: https://github.com/hello/world
```

### `setParams`
Can update the value of multiple param placeholders
```js
const url = Builder('https://github.com/{user}/{repo}')
			.setParams({
				user: 'ikeohachidi',
				repo: 'iono'
			})
			.toString();
// result: https://github.com/ikeohachidi/iono
```

### `setParam`
Update the value of single param placeholder
```js
const url = Builder('https://github.com/{user}/{repo}')
			.setParam('user', 'ikeohachidi');
			.toString()
// result: https://github.com/ikeohachidi
```

### `getParams`
Returns all param placeholders and their values or returns an
object with incrementing keys starting from 0 if placeholders aren't
found. Can also optionally return a single param value
```js
const url = Builder('https://github.com/ikeohachidi/iono')
			.getParams();
// result: {
// 	0: 'ikeohachidi',
// 	1: 'iono'
// }

const url2 = Builder('https:github.com/{user}/iono')
			.setParam('user', 'ikeohachidi')
			.getParams('user');
// result: 'ikeohachidi'
```

### `setQuery`
Adds and updates query values
```js
const url = Builder('https:github.com/ikeohachidi')
			.setQuery('country', 'nigeria')
			.setQuery('state', 'rivers');

// result: https://github.com/ikeohachidi?country=nigeria&state=rivers
```

### `getQuery`
Retrieves the decoded value of a single query
```js
const url = Builder('https:github.com/ikeohachidi?value=hello%20')
			.getQuery('value')

// result: hello world 
````

### `getRawQuery`
Retrieves the value of single query as is
```js
const url = Builder('https:github.com/ikeohachidi?value=hello%20world')
			.getQuery('value')

// result: hello%20world 
````

### `setHostName`
Update the value of the hostname 
```js
const url = Builder('https://github.com')
			.setHostName('google.com')
			.toString();

// result: https://google.com
```

### `getHostName`
Update the value of the url hostname 
```js
const url = Builder('https://github.com')
			.getHostName();

// result: github.com
```

### `setScheme`
Update the value of the url scheme 
```js
const url = Builder('https://github.com')
			.setScheme('ws')
			.toString();

// result: ws://github.com
```

### `getScheme`
Update the value of the url scheme 
```js
const url = Builder('https://github.com')
			.getScheme()

// result: https 
```

### `toString`
Return built url string
```js
const url = Builder('http://google.com')
			.setScheme('https')
			.setHostName('github')
			.toString()

// result: https://github.com
```