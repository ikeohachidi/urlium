export type Primitive = number | string | boolean | null | undefined;

export type Either<A, B> = A | B;

export type SetQueryParamOptions = {
	sep: string,
	value: Primitive 
}

export type ObjectWithPrimitiveValue = {[key: string]: Primitive}

enum Scheme {
	HTTP = 'http',
	HTTPS = 'https',
}

export interface Builder {
	// addParam: (param: string) => Builder;
	
	setParams: (paramObj: {[key: string]: Primitive}) => Builder;

	setParam: (param: string | number, value: Primitive) => Builder;

	getParams: (param?: string) => Either<
		Primitive, 
		ObjectWithPrimitiveValue
	>;

	setQueryParam: (params: {[key: string]: SetQueryParamOptions}) => Builder;

	addQueryParam: (param: string | number, value: Primitive) => Builder;

	getQueryParams: (param?: string) => Either<
		Primitive,
		ObjectWithPrimitiveValue
	>;

	getRawQueryParams: (param?: string) => Either<
		Primitive,
		ObjectWithPrimitiveValue
	>;

	setHostName: () => Builder;

	getHostName: () => string;

	setScheme: (scheme: Scheme) => Builder;

	getScheme: () => void;

	toString: () => string; 
}