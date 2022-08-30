## url-object
Build urls minus the string manipulation

```js
import { Builder } from 'url-object';

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