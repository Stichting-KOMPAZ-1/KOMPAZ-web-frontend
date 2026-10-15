import * as z from "zod";

const envSchema = z.object({
	VITE_API_BASEURL: z.string().default(""),
	VITE_API_CSRF_PATH: z.string().default("/sanctum/csrf-cookie"),
	VITE_GA_MEASUREMENT_ID: z.string().default(""),
});

const parsed = envSchema.parse(import.meta.env);

const env = {
	apiBaseUrl: parsed.VITE_API_BASEURL,
	apiCsrfPath: parsed.VITE_API_CSRF_PATH,
	gaMeasurementId: parsed.VITE_GA_MEASUREMENT_ID,
};

export default env;
export type Env = typeof env;
