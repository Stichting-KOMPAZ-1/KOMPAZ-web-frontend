import type { AuthenticationResultDto } from "./heyapi";

const REFRESH_TOKEN_KEY = "kompaz-refresh-token";

// The access token is deliberately kept in memory only. It is short-lived, and
// anything in storage is readable by every script on the origin. The refresh
// token has to outlive a reload, so it goes to localStorage.
let accessToken: string | undefined;

/**
 * Bearer token for the current session, if there is one.
 *
 * @example
 * const token = getAccessToken(); // "eyJhbGciOiJIUzI1NiIs..." | undefined
 */
export const getAccessToken = () => accessToken;

/**
 * Refresh token for the current session. Survives a page reload.
 *
 * @example
 * const token = getRefreshToken(); // "BYDA68j8R_CpDFW1..." | null
 */
export const getRefreshToken = () =>
	localStorage.getItem(REFRESH_TOKEN_KEY);

/**
 * Stores the tokens returned by a successful sign-in.
 *
 * @example
 * const { data } = await redeemLoginToken({ body: { token } });
 * if (data) startSession(data);
 */
export const startSession = ({
	accessToken: access,
	refreshToken,
}: AuthenticationResultDto) => {
	accessToken = access;
	localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * Drops both tokens. Call on logout, and whenever the API rejects the session.
 *
 * @example
 * endSession();
 */
export const endSession = () => {
	accessToken = undefined;
	localStorage.removeItem(REFRESH_TOKEN_KEY);
};
