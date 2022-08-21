import type { 
	Builder as BType, 
    Primitive,
    SetQueryParamOptions,
    StrOrInt,
    URLObject
} from "./type";
import { Scheme } from "./type";

const primitives = ['string', 'number', 'boolean'];

// TODO: probably remove Partial just here to ease 
// development experience
export const Builder = (url: string): BType => {
	let _url = '';

	const schemeSlice = url.slice(0, 9);
	// if no scheme is provided just default
	// to http
	if (!schemeSlice.includes(Scheme.HTTP) && !schemeSlice.includes(Scheme.HTTPS)) {
		_url = `http://'${url}`;
	} else {
		_url = url;
	}

	const _nativeURL = new URL(url);

	const _noSchemeURL = (): string => {
		return _url
			.replace('https://', '')
			.replace('http://', '');
	}

	// TODO: may not need a key value pair after all
	// an array may suffice
	const urlParamSections = () => {
		// check for the presense of placeholders
		// in url and index with them
		const regex = /\{(.*?)\}/;
		let matches = _url.match(regex);
		if (matches && matches.length > 0) {
			const params = {};

			for (let i = 0; i < matches.length; i++) {
				const param = matches[i];
				params[param] = i;
				// params[`{${param}}`] = i;
			}

			return params;
		}

		// since placehoders don't exist make keys 
		// indexes of params and values become the 
		// param itslef.
		const params = {};

		matches = _noSchemeURL().split('/');
		for (let i = 0; i < matches.length; i++) {
			// +1 in order to avoid the hostname which
			// would be the first element in the array 
			const param = matches[i + 1];
			params[i] = param;
		}

		return params;
	}

	const urlQuerySections = () => {
		const fullQueryString = _url.split("?").join("");
		const queryParts = fullQueryString.split("=");
		const sections: {[queryKey: string]: Primitive} = {};

		// take two pairs: i and i + 1, since i would be
		// the query key and i + 1  the value of the query
		for (let i = 0; i < queryParts.length; i += 2) {
			const query = queryParts[i];
			const value = queryParts[i + 1];

			if (value) {
				sections[query] = value; 
			}
		}

		return sections;
	}

	const urlObj: URLObject = {
		scheme: _nativeURL.protocol,
		hostname: _nativeURL.hostname,
		params: urlParamSections(),
		queries: urlQuerySections(),
	}

	// const initialParamSections = urlParamSections();

	return {
		setParams(obj) {
			let u = _url;
			for (const [key, value] of Object.entries(obj)) {
				if (value) {
					u = _url.replace(`{${key}}`, value.toString());
				}
				_url = u;
			}

			return this;
		},
		setParam(param, value) {
			if (!value) return this;

			_url = _url.replace(`{${param}}`, value.toString());

			return this;
		},
		getParams(param?) {
			if (param) {

				if (urlObj.params.hasOwnProperty(param)) {
					return urlObj.params[param];
				}
			}

			return urlObj.params;
		},
		setQueryParam(param, value) {
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
		getQueryParams(param) {
			console.log(param);
			return {} as ObjectWithPrimitiveValue;
		},
		getRawQueryParams(param) {
			console.log(param);
			return {} as ObjectWithPrimitiveValue;
		},
		setHostName() {
			return this;
		},
		getHostName() {
			return _nativeURL.host;
		},
		setScheme() {
			return this;
		},
		getScheme() {
			return _nativeURL.protocol;
		},
		toString() {
			return _url; 
		}
	}
}