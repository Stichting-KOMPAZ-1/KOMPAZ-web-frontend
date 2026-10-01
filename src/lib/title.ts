const APP_NAME = "KOMPAZ";
const DELIMITER = "·";

export const makePageTitle = (pageTitle: string): string =>
	[pageTitle, DELIMITER, APP_NAME].join(" ");
