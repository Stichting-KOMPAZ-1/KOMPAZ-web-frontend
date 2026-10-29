export const parseUrl = (url: string, base?: string) => {
	try {
		return new URL(url, base);
	} catch {
		return undefined;
	}
};
