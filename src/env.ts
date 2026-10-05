import * as z from "zod";

const envSchema = z.object({
	VITE_API_BASEURL: z.string().default(""),
	VITE_API_CSRF_PATH: z.string().default("/sanctum/csrf-cookie"),
});

const parsed = envSchema.parse(import.meta.env);

const env = {
	apiBaseUrl: parsed.VITE_API_BASEURL,
	apiCsrfPath: parsed.VITE_API_CSRF_PATH,
};

export default env;
export type Env = typeof env;
