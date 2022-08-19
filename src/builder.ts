import type { 
	Builder, 
	ObjectWithPrimitiveValue,
	Scheme
} from "./type";

// TODO: probably remove Partial just here to ease 
// development experience
const Builder = (url: string): Builder => {
	let _url;

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
		const matches = _url.match(regex);
		if (matches.length > 0) {
			const params = {};

			for (let i = 0; i < matches.length; i++) {
				const param = matches[i];
				params[param] = i;
				params[`{${param}}`] = i;
			}

			return params;
		}

		// since placehoders don't exist make keys 
		// indexes of params and values become the 
		// param itslef.
		const params = {};

		const matches = _noSchemeURL().split('/');
		for (let i = 0; i < matches.length; i++) {
			// +1 in order to avoid the hostname which
			// would be the first element in the array 
			const param = matches[i + 1];
			params[i] = param;
		}

		return params;
	}

	return {
		setParams(obj) {
			let u = _url;
			for (const  of Object.entries(obj)) {
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
			let url = _noSchemeURL();
			const params = urlParamSections();
			const splitURL = url.split('/').slice(1);
			let paramsValuesObj: ObjectWithPrimitiveValue = {};

			if (param) {
				if (params.hasOwnProperty(param)) {
					const position = params[param];
					return splitURL[position];
				}
				return;
			}

			const keys = Object.keys(params);
			for (let i = 0; i < keys; i++) {
				const key = keys[i];
				paramsValuesObj[key] = splitURL[i];
			}


			return paramsValuesObj;
		},
		setQueryParam(param) {
			if (!param) return {}
			return this;
		},
		addQueryParam(param, value) {
			console.log(param, value)
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