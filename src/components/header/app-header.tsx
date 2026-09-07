import {
	Link,
	linkOptions,
	useNavigate,
} from "@tanstack/react-router";
import Logo from "assets/icons/logo.svg?react";
import clsx from "clsx";
import { Button, Select } from "components/form";
import { postApiAuthLogout } from "lib/heyapi";
import { useLocale } from "lib/i18n";
import * as m from "lib/paraglide/messages";
import type { Locale } from "lib/paraglide/runtime";
import { locales, setLocale } from "lib/paraglide/runtime";
import style from "./app-header.module.scss";

const links = linkOptions([
	{
		to: "/",
		icon: <Logo width="1rem" />,
		label: m.home_title,
	},
	{
		to: "/form-example",
		icon: "📋",
		label: () => "Form",
	},
]);

const AppHeader = () => {
	const locale = useLocale();
	const navigate = useNavigate();

	const languageOptions = locales
		.toSorted((a, b) => a.localeCompare(b, locale))
		.map((lang) => ({
			value: lang,
			label:
				new Intl.DisplayNames([lang], {
					type: "language",
				}).of(lang) ?? "",
		}));

	const handleLogout = async () => {
		await postApiAuthLogout();
		navigate({ to: "/login" });
	};

	return (
		<header>
			<div className={clsx([style.header, style.row])}>
				<nav className={style.row}>
					{links.map((link) => (
						<Link
							key={link.to}
							to={link.to}
							className={style.link}
						>
							{link.icon}
							<span>{link.label()}</span>
						</Link>
					))}
				</nav>
				<div className={style.row}>
					<Select
						name="lang"
						options={languageOptions}
						defaultValue={locale.toString()}
						onChange={({ currentTarget: { value } }) =>
							setLocale(value as Locale)
						}
					/>
					<Button onClick={handleLogout}>
						{m.nav_logout()}
					</Button>
				</div>
			</div>
		</header>
	);
};

export default AppHeader;
