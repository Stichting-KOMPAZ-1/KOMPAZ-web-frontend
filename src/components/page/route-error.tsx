import { problemStatus } from "lib/api/error-helpers";

import PageError from "./page-error";
import PageNotFound from "./page-not-found";

const NOT_FOUND = 404;

type Props = {
	error: unknown;
	fallback: string;
};

const RouteError = ({ error, fallback }: Props) =>
	problemStatus(error) === NOT_FOUND ? (
		<PageNotFound />
	) : (
		<PageError>{fallback}</PageError>
	);

export default RouteError;
