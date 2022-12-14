import { Builder } from './builder';
import { Scheme } from './type';


describe('url builder functions', () => {
	it('should parse url params', () => {
		const url = 'https://github.com/{user}/{repo}';
		const user = 'ikeohachidi';
		const repo = 'url-builder';
		const finalString = `https://github.com/${user}/${repo}`;
		const builder = Builder(url)
						.setParams({
							user,
							repo
						});

		expect(builder.toString()).toBe(finalString);
		expect(builder.getParams()).toMatchObject({
			user,
			repo
		});

		// when not using placeholders, 0 index 'em
		const builder2 = Builder(finalString);
		expect(builder2.getParams()).toMatchObject({
			0: user,
			1: repo
		})
	});

	it('should drop placeholders when not replaced', () => {
		const url = 'https://github.com/{user}/repo';

		const builder = Builder(url);
		expect(builder.toString()).toBe('https://github.com/repo');
	})

	it('should set url query params when array', () => {
		const url = 'https://github.com';
		const builder = Builder(url)
						.setQuery({
							q: {
								sep: ';',
								value: ['first', 'second', 'third'],
							}
						})

		expect(builder.toString()).toBe(`${url}?q=first;second;third`);
	});

	it('should parse schemes from full string', () => {
		const schemes = ['https', 'ws', 'chrome'];
		const urls = schemes.map(scheme => `${scheme}://github.com/ikeohachidi/url-builder`);

		for (let i = 0; i < urls.length; i++) {
			const builder = Builder(urls[i]);
			expect(builder.getScheme()).toBe(schemes[i]);
		}
	});

	it('should parse query parameters from full string', () => {
		const url = 'https://github.com/ikeohachidi?first=hello+world&second=git%20lab';
		const builder = Builder(url);

		expect(builder.getQuery()).toMatchObject({
			first: 'hello+world',
			second: 'git lab'
		});
		expect(builder.getRawQuery()).toMatchObject({
			first: 'hello+world',
			second: 'git%20lab'
		});

		expect(builder.getQuery('first')).toBe('hello+world');
	});

	it('should remove the query from the url', () => {
		const url = 'https://github.com?user=ikeohachidi&repo=builder';
		const finalUrl = 'https://github.com?repo=builder'
		const builder = Builder(url)
						.removeQuery('user')

		expect(builder.toString()).toBe(finalUrl)
	})

	it('should parse hostname', () => {
		const hostnames = [
			'github.com',
			'api.github.com',
			'github.com.ng'
		];
		const urls: Array<string> = hostnames.map(hostname => `https://${hostname}/ikeohachidi/url-builder`);
		for (let i = 0; i < urls.length; i++) {
			const builder = Builder(urls[i]);
			expect(builder.getHostName()).toBe(hostnames[i]);
		}
	});
});

describe('standard url builder behaviour', () => {
	it('should produce proper url parts after setting', () => {
		const url = 'https://github.com/ikeohachidi/url-builder';
		const builder = Builder(url)
						.setScheme(Scheme.HTTP)
						.setHostName('google.com')
						.setParam(0, 'search')
						.setQuery('q', 'vue');

		expect(builder.getScheme()).toBe(Scheme.HTTP);
		expect(builder.getHostName()).toBe('google.com');
		expect(builder.getParams()).toMatchObject({
			0: 'search',
			1: 'url-builder'
		});
		expect(builder.toString()).toBe('http://google.com/search/url-builder?q=vue');
	});

	it('should interpolate param properly', () => {
		const urls = [
			{
				url: 'https://github.com/{user}/{repo}',
				params: {
					user: 'ikeohachidi',
					repo: 'url-builder'
				},
				queries: {
					page: 1,
					limit: 40
				},
				result: 'https://github.com/ikeohachidi/url-builder?page=1&limit=40'
			},
			{
				url: 'https://github.com/ikeohachidi/{repo}',
				params: {
					repo: 'url-builder'
				},
				queries: {},
				result: `https://github.com/ikeohachidi/url-builder`
			}
		];

		for (const obj of urls) {
			const builder = Builder(obj.url)

			for (const [key, value] of Object.entries(obj.params)) {
				builder.setParam(key, value);
			}

			for (const [key, value] of Object.entries(obj.queries)) {
				builder.setQuery(key, value);
			}

			expect(builder.toString()).toBe(obj.result);
		}
	});

	it('should be able to change plaecholder params multiple times', () => {
		const url = 'https://github.com/{user}';
		const builder = Builder(url).setParam('user', 'ikeohachidi');
		expect(builder.toString()).toBe('https://github.com/ikeohachidi');

		builder.setParam('user', 'chidi');
		expect(builder.toString()).toBe('https://github.com/chidi');
	});

	it('should return url parts', () => {
		const builder = Builder()
						.setHostName('github.com')
						.setScheme('ws')
						.addParam('ikeohachidi')
						.addParam('url-builder', 'settings')
						.setQuery('hello', 'world')
						.setQuery('name', 'chidi');

		const finalStr = 'ws://github.com/ikeohachidi/url-builder/settings?hello=world&name=chidi';
		expect(builder.toString()).toBe(finalStr);
	})

	it('render out incomplete url without hostname', () => {
		const builder = Builder()
						.setScheme('aaa')
						.addParam('url-builder', 'settings')
						.setQuery('hello', 'world')
						.setQuery('name', 'chidi');

		const finalStr = 'aaa:///url-builder/settings?hello=world&name=chidi';
		expect(builder.toString()).toBe(finalStr);
	})

	it('renders out incomplete url without scheme', () => {
		const builder = Builder()
						.setHostName('github.com')
						.setQuery('hello', 'world');

		const finalStr = 'github.com?hello=world';
		expect(builder.toString()).toBe(finalStr);
	})
});