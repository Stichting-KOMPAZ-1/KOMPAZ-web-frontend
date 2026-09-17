import * as z from "zod";

const envSchema = z.object({
	VITE_API_BASEURL: z.string().default(""),
});

const parsed = envSchema.parse(import.meta.env);

const env = {
	apiBaseUrl: parsed.VITE_API_BASEURL,
};

export default env;
export type Env = typeof env;
