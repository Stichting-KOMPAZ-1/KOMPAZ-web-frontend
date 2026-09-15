import * as z from "zod";

const envSchema = z.object({
	VITE_API_BASEURL: z.string().default(""),
});

const env = envSchema.parse(import.meta.env);

export default env;
export type Env = z.infer<typeof envSchema>;
