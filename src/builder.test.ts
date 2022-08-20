import { Builder } from 'url-builder';


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
		expect(builder.getParams()).toMatch({
			user,
			repo
		});

		// when not using placeholders, 0 index 'em
		const builder2 = Builder(finalString);
		expect(builder2.getParams()).toMatch({
			0: user,
			1: repo
		})
	});

	it('should set url query params when array', () => {
		const url = 'https://github.com';
		const builder = Builder(url, {
							multiQuerySeperator: ';'
						})
						.setQueryParam({
							q: {
								sep: ';',
								value: ['first', 'second', 'third'],
							}
						})
						.appendQueryParam('q', 'fourth')

		expect(builder.toString()).toBe(`${url}?q=first;second;third;fourth`);
	});

	// TODO: consider or delete
	// it('should build more complex query', () => {
	// 	const url = 'https://github.com';
	// 	const builder = Builder(url)
	// 					.setQueryParam({
	// 						family: {
	// 							sep: ';',
	// 							value: 'Roboto:ital,wght'
	// 						}
	// 					})
	// 					.appendQueryParam('family', '@0,100')
	// 					.appendQueryParam('family', '0,300')


	// 	expect(builder.toString()).toBe(`${url}?family=Roboto:ital,wght@0,100,0,300`);
	// });

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

		expect(builder.getQueryParams()).toMatch({
			first: 'hello world',
			second: 'git lab'
		});
		expect(builder.getRawQueryParams()).toMatch({
			first: 'hello+world',
			second: 'git%20lab'
		});
	});

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

describe.only('standard url builder behaviour', () => {
	it('should produce proper url parts after setting', () => {
		const url = 'https://github.com/ikeohachidi/url-builder';
		const builder = Builder(url)
						.setScheme('http')
						.setHostName('google.com')
						.setParam(0, 'ikeohachidi')
						.addQuery({ q: 'vue' });

		const urlString = builder.toString();
		expect(builder.getScheme()).toBe('https');
		expect(builder.getHostName()).toBe('google.com');
		expect(builder.getParams()).toBe({ 
			0: 'search',
			1: 'url-builder'
		});
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
				result: `https://github.com/ikeohachidi/url-builder`
			}
		];

		for (const obj of urls) {
			const builder = Builder(obj.url)
							.setParams(obj.params)
							.setQuery(obj.queries)

			expect(builder.toString()).toBe(obj.result);
		}
	})

});