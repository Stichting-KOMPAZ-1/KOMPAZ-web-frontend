import * as z from "zod";

const envSchema = z.object({
	apiBaseUrl: z.string().default(""),
});

const env = envSchema.parse(import.meta.env);

export default env;
export type Env = z.infer<typeof envSchema>;
