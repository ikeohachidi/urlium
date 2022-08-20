export type Primitive = number | string | boolean | null | undefined;
export type StrOrInt = number | string;

export type Either<A, B> = A | B;

export type SetQueryParamOptions = {
	sep: string,
	value: Primitive | Array<Primitive>
}

export type ObjectWithPrimitiveValue = {[key: string]: Primitive}
 
export enum Scheme {
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

	setQuery: (
		param: {[key: string]: SetQueryParamOptions} | StrOrInt,
		value?: Primitive | object
	) => Builder;

	// addQueryParam: (param: string | number, value: Primitive) => Builder;

	getQuery: (param?: string) => Either<
		Primitive,
		ObjectWithPrimitiveValue
	>;

	getRawQuery: (param?: string) => Either<
		Primitive,
		ObjectWithPrimitiveValue
	>;

	setHostName: (hostname: string) => Builder;

	getHostName: () => string;

	setScheme: (scheme: Scheme) => Builder;

	getScheme: () => void;

	toString: () => string; 
}

export type URLObject = {
	scheme: string;
	hostname: string;
	params:	{[param: string]: number};
	queries: {[queryKey: string]: Primitive};
}