import { getLocale } from "lib/paraglide/runtime";
import { useMemo } from "react";
import { z } from "zod";
import { en, nl } from "zod/locales";

const zodLocales = { en, nl };

export const loadZodLocale = (locale: string) => {
	const lng = locale.substring(
		0,
		2,
	) as keyof typeof zodLocales;
	if (lng in zodLocales) {
		z.config(zodLocales[lng]());
	}
};

export const useLocale = () => {
	const language = getLocale();
	return useMemo(
		() => new Intl.Locale(language),
		[language],
	);
};
