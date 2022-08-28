import type { 
	Builder as BType, 
    Primitive,
    SetQueryParamOptions,
    StrOrInt,
    URLObject
} from "./type";

const primitives = ['string', 'number', 'boolean'];

// TODO: probably remove Partial just here to ease 
// development experience
export const Builder = (url: string): BType => {
	let _url = url;

	const _nativeURL = new URL(_url);

	const _noSchemeURL = (): string => {
		return _url
			.replace('https://', '')
			.replace('http://', '')
			.replace('ws://', '');
	}

	const urlParamSections = () => {
		// removing half of url that includes queries if any exist
		// removing hostname which should be the 1st element in resulting array
		// after "/" split
		const positions = _noSchemeURL()
						.split("?")[0]
						.split('/')
						.slice(1);

		const params: {[index: number]: {
			value: Primitive,
			placeholder?: string
		}} = {};

		const regex = /\{(.*?)\}/;
		for (let i = 0; i < positions.length; i++) {
			params[i] = {
				value: positions[i]
			}
			let match = positions[i].match(regex);
			if (match && match.length > 0) {
				params[i].placeholder = match[1];
			}
		}

		return params;
	}

	const urlQuerySections = () => {
		const s = _url.split("?");
		let fullQueryString: string[] = [];
		if (s.length > 1) {
			// index 1 of s since that would have only the queries
			// on the url
			fullQueryString = s[1].split("&");
		}
		const sections: {[queryKey: string]: Primitive} = {};

		for (let i = 0; i < fullQueryString.length; i++) {
			const [query, value] = fullQueryString[i].split('=');

			if (value) {
				sections[query] = value; 
			}
		}

		return sections;
	}

	const urlObj: URLObject = {
		// remove colon in protocol, e.g https:
		scheme: _nativeURL.protocol.slice(0, _nativeURL.protocol.length - 1),
		hostname: _nativeURL.hostname,
		params: urlParamSections(),
		queries: urlQuerySections(),
	}

	return {
		rawBuilder() {
			return urlObj;
		},
		setParams(obj) {
			for (const [k, v] of Object.entries(obj)) {
				this.setParam(k, v);
			}

			return this;
		},
		setParam(param, value) {
			if (!value) return this;

			// urlObj.params[param] = value;
			if (typeof param === 'number') {
				urlObj.params[param].value = value;
			} else if (typeof param === 'string') {
				// keeping in mind that key(k) is actually numbers starting from 0
				// incremeted by 1
				for (const [k, v] of Object.entries(urlObj.params)) {
					if (v.placeholder === param) {
						urlObj.params[Number(k)].value = value;
					}
				}
			}

			return this;
		},
		getParams(param?) {
			if (param) {

				if (typeof param === 'number') {
					return urlObj.params[param].value
				}
				// if it's a string then it must have been a placeholder in the url 
				else if (typeof param === 'string') {
					for (const v of Object.values(urlObj.params)) {
						if (v.placeholder === param) {
							return v.value;
						}
					}
				}

				return null;
			}

			// build something readable to developer using lib
			const finalValue: {[key: string | number]: Primitive} = {};
				
			for (const [k, v] of Object.entries(urlObj.params)) {
				if (v.placeholder) {
					finalValue[v.placeholder] = v.value;
				} 
				else {
					finalValue[k] = v.value;
				}
			}

			return finalValue;
		},
		setQuery(param, value) {
			if (!param) return this;

			// when the key, value method of setting the
			// query is used
			if (primitives.includes(typeof param)) {
				urlObj.queries[param as StrOrInt] = value as Primitive;
				return this;
			}

			const paramKeys = Object.keys(param);

			for (let i = 0; i < paramKeys.length; i++) {
				const paramKey = paramKeys[i];
				const singleParamObj = (param as {[key: string]: SetQueryParamOptions})[paramKey];

				if (singleParamObj.hasOwnProperty('value')) {
					if (
						singleParamObj.value 
						&& singleParamObj.value.constructor === Array
					) {
						const value = singleParamObj.value as Array<unknown>;
						const sep = singleParamObj.sep;
						const values = value.join(sep);

						urlObj.queries[paramKey] = values;
					}
				}
			}

			return this;
		},
		getQuery(param) {
			if (param) return urlObj.queries[param];	

			const params: {[query: string]: string} = {};
			for (const [key, value] of Object.entries(urlObj.queries)) {
				params[key] = decodeURI(String(value));
			}

			return params;
		},
		getRawQuery(param) {
			if (param) return urlObj.queries[param];

			return urlObj.queries;
		},
		setHostName(hostname: string) {
			urlObj.hostname = hostname;
			return this;
		},
		getHostName() {
			return urlObj.hostname;
		},
		setScheme(scheme) {
			let s = scheme.replaceAll('/', '');
			s = s.replaceAll(':', '')

			urlObj.scheme = `${s}`;
			return this;
		},
		getScheme() {
			return urlObj.scheme;
		},
		toString() {
			const { scheme, hostname, params, queries } = urlObj;

			let str = '';
			if (scheme) {
				str += `${scheme}://`;
			}
			str += hostname;

			// construct param string
			for (const [k, v] of Object.entries(params)) {
				if (v.value) {
					str += `/${v.value}`
				}
				else if (v.placeholder) {
					str += `/{${v.placeholder}}`
				}
				else {
					str += `/${k}`
				}
			}

			// add query to string
			let addedQueries = 0;
			for (const [key, value] of Object.entries(queries)) {
				if (addedQueries === 0) {
					str += "?";
				}
				else if (addedQueries > 0) {
					str += '&';
				}
				str += `${key}=${value}`;
				addedQueries++;
			}

			return str; 
		}
	}
}